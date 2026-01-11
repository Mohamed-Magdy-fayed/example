import { eq } from "drizzle-orm";
import type {
    PartialUser,
    SignInInput,
    SignUpInput,
    TypedResponse,
} from "@/auth/config";
import { normalizeEmail } from "@/auth/core/helpers";
import {
    comparePasswords,
    generateSalt,
    hashPassword,
} from "@/auth/core/passwordHasher";
import { removeSession } from "@/auth/core/session";
import { UserCredentialsTable, UsersTable } from "@/auth/tables";
import type { Cookies } from "@/auth/types";
import { db } from "@/server/db";

export async function signInWithPassword(
    input: SignInInput,
): Promise<TypedResponse<PartialUser>> {
    const email = normalizeEmail(input.email);

    const user = await db.query.UsersTable.findFirst({
        columns: { id: true, role: true },
        where: eq(UsersTable.email, email),
        with: {
            credentials: { columns: { passwordHash: true, passwordSalt: true } },
        },
    });

    if (
        !user ||
        !user.credentials?.passwordHash ||
        !user.credentials?.passwordSalt
    ) {
        return { isError: true, message: "Invalid email or password" };
    }

    const isValid = await comparePasswords({
        password: input.password,
        hashedPassword: user.credentials.passwordHash,
        salt: user.credentials.passwordSalt,
    });

    if (!isValid) {
        return { isError: true, message: "Invalid email or password" };
    }

    return {
        isError: false,
        data: { id: user.id, role: user.role },
    };
}

export async function signUpWithPassword(
    input: SignUpInput,
): Promise<TypedResponse<PartialUser>> {
    const email = normalizeEmail(input.email);

    return await db.transaction(async (trx) => {
        const existing = await trx.query.UsersTable.findFirst({
            columns: { id: true },
            where: eq(UsersTable.email, email),
        });

        if (existing) {
            return { isError: true, message: "Email already exists" };
        }

        const salt = generateSalt();
        const passwordHash = await hashPassword(input.password, salt);

        const [created] = await trx
            .insert(UsersTable)
            .values({
                name: input.name,
                email,
                role: "user",
            })
            .returning({
                id: UsersTable.id,
                email: UsersTable.email,
                name: UsersTable.name,
                role: UsersTable.role,
            });

        if (!created) {
            return { isError: true, message: "Failed to create user" };
        }

        await trx.insert(UserCredentialsTable).values({
            userId: created.id,
            passwordHash,
            passwordSalt: salt,
        });

        return { isError: false, data: created };
    });
}

export function signOut(cookies: Pick<Cookies, "delete">): void {
    removeSession(cookies);
}
