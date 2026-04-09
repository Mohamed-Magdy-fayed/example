"use client";

import type { Table } from "@tanstack/react-table";
import type * as React from "react";

import { DataTableAdvancedToolbar } from "@/components/data-table/data-table-advanced-toolbar";
import { DataTableFilterList } from "@/components/data-table/data-table-filter-list";
import { DataTableSortList } from "@/components/data-table/data-table-sort-list";
import { cn } from "@/lib/utils";

interface DataTableToolbarProps<TData> extends React.ComponentProps<"div"> {
  table: Table<TData>;
  shallow?: boolean;
  debounceMs?: number;
  throttleMs?: number;
}

export function DataTableToolbar<TData>({
  table,
  children,
  className,
  shallow,
  debounceMs,
  throttleMs,
  ...props
}: DataTableToolbarProps<TData>) {
  return (
    <DataTableAdvancedToolbar
      className={cn("p-1", className)}
      table={table}
      {...props}
    >
      <DataTableSortList align="start" table={table} />
      <DataTableFilterList
        align="start"
        debounceMs={debounceMs}
        shallow={shallow}
        table={table}
        throttleMs={throttleMs}
      />
      {children}
    </DataTableAdvancedToolbar>
  );
}
