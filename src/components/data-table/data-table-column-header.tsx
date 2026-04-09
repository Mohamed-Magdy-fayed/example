"use client";

import type { Column, ColumnDef, Row, Table } from "@tanstack/react-table";
import {
  ChevronDown,
  ChevronsUpDown,
  ChevronUp,
  EyeOff,
  X,
} from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslation } from "@/features/core/i18n/useTranslation";
import { cn } from "@/lib/utils";

function SelectAllCheckbox({ table }: { table: Table<unknown> }) {
  const { t } = useTranslation();

  return (
    <Checkbox
      aria-label={t("dataTableTranslations.selectAll")}
      checked={
        table.getIsAllPageRowsSelected() || table.getIsSomePageRowsSelected()
      }
      onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
    />
  );
}

function SelectRowCheckbox({ row }: { row: Row<unknown> }) {
  const { t } = useTranslation();

  return (
    <Checkbox
      aria-label={t("dataTableTranslations.selectRow")}
      checked={row.getIsSelected()}
      onCheckedChange={(value) => row.toggleSelected(!!value)}
    />
  );
}

export const selectColumn: ColumnDef<unknown, unknown> = {
  id: "select",
  size: 40,
  minSize: 40,
  maxSize: 40,
  header: ({ table }) => (
    <div className="flex w-full items-center justify-center">
      <SelectAllCheckbox table={table} />
    </div>
  ),
  cell: ({ row }) => (
    <div className="flex w-full items-center justify-center">
      <SelectRowCheckbox row={row} />
    </div>
  ),
  enableSorting: false,
  enableHiding: false,
};

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.ComponentProps<typeof DropdownMenuTrigger> {
  column: Column<TData, TValue>;
  label: string;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  label,
  className,
  ...props
}: DataTableColumnHeaderProps<TData, TValue>) {
  const { t } = useTranslation();

  if (!column.getCanSort() && !column.getCanHide()) {
    return <div className={cn(className)}>{label}</div>;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "-ms-1.5 flex h-8 items-center gap-1.5 rounded-md px-2 py-1.5 hover:bg-accent focus:outline-none focus:ring-1 focus:ring-ring data-[state=open]:bg-accent [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-muted-foreground",
          className,
        )}
        {...props}
      >
        {label}
        {column.getCanSort() &&
          (column.getIsSorted() === "desc" ? (
            <ChevronDown />
          ) : column.getIsSorted() === "asc" ? (
            <ChevronUp />
          ) : (
            <ChevronsUpDown />
          ))}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-28">
        {column.getCanSort() && (
          <>
            <DropdownMenuCheckboxItem
              checked={column.getIsSorted() === "asc"}
              className="relative ps-2 pe-8 [&_svg]:text-muted-foreground"
              onClick={() => column.toggleSorting(false)}
            >
              <ChevronUp />
              {t("dataTableTranslations.asc")}
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={column.getIsSorted() === "desc"}
              className="relative ps-2 pe-8 [&_svg]:text-muted-foreground"
              onClick={() => column.toggleSorting(true)}
            >
              <ChevronDown />
              {t("dataTableTranslations.desc")}
            </DropdownMenuCheckboxItem>
            {column.getIsSorted() && (
              <DropdownMenuItem
                className="ps-2 [&_svg]:text-muted-foreground"
                onClick={() => column.clearSorting()}
              >
                <X />
                {t("dataTableTranslations.reset")}
              </DropdownMenuItem>
            )}
          </>
        )}
        {column.getCanHide() && (
          <DropdownMenuCheckboxItem
            checked={!column.getIsVisible()}
            className="relative ps-2 pe-8 [&_svg]:text-muted-foreground"
            onClick={() => column.toggleVisibility(false)}
          >
            <EyeOff />
            {t("dataTableTranslations.hide")}
          </DropdownMenuCheckboxItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
