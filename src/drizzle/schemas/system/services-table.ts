import { pgTable, varchar } from "drizzle-orm/pg-core";

import { createdAt, createdBy, id, updatedAt, updatedBy } from "@/drizzle/schemas/helpers";

export const servicesTable = pgTable("services", {
    id,
    nameEn: varchar().notNull(),
    nameAr: varchar().notNull(),
    updatedAt,
    updatedBy,
    createdAt,
    createdBy,
});
