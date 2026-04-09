"use server";

import { and, desc, eq, ilike, inArray, isNull, or } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/drizzle";
import {
    BranchesTable,
    BranchMembershipsTable,
    type User,
    UsersTable,
} from "@/drizzle/schema";
import { authError } from "@/features/core/auth/core/helpers";
import { getCurrentUser } from "@/features/core/auth/nextjs/currentUser";
import type { TypedResponse } from "@/features/core/auth/types";
import { getT } from "@/features/core/i18n/actions";

type DbTransaction = Parameters<Parameters<typeof db.transaction>[0]>[0];

const employeeInputSchema = z.object({
    name: z.string().trim().min(1),
    email: z.email(),
    phone: z.string().trim().nullable(),
    branchIds: z.array(z.uuid()).default([]),
    lastSignInAt: z.coerce.date().nullable(),
    salary: z.coerce.number().int().nonnegative(),
});

const updateEmployeeInputSchema = z.object({
    id: z.uuid(),
    data: employeeInputSchema,
});

const deleteEmployeesInputSchema = z.object({
    ids: z.array(z.uuid()).min(1),
});

const getEmployeesByIdsInputSchema = z.object({
    ids: z.array(z.uuid()).min(1),
});

const searchBranchesInputSchema = z.object({
    query: z.string().trim(),
});

type EmployeeInput = z.infer<typeof employeeInputSchema>;

async function assertAdmin(): Promise<TypedResponse<{ actor: User }>> {
    const actor = await getCurrentUser({ withFullUser: true, redirectIfNotFound: true });

    if (actor.role !== "admin") {
        const { t } = await getT();
        return {
            isError: true,
            message: t("error", { error: "Forbidden" }),
        };
    }

    return { isError: false, actor };
}

async function upsertBranchMemberships(
    tx: DbTransaction,
    userId: string,
    branchIds: string[],
) {
    const dedupedBranchIds = Array.from(new Set(branchIds));

    await tx
        .delete(BranchMembershipsTable)
        .where(eq(BranchMembershipsTable.userId, userId));

    if (!dedupedBranchIds.length) return;

    await tx.insert(BranchMembershipsTable).values(
        dedupedBranchIds.map((branchId, index) => ({
            userId,
            branchId,
            isCurrent: index === 0,
        })),
    );
}

export async function searchBranchesAction(
    rawInput: z.infer<typeof searchBranchesInputSchema>,
): Promise<
    TypedResponse<{
        data: Array<{ id: string; nameEn: string; nameAr: string }>;
    }>
> {
    const { t } = await getT();

    const parsed = searchBranchesInputSchema.safeParse(rawInput);
    if (!parsed.success) {
        return {
            isError: true,
            message: t("authTranslations.profile.error.invalidInput"),
        };
    }

    const adminCheck = await assertAdmin();
    if (adminCheck.isError) {
        return adminCheck;
    }

    try {
        const branches = await db
            .select({
                id: BranchesTable.id,
                nameEn: BranchesTable.nameEn,
                nameAr: BranchesTable.nameAr,
            })
            .from(BranchesTable)
            .where(
                and(
                    parsed.data.query.length === 0
                        ? undefined
                        : or(
                            ilike(BranchesTable.nameEn, `%${parsed.data.query}%`),
                            ilike(BranchesTable.nameAr, `%${parsed.data.query}%`),
                        ),
                ),
            )
            .orderBy(desc(BranchesTable.createdAt))
            .limit(10);

        return {
            isError: false,
            data: branches,
        };
    } catch (error) {
        return authError(error);
    }
}

export async function createEmployeeAction(
    rawInput: EmployeeInput,
): Promise<TypedResponse<{ id: string }>> {
    const { t } = await getT();

    const parsed = employeeInputSchema.safeParse(rawInput);
    if (!parsed.success) {
        return {
            isError: true,
            message: t("authTranslations.profile.error.invalidInput"),
        };
    }

    const adminCheck = await assertAdmin();
    if (adminCheck.isError) {
        return adminCheck;
    }

    try {
        const actorEmail = adminCheck.actor.email ?? adminCheck.actor.id;

        const createdUser = await db.transaction(async (tx) => {
            const user = await tx
                .insert(UsersTable)
                .values({
                    name: parsed.data.name,
                    email: parsed.data.email,
                    phone: parsed.data.phone,
                    role: "employee",
                    salary: parsed.data.salary,
                    lastSignInAt: parsed.data.lastSignInAt,
                    createdBy: actorEmail,
                })
                .returning({ id: UsersTable.id })
                .then((result) => result[0]);

            if (!user) throw new Error("Failed to create employee");

            await upsertBranchMemberships(tx, user.id, parsed.data.branchIds);

            return user;
        });

        revalidatePath("/employee");

        return {
            isError: false,
            id: createdUser.id,
        };
    } catch (error) {
        return authError(error);
    }
}

