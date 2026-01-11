import crypto from "crypto";
import { and, eq } from "drizzle-orm";
import type {
    RequestPasswordResetInput,
    ResetPasswordInput,
    SendPasswordResetOtpEmail,
    TypedResponse,
} from "@/auth/config";
import { normalizeEmail } from "@/auth/core/helpers";
import { generateSalt, hashPassword } from "@/auth/core/passwordHasher";
import { hashTokenValue } from "@/auth/core/token";
import {
    UserCredentialsTable,
    UsersTable,
    UserTokensTable,
} from "@/auth/tables";
import { db } from "@/server/db";

const PASSWORD_RESET_OTP_LENGTH = 6;
const PASSWORD_RESET_OTP_TTL_MS = 1000 * 60 * 10; // 10 minutes

function generateResetOtp() {
    return crypto
        .randomInt(0, 10 ** PASSWORD_RESET_OTP_LENGTH)
        .toString()
        .padStart(PASSWORD_RESET_OTP_LENGTH, "0");
}

function hashPasswordResetOtp(normalizedEmail: string, otp: string) {
    return hashTokenValue(`${normalizedEmail}:${otp}`);
}

export async function requestPasswordReset(
    input: RequestPasswordResetInput,
    sendEmail: SendPasswordResetOtpEmail,
): Promise<TypedResponse<null>> {
    const normalizedEmail = normalizeEmail(input.email);
    if (!normalizedEmail || !normalizedEmail.includes("@")) {
        return { isError: true, message: "Invalid email" };
    }

    const user = await db.query.UsersTable.findFirst({
        columns: { id: true, email: true, name: true },
        where: eq(UsersTable.email, normalizedEmail),
    });

    // Avoid account enumeration
    if (!user) {
        return { isError: false, data: null };
    }

    const otp = generateResetOtp();
    const tokenHash = hashPasswordResetOtp(normalizedEmail, otp);
    const expiresAt = new Date(Date.now() + PASSWORD_RESET_OTP_TTL_MS);

    await db.transaction(async (trx) => {
        await trx
            .delete(UserTokensTable)
            .where(
                and(
                    eq(UserTokensTable.userId, user.id),
                    eq(UserTokensTable.type, "password_reset"),
                ),
            );

        await trx.insert(UserTokensTable).values({
            userId: user.id,
            tokenHash,
            type: "password_reset",
            expiresAt,
            metadata: {
                email: user.email,
                normalizedEmail,
                otpLength: PASSWORD_RESET_OTP_LENGTH,
            },
        });
    });

    try {
        await sendEmail({
            to: user.email,
            name: user.name,
            code: otp,
            expiresInMinutes: Math.floor(PASSWORD_RESET_OTP_TTL_MS / (1000 * 60)),
        });
    } catch {
        // Best-effort cleanup to prevent dangling usable tokens
        await db
            .delete(UserTokensTable)
            .where(eq(UserTokensTable.tokenHash, tokenHash));
        return { isError: true, message: "Failed to send password reset email" };
    }

    return { isError: false, data: null };
}

export async function resetPassword(
    input: ResetPasswordInput,
): Promise<TypedResponse<null>> {
    const normalizedEmail = normalizeEmail(input.email);
    const tokenHash = hashPasswordResetOtp(normalizedEmail, input.otp);
    const now = new Date();

    const tokenRecord = await db.query.UserTokensTable.findFirst({
        columns: {
            id: true,
            userId: true,
            expiresAt: true,
            consumedAt: true,
            metadata: true,
        },
        where: and(
            eq(UserTokensTable.tokenHash, tokenHash),
            eq(UserTokensTable.type, "password_reset"),
        ),
    });

    if (
        !tokenRecord ||
        tokenRecord.consumedAt != null ||
        tokenRecord.expiresAt.getTime() <= now.getTime()
    ) {
        return { isError: true, message: "Invalid or expired code" };
    }

    const metadata = (tokenRecord.metadata ?? {}) as {
        normalizedEmail?: unknown;
    };
    const tokenEmail =
        typeof metadata.normalizedEmail === "string"
            ? metadata.normalizedEmail
            : null;
    if (tokenEmail && tokenEmail !== normalizedEmail) {
        return { isError: true, message: "Invalid or expired code" };
    }

    const user = await db.query.UsersTable.findFirst({
        columns: { id: true, email: true },
        where: eq(UsersTable.id, tokenRecord.userId ?? ""),
    });

    if (!user || normalizeEmail(user.email) !== normalizedEmail) {
        return { isError: true, message: "Invalid or expired code" };
    }

    const salt = generateSalt();
    const passwordHash = await hashPassword(input.newPassword, salt);

    try {
        await db.transaction(async (trx) => {
            const credentials = await trx.query.UserCredentialsTable.findFirst({
                columns: { userId: true },
                where: eq(UserCredentialsTable.userId, user.id),
            });

            if (credentials) {
                await trx
                    .update(UserCredentialsTable)
                    .set({
                        passwordHash,
                        passwordSalt: salt,
                        mustChangePassword: false,
                        lastChangedAt: now,
                    })
                    .where(eq(UserCredentialsTable.userId, user.id));
            } else {
                await trx.insert(UserCredentialsTable).values({
                    userId: user.id,
                    passwordHash,
                    passwordSalt: salt,
                    mustChangePassword: false,
                    lastChangedAt: now,
                });
            }

            await trx
                .update(UserTokensTable)
                .set({ consumedAt: now })
                .where(eq(UserTokensTable.id, tokenRecord.id));
        });
    } catch {
        return { isError: true, message: "Failed to reset password" };
    }

    return { isError: false, data: null };
}
