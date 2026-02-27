import type { ColumnDef } from "@tanstack/react-table";
import type { GetColumnData } from "drizzle-orm";
import {
    and,
    asc,
    between,
    count,
    desc,
    eq,
    ilike,
    inArray,
    type SQL,
} from "drizzle-orm";
import type {
    PgColumn,
    PgTable,
    PgTableWithColumns,
} from "drizzle-orm/pg-core";

import type { FilterVariant } from "@/components/data-table/types";
import { db } from "@/server/db";

export type MetaMapEntry = {
    variant: FilterVariant;
    column: PgColumn;
};

export function buildWhereFromMeta<TFilter>(
    filters: TFilter,
    metaMap: Record<string, MetaMapEntry>,
): SQL | undefined {
    if (!filters) return undefined;

    const parts: SQL[] = [];

    for (const [key, value] of Object.entries(filters)) {
        if (value === null || value === undefined) continue;
        const meta = metaMap[key];
        if (!meta) continue;

        const { variant, column } = meta;

        // text-like
        if (variant === "text") {
            if (typeof value === "string") {
                const v = value.trim();
                if (v.length > 0) {
                    parts.push(ilike(column, `%${v}%`));
                }
            }
            continue;
        }

        // multi-select
        if (variant === "multiSelect") {
            if (Array.isArray(value) && value.length > 0) {
                parts.push(inArray(column, value));
            } else if (typeof value === "string" && value !== "") {
                parts.push(eq(column, value));
            }
            continue;
        }

        // select
        if (variant === "select") {
            if (typeof value === column.dataType && value !== "") {
                parts.push(eq(column, value));
            }
            continue;
        }

        // number
        if (variant === "number") {
            if (typeof value === "number") {
                parts.push(eq(column, value));
            } else if (
                typeof value === "string" &&
                value !== "" &&
                !Number.isNaN(Number(value))
            ) {
                parts.push(eq(column, Number(value)));
            }
            continue;
        }

        // date / range / dateRange
        if (variant === "date" || variant === "range" || variant === "dateRange") {
            if (Array.isArray(value) && value.length === 2) {
                const rawLow = value[0];
                const rawHigh = value[1];
                const low = typeof rawLow === "number" ? rawLow : Number(rawLow);
                const high = typeof rawHigh === "number" ? rawHigh : Number(rawHigh);
                if (!Number.isNaN(low) && !Number.isNaN(high)) {
                    parts.push(between(column, low, high));
                }
            }
            continue;
        }

        // boolean
        if (variant === "boolean") {
            if (typeof value === "boolean") {
                parts.push(eq(column, value));
            } else if (typeof value === "string") {
                const v = value.toLowerCase();
                if (v === "true" || v === "false") {
                    parts.push(eq(column, v === "true"));
                }
            }
        }
    }

    return parts.length ? and(...parts) : undefined;
}

export function buildOrderByFromSorting(
    sorting: Array<{ id: string; desc?: boolean }> | undefined,
    columnDrizzleMap: Record<string, PgColumn>,
): SQL[] | undefined {
    if (!sorting || !sorting.length) return undefined;

    const parts: SQL[] = [];

    for (const s of sorting) {
        const col = columnDrizzleMap[s.id];
        if (!col) continue;
        const dir = s.desc ? desc : asc;
        parts.push(dir(col));
    }

    return parts.length ? parts : undefined;
}

export function buildMetaMapFromColumns<TData>(
    columns: ColumnDef<TData, unknown>[],
    columnDrizzleMap: Record<string, PgColumn>,
): Record<string, MetaMapEntry> {
    const map: Record<string, MetaMapEntry> = {};

    for (const col of columns) {
        let id: string | undefined;

        if (typeof col.id === "string" && col.id.length > 0) {
            id = col.id;
        } else if ("accessorKey" in col) {
            const a = (col as unknown as { accessorKey?: unknown }).accessorKey;
            if (typeof a === "string" && a.length > 0) id = a;
        }

        const variant = col.meta?.variant;

        if (id && variant) {
            const drizzleColumn = columnDrizzleMap[id];
            if (drizzleColumn) {
                map[id] = {
                    variant,
                    column: drizzleColumn,
                };
            }
        }
    }

    return map;
}

export async function buildCountQuery<
    TTable extends PgTableWithColumns<any>,
    TKey extends keyof TTable["_"]["columns"] & string,
>({
    table,
    whereExpr,
    column,
    label,
}: {
    table: TTable;
    whereExpr?: SQL;
    column: TKey;
    label?: (value: GetColumnData<TTable["_"]["columns"][TKey]>) => string;
}) {
    const col = table[column] as unknown as PgColumn;

    return db
        .select({ value: col, count: count(col) })
        .from(table as PgTable)
        .where(whereExpr)
        .groupBy(col)
        .then((rows) =>
            rows.map((row) => ({
                ...row,
                value: row.value as GetColumnData<TTable["_"]["columns"][TKey]>,
                label: label ? label(row.value) : `${row.value}`,
            })),
        );
}
