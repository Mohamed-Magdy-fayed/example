"use server";

import { and, desc, eq, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { authError } from "@/auth/core";
import { getCurrentUser } from "@/auth/nextjs/currentUser";
import { createOrganizationSchema } from "@/auth/schemas";
import {
    type Organization,
    OrganizationMembershipsTable,
    OrganizationsTable,
} from "@/auth/tables";
import type { OrganizationState, TypedResponse } from "@/auth/types";
import { getT } from "@/lib/i18n/actions";
import { db } from "@/server/db";

const upsertOrganizationsInputSchema = z.object({
    userId: z.uuid(),
    organizationIds: z.array(z.uuid()),
});

export async function createOrganizationAction(
    rawInput: z.infer<typeof createOrganizationSchema>,
): Promise<TypedResponse<{ organizationId: string }>> {
    const { t } = await getT();
    const { id } = await getCurrentUser({ redirectIfNotFound: true });

    const parsed = createOrganizationSchema.safeParse(rawInput);
    if (!parsed.success) {
        return {
            isError: true,
            message: t("authTranslations.error.badRequest"),
        };
    }

    const { nameAr, nameEn } = parsed.data;
    const trimmedEn = nameEn.trim();
    const trimmedAr = nameAr.trim();

    const [org] = await db
        .insert(OrganizationsTable)
        .values({ nameEn: trimmedEn, nameAr: trimmedAr, ownerId: id })
        .returning({ id: OrganizationsTable.id });

    if (!org) {
        return {
            isError: true,
            message: t("authTranslations.org.actions.createOrganization.error"),
        };
    }

    await db.transaction(async (trx) => {
        await trx
            .insert(OrganizationMembershipsTable)
            .values({
                isCurrent: false,
                organizationId: org.id,
                userId: id,
            })
            .onConflictDoNothing();
    });

    revalidatePath("/");

    return { isError: false, organizationId: org.id };
}

export async function deleteOrganizationAction(
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

    const organizationId = parsed.data;
    const { id: actorUserId } = await getCurrentUser({ redirectIfNotFound: true });

    const org = await db.query.OrganizationsTable.findFirst({
        columns: { id: true, ownerId: true },
        where: eq(OrganizationsTable.id, organizationId),
    });

    if (!org) {
        return {
            isError: true,
            message: t("authTranslations.org.actions.deleteOrganization.notFound"),
        };
    }
    if (org.ownerId !== actorUserId)
        return {
            isError: true,
            message: t("authTranslations.org.actions.deleteOrganization.ownerOnly"),
        };

    await db
        .delete(OrganizationsTable)
        .where(eq(OrganizationsTable.id, organizationId));

    revalidatePath("/");

    return { isError: false, deleted: true };
}

export async function upsertUserOrganizationsAction(
    rawInput: z.infer<typeof upsertOrganizationsInputSchema>,
): Promise<TypedResponse<{ updated: true }>> {
    const { t } = await getT();
    const parsed = upsertOrganizationsInputSchema.safeParse(rawInput);
    if (!parsed.success) {
        return {
            isError: true,
            message: t("authTranslations.error.badRequest"),
        };
    }

    const { userId } = parsed.data;
    const organizationIds = Array.from(new Set(parsed.data.organizationIds));

    const existing = await db
        .select({ organizationId: OrganizationMembershipsTable.organizationId })
        .from(OrganizationMembershipsTable)
        .where(eq(OrganizationMembershipsTable.userId, userId));

    const existingIds = existing.map((row) => row.organizationId);
    const toAdd = organizationIds.filter((id) => !existingIds.includes(id));
    const toRemove = existingIds.filter((id) => !organizationIds.includes(id));

    if (toAdd.length > 0) {
        await db.insert(OrganizationMembershipsTable).values(
            toAdd.map((orgId) => ({
                organizationId: orgId,
                userId,
            })),
        );
    }

    if (toRemove.length > 0) {
        await db
            .delete(OrganizationMembershipsTable)
            .where(
                and(
                    eq(OrganizationMembershipsTable.userId, userId),
                    inArray(OrganizationMembershipsTable.organizationId, toRemove),
                ),
            );
    }

    return { isError: false, updated: true };
}

export type FullOrganization = Pick<Organization, "id" | "nameEn" | "nameAr" | "ownerId"> & { isCurrent: boolean | null };
export async function listOrganizationsForUserAction(): Promise<
    TypedResponse<{
        data: Array<FullOrganization>;
    }>
> {
    const { id: userId } = await getCurrentUser({ redirectIfNotFound: true });

    const memberships = await db.query.OrganizationMembershipsTable.findMany({
        where: eq(OrganizationMembershipsTable.userId, userId),
        orderBy: [desc(OrganizationMembershipsTable.createdAt)],
        with: {
            organization: {
                columns: { id: true, nameEn: true, nameAr: true, ownerId: true },
            },
        },
        columns: { isCurrent: true },
    });

    return {
        isError: false,
        data: memberships.map((m) => ({
            id: m.organization.id,
            nameEn: m.organization.nameEn,
            nameAr: m.organization.nameAr,
            ownerId: m.organization.ownerId,
            isCurrent: m.isCurrent,
        })),
    };
}

export async function setActiveOrganizationForUserAction(
    organizationId: string,
): Promise<TypedResponse<{ updated: true }>> {
    const { id: userId } = await getCurrentUser({ redirectIfNotFound: true });
    try {
        await db.transaction(async (trx) => {
            await trx
                .update(OrganizationMembershipsTable)
                .set({ isCurrent: false })
                .where(eq(OrganizationMembershipsTable.userId, userId));
            await trx
                .update(OrganizationMembershipsTable)
                .set({ isCurrent: true })
                .where(
                    and(
                        eq(OrganizationMembershipsTable.userId, userId),
                        eq(OrganizationMembershipsTable.organizationId, organizationId),
                    ),
                );
        });

        revalidatePath("/");

        return { isError: false, updated: true };
    } catch (error) {
        return authError(error);
    }
}

export async function getOrganizations(): Promise<OrganizationState> {
    const { id: userId } = await getCurrentUser({ redirectIfNotFound: true });

    const organizations = await db
        .select({
            id: OrganizationsTable.id,
            nameEn: OrganizationsTable.nameEn,
            nameAr: OrganizationsTable.nameAr,
            ownerId: OrganizationsTable.ownerId,
            isCurrent: OrganizationMembershipsTable.isCurrent,
        })
        .from(OrganizationMembershipsTable)
        .innerJoin(OrganizationsTable, eq(OrganizationMembershipsTable.organizationId, OrganizationsTable.id))
        .where(eq(OrganizationMembershipsTable.userId, userId));

    const activeOrganization = organizations.find(org => org.isCurrent);
    const hasActiveOrg = activeOrganization !== undefined;

    if (!hasActiveOrg) {
        return { hasActiveOrg: false, organizations, activeOrganization };
    }

    return { hasActiveOrg, activeOrganization, organizations };
}
