"use server";

import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { getOAuthClient } from "@/auth/core";
import {
    authError,
    formDataToObject,
    normalizeEmail,
} from "@/auth/core/helpers";
import {
    comparePasswords,
    generateSalt,
    hashPassword,
} from "@/auth/core/passwordHasher";
import { createSession, removeSession } from "@/auth/core/session";
import { getCurrentUser } from "@/auth/nextjs/currentUser";
import { signInSchema, signUpSchema } from "@/auth/schemas";
import {
    type OAuthProvider,
    UserCredentialsTable,
    UsersTable,
} from "@/auth/tables";
import type { AuthState, PartialUser, TypedResponse } from "@/auth/types";
import { getT } from "@/lib/i18n/actions";
import { db } from "@/server/db";

export async function signInAction(
    _: unknown,
    formData: FormData,
): Promise<TypedResponse<{ user: PartialUser }>> {
    const { t } = await getT();
    const parsed = signInSchema.safeParse(formDataToObject(formData));
    if (!parsed.success) {
        return {
            isError: true,
            message: t("authTranslations.error.credentials"),
        };
    }

    const email = normalizeEmail(parsed.data.email);

    try {
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
            return {
                isError: true,
                message: t("authTranslations.error.credentials"),
            };
        }

        const isValid = await comparePasswords({
            password: parsed.data.password,
            hashedPassword: user.credentials.passwordHash,
            salt: user.credentials.passwordSalt,
        });

        if (!isValid) {
            return {
                isError: true,
                message: t("authTranslations.error.credentials"),
            };
        }

        await createSession(user, await cookies());
    } catch (error) {
        return authError(error);
    }

    redirect("/");
}

export async function signUpAction(
    _: unknown,
    formData: FormData,
): Promise<TypedResponse<{ user: PartialUser }>> {
    const { t } = await getT();
    const parsed = signUpSchema.safeParse(formDataToObject(formData));
    if (!parsed.success) {
        return {
            isError: true,
            message: t("authTranslations.error.badRequest"),
        };
    }

    const input = parsed.data;
    const email = normalizeEmail(input.email);

    const result: TypedResponse<{ user: PartialUser }> = await db.transaction(
        async (trx) => {
            const existing = await trx.query.UsersTable.findFirst({
                columns: { id: true },
                where: eq(UsersTable.email, email),
            });

            if (existing) {
                return {
                    isError: true,
                    message: t("authTranslations.signUp.error.duplicate"),
                };
            }

            const salt = generateSalt();
            const passwordHash = await hashPassword(input.password, salt);

            const [user] = await trx
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

            if (!user) {
                return {
                    isError: true,
                    message: t("authTranslations.signUp.error.generic"),
                };
            }

            await trx.insert(UserCredentialsTable).values({
                userId: user.id,
                passwordHash,
                passwordSalt: salt,
            });

            return { isError: false, user };
        },
    );

    if (result.isError) return { isError: true, message: result.message };
    await createSession(result.user, await cookies());

    redirect("/");
}

export async function oAuthSignIn(provider: OAuthProvider) {
    const oAuthClient = getOAuthClient(provider);
    redirect(oAuthClient.createAuthUrl(await cookies()));
}

export async function signOutAction(): Promise<TypedResponse<{}>> {
    const cookieStore = await cookies();
    removeSession({
        delete: (name: string) => {
            cookieStore.delete(name);
        },
    });
    redirect("/sign-in");
}

export async function getAuth(): Promise<AuthState> {
    const fullUser = await getCurrentUser({
        withFullUser: true,
    });
    if (!fullUser) return { isAuthenticated: false, session: null };

    const userCredentials = await db.query.UserCredentialsTable.findFirst({
        where: eq(UserCredentialsTable.userId, fullUser.id),
        columns: { expiresAt: true },
    });

    return {
        isAuthenticated: true,
        session: { user: fullUser, hasPassword: !!(userCredentials && (!userCredentials.expiresAt || userCredentials.expiresAt > new Date())) },
    };
}
