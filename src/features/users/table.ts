import type { DataTableQuery } from "@/components/data-table/types";
import { createServerDataTable } from "@/components/data-table/lib/server-table";
import { getUserColumns } from "@/features/users/columns";
import {
  type UserCounts,
  type UserFilters,
  userCountFetchers,
} from "@/features/users/utils";
import type { User } from "@/server/db/schema";
import { api } from "@/trpc/server";

async function fetchUsers(
  query: DataTableQuery<UserFilters, User>,
) {
  return api.users.list({
    pagination: {
      page: query.pagination.page,
      perPage: query.pagination.perPage,
    },
    sorting: query.sorting,
    filters: query.filters as Record<string, unknown>,
  });
}

export const usersTable = createServerDataTable<
  User,
  UserFilters,
  UserCounts
>({
  entity: "user",
  columns: (context) => getUserColumns(context, () => ""),
  fetcher: fetchUsers,
  counts: userCountFetchers,
  defaultPageSize: 10,
  initialState: {
    sorting: [{ id: "createdAt", desc: true }],
    columnVisibility: {
      estimatedHours: true,
    },
  },
});
