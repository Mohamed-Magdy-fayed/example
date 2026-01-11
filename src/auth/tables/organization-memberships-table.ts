import { relations } from "drizzle-orm";
import {
	pgTable,
	primaryKey,
	uuid,
} from "drizzle-orm/pg-core";
import { OrganizationsTable, UsersTable } from "./";
import { createdAt, updatedAt } from "./schema-helpers";

export const OrganizationMembershipsTable = pgTable(
	"organization_memberships",
	{
		organizationId: uuid()
			.notNull()
			.references(() => OrganizationsTable.id, { onDelete: "cascade" }),
		userId: uuid()
			.notNull()
			.references(() => UsersTable.id, { onDelete: "cascade" }),
		createdAt,
		updatedAt,
	},
	(table) => [primaryKey({ columns: [table.organizationId, table.userId] })],
);

export const organizationMembershipRelations = relations(
	OrganizationMembershipsTable,
	({ one }) => ({
		organization: one(OrganizationsTable, {
			fields: [OrganizationMembershipsTable.organizationId],
			references: [OrganizationsTable.id],
		}),
		user: one(UsersTable, {
			fields: [OrganizationMembershipsTable.userId],
			references: [UsersTable.id],
		}),
	}),
);

export type OrganizationMembership =
	typeof OrganizationMembershipsTable.$inferSelect;
export type NewOrganizationMembership =
	typeof OrganizationMembershipsTable.$inferInsert;
