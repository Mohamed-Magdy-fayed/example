import { and, eq, ne } from "drizzle-orm";

import { env } from "@/env/server";
import { comparePasswords } from "@/features/core/auth/core";
import { normalizeEmail } from "@/features/core/auth/core/helpers";
import { createTokenValue, hashTokenValue } from "@/features/core/auth/core/token";
import {
    changeEmailSchema,
} from "@/features/core/auth/schemas";
import {
    UserCredentialsTable,
    UsersTable,
    UserTokensTable,
} from "@/features/core/auth/tables";
import { getT } from "@/features/core/i18n/actions";
import {
    sendEmailChangeVerification,
    sendEmailVerificationEmail,
} from "@/features/core/auth/nextjs/emails";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

const EMAIL_TOKEN_TTL_MS = 1000 * 60 * 60 * 24; // 24h

export const emailRouter = createTRPCRouter({
    beginVerification: protectedProcedure.mutation(async ({ ctx }) => {
        const { t } = await getT();

        const user = await ctx.db.query.UsersTable.findFirst({
            where: eq(UsersTable.id, ctx.user.id),
            columns: { id: true, email: true, name: true },
        });

        if (!user?.email) {
            return {
                sent: false as const,
                message: t("authTranslations.emailVerification.error.missingEmail"),
            };
        }

        const token = createTokenValue();
        const tokenHash = hashTokenValue(token);
        const expiresAt = new Date(Date.now() + EMAIL_TOKEN_TTL_MS);
        const normalizedEmail = normalizeEmail(user.email);

        await ctx.db.transaction(async (trx) => {
            await trx
                .delete(UserTokensTable)
                .where(
                    and(
                        eq(UserTokensTable.userId, user.id),
                        eq(UserTokensTable.type, "email_verification"),
                    ),
                );

            await trx.insert(UserTokensTable).values({
                userId: user.id,
                tokenHash,
                type: "email_verification",
                expiresAt,
                metadata: { operation: "verify", normalizedEmail },
            });
        });

        const verificationUrl = `${env.BASE_URL}/verify-email?${new URLSearchParams({ token }).toString()}`;

        try {
            await sendEmailVerificationEmail({
                to: user.email,
                name: user.name,
                verificationUrl,
            });
        } catch {
            return {
                sent: false as const,
                message: t("authTranslations.emailVerification.error.sendFailed"),
            };
        }

        return { sent: true as const };
    }),

    beginChange: protectedProcedure
        .input(changeEmailSchema)
        .mutation(async ({ ctx, input }) => {
            const { t } = await getT();

            const user = await ctx.db.query.UsersTable.findFirst({
                where: eq(UsersTable.id, ctx.user.id),
                columns: { id: true, email: true, name: true },
            });

            if (!user) {
                return {
                    sent: false as const,
                    message: t("authTranslations.error.badRequest"),
                };
            }

            const currentEmail = user.email;
            const normalizedCurrentEmail = currentEmail
                ? normalizeEmail(currentEmail)
                : null;

            const normalizedNewEmail = normalizeEmail(input.newEmail);
            if (normalizedCurrentEmail && normalizedNewEmail === normalizedCurrentEmail) {
                return {
                    sent: false as const,
                    message: t("authTranslations.profile.email.error.sameAddress"),
                };
            }

            const conflict = await ctx.db.query.UsersTable.findFirst({
                columns: { id: true },
                where: eq(UsersTable.email, normalizedNewEmail),
            });
            if (conflict) {
                return {
                    sent: false as const,
                    message: t("authTranslations.profile.email.error.inUse"),
                };
            }

            const credentials = await ctx.db.query.UserCredentialsTable.findFirst({
                where: eq(UserCredentialsTable.userId, user.id),
                columns: { passwordHash: true, passwordSalt: true },
            });

            if (credentials) {
                if (!input.currentPassword) {
                    return {
                        sent: false as const,
                        message: t("authTranslations.profile.email.error.passwordRequired"),
                    };
                }

                const isPasswordValid = await comparePasswords({
                    hashedPassword: credentials.passwordHash,
                    salt: credentials.passwordSalt,
                    password: input.currentPassword ?? "",
                });
                if (!isPasswordValid) {
                    return {
                        sent: false as const,
                        message: t("authTranslations.profile.email.error.passwordIncorrect"),
                    };
                }
            }

            const token = createTokenValue();
            const tokenHash = hashTokenValue(token);
            const expiresAt = new Date(Date.now() + EMAIL_TOKEN_TTL_MS);

            await ctx.db.transaction(async (trx) => {
                await trx
                    .delete(UserTokensTable)
                    .where(
                        and(
                            eq(UserTokensTable.userId, user.id),
                            eq(UserTokensTable.type, "email_verification"),
                        ),
                    );

                await trx.insert(UserTokensTable).values({
                    userId: user.id,
                    tokenHash,
                    type: "email_verification",
                    expiresAt,
                    metadata: {
                        operation: "change",
                        newEmail: input.newEmail,
                        normalizedEmail: normalizedNewEmail,
                        currentEmail,
                    },
                });
            });

            const verificationUrl = `${env.BASE_URL}/verify-email?${new URLSearchParams({ token }).toString()}`;

            try {
                if (currentEmail) {
                    await sendEmailChangeVerification({
                        to: input.newEmail,
                        name: user.name,
                        verificationUrl,
                        currentEmail,
                    });
                } else {
                    await sendEmailVerificationEmail({
                        to: input.newEmail,
                        name: user.name,
                        verificationUrl,
                    });
                }
            } catch {
                return {
                    sent: false as const,
                    message: t("authTranslations.profile.email.error.sendFailed"),
                };
            }

            return { sent: true as const };
        }),
});
