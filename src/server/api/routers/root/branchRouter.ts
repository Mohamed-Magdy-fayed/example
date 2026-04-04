import { DrizzleError, eq, getTableColumns, ilike, or } from "drizzle-orm";
import z from "zod";
import { BranchMembershipsTable, BranchesTable } from "@/features/core/auth/tables";
import { getT } from "@/features/core/i18n/actions";
import type { mainTranslations } from "@/features/core/i18n/global";
import type { TFunction } from "@/features/core/i18n/lib";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const branchRouter = createTRPCRouter({
    searchBranches: protectedProcedure
        .input(z.object({ query: z.string().min(1) }))
        .query(async ({ ctx, input }) => {
            const pattern = `%${input.query}%`;
            const results = await ctx.db
                .select({
                    id: BranchesTable.id,
                    nameEn: BranchesTable.nameEn,
                    nameAr: BranchesTable.nameAr,
                })
                .from(BranchesTable)
                .where(
                    or(
                        ilike(BranchesTable.nameEn, pattern),
                        ilike(BranchesTable.nameAr, pattern),
                    ),
                )
                .limit(20);

            return results;
        }),

    getUserBranches: protectedProcedure.query(async ({ ctx }) => {
        const { t } = await getT();

        try {
            const userBranches = await ctx.db
                .select(getTableColumns(BranchesTable))
                .from(BranchMembershipsTable)
                .innerJoin(BranchesTable, eq(BranchMembershipsTable.branchId, BranchesTable.id))
                .where(eq(BranchMembershipsTable.userId, ctx.user.id))

            return userBranches;
        } catch (error) {
            handleError({ error, t });
        }
    }),
});

export function handleError({
    error,
    t,
}: {
    error: unknown;
    t: TFunction<typeof mainTranslations>;
}) {
    console.error("tRPC error:", error);

    if (error instanceof DrizzleError) {
        return {
            isError: true,
            message: t("error", { error: error.message }),
        };
    }

    const message = t("error", {
        error: error instanceof Error ? error.message : String(error),
    });

    return { isError: true, message };
}
