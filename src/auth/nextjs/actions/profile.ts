"use server";

import { eq } from "drizzle-orm";
import { z } from "zod";
import { authError } from "@/auth/core";
import {
    comparePasswords,
    generateSalt,
    hashPassword,
} from "@/auth/core/passwordHasher";
import { getCurrentUser } from "@/auth/nextjs/currentUser";
import { updateProfileSchema } from "@/auth/schemas";
import { UserCredentialsTable, UsersTable } from "@/auth/tables";
import type { PartialUser, TypedResponse } from "@/auth/types";
import { getT } from "@/lib/i18n/actions";
import { db } from "@/server/db";

const changePasswordSchema = z.object({
    userId: z.uuid(),
    currentPassword: z.string().min(1),
    newPassword: z.string().min(6),
});

const createPasswordSchema = z.object({
    userId: z.uuid(),
    newPassword: z.string().min(6),
});

export type PasswordChangeResult = {
    refreshSession: boolean;
    sessionUser?: Pick<PartialUser, "id" | "role">;
};

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
): Promise<TypedResponse<PasswordChangeResult>> {
    const { t } = await getT();
    const sessionUser = await getCurrentUser({ redirectIfNotFound: true });

    const parsed = changePasswordSchema.safeParse(rawInput);
    if (!parsed.success) {
        return {
            isError: true,
            message: t("authTranslations.profile.error.invalidInput"),
        };
    }

    const { userId, currentPassword, newPassword } = parsed.data;

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

    return {
        isError: false,
        refreshSession: true,
        sessionUser: sessionUser ?? undefined,
    };
}

export async function createPasswordAction(
    rawInput: z.infer<typeof createPasswordSchema>,
): Promise<TypedResponse<PasswordChangeResult>> {
    const { t } = await getT();
    const sessionUser = await getCurrentUser({ redirectIfNotFound: true });

    const parsed = createPasswordSchema.safeParse(rawInput);
    if (!parsed.success) {
        return {
            isError: true,
            message: t("authTranslations.profile.error.invalidInput"),
        };
    }

    const { userId, newPassword } = parsed.data;

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


    return {
        isError: false,
        refreshSession: true,
        sessionUser: sessionUser ?? undefined,
    };
}
