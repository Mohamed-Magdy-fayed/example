import { sql } from "drizzle-orm";

import { db } from "@/server/db";

export async function clearDb() {
    console.log(
        "🗑️ Emptying the entire database (tables, indexes, enums, sequences)",
    );

    const tablesSchema = db._.schema;
    if (!tablesSchema) throw new Error("Schema not loaded");

    const tableNames = Object.values(tablesSchema)
        .map((t) => t.dbName)
        .filter(Boolean);
    if (tableNames.length === 0) {
        console.log("⚠️ No tables found in schema, nothing to truncate");
        return;
    }

    const quoteIdent = (s: string) => `"${s.replace(/"/g, '""')}"`;
    const quotedTables = tableNames.map(quoteIdent).join(", ");

    console.log("🛜 Sending cleanup queries (indexes -> truncate -> enums)");

    await db.transaction(async (trx) => {
        // Drop non-primary indexes in public schema
        try {
            const dropIndexesQuery = `SELECT indexname FROM pg_indexes WHERE schemaname = 'public' AND indexname NOT LIKE '%_pkey';`;
            const idxRes: any = await trx.execute(sql.raw(dropIndexesQuery));
            const idxRows = idxRes.rows ?? idxRes;
            if (Array.isArray(idxRows) && idxRows.length > 0) {
                console.log(`🧩 Found ${idxRows.length} non-PK indexes to drop`);
                for (const r of idxRows) {
                    const idxName = r.indexname ?? r.index_name ?? r.name;
                    if (!idxName) continue;
                    const dropSql = `DROP INDEX IF EXISTS ${quoteIdent(idxName)} CASCADE;`;
                    console.log(`🗡️ Dropping index: ${idxName}`);
                    await trx.execute(sql.raw(dropSql));
                }
            } else {
                console.log("ℹ️ No non-primary indexes found to drop");
            }
        } catch (err) {
            console.warn("⚠️ Error while dropping indexes:", err);
        }

        // Truncate all tables and restart identities (also cascades to dependent tables)
        try {
            const truncateSql = `TRUNCATE TABLE ${quotedTables} RESTART IDENTITY CASCADE;`;
            console.log(`🧽 Truncating tables: ${tableNames.join(", ")}`);
            await trx.execute(sql.raw(truncateSql));
        } catch (err) {
            console.error("❌ Error while truncating tables:", err);
            throw err;
        }

        // Drop enum types (Postgres type typtype = 'e')
        try {
            const enumsQuery = `
				SELECT n.nspname as schema_name, t.typname as type_name
				FROM pg_type t
				JOIN pg_namespace n ON n.oid = t.typnamespace
				WHERE t.typtype = 'e';
			`;
            const enumsRes: any = await trx.execute(sql.raw(enumsQuery));
            const enumRows = enumsRes.rows ?? enumsRes;
            if (Array.isArray(enumRows) && enumRows.length > 0) {
                console.log(`🔻 Found ${enumRows.length} enum types to drop`);
                for (const er of enumRows) {
                    const ns = er.schema_name ?? er.schema ?? "public";
                    const name = er.type_name ?? er.typname;
                    if (!name) continue;
                    const dropTypeSql = `DROP TYPE IF EXISTS ${quoteIdent(ns)}.${quoteIdent(name)} CASCADE;`;
                    console.log(`🧯 Dropping enum type: ${ns}.${name}`);
                    await trx.execute(sql.raw(dropTypeSql));
                }
            } else {
                console.log("ℹ️ No enum types found to drop");
            }
        } catch (err) {
            console.warn("⚠️ Error while dropping enum types:", err);
        }
    });

    console.log("✅ Database cleanup complete");
}
