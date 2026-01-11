import { relations } from "drizzle-orm";
import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";

import { OrganizationMembershipsTable, UsersTable } from "./";
import { createdAt, id, updatedAt } from "./schema-helpers";

export const OrganizationsTable = pgTable("organizations", {
	id,
	nameEn: varchar({ length: 128 }).notNull(),
	nameAr: varchar({ length: 128 }).notNull(),
	ownerId: uuid().references(() => UsersTable.id, { onDelete: "set null" }),
	createdAt,
	updatedAt,
});

export const organizationsRelations = relations(
	OrganizationsTable,
	({ many, one }) => ({
		memberships: many(OrganizationMembershipsTable),
		owner: one(UsersTable, {
			fields: [OrganizationsTable.ownerId],
			references: [UsersTable.id],
		}),
	}),
);

export type Organization = typeof OrganizationsTable.$inferSelect;
export type NewOrganization = typeof OrganizationsTable.$inferInsert;
