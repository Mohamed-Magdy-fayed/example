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
import { getTaskColumns } from "@/features/tasks/columns";
import { TasksActionBar } from "@/features/tasks/components/tasks-action-bar";
import { TasksForm } from "@/features/tasks/components/tasks-form";
import type {
  TaskCounts,
  TaskFilters,
  TaskTableMeta,
} from "@/features/tasks/utils";
import { useTranslation } from "@/lib/i18n/useTranslation";
import type { Task } from "@/server/db/schema";

interface TasksTableClientProps
  extends ServerDataTableLoadResult<
    Task,
    TaskFilters,
    TaskCounts,
    TaskTableMeta
  > { }

export function TasksTableClient(props: TasksTableClientProps) {
  const { t } = useTranslation();
  const columns = React.useMemo<ColumnDef<Task, unknown>[]>(() => {
    return getTaskColumns(
      {
        counts: props.counts,
        features: props.features,
      },
      t,
    );
  }, [props.counts, props.features, t]);

  const [isOpen, setIsOpen] = React.useState(false);
  const [isRouting, startTransition] = React.useTransition();
  const { table } = useDataTable<Task>({
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
        meta: props.meta ?? {
          totalEstimatedHours: 0,
          averageCompletion: 0,
        },
      }}
    >
      <section className="space-y-4">
        <header className="flex flex-col gap-1">
          <h1 className="font-semibold text-2xl">{t("appName")}</h1>
          <p className="text-muted-foreground text-sm">
            {props.meta
              ? t("tasksTranslations.table.summary", {
                hours: props.meta.totalEstimatedHours,
                completion: props.meta.averageCompletion,
              })
              : t("tasksTranslations.table.description")}
          </p>
        </header>
        <DataTable
          actionBar={<TasksActionBar table={table} />}
          aria-busy={isRouting}
          table={table}
        >
          <DataTableToolbar table={table}>
            <DataTableSheet
              content={<TasksForm setIsOpen={setIsOpen} />}
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
