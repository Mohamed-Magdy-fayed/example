import { asc, count, desc, sql } from "drizzle-orm";
import { buildOrderByFromSorting } from "@/components/data-table/lib/drizzle-helpers";
import { createServerDataTable } from "@/components/data-table/lib/server-table";
import { db } from "@/drizzle";
import type { User } from "@/drizzle/schema";
import { UsersTable } from "@/drizzle/schema";
import { getUserColumns } from "@/features/users/columns";
import {
  buildUsersWhere,
  drizzleColumnMap,
  toUserFilters,
  type UserCounts,
  type UserFilters,
  userCountFetchers,
} from "@/features/users/utils";

async function fetchUsers(query: {
  pagination: { page: number; perPage: number };
  sorting: Array<{ id: string; desc?: boolean }>;
  filters: UserFilters;
}) {
  const { page, perPage } = query.pagination;
  const offset = Math.max(0, (page - 1) * perPage);

  const whereExpr = buildUsersWhere(query.filters);
  const orderByExpr = buildOrderByFromSorting(
    query.sorting,
    drizzleColumnMap,
  ) ?? [desc(UsersTable.createdAt), asc(UsersTable.id)];

  const [rows, totalRows, salaryTotal] = await Promise.all([
    db
      .select()
      .from(UsersTable)
      .where(whereExpr)
      .orderBy(...orderByExpr)
      .limit(perPage)
      .offset(offset),
    db
      .select({ count: count() })
      .from(UsersTable)
      .where(whereExpr)
      .then((result) => Number(result[0]?.count ?? 0)),
    db
      .select({
        salary: sql<number>`coalesce(sum(${UsersTable.salary}), 0)`,
      })
      .from(UsersTable)
      .where(whereExpr)
      .then((result) => Number(result[0]?.salary ?? 0)),
  ]);

  return {
    rows,
    total: totalRows,
    meta: {
      totalsByColumnId: {
        salary: salaryTotal,
      },
    },
  };
}

export const usersTable = createServerDataTable<User, UserFilters, UserCounts>({
  entity: "employee",
  columns: (context: any) => getUserColumns(context, () => ""),
  fetcher: fetchUsers,
  counts: userCountFetchers,
  transformFilters: async (filters) => toUserFilters(filters),
  defaultPageSize: 10,
  initialState: {
    sorting: [{ id: "createdAt", desc: true }],
    columnVisibility: {
      estimatedHours: true,
    },
  },
});
