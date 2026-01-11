import type { Config } from "drizzle-kit";

import { env } from "@/env/server";

export default {
	schema: "./src/server/db/schema.ts",
	dialect: "postgresql",
	dbCredentials: {
		url: env.DATABASE_URL,
	},
	tablesFilter: ["example_*"],
} satisfies Config;
