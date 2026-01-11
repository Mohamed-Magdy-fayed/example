import { and, DrizzleError, eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";
import { z } from "zod";

import {
	createSession,
	getOAuthClient,
	getSessionFromCookie,
	normalizeEmail,
} from "@/auth/core";
import {
	type OAuthProvider,
	oAuthProviderValues,
	UserOAuthAccountsTable,
	UsersTable,
} from "@/auth/tables";
import type { PartialUser } from "@/auth/types";
import { db } from "@/server/db";

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ provider: string }> },
) {
	const { provider: rawProvider } = await params;
	const code = request.nextUrl.searchParams.get("code");
	const state = request.nextUrl.searchParams.get("state");
	const { success, data: provider } = z
		.enum(oAuthProviderValues)
		.safeParse(rawProvider);

	if (typeof code !== "string" || typeof state !== "string" || !success) {
		redirect(
			`/sign-in?oauthError=${encodeURIComponent(
				"Failed to connect. Please try again.",
			)}`,
		);
	}

	const cookieJar = await cookies();
	const currentSession = await getSessionFromCookie(cookieJar);
	const oAuthClient = getOAuthClient(provider);
	try {
		const oAuthUser = await oAuthClient.fetchUser(code, state, cookieJar);

		let user: PartialUser | null = null;

		if (currentSession?.id) {
			user = await connectUserToAccount(oAuthUser, provider, {
				currentUserId: currentSession.id,
			});
		} else {
			const existingUser = await db.query.UserOAuthAccountsTable.findFirst({
				where: eq(UserOAuthAccountsTable.providerAccountId, oAuthUser.id),
			});

			user = await connectUserToAccount(oAuthUser, provider, {
				currentUserId: existingUser?.userId,
			});
		}

		await createSession(user, cookieJar);
	} catch (error) {
		console.error(error);
		if (error instanceof Error) {
			redirect(
				`/sign-in?oauthError=${encodeURIComponent(
					error.message || "Failed to connect. Please try again.",
				)}`,
			);
		} else if (error instanceof DrizzleError) {
			redirect(
				`/sign-in?oauthError=${encodeURIComponent(
					error.message || "Failed to connect. Please try again.",
				)}`,
			);
		}
	}

	redirect("/");
}

type ConnectOptions = { currentUserId?: string };

function connectUserToAccount(
	{ id, email, name }: { id: string; email: string; name: string },
	provider: OAuthProvider,
	options: ConnectOptions = {},
) {
	return db.transaction(async (trx) => {
		const normalizedEmail = normalizeEmail(email);
		const existingUser = options.currentUserId
			? await trx.query.UsersTable.findFirst({
				columns: {
					id: true,
					emailVerified: true,
					role: true,
					name: true,
					email: true,
					phone: true,
					imageUrl: true,
				},
				where: eq(UsersTable.id, options.currentUserId),
			})
			: await trx.query.UsersTable.findFirst({
				columns: {
					id: true,
					emailVerified: true,
					role: true,
					name: true,
					email: true,
					phone: true,
					imageUrl: true,
				},
				where: eq(UsersTable.email, normalizedEmail),
			});

		let user = existingUser;

		if (user == null) {
			const [newUser] = await trx
				.insert(UsersTable)
				.values({
					name,
					email: normalizedEmail,
					emailVerified: new Date(),
					role: "user",
				})
				.returning({
					id: UsersTable.id,
					role: UsersTable.role,
					name: UsersTable.name,
					email: UsersTable.email,
					phone: UsersTable.phone,
					imageUrl: UsersTable.imageUrl,
					emailVerified: UsersTable.emailVerified,
				});

			if (newUser == null) {
				throw new Error("Unable to create user from OAuth profile");
			}

			user = newUser;
		} else {
			const existingAccount = await trx.query.UserOAuthAccountsTable.findFirst({
				columns: { userId: true },
				where: and(
					eq(UserOAuthAccountsTable.provider, provider),
					eq(UserOAuthAccountsTable.providerAccountId, id),
				),
			});

			if (existingAccount && existingAccount.userId !== user.id) {
				throw new Error("This OAuth account is already linked to another user");
			}

			if (user.emailVerified == null) {
				await trx
					.update(UsersTable)
					.set({ emailVerified: new Date() })
					.where(eq(UsersTable.id, user.id));
			}
		}

		await trx
			.insert(UserOAuthAccountsTable)
			.values({ provider, providerAccountId: id, userId: user.id })
			.onConflictDoNothing();

		return user;
	});
}
