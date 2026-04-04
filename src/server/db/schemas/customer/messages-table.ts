import { pgEnum, pgTable, text, varchar } from "drizzle-orm/pg-core";
import z from "zod";
import { createdAt, id, updatedAt } from "@/server/db/schemas/helpers";

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

export const contactFormSchema = z.object({
	name: z.string().min(1, "contact.form.fields.name.error.required"),
	email: z.email("contact.form.fields.email.error.invalid"),
	company: z.string().optional(),
	phone: z.string().optional(),
	contactReason: z
		.enum(["demo", "pricing", "support", "partnership", "other"])
		.default("other")
		.optional(),
	subject: z.string().min(1, "contact.form.fields.subject.error.required"),
	message: z.string().min(1, "contact.form.fields.message.error.required"),
});
export type ContactFormData = z.infer<typeof contactFormSchema>;
