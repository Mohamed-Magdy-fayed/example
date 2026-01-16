"use server";

import { and, eq, ne } from "drizzle-orm";
import { z } from "zod";
import { comparePasswords } from "@/auth/core";
import { normalizeEmail } from "@/auth/core/helpers";
import { createTokenValue, hashTokenValue } from "@/auth/core/token";
import { getCurrentUser } from "@/auth/nextjs/currentUser";
import {
    sendEmailChangeVerification,
    sendEmailVerificationEmail,
} from "@/auth/nextjs/emails";
import { changeEmailSchema } from "@/auth/schemas";
import {
    UserCredentialsTable,
    UsersTable,
    UserTokensTable,
} from "@/auth/tables";
import type { TypedResponse } from "@/auth/types";
import { env } from "@/env/server";
import { getT } from "@/lib/i18n/actions";
import { db } from "@/server/db";

const EMAIL_TOKEN_TTL_MS = 1000 * 60 * 60 * 24; // 24h

const verifyEmailTokenSchema = z.object({ token: z.string().min(1) });

type EmailTokenMetadata = {
    operation?: unknown;
    newEmail?: unknown;
    normalizedEmail?: unknown;
    currentEmail?: unknown;
};

export async function beginEmailVerificationAction(): Promise<
    TypedResponse<{ sent: true }>
> {
    const { t } = await getT();
    const { id, email, name } = await getCurrentUser({
        redirectIfNotFound: true,
        withFullUser: true,
    });

    const token = createTokenValue();
    const tokenHash = hashTokenValue(token);
    const expiresAt = new Date(Date.now() + EMAIL_TOKEN_TTL_MS);
    const normalizedEmail = normalizeEmail(email);

    await db.transaction(async (trx) => {
        await trx
            .delete(UserTokensTable)
            .where(
                and(
                    eq(UserTokensTable.userId, id),
                    eq(UserTokensTable.type, "email_verification"),
                ),
            );

        await trx.insert(UserTokensTable).values({
            userId: id,
            tokenHash,
            type: "email_verification",
            expiresAt,
            metadata: { operation: "verify", normalizedEmail },
        });
    });

    const verificationUrl = `${env.BASE_URL}/verify-email?${new URLSearchParams({ token }).toString()}`;

    try {
        await sendEmailVerificationEmail({
            to: email,
            name: name,
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
): Promise<TypedResponse<{ sent: true }>> {
    const { t } = await getT();
    const {
        email: currentEmail,
        id: userId,
        name,
    } = await getCurrentUser({
        redirectIfNotFound: true,
        withFullUser: true,
    });

    const parsed = changeEmailSchema.safeParse(
        Object.fromEntries(formData.entries()),
    );
    if (!parsed.success) {
        return {
            isError: true,
            message: t("authTranslations.error.badRequest"),
        };
    }

    const { newEmail, currentPassword } = parsed.data;
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

    const userCredentials = await db.query.UserCredentialsTable.findFirst({
        where: eq(UserCredentialsTable.userId, userId),
        columns: { passwordHash: true, passwordSalt: true },
    });

    if (userCredentials) {
        const isPasswordValid = await comparePasswords({
            hashedPassword: userCredentials.passwordHash,
            salt: userCredentials.passwordSalt,
            password: currentPassword,
        });
        if (!isPasswordValid) {
            return {
                isError: true,
                message: t("authTranslations.profile.email.error.passwordIncorrect"),
            };
        }
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
        await sendEmailChangeVerification({
            to: newEmail,
            name,
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
                .set({ email: newEmail, emailVerified: now })
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
            .update(UsersTable)
            .set({ emailVerified: now })
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

    return { isError: false, status: "verified" };
}
