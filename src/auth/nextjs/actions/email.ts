"use server";

import { and, eq, ne } from "drizzle-orm";
import { z } from "zod";

import { normalizeEmail } from "@/auth/core/helpers";
import { createTokenValue, hashTokenValue } from "@/auth/core/token";
import { getCurrentUser } from "@/auth/nextjs/currentUser";
import {
    sendEmailChangeVerification,
    sendEmailVerificationEmail,
} from "@/auth/nextjs/emails";
import { UsersTable, UserTokensTable } from "@/auth/tables";
import type {
    SendEmailChangeVerificationEmail,
    SendEmailVerificationEmail,
    TypedResponse,
} from "@/auth/types";
import { env } from "@/env/server";
import { getT } from "@/lib/i18n/actions";
import { db } from "@/server/db";

const EMAIL_TOKEN_TTL_MS = 1000 * 60 * 60 * 24; // 24h

const beginEmailVerificationSchema = z.object({
    userId: z.string().min(1),
    currentEmail: z.email(),
    origin: z.url(),
    userDisplayName: z.string().trim().optional().nullable(),
});

const beginEmailChangeSchema = z.object({
    currentEmail: z.email(),
    newEmail: z.email(),
    userDisplayName: z.string().trim().optional().nullable(),
});

const verifyEmailTokenSchema = z.object({ token: z.string().min(1) });

type EmailTokenMetadata = {
    operation?: unknown;
    newEmail?: unknown;
    normalizedEmail?: unknown;
    currentEmail?: unknown;
};

export async function beginEmailVerificationAction(
    rawInput: z.infer<typeof beginEmailVerificationSchema>,
    sendEmail: SendEmailVerificationEmail = sendEmailVerificationEmail,
): Promise<TypedResponse<{ sent: true }>> {
    const { t } = await getT();
    const parsed = beginEmailVerificationSchema.safeParse(rawInput);
    if (!parsed.success) {
        return {
            isError: true,
            message: t("authTranslations.error.badRequest"),
        };
    }

    const { userId, currentEmail, origin, userDisplayName } = parsed.data;
    const token = createTokenValue();
    const tokenHash = hashTokenValue(token);
    const expiresAt = new Date(Date.now() + EMAIL_TOKEN_TTL_MS);
    const normalizedEmail = normalizeEmail(currentEmail);

    await db.transaction(async (trx) => {
        await trx
            .delete(UserTokensTable)
            .where(
                and(
                    eq(UserTokensTable.userId, userId),
                    eq(UserTokensTable.type, "email_verification"),
                ),
            );

        await trx.insert(UserTokensTable).values({
            userId,
            tokenHash,
            type: "email_verification",
            expiresAt,
            metadata: { operation: "verify", normalizedEmail },
        });
    });

    const verificationUrl = `${origin.replace(/\/$/, "")}/verify-email?${new URLSearchParams({ token }).toString()}`;

    try {
        await sendEmail({
            to: currentEmail,
            name: userDisplayName ?? undefined,
            verificationUrl,
        });
    } catch {
        return {
            isError: true,
            message: t("authTranslations.emailVerification.error.sendFailed"),
        };
    }

    return { isError: false, sent: true };
}

export async function beginEmailChangeAction(
    formData: FormData,
    sendEmail: SendEmailChangeVerificationEmail = sendEmailChangeVerification,
): Promise<TypedResponse<{ sent: true }>> {
    const { t } = await getT();
    const parsed = beginEmailChangeSchema.safeParse(formData.entries());
    if (!parsed.success) {
        return {
            isError: true,
            message: t("authTranslations.error.badRequest"),
        };
    }

    const { currentEmail, newEmail, userDisplayName } = parsed.data;
    const { id: userId } = await getCurrentUser({ redirectIfNotFound: true });
    const normalizedNewEmail = normalizeEmail(newEmail);
    const normalizedCurrentEmail = normalizeEmail(currentEmail);

    if (normalizedNewEmail === normalizedCurrentEmail) {
        return {
            isError: true,
            message: t("authTranslations.profile.email.error.sameAddress"),
        };
    }

    const conflict = await db.query.UsersTable.findFirst({
        columns: { id: true },
        where: eq(UsersTable.email, normalizedNewEmail),
    });

    if (conflict) {
        return {
            isError: true,
            message: t("authTranslations.profile.email.error.inUse"),
        };
    }

    const token = createTokenValue();
    const tokenHash = hashTokenValue(token);
    const expiresAt = new Date(Date.now() + EMAIL_TOKEN_TTL_MS);

    await db.transaction(async (trx) => {
        await trx
            .delete(UserTokensTable)
            .where(
                and(
                    eq(UserTokensTable.userId, userId),
                    eq(UserTokensTable.type, "email_verification"),
                ),
            );

        await trx.insert(UserTokensTable).values({
            userId,
            tokenHash,
            type: "email_verification",
            expiresAt,
            metadata: {
                operation: "change",
                newEmail,
                normalizedEmail: normalizedNewEmail,
                currentEmail,
            },
        });
    });

    const verificationUrl = `${env.BASE_URL}/verify-email?${new URLSearchParams({ token }).toString()}`;

    try {
        await sendEmail({
            to: newEmail,
            name: userDisplayName ?? undefined,
            verificationUrl,
            currentEmail,
        });
    } catch {
        return {
            isError: true,
            message: t("authTranslations.profile.email.error.sendFailed"),
        };
    }

    return { isError: false, sent: true };
}

