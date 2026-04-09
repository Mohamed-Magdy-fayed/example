import { and, DrizzleError, eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/drizzle";
import {
	createSession,
	getOAuthClient,
	getSessionFromCookie,
	normalizeEmail,
} from "@/features/core/auth/core";
import {
	type OAuthProvider,
	oAuthProviderValues,
	UserOAuthAccountsTable,
	UsersTable,
} from "@/features/core/auth/tables";
import type { PartialUser } from "@/features/core/auth/types";

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
		console.error("Invalid OAuth callback parameters", {
			code,
			state,
			provider: rawProvider,
		});

		redirect(
			`/sign-in?oauthError=${encodeURIComponent(
				"Failed to connect. Please try again.",
			)}`,
		);
	}

	const cookieJar = await cookies();
	const currentSession = await getSessionFromCookie(cookieJar);
	const oAuthClient = getOAuthClient(provider);
	let user: PartialUser | null = null;

	try {
		const oAuthUser = await oAuthClient.fetchUser(code, state, cookieJar);

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

		const message =
			error instanceof Error || error instanceof DrizzleError
				? error.message || "Failed to connect. Please try again."
				: "Failed to connect. Please try again.";

		redirect(`/sign-in?oauthError=${encodeURIComponent(message)}`);
	}

	redirect(user.role === "customer" ? "/" : "/dashboard");
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
					emailVerifiedAt: true,
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
					emailVerifiedAt: true,
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
					emailVerifiedAt: new Date(),
					role: "customer",
					createdBy: "sign-up",
				})
				.returning({
					id: UsersTable.id,
					role: UsersTable.role,
					name: UsersTable.name,
					email: UsersTable.email,
					phone: UsersTable.phone,
					imageUrl: UsersTable.imageUrl,
					emailVerifiedAt: UsersTable.emailVerifiedAt,
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

			if (user.emailVerifiedAt == null) {
				await trx
					.update(UsersTable)
					.set({ emailVerifiedAt: new Date() })
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
