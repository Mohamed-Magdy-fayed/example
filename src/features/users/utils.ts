import type { PgColumn } from "drizzle-orm/pg-core";
import z from "zod";
import {
    buildCountQuery,
    buildMetaMapFromColumns,
    buildWhereFromMeta,
} from "@/components/data-table/lib/drizzle-helpers";
import type {
    DataTableCountFetcherMap,
    DataTableQuery,
    Option,
} from "@/components/data-table/types";
import { getT } from "@/features/core/i18n/actions";
import { getUserColumns } from "@/features/users/columns";
import {
    type User,
    type UserRole,
    UsersTable,
    userRoleValues,
} from "@/server/db/schema";

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
    createdAt?: {
        from?: string;
        to?: string;
    };
}

export interface UserCounts {
    role: Option<UserRole>[];
}

export const baseUserColumns = getUserColumns(
    {
        counts: {} as UserCounts,
        features: undefined,
    },
    () => "",
);

export const drizzleColumnMap: Record<string, PgColumn> = {
    id: UsersTable.id,
    name: UsersTable.name,
    email: UsersTable.email,
    phone: UsersTable.phone,
    role: UsersTable.role,
    createdAt: UsersTable.createdAt,
};

export const userMetaMap = buildMetaMapFromColumns(
    baseUserColumns,
    drizzleColumnMap,
);

async function buildFacetCounts(
    query: DataTableQuery<UserFilters, User>,
): Promise<UserCounts> {
    const filters = query?.filters ?? {};
    const whereExprRole = buildWhereFromMeta(
        { ...filters, role: undefined },
        userMetaMap,
    );

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
