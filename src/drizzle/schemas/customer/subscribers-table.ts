import { pgTable, varchar } from "drizzle-orm/pg-core";

import { createdAt, id } from "@/drizzle/schemas/helpers";

export const subscribersTable = pgTable("subscribers", {
    id,
    email: varchar().notNull().unique(),
    createdAt,
});
