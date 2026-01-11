import { and, eq, ne } from "drizzle-orm";
import type {
    SendEmailChangeVerificationEmail,
    SendEmailVerificationEmail,
    TypedResponse,
} from "@/auth/config";
import { normalizeEmail } from "@/auth/core/helpers";
import { createTokenValue, hashTokenValue } from "@/auth/core/token";
import { UsersTable, UserTokensTable } from "@/auth/tables";
import { env } from "@/env/server";
import { db } from "@/server/db";

type EmailTokenMetadata = {
    operation?: unknown;
    newEmail?: unknown;
    normalizedEmail?: unknown;
    currentEmail?: unknown;
};

const EMAIL_TOKEN_TTL_MS = 1000 * 60 * 60 * 24; // 24h

export async function beginEmailVerification(input: {
    userId: string;
    currentEmail: string;
    origin: string;
    sendEmail: SendEmailVerificationEmail;
    userDisplayName?: string | null;
}): Promise<TypedResponse<{ sent: true }>> {
    const token = createTokenValue();
    const tokenHash = hashTokenValue(token);
    const expiresAt = new Date(Date.now() + EMAIL_TOKEN_TTL_MS);
    const normalizedEmail = normalizeEmail(input.currentEmail);

    await db.transaction(async (trx) => {
        await trx
            .delete(UserTokensTable)
            .where(
                and(
                    eq(UserTokensTable.userId, input.userId),
                    eq(UserTokensTable.type, "email_verification"),
                ),
            );

        await trx.insert(UserTokensTable).values({
            userId: input.userId,
            tokenHash,
            type: "email_verification",
            expiresAt,
            metadata: { operation: "verify", normalizedEmail },
        });
    });

    const verificationUrl = `${input.origin.replace(/\/$/, "")}/verify-email?${new URLSearchParams({ token }).toString()}`;

    try {
        await input.sendEmail({
            to: input.currentEmail,
            name: input.userDisplayName,
            verificationUrl,
        });
    } catch {
        return { isError: true, message: "Failed to send verification email" };
    }

    return { isError: false, data: { sent: true } };
}

export async function beginEmailChange(input: {
    userId: string;
    currentEmail: string;
    newEmail: string;
    sendEmail: SendEmailChangeVerificationEmail;
    userDisplayName?: string | null;
}): Promise<TypedResponse<{ sent: true }>> {
    const normalizedNewEmail = normalizeEmail(input.newEmail);
    const normalizedCurrentEmail = normalizeEmail(input.currentEmail);

    if (normalizedNewEmail === normalizedCurrentEmail) {
        return { isError: true, message: "New email must be different" };
    }

    const conflict = await db.query.UsersTable.findFirst({
        columns: { id: true },
        where: eq(UsersTable.email, normalizedNewEmail),
    });

    if (conflict) {
        return { isError: true, message: "Email is already in use" };
    }

    const token = createTokenValue();
    const tokenHash = hashTokenValue(token);
    const expiresAt = new Date(Date.now() + EMAIL_TOKEN_TTL_MS);

    await db.transaction(async (trx) => {
        await trx
            .delete(UserTokensTable)
            .where(
                and(
                    eq(UserTokensTable.userId, input.userId),
                    eq(UserTokensTable.type, "email_verification"),
                ),
            );

        await trx.insert(UserTokensTable).values({
            userId: input.userId,
            tokenHash,
            type: "email_verification",
            expiresAt,
            metadata: {
                operation: "change",
                newEmail: input.newEmail,
                normalizedEmail: normalizedNewEmail,
                currentEmail: input.currentEmail,
            },
        });
    });

    const verificationUrl = `${env.BASE_URL}/verify-email?${new URLSearchParams({ token }).toString()}`;

    try {
        await input.sendEmail({
            to: input.newEmail,
            name: input.userDisplayName,
            verificationUrl,
            currentEmail: input.currentEmail,
        });
    } catch {
        return {
            isError: true,
            message: "Failed to send email change verification",
        };
    }

    return { isError: false, data: { sent: true } };
}

export async function verifyEmailToken(input: {
    token: string;
}): Promise<TypedResponse<{ status: "verified" | "changed" }>> {
    if (!input.token) return { isError: true, message: "Invalid token" };

    const tokenHash = hashTokenValue(input.token);
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
        return { isError: true, message: "Invalid token" };
    }

    const now = new Date();
    if (
        record.consumedAt != null ||
        record.expiresAt.getTime() <= now.getTime()
    ) {
        return { isError: true, message: "Token expired" };
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
            return { isError: true, message: "Invalid token" };
        }

        const conflict = await db.query.UsersTable.findFirst({
            columns: { id: true },
            where: and(
                eq(UsersTable.email, normalizedEmail),
                ne(UsersTable.id, userId),
            ),
        });
        if (conflict) {
            return { isError: true, message: "Email is already in use" };
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

        return { isError: false, data: { status: "changed" } };
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

    return { isError: false, data: { status: "verified" } };
}
