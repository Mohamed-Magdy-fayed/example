"use client";

import type { Table } from "@tanstack/react-table";
import { Trash2, XCircleIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";
import {
  DataTableActionBar,
  DataTableActionBarAction,
  DataTableActionBarSelection,
} from "@/components/data-table/data-table-action-bar";
import ExportForm from "@/components/data-table/data-table-export-form";
import { DataTableModal } from "@/components/data-table/data-table-modal";
import { type CsvExportColumn, exportToCsv } from "@/components/data-table/lib/export";
import { getSelectedRowIds } from "@/components/data-table/lib/selection";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { P } from "@/components/ui/typography";
import type { User } from "@/drizzle/schema";
import { useTranslation } from "@/features/core/i18n/useTranslation";
import {
  deleteEmployeesAction,
  getEmployeesByIdsAction,
} from "@/features/users/actions";

const actions = ["export", "delete"] as const;

type Action = (typeof actions)[number];

interface UsersActionBarProps {
  table: Table<User>;
}

export function UsersActionBar({ table }: UsersActionBarProps) {
  const { t } = useTranslation();
  const router = useRouter();

  const rowSelection = table.getState().rowSelection;
  const selectedIds = React.useMemo(
    () => getSelectedRowIds(table as Table<unknown>),
    [table, rowSelection],
  );
  const rows = table.getFilteredSelectedRowModel().rows;
  const [isPending, startTransition] = React.useTransition();
  const [currentAction, setCurrentAction] = React.useState<Action | null>(null);
  const [isExportFormOpen, setIsExportFormOpen] =
    React.useState<boolean>(false);

  const getIsActionPending = React.useCallback(
    (action: Action) => isPending && currentAction === action,
    [isPending, currentAction],
  );

  const onEmployeesDelete = React.useCallback(async () => {
    setCurrentAction("delete");
    startTransition(async () => {
      try {
        const result = await deleteEmployeesAction({
          ids: selectedIds,
        });

        if (result.isError) {
          toast.error(result.message);
          return;
        }

        table.resetRowSelection(true);
        toast.success(
          t("employeeTranslations.actions.success", {
            action: "delete",
            length: selectedIds.length,
          }),
        );
        router.refresh();
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : t("employeeTranslations.actions.error", { action: "delete" }),
        );
      }
    });
  }, [selectedIds, table, router, t]);

  const onEmployeesExport = React.useCallback(
    async (columns: CsvExportColumn[]) => {
      setCurrentAction("export");
      startTransition(async () => {
        try {
          const result = await getEmployeesByIdsAction({ ids: selectedIds });

          if (result.isError) {
            toast.error(result.message);
            return;
          }

          const byId = new Map(result.data.map((item) => [item.id, item]));
          const orderedRows = selectedIds
            .map((id) => byId.get(id))
            .filter((item): item is User => Boolean(item));

          const exportData = orderedRows.map((item) =>
            columns.reduce<Record<string, unknown>>(
              (acc, key) => {
                const columnKey = key.key as keyof User;
                acc[key.key] = item[columnKey];
                return acc;
              },
              {},
            ),
          );

          exportToCsv(exportData, "employees.csv", { columns });
        } catch (error) {
          toast.error(
            error instanceof Error
              ? error.message
              : t("employeeTranslations.actions.error", { action: "update" }),
          );
        }
      });
    },
    [selectedIds, t],
  );

  return (
    <DataTableActionBar table={table} visible={selectedIds.length > 0}>
      <DataTableActionBarSelection table={table} />
      <Separator
        className="hidden data-[orientation=vertical]:h-5 sm:block"
        orientation="vertical"
      />
      <div className="flex items-center gap-1.5">
        <ExportForm
          data={rows.map((row) => row.original)}
          fileName="employees.csv"
          handleExport={onEmployeesExport}
          isLoading={getIsActionPending("export")}
          isOpen={isExportFormOpen}
          selectedData={[]}
          setIsOpen={setIsExportFormOpen}
          sheetName="Employees"
          table={table}
        />
        <DataTableModal
          content={
            <div className="flex flex-col gap-4">
              <P>{t("common.areYouSure")}</P>
              <div className="flex items-center gap-2">
                <Button onClick={onEmployeesDelete} variant="destructive">
                  <Trash2 />
                  {t("common.delete")}
                </Button>
                <Button onClick={() => setCurrentAction(null)} variant="ghost">
                  <XCircleIcon />
                  {t("common.cancel")}
                </Button>
              </div>
            </div>
          }
          onOpenChange={() => setCurrentAction(null)}
          open={currentAction === "delete"}
          title={t("common.deleteConfirmation")}
        />
        <DataTableActionBarAction
          className="border-destructive"
          isPending={getIsActionPending("delete")}
          onClick={() => setCurrentAction("delete")}
          size="icon"
          tooltip={t("common.delete")}
          variant="destructive"
        >
          <Trash2 />
        </DataTableActionBarAction>
      </div>
    </DataTableActionBar>
  );
}
