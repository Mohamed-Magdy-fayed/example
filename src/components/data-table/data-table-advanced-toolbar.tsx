"use client";

import type { Table } from "@tanstack/react-table";
import type * as React from "react";
import { DataTableTotalsSelect } from "@/components/data-table/data-table-totals-select";
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options";
import { cn } from "@/lib/utils";

interface DataTableAdvancedToolbarProps<TData>
  extends React.ComponentProps<"div"> {
  table: Table<TData>;
}

export function DataTableAdvancedToolbar<TData>({
  table,
  children,
  className,
  ...props
}: DataTableAdvancedToolbarProps<TData>) {
  return (
    <div
      aria-orientation="horizontal"
      className={cn(
        "flex w-full min-w-0 flex-col gap-2 p-1 sm:flex-row sm:items-start sm:justify-between",
        className,
      )}
      role="toolbar"
      {...props}
    >
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
        {children}
      </div>
      <div className="flex min-w-0 items-center gap-2 sm:shrink-0">
        <DataTableViewOptions align="end" table={table} />
        <DataTableTotalsSelect table={table} />
      </div>
    </div>
  );
}
