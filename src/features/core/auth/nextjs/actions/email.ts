"use server";

import { and, eq, ne } from "drizzle-orm";
import { z } from "zod";
import { normalizeEmail } from "@/features/core/auth/core/helpers";
import { hashTokenValue } from "@/features/core/auth/core/token";
import { getCurrentUser } from "@/features/core/auth/nextjs/currentUser";
import {
    UsersTable,
    UserTokensTable,
} from "@/features/core/auth/tables";
import type { TypedResponse } from "@/features/core/auth/types";
import { getT } from "@/features/core/i18n/actions";
import { db } from "@/server/db";

const verifyEmailTokenSchema = z.object({ token: z.string().min(1) });

type EmailTokenMetadata = {
    operation?: unknown;
    newEmail?: unknown;
    normalizedEmail?: unknown;
    currentEmail?: unknown;
};

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
                .set({ email: newEmail, emailVerifiedAt: now })
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
            .set({ emailVerifiedAt: now })
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
