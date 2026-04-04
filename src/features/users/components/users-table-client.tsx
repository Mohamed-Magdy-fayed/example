"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { PlusSquareIcon } from "lucide-react";
import * as React from "react";
import { DataTable } from "@/components/data-table/components/data-table";
import { DataTableProvider } from "@/components/data-table/components/data-table-provider";
import { DataTableSheet } from "@/components/data-table/components/data-table-sheet";
import { DataTableToolbar } from "@/components/data-table/components/data-table-toolbar";
import { useDataTable } from "@/components/data-table/hooks/use-data-table";
import type { ServerDataTableLoadResult } from "@/components/data-table/lib/server-table";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/features/core/i18n/useTranslation";
import { getUserColumns } from "@/features/users/columns";
import { UsersActionBar } from "@/features/users/components/users-action-bar";
import { UsersForm } from "@/features/users/components/users-form";
import type { UserCounts, UserFilters } from "@/features/users/utils";
import type { User } from "@/server/db/schema";

interface UsersTableClientProps
  extends ServerDataTableLoadResult<User, UserFilters, UserCounts, unknown> { }

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

  const [isOpen, setIsOpen] = React.useState(false);
  const [isRouting, startTransition] = React.useTransition();
  const { table } = useDataTable<User>({
    columns,
    data: props.data,
    pageCount: props.pageCount,
    initialState: props.initialState,
    history: "push",
    shallow: false,
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
      <section className="flex min-h-0 flex-1 flex-col space-y-4 overflow-hidden">
        <DataTable
          actionBar={<UsersActionBar table={table} />}
          aria-busy={isRouting}
          className="min-h-0 flex-1"
          table={table}
        >
          <DataTableToolbar table={table}>
            <DataTableSheet
              content={<UsersForm setIsOpen={setIsOpen} />}
              onOpenChange={(val) => setIsOpen(val)}
              open={isOpen}
              trigger={
                <Button>
                  <PlusSquareIcon className="size-4" />
                  {t("common.add")}
                </Button>
              }
            />
          </DataTableToolbar>
        </DataTable>
      </section>
    </DataTableProvider>
  );
}
