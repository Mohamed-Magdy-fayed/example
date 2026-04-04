"use client";

import type { Table } from "@tanstack/react-table";
import { Trash2, XCircleIcon, XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";
import {
  DataTableActionBar,
  DataTableActionBarAction,
  DataTableActionBarSelection,
} from "@/components/data-table/components/data-table-action-bar";
import ExportForm from "@/components/data-table/components/data-table-export-form";
import { DataTableModal } from "@/components/data-table/components/data-table-modal";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { P } from "@/components/ui/typography";
import { useTranslation } from "@/features/core/i18n/useTranslation";
import type { User } from "@/server/db/schema";
import { api } from "@/trpc/react";

const actions = ["export", "delete"] as const;

type Action = (typeof actions)[number];

interface UsersActionBarProps {
  table: Table<User>;
}

export function UsersActionBar({ table }: UsersActionBarProps) {
  const { t } = useTranslation();
  const router = useRouter();

  const rows = table.getFilteredSelectedRowModel().rows;
  const [isPending, startTransition] = React.useTransition();
  const [currentAction, setCurrentAction] = React.useState<Action | null>(null);
  const [isExportFormOpen, setIsExportFormOpen] =
    React.useState<boolean>(false);

  const deleteUsersMutation = api.users.delete.useMutation();

  const getIsActionPending = React.useCallback(
    (action: Action) => isPending && currentAction === action,
    [isPending, currentAction],
  );

  const onOrderDelete = React.useCallback(async () => {
    setCurrentAction("delete");
    startTransition(async () => {
      try {
        await deleteUsersMutation.mutateAsync({
          ids: rows.map((row) => row.original.id),
        });
        table.toggleAllRowsSelected(false);
        toast.success(t("success"));
        router.refresh();
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : t("error", { error: "" }),
        );
      }
    });
  }, [rows, table, router, t, deleteUsersMutation]);

  return (
    <DataTableActionBar table={table} visible={rows.length > 0}>
      <DataTableActionBarSelection table={table} />
      <Separator
        className="hidden data-[orientation=vertical]:h-5 sm:block"
        orientation="vertical"
      />
      <div className="flex items-center gap-1.5">
        <ExportForm
          data={rows.map((row) => row.original)}
          fileName="orders.csv"
          isLoading={getIsActionPending("export")}
          isOpen={isExportFormOpen}
          selectedData={rows.map((row) => row.original)}
          setIsOpen={setIsExportFormOpen}
          sheetName="Orders"
        />
        <DataTableModal
          content={
            <div className="flex flex-col gap-4">
              <P>{t("common.areYouSure")}</P>
              <div className="flex gap-2 items-center">
                <Button
                  variant="destructive"
                  onClick={onOrderDelete}>
                  <Trash2 />
                  {t("common.delete")}</Button>
                <Button variant="ghost" onClick={() => setCurrentAction(null)}>
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
