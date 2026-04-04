import { and, count, eq, inArray } from "drizzle-orm";
import z from "zod";

import {
    buildOrderByFromSorting,
    buildWhereFromMeta,
} from "@/components/data-table/lib/drizzle-helpers";
import { toTypedFilters } from "@/components/data-table/lib/utils";
import type {
    DataTableFilterMap,
    DataTableQuery,
} from "@/components/data-table/types";
import { hasPermission } from "@/features/core/auth/core";
import { getCurrentUser } from "@/features/core/auth/nextjs";
import { getT } from "@/features/core/i18n/actions";
import {
    drizzleColumnMap,
    type UserFilters,
    userFormSchema,
    userMetaMap,
} from "@/features/users/utils";
import {
    createTRPCRouter,
    protectedProcedure,
} from "@/server/api/trpc";
import { type User, UsersTable } from "@/server/db/schema";

const listInputSchema = z.object({
    pagination: z.object({
        page: z.number().min(1).default(1),
        perPage: z.number().min(1).max(100).default(10),
    }),
    sorting: z
        .array(
            z.object({
                id: z.string(),
                desc: z.boolean(),
            }),
        )
        .optional(),
    filters: z
        .record(z.string(), z.unknown())
        .optional(),
});

export const usersRouter = createTRPCRouter({
    list: protectedProcedure
        .input(listInputSchema)
        .query(async ({ ctx, input }) => {
            const filters = input.filters
                ? await transformUserFilters(input.filters as DataTableFilterMap)
                : {};

            const whereExpr = and(buildWhereFromMeta(filters, userMetaMap), eq(UsersTable.role, "employee"));

            const totalRows = await ctx.db
                .select({ total: count(UsersTable.id) })
                .from(UsersTable)
                .where(whereExpr);

            const orderBy = buildOrderByFromSorting(
                input.sorting as DataTableQuery<UserFilters, User>["sorting"],
                drizzleColumnMap,
            );

            const rows = await ctx.db
                .select()
                .from(UsersTable)
                .where(whereExpr)
                .orderBy(...(orderBy ?? []))
                .limit(input.pagination.perPage)
                .offset(
                    (input.pagination.page - 1) * input.pagination.perPage,
                );

            return {
                rows,
                total: totalRows[0]?.total ?? 0,
            };
        }),

    create: protectedProcedure
        .input(userFormSchema)
        .mutation(async ({ ctx, input }) => {
            const { t } = await getT();

            const currentUser = await getCurrentUser({
                withFullUser: true,
                redirectIfNotFound: true,
            });

            if (!hasPermission(ctx.user, "users", "create")) {
                throw new Error(
                    t("authTranslations.unauthorized", {
                        action: "create",
                        resource: "users",
                    }),
                );
            }

            const [createdUser] = await ctx.db
                .insert(UsersTable)
                .values({
                    ...input,
                    createdBy: currentUser.id,
                })
                .returning();

            if (!createdUser) {
                throw new Error(
                    t("employeeTranslations.actions.error", { action: "create" }),
                );
            }

            return createdUser;
        }),

    update: protectedProcedure
        .input(
            z.object({
                id: z.string().uuid(),
                data: userFormSchema.partial(),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const { t } = await getT();

            if (!hasPermission(ctx.user, "users", "update")) {
                throw new Error(
                    t("authTranslations.unauthorized", {
                        action: "update",
                        resource: "users",
                    }),
                );
            }

            const [user] = await ctx.db
                .update(UsersTable)
                .set(input.data)
                .where(eq(UsersTable.id, input.id))
                .returning();

            if (!user) {
                throw new Error(
                    t("employeeTranslations.actions.error", { action: "update" }),
                );
            }

            return user;
        }),

    delete: protectedProcedure
        .input(z.object({ ids: z.array(z.string().uuid()).min(1) }))
        .mutation(async ({ ctx, input }) => {
            const { t } = await getT();

            if (!hasPermission(ctx.user, "users", "delete")) {
                throw new Error(
                    t("authTranslations.unauthorized", {
                        action: "delete",
                        resource: "users",
                    }),
                );
            }

            const deletedRows = await ctx.db
                .delete(UsersTable)
                .where(inArray(UsersTable.id, input.ids))
                .returning({ id: UsersTable.id });

            return deletedRows;
        }),
});

async function transformUserFilters(
    filters: DataTableFilterMap,
): Promise<UserFilters> {
    const typed = toTypedFilters<UserFilters>(
        filters,
        ["name", "email", "phone"],
        ["role", "createdAt"],
    );

    return {
        name: typed.name,
        email: typed.email,
        phone: typed.phone,
        role: typed.role,
        createdAt: typed.createdAt,
    } satisfies UserFilters;
}
