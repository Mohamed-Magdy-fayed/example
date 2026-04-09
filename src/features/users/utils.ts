import { and, gte, ilike, inArray, isNull, lte, type SQL } from "drizzle-orm";
import type { PgColumn } from "drizzle-orm/pg-core";
import z from "zod";
import {
    buildCountQuery,
} from "@/components/data-table/lib/drizzle-helpers";
import type {
    DataTableCountFetcherMap,
    DataTableQuery,
    Option,
} from "@/components/data-table/types";
import {
    type User,
    type UserRole,
    UsersTable,
    userRoleValues,
} from "@/drizzle/schema";
import { getT } from "@/features/core/i18n/actions";

export const userFormSchema = z.object({
    name: z.string(),
    email: z.email(),
    phone: z.string().nullable(),
    salary: z.number(),
    role: z.enum(userRoleValues),
    branchIds: z.array(z.uuid()),
    lastSignInAt: z.date(),
});
export type UserFormValues = z.infer<typeof userFormSchema>;

export interface UserFilters {
    name?: string;
    email?: string;
    phone?: string;
    role?: UserRole[];
    salary?: {
        from?: number;
        to?: number;
    };
    createdAt?: {
        from?: Date;
        to?: Date;
    };
    lastSignInAt?: {
        from?: Date;
        to?: Date;
    };
}

export interface UserCounts {
    role: Option<UserRole>[];
}

export const drizzleColumnMap: Record<string, PgColumn> = {
    id: UsersTable.id,
    name: UsersTable.name,
    email: UsersTable.email,
    phone: UsersTable.phone,
    role: UsersTable.role,
    createdAt: UsersTable.createdAt,
};

function parseTrimmedString(value: unknown): string | undefined {
    if (typeof value !== "string") return undefined;
    const normalized = value.trim();
    return normalized.length ? normalized : undefined;
}

function parseNumberRange(value: unknown): { from?: number; to?: number } | undefined {
    if (!Array.isArray(value) || value.length === 0) return undefined;

    const fromRaw = value[0];
    const toRaw = value[1];

    const from =
        typeof fromRaw === "number" ? fromRaw : Number(fromRaw);
    const to =
        typeof toRaw === "number" ? toRaw : Number(toRaw);

    const hasFrom = Number.isFinite(from);
    const hasTo = Number.isFinite(to);
    if (!hasFrom && !hasTo) return undefined;

    return {
        from: hasFrom ? from : undefined,
        to: hasTo ? to : undefined,
    };
}

function parseDateRange(value: unknown): { from?: Date; to?: Date } | undefined {
    if (!Array.isArray(value) || value.length === 0) return undefined;

    const parseDate = (raw: unknown): Date | undefined => {
        if (raw === null || raw === undefined || raw === "") return undefined;
        const asNumber = typeof raw === "number" ? raw : Number(raw);
        if (!Number.isFinite(asNumber)) return undefined;
        const date = new Date(asNumber);
        return Number.isNaN(date.getTime()) ? undefined : date;
    };

    const from = parseDate(value[0]);
    const to = parseDate(value[1]);

    if (!from && !to) return undefined;
    return { from, to };
}

export function toUserFilters(raw: Record<string, unknown>): UserFilters {
    const roleRaw = raw.role;
    const role = Array.isArray(roleRaw)
        ? roleRaw.filter((item): item is UserRole =>
            typeof item === "string" && userRoleValues.includes(item as UserRole),
        )
        : undefined;

    return {
        name: parseTrimmedString(raw.name),
        email: parseTrimmedString(raw.email),
        phone: parseTrimmedString(raw.phone),
        role: role && role.length ? role : undefined,
        salary: parseNumberRange(raw.salary),
        createdAt: parseDateRange(raw.createdAt),
        lastSignInAt: parseDateRange(raw.lastSignInAt),
    };
}

export function buildUsersWhere(
    filters: UserFilters,
    options?: { ignoreRole?: boolean },
): SQL {
    const clauses: SQL[] = [
        isNull(UsersTable.deletedAt),
        inArray(UsersTable.role, ["employee"]),
    ];

    if (filters.name) {
        clauses.push(ilike(UsersTable.name, `%${filters.name}%`));
    }

    if (filters.email) {
        clauses.push(ilike(UsersTable.email, `%${filters.email}%`));
    }

    if (filters.phone) {
        clauses.push(ilike(UsersTable.phone, `%${filters.phone}%`));
    }

    if (!options?.ignoreRole && filters.role?.length) {
        clauses.push(inArray(UsersTable.role, filters.role));
    }

    if (filters.salary?.from !== undefined) {
        clauses.push(gte(UsersTable.salary, filters.salary.from));
    }

    if (filters.salary?.to !== undefined) {
        clauses.push(lte(UsersTable.salary, filters.salary.to));
    }

    if (filters.createdAt?.from) {
        clauses.push(gte(UsersTable.createdAt, filters.createdAt.from));
    }

    if (filters.createdAt?.to) {
        clauses.push(lte(UsersTable.createdAt, filters.createdAt.to));
    }

    if (filters.lastSignInAt?.from) {
        clauses.push(gte(UsersTable.lastSignInAt, filters.lastSignInAt.from));
    }

    if (filters.lastSignInAt?.to) {
        clauses.push(lte(UsersTable.lastSignInAt, filters.lastSignInAt.to));
    }

    return and(...clauses) as SQL;
}

async function buildFacetCounts(
    query: DataTableQuery<UserFilters, User>,
): Promise<UserCounts> {
    const filters = query?.filters ?? {};
    const whereExprRole = buildUsersWhere(filters, { ignoreRole: true });

    const { t } = await getT();

    const [roleRows] = await Promise.all([
        buildCountQuery({
            column: "role",
            table: UsersTable,
            whereExpr: whereExprRole,
            label: (role) =>
                t("employeeTranslations.columns.role.filterValues", { role }),
        }),
    ]);

    return {
        role: roleRows,
    };
}

export const userCountFetchers: DataTableCountFetcherMap<
    UserFilters,
    UserCounts,
    User
> = {
    role: async (query) => {
        const counts = await buildFacetCounts(query);
        return counts.role;
    },
};
