"use server";

import { and, desc, eq, inArray } from "drizzle-orm";
import { z } from "zod";

import { createOrganizationSchema } from "@/auth/schemas";
import {
    OrganizationMembershipsTable,
    OrganizationsTable,
} from "@/auth/tables";
import type { TypedResponse } from "@/auth/types";
import { getT } from "@/lib/i18n/actions";
import { db } from "@/server/db";

const createOrganizationInputSchema = createOrganizationSchema.extend({
    ownerUserId: z.uuid(),
});
const deleteOrganizationInputSchema = z.object({
    actorUserId: z.uuid(),
    organizationId: z.uuid(),
});
const upsertOrganizationsInputSchema = z.object({
    userId: z.uuid(),
    organizationIds: z.array(z.uuid()),
});
const listOrganizationsForUserSchema = z.uuid();

export async function createOrganizationAction(
    rawInput: z.infer<typeof createOrganizationInputSchema>,
): Promise<TypedResponse<{ organizationId: string }>> {
    const { t } = await getT();
    const parsed = createOrganizationInputSchema.safeParse(rawInput);
    if (!parsed.success) {
        return {
            isError: true,
            message: t("authTranslations.error.badRequest"),
        };
    }

    const { ownerUserId, nameAr, nameEn } = parsed.data;
    const trimmedEn = nameEn.trim();
    const trimmedAr = nameAr.trim();

    const [org] = await db
        .insert(OrganizationsTable)
        .values({ nameEn: trimmedEn, nameAr: trimmedAr, ownerId: ownerUserId })
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
                organizationId: org.id,
                userId: ownerUserId,
            })
            .onConflictDoNothing();
    });

    return { isError: false, organizationId: org.id };
}

export async function deleteOrganizationAction(
    rawInput: z.infer<typeof deleteOrganizationInputSchema>,
): Promise<TypedResponse<{ deleted: true }>> {
    const { t } = await getT();
    const parsed = deleteOrganizationInputSchema.safeParse(rawInput);
    if (!parsed.success) {
        return {
            isError: true,
            message: t("authTranslations.error.badRequest"),
        };
    }

    const { actorUserId, organizationId } = parsed.data;

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

export async function listOrganizationsForUserAction(
    rawUserId: z.infer<typeof listOrganizationsForUserSchema>,
): Promise<
    TypedResponse<{ data: Array<{ id: string; nameEn: string; nameAr: string }> }>
> {
    const { t } = await getT();
    const parsed = listOrganizationsForUserSchema.safeParse(rawUserId);
    if (!parsed.success) {
        return {
            isError: true,
            message: t("authTranslations.error.badRequest"),
        };
    }

    const userId = parsed.data;
    const memberships = await db.query.OrganizationMembershipsTable.findMany({
        where: eq(OrganizationMembershipsTable.userId, userId),
        orderBy: [desc(OrganizationMembershipsTable.createdAt)],
        with: {
            organization: { columns: { id: true, nameEn: true, nameAr: true } },
        },
    });

    return {
        isError: false,
        data: memberships.map((m) => ({
            id: m.organization.id,
            nameEn: m.organization.nameEn,
            nameAr: m.organization.nameAr,
        })),
    };
}
