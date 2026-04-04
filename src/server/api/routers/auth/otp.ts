import { TRPCError } from "@trpc/server";

import {
    customerOtpStepSchema,
    customerPhoneStepSchema,
} from "@/features/core/auth/schemas";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { sendPhoneOtp, verifyPhoneOtp } from "@/server/whatsapp/otp";
import { eq } from "drizzle-orm";
import { UsersTable } from "@/server/db/schema";
import { getT } from "@/features/core/i18n/actions";

export const otpRouter = createTRPCRouter({
    send: publicProcedure
        .input(customerPhoneStepSchema)
        .mutation(async ({ input, ctx }) => {
            const { t } = await getT();
            try {
                const exists = await ctx.db.query.UsersTable.findFirst({
                    where: eq(UsersTable.phone, input.phone),
                    columns: { id: true },
                });
                if (exists) {
                    throw new TRPCError({
                        code: "CONFLICT",
                        message: t("authTranslations.signUp.error.duplicate"),
                    });
                }

                const result = await sendPhoneOtp(input.phone);
                return result;
            } catch (error) {
                throw new TRPCError({
                    code: "TOO_MANY_REQUESTS",
                    message: error instanceof Error ? error.message : "Failed to send verification code",
                });
            }
        }),

    verify: publicProcedure
        .input(customerOtpStepSchema)
        .mutation(async ({ input }) => {
            try {
                const result = await verifyPhoneOtp(input.phone, input.otp);
                return result;
            } catch (error) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: error instanceof Error ? error.message : "Invalid verification code",
                });
            }
        }),
});
