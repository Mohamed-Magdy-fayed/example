import { eq } from "drizzle-orm";
import type {
    ChangePasswordInput,
    CreatePasswordInput,
    PartialUser,
    TypedResponse,
    UpdateProfileInput,
} from "@/auth/config";
import {
    comparePasswords,
    generateSalt,
    hashPassword,
} from "@/auth/core/passwordHasher";
import { UserCredentialsTable, UsersTable } from "@/auth/tables";
import { db } from "@/server/db";

export type PasswordChangeResult = {
    refreshSession: boolean;
    sessionUser?: Pick<PartialUser, "id" | "role">;
};

async function getSessionUserForRefresh(
    userId: string,
): Promise<Pick<PartialUser, "id" | "role"> | null> {
    const user = await db.query.UsersTable.findFirst({
        columns: { id: true, role: true },
        where: eq(UsersTable.id, userId),
    });
    return user ? { id: user.id, role: user.role } : null;
}

export async function updateProfileName(
    input: UpdateProfileInput,
): Promise<TypedResponse<{ updated: true }>> {
    if (!input.name || input.name.trim().length === 0) {
        return { isError: true, message: "Name is required" };
    }

    await db
        .update(UsersTable)
        .set({ name: input.name.trim() })
        .where(eq(UsersTable.id, input.userId));

    return { isError: false, data: { updated: true } };
}

export async function changePassword(
    input: ChangePasswordInput,
): Promise<TypedResponse<PasswordChangeResult>> {
    const credentials = await db.query.UserCredentialsTable.findFirst({
        columns: { passwordHash: true, passwordSalt: true },
        where: eq(UserCredentialsTable.userId, input.userId),
    });

    if (!credentials) {
        return {
            isError: true,
            message: "Password is not set for this account",
        };
    }

    const isValid = await comparePasswords({
        password: input.currentPassword,
        hashedPassword: credentials.passwordHash,
        salt: credentials.passwordSalt,
    });

    if (!isValid) {
        return { isError: true, message: "Current password is incorrect" };
    }

    const salt = generateSalt();
    const passwordHash = await hashPassword(input.newPassword, salt);
    const now = new Date();

    await db
        .update(UserCredentialsTable)
        .set({
            passwordHash,
            passwordSalt: salt,
            mustChangePassword: false,
            lastChangedAt: now,
        })
        .where(eq(UserCredentialsTable.userId, input.userId));

    const sessionUser = await getSessionUserForRefresh(input.userId);
    return {
        isError: false,
        data: { refreshSession: true, sessionUser: sessionUser ?? undefined },
    };
}

export async function createPassword(
    input: CreatePasswordInput,
): Promise<TypedResponse<PasswordChangeResult>> {
    const existing = await db.query.UserCredentialsTable.findFirst({
        columns: { userId: true },
        where: eq(UserCredentialsTable.userId, input.userId),
    });

    if (existing) {
        return {
            isError: true,
            message: "Password is already set for this account",
        };
    }

    const salt = generateSalt();
    const passwordHash = await hashPassword(input.newPassword, salt);
    const now = new Date();

    await db.insert(UserCredentialsTable).values({
        userId: input.userId,
        passwordHash,
        passwordSalt: salt,
        mustChangePassword: false,
        lastChangedAt: now,
    });

    const sessionUser = await getSessionUserForRefresh(input.userId);
    return {
        isError: false,
        data: { refreshSession: true, sessionUser: sessionUser ?? undefined },
    };
}
