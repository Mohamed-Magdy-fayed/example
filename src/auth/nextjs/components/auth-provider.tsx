"use client";

import { eq } from "drizzle-orm";
import { createContext, type ReactNode, useContext } from "react";

import { listPasskeys } from "@/auth/core/services";
import { getCurrentUser } from "@/auth/nextjs/currentUser";
import { UserCredentialsTable } from "@/auth/tables";
import { db } from "@/server/db";

type AuthContextValue = Awaited<ReturnType<typeof loadAppContext>>;

export async function loadAppContext() {
	const fullUser = await getCurrentUser({
		redirectIfNotFound: true,
		withFullUser: true,
	});
	const [passkeys, credentials] = await Promise.all([
		listPasskeys(fullUser.id),
		db.query.UserCredentialsTable.findFirst({
			columns: { userId: true },
			where: eq(UserCredentialsTable.userId, fullUser.id),
		}),
	]);

	const profileName = fullUser.name ?? "--";
	const hasPassword = credentials != null;
	const emailVerified = fullUser.emailVerified != null;

	return {
		fullUser,
		passkeys,
		profileName,
		hasPassword,
		emailVerified,
	};
}

const AuthContext = createContext<AuthContextValue | null>(null);
type AuthProviderProps = { value: AuthContextValue; children: ReactNode };

export function AuthProvider({ value, children }: AuthProviderProps) {
	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (context == null) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}
