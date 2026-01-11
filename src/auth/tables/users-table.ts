import { relations } from "drizzle-orm";
import {
	pgEnum,
	pgTable,
	timestamp,
	uniqueIndex,
	varchar,
} from "drizzle-orm/pg-core";

import {
	BiometricCredentialsTable,
	OrganizationMembershipsTable,
	UserCredentialsTable,
	UserOAuthAccountsTable,
	UserTokensTable,
} from "./";
import { createdAt, id, updatedAt } from "./schema-helpers";

export const userRoleValues = [
	"admin",
	"user",
] as const;
export type UserRole = (typeof userRoleValues)[number];
export const userRoleEnum = pgEnum("user_role", userRoleValues);

export const UsersTable = pgTable(
	"users",
	{
		id,
		email: varchar({ length: 256 }).notNull(),
		name: varchar({ length: 256 }),
		phone: varchar({ length: 16 }),
		imageUrl: varchar({ length: 512 }),
		role: userRoleEnum().notNull().default("user"),
		emailVerified: timestamp({ withTimezone: true }),
		lastSignInAt: timestamp({ withTimezone: true }),
		createdAt,
		updatedAt,
	},
	(table) => [uniqueIndex("users_email_unique").on(table.email)],
);

export const usersRelations = relations(UsersTable, ({ many, one }) => ({
	credentials: one(UserCredentialsTable, {
		fields: [UsersTable.id],
		references: [UserCredentialsTable.userId],
	}),
	oauthAccounts: many(UserOAuthAccountsTable),
	organizationMemberships: many(OrganizationMembershipsTable),
	tokens: many(UserTokensTable),
	biometricCredentials: many(BiometricCredentialsTable),
}));

export type User = typeof UsersTable.$inferSelect;
export type NewUser = typeof UsersTable.$inferInsert;