export async function verifyEmailTokenAction(
    rawInput: z.infer<typeof verifyEmailTokenSchema>,
): Promise<TypedResponse<{ status: "verified" | "changed" }>> {
    const { t } = await getT();
    const parsed = verifyEmailTokenSchema.safeParse(rawInput);
    if (!parsed.success) {
        return {
            isError: true,
            message: t("authTranslations.emailVerification.error.invalidToken"),
        };
    }

    const { token } = parsed.data;
    const tokenHash = hashTokenValue(token);
    const record = await db.query.UserTokensTable.findFirst({
        columns: {
            id: true,
            userId: true,
            expiresAt: true,
            consumedAt: true,
            metadata: true,
        },
        where: and(
            eq(UserTokensTable.tokenHash, tokenHash),
            eq(UserTokensTable.type, "email_verification"),
        ),
    });

    const userId = record?.userId;
    if (!record || !userId) {
        return {
            isError: true,
            message: t("authTranslations.emailVerification.error.invalidToken"),
        };
    }

    const now = new Date();
    if (
        record.consumedAt != null ||
        record.expiresAt.getTime() <= now.getTime()
    ) {
        return {
            isError: true,
            message: t("authTranslations.emailVerification.error.expired"),
        };
    }

    const metadata = (record.metadata ?? {}) as EmailTokenMetadata;
    const operation = metadata.operation === "change" ? "change" : "verify";

    if (operation === "change") {
        const newEmail =
            typeof metadata.newEmail === "string" ? metadata.newEmail : null;
        const normalizedEmail =
            typeof metadata.normalizedEmail === "string"
                ? metadata.normalizedEmail
                : newEmail
                    ? normalizeEmail(newEmail)
                    : null;

        if (!newEmail || !normalizedEmail) {
            return {
                isError: true,
                message: t("authTranslations.emailVerification.error.invalidToken"),
            };
        }

        const conflict = await db.query.UsersTable.findFirst({
            columns: { id: true },
            where: and(
                eq(UsersTable.email, normalizedEmail),
                ne(UsersTable.id, userId),
            ),
        });
        if (conflict) {
            return {
                isError: true,
                message: t("authTranslations.emailVerification.error.conflict"),
            };
        }

        await db.transaction(async (trx) => {
            await trx
                .update(UsersTable)
                .set({ email: newEmail })
                .where(eq(UsersTable.id, userId));

            await trx
                .update(UserTokensTable)
                .set({ consumedAt: now })
                .where(eq(UserTokensTable.id, record.id));
            await trx
                .delete(UserTokensTable)
                .where(
                    and(
                        eq(UserTokensTable.userId, userId),
                        eq(UserTokensTable.type, "email_verification"),
                        ne(UserTokensTable.id, record.id),
                    ),
                );
        });

        return { isError: false, status: "changed" };
    }

    await db.transaction(async (trx) => {
        await trx
            .update(UserTokensTable)
            .set({ consumedAt: now })
            .where(eq(UserTokensTable.id, record.id));
        await trx
            .delete(UserTokensTable)
            .where(
                and(
                    eq(UserTokensTable.userId, userId),
                    eq(UserTokensTable.type, "email_verification"),
                    ne(UserTokensTable.id, record.id),
                ),
            );
    });

    return { isError: false, status: "verified" };
}
