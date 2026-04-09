import crypto from "node:crypto";
import { and, eq, gt, isNull } from "drizzle-orm";

import { db } from "@/drizzle";
import { env } from "@/env/server";
import { hashTokenValue } from "@/features/core/auth/core/token";
import { UserTokensTable } from "@/features/core/auth/tables";
import { sendText } from "@/integrations/whatsapp/wapilot-api";

const OTP_LENGTH = 6;
const OTP_TTL_MS = 10 * 60 * 1000; // 10 minutes
const OTP_RATE_LIMIT_MS = 60 * 1000; // 1 minute between sends

function generateOtp(): string {
    const max = 10 ** OTP_LENGTH;
    const num = crypto.randomInt(0, max);
    return num.toString().padStart(OTP_LENGTH, "0");
}

/** Format phone number to WhatsApp chat_id (e.g. "966501234567@c.us") */
export function toChatId(phone: string): string {
    const digits = phone.replace(/[^0-9]/g, "");
    return `${digits}@c.us`;
}

export async function rateLimitOTP(phone: string): Promise<true> {
    // Rate-limit: check for recent unexpired OTP for this phone
    const recentToken = await db.query.UserTokensTable.findFirst({
        where: and(
            eq(UserTokensTable.type, "otp"),
            gt(UserTokensTable.expiresAt, new Date()),
            isNull(UserTokensTable.consumedAt),
        ),
        columns: { id: true, createdAt: true, metadata: true },
        orderBy: (t, { desc }) => [desc(t.createdAt)],
    });

    if (
        recentToken?.metadata &&
        typeof recentToken.metadata === "object" &&
        "phone" in recentToken.metadata
    ) {
        const meta = recentToken.metadata as { phone: string };
        if (meta.phone === phone) {
            const elapsed = Date.now() - recentToken.createdAt.getTime();
            if (elapsed < OTP_RATE_LIMIT_MS) {
                throw new Error("Please wait before requesting another code");
            }
        }
    }

    return true;
}

export async function sendPhoneOtp(
    phone: string,
): Promise<{ verificationId: string }> {
    await rateLimitOTP(phone);

    const otp = generateOtp();
    const tokenHash = hashTokenValue(otp);

    const [token] = await db
        .insert(UserTokensTable)
        .values({
            userId: null,
            tokenHash,
            type: "otp",
            expiresAt: new Date(Date.now() + OTP_TTL_MS),
            metadata: { phone },
        })
        .returning({ id: UserTokensTable.id });

    if (!token) {
        throw new Error("Failed to create OTP token");
    }

    // Send via WhatsApp
    await sendText({
        instanceId: env.WAPILOT_INSTANCE_ID,
        token: env.WAPILOT_API_TOKEN,
        params: {
            chat_id: toChatId(phone),
            text: `Your verification code is: ${otp}\n\nThis code expires in 10 minutes.`,
        },
    });

    return { verificationId: token.id };
}

export async function verifyPhoneOtp(
    phone: string,
    otp: string,
): Promise<{ verificationId: string }> {
    const tokenHash = hashTokenValue(otp);

    const token = await db.query.UserTokensTable.findFirst({
        where: and(
            eq(UserTokensTable.type, "otp"),
            eq(UserTokensTable.tokenHash, tokenHash),
            gt(UserTokensTable.expiresAt, new Date()),
            isNull(UserTokensTable.consumedAt),
        ),
        columns: { id: true, metadata: true },
    });

    if (
        !token ||
        !token.metadata ||
        typeof token.metadata !== "object" ||
        !("phone" in token.metadata)
    ) {
        throw new Error("Invalid or expired verification code");
    }

    const meta = token.metadata as { phone: string };
    if (meta.phone !== phone) {
        throw new Error("Invalid or expired verification code");
    }

    // Mark as consumed + set verified flag
    await db
        .update(UserTokensTable)
        .set({
            consumedAt: new Date(),
            metadata: { phone, verified: true },
        })
        .where(eq(UserTokensTable.id, token.id));

    return { verificationId: token.id };
}

/** Check that verificationId is valid and was verified for the given phone */
export async function assertPhoneVerified(
    phone: string,
    verificationId: string,
): Promise<void> {
    const token = await db.query.UserTokensTable.findFirst({
        where: and(
            eq(UserTokensTable.id, verificationId),
            eq(UserTokensTable.type, "otp"),
        ),
        columns: { metadata: true, consumedAt: true },
    });

    if (
        !token?.consumedAt ||
        !token.metadata ||
        typeof token.metadata !== "object"
    ) {
        throw new Error("Phone number not verified");
    }

    const meta = token.metadata as { phone: string; verified?: boolean };
    if (meta.phone !== phone || !meta.verified) {
        throw new Error("Phone number not verified");
    }
}
