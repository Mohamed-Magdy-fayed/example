"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { PlusSquareIcon } from "lucide-react";
import * as React from "react";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableProvider } from "@/components/data-table/data-table-provider";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { useDataTable } from "@/components/data-table/hooks/use-data-table";
import type { ServerDataTableLoadResult } from "@/components/data-table/lib/server-table";
import { LinkButton } from "@/components/general/link-button";
import type { User } from "@/drizzle/schema";
import { useTranslation } from "@/features/core/i18n/useTranslation";
import { getUserColumns } from "@/features/users/columns";
import { UsersActionBar } from "@/features/users/components/users-action-bar";
import type { UserCounts, UserFilters } from "@/features/users/utils";

interface UsersTableMeta {
  totalsByColumnId?: Partial<Record<string, number>>;
}

interface UsersTableClientProps
  extends ServerDataTableLoadResult<
    User,
    UserFilters,
    UserCounts,
    UsersTableMeta
  > { }

export function UsersTableClient(props: UsersTableClientProps) {
  const { t } = useTranslation();
  const columns = React.useMemo<ColumnDef<User, unknown>[]>(() => {
    return getUserColumns(
      {
        counts: props.counts,
        features: props.features,
      },
      t,
    );
  }, [props.counts, props.features, t]);

  const [isRouting, startTransition] = React.useTransition();
  const { table, shallow, debounceMs, throttleMs } = useDataTable<User>({
    columns,
    data: props.data,
    pageCount: props.pageCount,
    rowCount: props.total,
    getRowId: (row) => row.id,
    initialState: props.initialState,
    meta: {
      totalsByColumnId: props.meta?.totalsByColumnId,
    },
    history: "push",
    shallow: false,
    enableAdvancedFilter: true,
    startTransition,
  });

  return (
    <DataTableProvider
      value={{
        entity: props.entity,
        counts: props.counts,
        features: props.features,
      }}
    >
      <section className="flex min-h-0 min-w-0 flex-1 flex-col space-y-4 overflow-hidden">
        <DataTable
          actionBar={<UsersActionBar table={table} />}
          aria-busy={isRouting}
          className="min-h-0 flex-1"
          table={table}
        >
          <DataTableToolbar
            debounceMs={debounceMs}
            shallow={shallow}
            table={table}
            throttleMs={throttleMs}
          >
            <LinkButton
              href="/employee/new"
              rel="noopener noreferrer"
              target="_blank"
            >
              <PlusSquareIcon className="size-4" />
              {t("common.add")}
            </LinkButton>
          </DataTableToolbar>
        </DataTable>
      </section>
    </DataTableProvider>
  );
}
