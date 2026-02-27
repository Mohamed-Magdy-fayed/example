"use client";

import type { Column, ColumnDef } from "@tanstack/react-table";
import {
  ChevronDown,
  ChevronsUpDown,
  ChevronUp,
  EyeOff,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { cn } from "@/lib/utils";

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.ComponentProps<typeof DropdownMenuTrigger> {
  column: Column<TData, TValue>;
  title: string;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
  ...props
}: DataTableColumnHeaderProps<TData, TValue>) {
  const { t } = useTranslation();

  if (!column.getCanSort() && !column.getCanHide()) {
    return <div className={cn(className)}>{title}</div>;
  }

  return (
    <DropdownMenu>
      <div className="flex items-center justify-between gap-2 px-2">
        {title}
        <DropdownMenuTrigger asChild className={cn(className)} {...props}>
          <Button size="sm" variant="ghost">
            {column.getCanSort() &&
              (column.getIsSorted() === "desc" ? (
                <ChevronDown />
              ) : column.getIsSorted() === "asc" ? (
                <ChevronUp />
              ) : (
                <ChevronsUpDown />
              ))}
          </Button>
        </DropdownMenuTrigger>
      </div>
      <DropdownMenuContent align="start" className="w-28">
        {column.getCanSort() && (
          <>
            <DropdownMenuCheckboxItem
              checked={column.getIsSorted() === "asc"}
              className="relative pe-8 ps-2 [&>span:first-child]:end-2 [&>span:first-child]:start-auto [&_svg]:text-foreground"
              onClick={() => column.toggleSorting(false)}
            >
              <ChevronUp />
              {t("dataTableTranslations.asc")}
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={column.getIsSorted() === "desc"}
              className="relative pe-8 ps-2 [&>span:first-child]:end-2 [&>span:first-child]:start-auto [&_svg]:text-foreground"
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
            className="relative pe-8 ps-2 [&>span:first-child]:end-2 [&>span:first-child]:start-auto [&_svg]:text-muted-foreground"
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

export const selectColumn = {
  id: "select",
  header: ({ table }) => (
    <Checkbox
      aria-label="Select all"
      checked={
        table.getIsAllPageRowsSelected() ||
        (table.getIsSomePageRowsSelected() && "indeterminate")
      }
      onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
    />
  ),
  cell: ({ row }) => (
    <Checkbox
      aria-label="Select row"
      checked={row.getIsSelected()}
      onCheckedChange={(value) => row.toggleSelected(!!value)}
    />
  ),
  enableSorting: false,
  enableHiding: false,
  size: 40,
} satisfies ColumnDef<any>;
