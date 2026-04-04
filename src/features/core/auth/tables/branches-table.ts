import { relations } from "drizzle-orm";
import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";

import { BranchMembershipsTable, UsersTable } from ".";
import { createdAt, id, updatedAt } from "@/server/db/schemas/helpers";

export const BranchesTable = pgTable("branches", {
	id,
	nameEn: varchar({ length: 128 }).notNull(),
	nameAr: varchar({ length: 128 }).notNull(),
	ownerId: uuid().references(() => UsersTable.id, { onDelete: "set null" }),
	createdAt,
	updatedAt,
});

export const branchesRelations = relations(
	BranchesTable,
	({ many, one }) => ({
		memberships: many(BranchMembershipsTable),
		owner: one(UsersTable, {
			fields: [BranchesTable.ownerId],
			references: [UsersTable.id],
		}),
	}),
);

export type Branch = typeof BranchesTable.$inferSelect;
export type NewBranch = typeof BranchesTable.$inferInsert;
