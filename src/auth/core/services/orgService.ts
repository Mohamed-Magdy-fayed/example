import { and, desc, eq, inArray } from "drizzle-orm";
import type { CreateOrganizationInput, TypedResponse } from "@/auth/config";
import {
    OrganizationMembershipsTable,
    OrganizationsTable,
} from "@/auth/tables";
import { db } from "@/server/db";

export async function createOrganization(
    input: CreateOrganizationInput & { ownerUserId: string },
): Promise<TypedResponse<{ organizationId: string }>> {
    const nameEn = input.nameEn.trim();
    const nameAr = input.nameAr.trim();

    const [org] = await db
        .insert(OrganizationsTable)
        .values({ nameEn, nameAr, ownerId: input.ownerUserId })
        .returning({ id: OrganizationsTable.id });

    if (!org) return { isError: true, message: "Failed to create organization" };

    await db.transaction(async (trx) => {
        await trx
            .insert(OrganizationMembershipsTable)
            .values({
                organizationId: org.id,
                userId: input.ownerUserId,
            })
            .onConflictDoNothing();
    });

    return { isError: false, data: { organizationId: org.id } };
}

export async function deleteOrganization(input: {
    actorUserId: string;
    organizationId: string;
}): Promise<TypedResponse<{ deleted: true }>> {
    const org = await db.query.OrganizationsTable.findFirst({
        columns: { id: true, ownerId: true },
        where: eq(OrganizationsTable.id, input.organizationId),
    });

    if (!org) return { isError: true, message: "Organization not found" };
    if (org.ownerId !== input.actorUserId)
        return {
            isError: true,
            message: "Only the owner can delete this organization",
        };

    await db
        .delete(OrganizationsTable)
        .where(eq(OrganizationsTable.id, input.organizationId));
    return { isError: false, data: { deleted: true } };
}

export async function upsertUserOrganizations(input: {
    userId: string;
    organizationIds: string[];
}): Promise<TypedResponse<{ updated: true }>> {
    const organizationIds = Array.from(new Set(input.organizationIds));

    const existing = await db
        .select({ organizationId: OrganizationMembershipsTable.organizationId })
        .from(OrganizationMembershipsTable)
        .where(eq(OrganizationMembershipsTable.userId, input.userId));

    const existingIds = existing.map((row) => row.organizationId);
    const toAdd = organizationIds.filter((id) => !existingIds.includes(id));
    const toRemove = existingIds.filter((id) => !organizationIds.includes(id));

    if (toAdd.length > 0) {
        await db.insert(OrganizationMembershipsTable).values(
            toAdd.map((orgId) => ({
                organizationId: orgId,
                userId: input.userId,
            })),
        );
    }

    if (toRemove.length > 0) {
        await db
            .delete(OrganizationMembershipsTable)
            .where(
                and(
                    eq(OrganizationMembershipsTable.userId, input.userId),
                    inArray(OrganizationMembershipsTable.organizationId, toRemove),
                ),
            );
    }

    return { isError: false, data: { updated: true } };
}

export async function listOrganizationsForUser(
    userId: string,
): Promise<
    TypedResponse<Array<{ id: string; nameEn: string; nameAr: string }>>
> {
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
