"use server";

import { and, desc, eq, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { authError } from "@/features/core/auth/core";
import { getCurrentUser } from "@/features/core/auth/nextjs/currentUser";
import {
    createBranchSchema,
    updateBranchSchema,
} from "@/features/core/auth/schemas";
import {
    type Branch,
    BranchMembershipsTable,
    BranchesTable,
} from "@/features/core/auth/tables";
import type { BranchState, TypedResponse } from "@/features/core/auth/types";
import { getT } from "@/features/core/i18n/actions";
import { db } from "@/server/db";

const upsertBranchesInputSchema = z.object({
    userId: z.uuid(),
    branchIds: z.array(z.uuid()),
});

export async function createBranchAction(
    rawInput: z.infer<typeof createBranchSchema>,
): Promise<TypedResponse<{ branchId: string }>> {
    const { t } = await getT();
    const { id } = await getCurrentUser({ redirectIfNotFound: true });

    const parsed = createBranchSchema.safeParse(rawInput);
    if (!parsed.success) {
        return {
            isError: true,
            message: t("authTranslations.error.badRequest"),
        };
    }

    const { nameAr, nameEn } = parsed.data;
    const trimmedEn = nameEn.trim();
    const trimmedAr = nameAr.trim();

    const [branch] = await db
        .insert(BranchesTable)
        .values({ nameEn: trimmedEn, nameAr: trimmedAr, ownerId: id })
        .returning({ id: BranchesTable.id });

    if (!branch) {
        return {
            isError: true,
            message: t("authTranslations.branch.actions.createBranch.error"),
        };
    }

    await db.transaction(async (trx) => {
        await trx
            .insert(BranchMembershipsTable)
            .values({
                isCurrent: false,
                branchId: branch.id,
                userId: id,
            })
            .onConflictDoNothing();
    });

    revalidatePath("/");

    return { isError: false, branchId: branch.id };
}

export async function updateBranchAction(
    rawInput: z.infer<typeof updateBranchSchema>,
): Promise<TypedResponse<{ updated: true }>> {
    const { t } = await getT();
    const parsed = updateBranchSchema.safeParse(rawInput);
    if (!parsed.success) {
        return {
            isError: true,
            message: t("authTranslations.error.badRequest"),
        };
    }

    const { id: actorUserId } = await getCurrentUser({ redirectIfNotFound: true });
    const { branchId, nameEn, nameAr } = parsed.data;

    const branch = await db.query.BranchesTable.findFirst({
        columns: { id: true, ownerId: true },
        where: eq(BranchesTable.id, branchId),
    });

    if (!branch) {
        return {
            isError: true,
            message: t("authTranslations.branch.actions.updateBranch.notFound"),
        };
    }

    if (branch.ownerId !== actorUserId) {
        return {
            isError: true,
            message: t("authTranslations.branch.actions.updateBranch.ownerOnly"),
        };
    }

    await db
        .update(BranchesTable)
        .set({
            nameEn: nameEn.trim(),
            nameAr: nameAr.trim(),
        })
        .where(eq(BranchesTable.id, branchId));

    revalidatePath("/");

    return { isError: false, updated: true };
}

export async function deleteBranchAction(
    rawInput: string,
): Promise<TypedResponse<{ deleted: true }>> {
    const { t } = await getT();
    const parsed = z.uuid().safeParse(rawInput);
    if (!parsed.success) {
        return {
            isError: true,
            message: t("authTranslations.error.badRequest"),
        };
    }

    const branchId = parsed.data;
    const { id: actorUserId } = await getCurrentUser({ redirectIfNotFound: true });

    const branch = await db.query.BranchesTable.findFirst({
        columns: { id: true, ownerId: true },
        where: eq(BranchesTable.id, branchId),
    });

    if (!branch) {
        return {
            isError: true,
            message: t("authTranslations.branch.actions.deleteBranch.notFound"),
        };
    }
    if (branch.ownerId !== actorUserId)
        return {
            isError: true,
            message: t("authTranslations.branch.actions.deleteBranch.ownerOnly"),
        };

    await db
        .delete(BranchesTable)
        .where(eq(BranchesTable.id, branchId));

    revalidatePath("/");

    return { isError: false, deleted: true };
}

export async function upsertUserBranchesAction(
    rawInput: z.infer<typeof upsertBranchesInputSchema>,
): Promise<TypedResponse<{ updated: true }>> {
    const { t } = await getT();
    const parsed = upsertBranchesInputSchema.safeParse(rawInput);
    if (!parsed.success) {
        return {
            isError: true,
            message: t("authTranslations.error.badRequest"),
        };
    }

    const { userId } = parsed.data;
    const branchIds = Array.from(new Set(parsed.data.branchIds));

    const existing = await db
        .select({ branchId: BranchMembershipsTable.branchId })
        .from(BranchMembershipsTable)
        .where(eq(BranchMembershipsTable.userId, userId));

    const existingIds = existing.map((row) => row.branchId);
    const toAdd = branchIds.filter((id) => !existingIds.includes(id));
    const toRemove = existingIds.filter((id) => !branchIds.includes(id));

    if (toAdd.length > 0) {
        await db.insert(BranchMembershipsTable).values(
            toAdd.map((branchId) => ({
                branchId: branchId,
                userId,
            })),
        );
    }

    if (toRemove.length > 0) {
        await db
            .delete(BranchMembershipsTable)
            .where(
                and(
                    eq(BranchMembershipsTable.userId, userId),
                    inArray(BranchMembershipsTable.branchId, toRemove),
                ),
            );
    }

    return { isError: false, updated: true };
}

export type FullBranch = Pick<Branch, "id" | "nameEn" | "nameAr" | "ownerId"> & { isCurrent: boolean | null };
export async function listBranchesForUserAction(): Promise<
    TypedResponse<{
        data: Array<FullBranch>;
    }>
> {
    const { id: userId } = await getCurrentUser({ redirectIfNotFound: true });

    const memberships = await db.query.BranchMembershipsTable.findMany({
        where: eq(BranchMembershipsTable.userId, userId),
        orderBy: [desc(BranchMembershipsTable.createdAt)],
        with: {
            branch: {
                columns: { id: true, nameEn: true, nameAr: true, ownerId: true },
            },
        },
        columns: { isCurrent: true },
    });

    return {
        isError: false,
        data: memberships.map((m) => ({
            id: m.branch.id,
            nameEn: m.branch.nameEn,
            nameAr: m.branch.nameAr,
            ownerId: m.branch.ownerId,
            isCurrent: m.isCurrent,
        })),
    };
}

export async function setActiveBranchForUserAction(
    branchId: string,
): Promise<TypedResponse<{ updated: true }>> {
    const { id: userId } = await getCurrentUser({ redirectIfNotFound: true });
    try {
        await db.transaction(async (trx) => {
            await trx
                .update(BranchMembershipsTable)
                .set({ isCurrent: false })
                .where(eq(BranchMembershipsTable.userId, userId));
            await trx
                .update(BranchMembershipsTable)
                .set({ isCurrent: true })
                .where(
                    and(
                        eq(BranchMembershipsTable.userId, userId),
                        eq(BranchMembershipsTable.branchId, branchId),
                    ),
                );
        });

        revalidatePath("/");

        return { isError: false, updated: true };
    } catch (error) {
        return authError(error);
    }
}

export async function getBranches(): Promise<BranchState> {
    const { id: userId } = await getCurrentUser({ redirectIfNotFound: true });

    const branches = await db
        .select({
            id: BranchesTable.id,
            nameEn: BranchesTable.nameEn,
            nameAr: BranchesTable.nameAr,
            ownerId: BranchesTable.ownerId,
            isCurrent: BranchMembershipsTable.isCurrent,
        })
        .from(BranchMembershipsTable)
        .innerJoin(BranchesTable, eq(BranchMembershipsTable.branchId, BranchesTable.id))
        .where(eq(BranchMembershipsTable.userId, userId));

    const activeBranch = branches.find(branch => branch.isCurrent);
    const hasActiveOrg = activeBranch !== undefined;

    if (!hasActiveOrg) {
        return { hasActiveOrg: false, branches, activeBranch };
    }

    return { hasActiveOrg, activeBranch, branches };
}