export async function updateEmployeeAction(
    rawInput: z.infer<typeof updateEmployeeInputSchema>,
): Promise<TypedResponse<{ id: string }>> {
    const { t } = await getT();

    const parsed = updateEmployeeInputSchema.safeParse(rawInput);
    if (!parsed.success) {
        return {
            isError: true,
            message: t("authTranslations.profile.error.invalidInput"),
        };
    }

    const adminCheck = await assertAdmin();
    if (adminCheck.isError) {
        return adminCheck;
    }

    try {
        const actorEmail = adminCheck.actor.email ?? adminCheck.actor.id;

        const updatedUser = await db.transaction(async (tx) => {
            const user = await tx
                .update(UsersTable)
                .set({
                    name: parsed.data.data.name,
                    email: parsed.data.data.email,
                    phone: parsed.data.data.phone,
                    role: "employee",
                    salary: parsed.data.data.salary,
                    lastSignInAt: parsed.data.data.lastSignInAt,
                    updatedBy: actorEmail,
                })
                .where(
                    and(
                        eq(UsersTable.id, parsed.data.id),
                        isNull(UsersTable.deletedAt),
                    ),
                )
                .returning({ id: UsersTable.id })
                .then((result) => result[0]);

            if (!user) throw new Error("Employee not found");

            await upsertBranchMemberships(tx, user.id, parsed.data.data.branchIds);

            return user;
        });

        revalidatePath("/employee");

        return {
            isError: false,
            id: updatedUser.id,
        };
    } catch (error) {
        return authError(error);
    }
}

export async function deleteEmployeesAction(
    rawInput: z.infer<typeof deleteEmployeesInputSchema>,
): Promise<TypedResponse<{ ids: string[] }>> {
    const { t } = await getT();

    const parsed = deleteEmployeesInputSchema.safeParse(rawInput);
    if (!parsed.success) {
        return {
            isError: true,
            message: t("authTranslations.profile.error.invalidInput"),
        };
    }

    const adminCheck = await assertAdmin();
    if (adminCheck.isError) {
        return adminCheck;
    }

    try {
        const actorEmail = adminCheck.actor.email ?? adminCheck.actor.id;

        const deletedRows = await db
            .update(UsersTable)
            .set({
                deletedAt: new Date(),
                deletedBy: actorEmail,
            })
            .where(
                and(
                    inArray(UsersTable.id, parsed.data.ids),
                    isNull(UsersTable.deletedAt),
                ),
            )
            .returning({ id: UsersTable.id });

        revalidatePath("/employee");

        return {
            isError: false,
            ids: deletedRows.map((row) => row.id),
        };
    } catch (error) {
        return authError(error);
    }
}

export async function getEmployeesByIdsAction(
    rawInput: z.infer<typeof getEmployeesByIdsInputSchema>,
): Promise<TypedResponse<{ data: User[] }>> {
    const { t } = await getT();

    const parsed = getEmployeesByIdsInputSchema.safeParse(rawInput);
    if (!parsed.success) {
        return {
            isError: true,
            message: t("authTranslations.profile.error.invalidInput"),
        };
    }

    const adminCheck = await assertAdmin();
    if (adminCheck.isError) {
        return adminCheck;
    }

    try {
        const rows = await db
            .select()
            .from(UsersTable)
            .where(
                and(
                    inArray(UsersTable.id, parsed.data.ids),
                    eq(UsersTable.role, "employee"),
                    isNull(UsersTable.deletedAt),
                ),
            );

        return {
            isError: false,
            data: rows,
        };
    } catch (error) {
        return authError(error);
    }
}
