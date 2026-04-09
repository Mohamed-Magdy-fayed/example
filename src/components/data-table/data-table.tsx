"use client";

import { flexRender, type Table as TanstackTable } from "@tanstack/react-table";
import type * as React from "react";

import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { getSelectedRowCount } from "@/components/data-table/lib/selection";
import { getCommonPinningStyles } from "@/components/data-table/lib/utils";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTranslation } from "@/features/core/i18n/useTranslation";
import { cn } from "@/lib/utils";

interface DataTableProps<TData> extends React.ComponentProps<"div"> {
  table: TanstackTable<TData>;
  actionBar?: React.ReactNode;
}

function getColumnSizeStyle(column: {
  columnDef: { size?: number };
  getSize: () => number;
}) {
  if (typeof column.columnDef.size !== "number") {
    return undefined;
  }

  const size = column.getSize();
  return {
    minWidth: size,
    width: size,
  } as const;
}

export function DataTable<TData>({
  table,
  actionBar,
  children,
  className,
  ...props
}: DataTableProps<TData>) {
  const { t } = useTranslation();
  const selectedRowsCount = getSelectedRowCount(
    table as TanstackTable<unknown>,
  );

  return (
    <div
      className={cn(
        "flex min-h-0 w-full min-w-0 flex-1 flex-col gap-2.5 overflow-hidden",
        className,
      )}
      {...props}
    >
      {children ? <div className="shrink-0">{children}</div> : null}
      <div className="flex min-h-0 min-w-0 flex-1 overflow-hidden rounded-md border bg-card/40 p-2">
        <ScrollArea
          className="size-full"
          viewportClassName="overflow-y-hidden rounded-sm"
        >
          <div className="flex h-full min-h-0 min-w-max flex-col pb-8 *:data-[slot='table-container']:pe-4">
            <Table className="w-max min-w-full">
              <TableHeader className="bg-background">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead
                        className={cn(
                          "bg-background",
                          getCommonPinningStyles({ column: header.column }),
                        )}
                        colSpan={header.colSpan}
                        key={header.id}
                        style={getColumnSizeStyle(header.column)}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
            </Table>

            <div className="min-h-0 flex-1">
              <ScrollArea
                className="size-full"
                defaultScrollbarClassName="z-30"
                viewportClassName="rounded-none pe-4"
              >
                <Table className="w-max min-w-full">
                  <TableBody>
                    {table.getRowModel().rows?.length ? (
                      table.getRowModel().rows.map((row) => (
                        <TableRow
                          data-state={row.getIsSelected() && "selected"}
                          key={row.id}
                        >
                          {row.getVisibleCells().map((cell) => (
                            <TableCell
                              className={getCommonPinningStyles({
                                column: cell.column,
                              })}
                              key={cell.id}
                              style={getColumnSizeStyle(cell.column)}
                            >
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext(),
                              )}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          className="h-24 text-center"
                          colSpan={table.getAllColumns().length}
                        >
                          {t("dataTableTranslations.noResults")}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </ScrollArea>
            </div>
          </div>
          <ScrollBar className="z-40" orientation="horizontal" />
        </ScrollArea>
      </div>
      <div className="shrink-0">
        <DataTablePagination table={table} />
        {actionBar && selectedRowsCount > 0 && actionBar}
      </div>
    </div>
  );
}
