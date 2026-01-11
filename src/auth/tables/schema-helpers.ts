import { timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const id = uuid().primaryKey().defaultRandom();

export const createdBy = varchar().notNull();
export const createdAt = timestamp({ withTimezone: true })
	.notNull()
	.defaultNow();

export const updatedBy = varchar().notNull();
export const updatedAt = timestamp({ withTimezone: true })
	.notNull()
	.defaultNow()
	.$onUpdate(() => new Date());

export const deletedBy = varchar()
export const deletedAt = timestamp({ withTimezone: true })
	.notNull()
