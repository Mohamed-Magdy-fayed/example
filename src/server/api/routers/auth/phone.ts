import { and, eq, ne } from "drizzle-orm";

import {
    beginPhoneChangeSchema,
    confirmPhoneChangeSchema,
} from "@/features/core/auth/schemas";
import { UsersTable } from "@/features/core/auth/tables";
import { getT } from "@/features/core/i18n/actions";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { sendPhoneOtp, verifyPhoneOtp } from "@/server/whatsapp/otp";

export const phoneRouter = createTRPCRouter({
    beginChange: protectedProcedure
        .input(beginPhoneChangeSchema)
        .mutation(async ({ ctx, input }) => {
            const { t } = await getT();

            const user = await ctx.db.query.UsersTable.findFirst({
                columns: { phone: true },
                where: eq(UsersTable.id, ctx.user.id),
            });

            if (user?.phone && input.phone === user.phone) {
                return {
                    sent: false as const,
                    phone: input.phone,
                    message: t("authTranslations.profile.phone.error.same"),
                };
            }

            const conflict = await ctx.db.query.UsersTable.findFirst({
                columns: { id: true },
                where: and(eq(UsersTable.phone, input.phone), ne(UsersTable.id, ctx.user.id)),
            });
            if (conflict) {
                return {
                    sent: false as const,
                    phone: input.phone,
                    message: t("authTranslations.profile.phone.error.inUse"),
                };
            }

            await sendPhoneOtp(input.phone);

            return {
                sent: true as const,
                phone: input.phone,
            };
        }),

    confirmChange: protectedProcedure
        .input(confirmPhoneChangeSchema)
        .mutation(async ({ ctx, input }) => {
            const { t } = await getT();

            const conflict = await ctx.db.query.UsersTable.findFirst({
                columns: { id: true },
                where: and(eq(UsersTable.phone, input.phone), ne(UsersTable.id, ctx.user.id)),
            });
            if (conflict) {
                return {
                    changed: false as const,
                    message: t("authTranslations.profile.phone.error.inUse"),
                };
            }

            try {
                await verifyPhoneOtp(input.phone, input.otp);
            } catch (error) {
                return {
                    changed: false as const,
                    message:
                        error instanceof Error
                            ? error.message
                            : t("authTranslations.profile.phone.error.otpInvalid"),
                };
            }

            await ctx.db
                .update(UsersTable)
                .set({ phone: input.phone, phoneVerifiedAt: new Date() })
                .where(eq(UsersTable.id, ctx.user.id));

            return { changed: true as const };
        }),
});
