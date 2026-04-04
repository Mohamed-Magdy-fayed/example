import { pgTable, varchar } from "drizzle-orm/pg-core";
import { createdAt, id } from "@/server/db/schemas/helpers";

export const subscribersTable = pgTable("subscribers", {
    id,
    email: varchar().notNull().unique(),
    createdAt,
});
