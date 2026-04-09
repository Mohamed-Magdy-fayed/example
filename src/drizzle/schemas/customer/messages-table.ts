import { pgEnum, pgTable, text, varchar } from "drizzle-orm/pg-core";

import { createdAt, id, updatedAt } from "@/drizzle/schemas/helpers";

const contactReasons = [
	"demo",
	"pricing",
	"support",
	"partnership",
	"other",
] as const;
export type ContactReason = (typeof contactReasons)[number];
export const contactReasonsEnum = pgEnum("contact_reasons", contactReasons);

export const MessagesTable = pgTable("messages", {
	id,
	name: varchar().notNull(),
	email: varchar().notNull(),
	company: varchar(),
	phone: varchar(),
	contactReason: contactReasonsEnum().default("other").notNull(),
	subject: varchar().notNull(),
	message: text().notNull(),
	createdAt,
	updatedAt,
});
