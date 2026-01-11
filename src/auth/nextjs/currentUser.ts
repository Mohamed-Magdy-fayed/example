import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { OrganizationMembershipsTable } from "@/auth/tables";
import { UsersTable } from "@/auth/tables/users-table";
import { db } from "@/server/db";
import { getSessionFromCookie } from "../core/session";

export type FullUser = Exclude<
	Awaited<ReturnType<typeof getUserFromDb>>,
	undefined | null
>;

type User = Exclude<
	Awaited<ReturnType<typeof getSessionFromCookie>>,
	undefined | null
>;

function _getCurrentUser(options: {
	withFullUser: true;
	redirectIfNotFound: true;
}): Promise<FullUser>;
function _getCurrentUser(options: {
	withFullUser: true;
	redirectIfNotFound?: false;
}): Promise<FullUser | null>;
function _getCurrentUser(options: {
	withFullUser?: false;
	redirectIfNotFound: true;
}): Promise<User>;
function _getCurrentUser(options?: {
	withFullUser?: false;
	redirectIfNotFound?: false;
}): Promise<User | null>;
async function _getCurrentUser({
	withFullUser = false,
	redirectIfNotFound = false,
} = {}) {
	const cookieStore = await cookies();
	const user = await getSessionFromCookie(cookieStore);
	if (user == null) {
		if (redirectIfNotFound) return redirect("/sign-in");
		return null;
	}

	if (withFullUser) {
		const fullUser = await getUserFromDb(user.id);
		// This should never happen
		if (fullUser == null) throw new Error("User not found in database");
		return fullUser;
	}

	return user;
}

export const getCurrentUser = cache(_getCurrentUser);

function getUserFromDb(id: string) {
	return db
		.select({
			id: UsersTable.id,
			email: UsersTable.email,
			name: UsersTable.name,
			phone: UsersTable.phone,
			imageUrl: UsersTable.imageUrl,
			role: UsersTable.role,
			emailVerified: UsersTable.emailVerified,
			lastSignInAt: UsersTable.lastSignInAt,
			organizationId: OrganizationMembershipsTable.organizationId,
		})
		.from(UsersTable)
		.leftJoin(
			OrganizationMembershipsTable,
			eq(UsersTable.id, OrganizationMembershipsTable.userId),
		)
		.where(eq(UsersTable.id, id))
		.then((results) => results[0]);
}
