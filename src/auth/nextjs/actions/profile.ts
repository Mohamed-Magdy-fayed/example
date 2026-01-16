"use server";

import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import type { z } from "zod";

import { authError, refreshSession } from "@/auth/core";
import {
    comparePasswords,
    generateSalt,
    hashPassword,
} from "@/auth/core/passwordHasher";
import { getCurrentUser } from "@/auth/nextjs/currentUser";
import { changePasswordSchema, createPasswordSchema, updateProfileSchema } from "@/auth/schemas";
import { UserCredentialsTable, UsersTable } from "@/auth/tables";
import type { TypedResponse } from "@/auth/types";
import { getT } from "@/lib/i18n/actions";
import { db } from "@/server/db";

export async function updateProfileNameAction(
    rawInput: z.infer<typeof updateProfileSchema>,
): Promise<TypedResponse<{ updated: true }>> {
    try {
        const { t } = await getT();
        const { id: userId } = await getCurrentUser({ redirectIfNotFound: true });

        const parsed = updateProfileSchema.safeParse(rawInput);
        if (!parsed.success) {
            return {
                isError: true,
                message: t("authTranslations.profile.error.invalidInput"),
            };
        }
        const { phone, name } = parsed.data;

        await db
            .update(UsersTable)
            .set({ name: name.trim(), phone: phone.trim() })
            .where(eq(UsersTable.id, userId));

        return { isError: false, updated: true };
    } catch (error) {
        return authError(error);
    }
}

export async function changePasswordAction(
    rawInput: z.infer<typeof changePasswordSchema>,
): Promise<TypedResponse<unknown>> {
    const { t } = await getT();
    const { id: userId } = await getCurrentUser({ redirectIfNotFound: true });

    const parsed = changePasswordSchema.safeParse(rawInput);
    if (!parsed.success) {
        return {
            isError: true,
            message: t("authTranslations.profile.error.invalidInput"),
        };
    }

    const { currentPassword, newPassword } = parsed.data;

    const credentials = await db.query.UserCredentialsTable.findFirst({
        columns: { passwordHash: true, passwordSalt: true },
        where: eq(UserCredentialsTable.userId, userId),
    });

    if (!credentials) {
        return {
            isError: true,
            message: t("authTranslations.error.noPassword"),
        };
    }

    const isValid = await comparePasswords({
        password: currentPassword,
        hashedPassword: credentials.passwordHash,
        salt: credentials.passwordSalt,
    });

    if (!isValid) {
        return {
            isError: true,
            message: t("authTranslations.profile.email.error.passwordIncorrect"),
        };
    }

    const salt = generateSalt();
    const passwordHash = await hashPassword(newPassword, salt);
    const now = new Date();

    await db
        .update(UserCredentialsTable)
        .set({
            passwordHash,
            passwordSalt: salt,
            mustChangePassword: false,
            lastChangedAt: now,
        })
        .where(eq(UserCredentialsTable.userId, userId));

    await refreshSession(await cookies());

    return {
        isError: false,
    };
}

export async function createPasswordAction(
    rawInput: z.infer<typeof createPasswordSchema>,
): Promise<TypedResponse<unknown>> {
    const { t } = await getT();
    const { id: userId } = await getCurrentUser({ redirectIfNotFound: true });

    const parsed = createPasswordSchema.safeParse(rawInput);
    if (!parsed.success) {
        return {
            isError: true,
            message: t("authTranslations.profile.error.invalidInput"),
        };
    }

    const { newPassword } = parsed.data;

    const existing = await db.query.UserCredentialsTable.findFirst({
        columns: { userId: true },
        where: eq(UserCredentialsTable.userId, userId),
    });

    if (existing) {
        return {
            isError: true,
            message: t("authTranslations.error.badRequest"),
        };
    }

    const salt = generateSalt();
    const passwordHash = await hashPassword(newPassword, salt);
    const now = new Date();

    await db.insert(UserCredentialsTable).values({
        userId,
        passwordHash,
        passwordSalt: salt,
        mustChangePassword: false,
        lastChangedAt: now,
    });

    await refreshSession(await cookies());

    return {
        isError: false,
    };
}
