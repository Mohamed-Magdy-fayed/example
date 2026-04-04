import { eq } from "drizzle-orm";

import { updateProfileSchema } from "@/features/core/auth/schemas";
import { UsersTable } from "@/features/core/auth/tables";
import { getT } from "@/features/core/i18n/actions";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const profileRouter = createTRPCRouter({
    updateName: protectedProcedure
        .input(updateProfileSchema)
        .mutation(async ({ ctx, input }) => {
            const { t } = await getT();

            await ctx.db
                .update(UsersTable)
                .set({ name: input.name.trim() })
                .where(eq(UsersTable.id, ctx.user.id));

            return {
                updated: true as const,
                message: t("authTranslations.profile.form.submit"),
            };
        }),
});
