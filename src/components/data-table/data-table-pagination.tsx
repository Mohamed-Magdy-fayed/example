import type { Table } from "@tanstack/react-table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

import { getSelectedRowCount } from "@/components/data-table/lib/selection";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "@/features/core/i18n/useTranslation";
import { cn } from "@/lib/utils";

interface DataTablePaginationProps<TData> extends React.ComponentProps<"div"> {
  table: Table<TData>;
  pageSizeOptions?: number[];
}

export function DataTablePagination<TData>({
  table,
  pageSizeOptions = [10, 20, 30, 40, 50],
  className,
  ...props
}: DataTablePaginationProps<TData>) {
  const { t, dir } = useTranslation();
  const isRtl = dir === "rtl";
  const totalRows = table.getRowCount();
  const selectedRowsCount = getSelectedRowCount(table as Table<unknown>);

  return (
    <div
      className={cn(
        "flex w-full min-w-0 flex-col gap-3 overflow-x-hidden p-1 xl:flex-row xl:items-center xl:justify-between xl:gap-8",
        className,
      )}
      {...props}
    >
      <div className="w-full min-w-0 text-muted-foreground text-sm xl:flex-1">
        {t("dataTableTranslations.rowsSelected", {
          selected: selectedRowsCount,
          rows: totalRows,
        })}
      </div>
      <div className="flex w-full flex-wrap items-center justify-between gap-3 xl:w-auto xl:justify-end xl:gap-6">
        <div className="flex items-center gap-2">
          <p className="whitespace-nowrap font-medium text-sm">
            {t("dataTableTranslations.rowsPerPage")}
          </p>
          <Select
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
            value={`${table.getState().pagination.pageSize}`}
          >
            <SelectTrigger>
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent className="min-w-min" side="top">
              {pageSizeOptions.map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="order-first w-full text-start font-medium text-sm sm:order-0 sm:w-auto">
          {t("dataTableTranslations.pageOf", {
            page: table.getState().pagination.pageIndex + 1,
            total: table.getPageCount(),
          })}
        </div>
        <div className="flex items-center gap-2">
          <Button
            aria-label={t("dataTableTranslations.goToFirstPage")}
            className="hidden lg:flex"
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.setPageIndex(0)}
            size="icon"
            variant="outline"
          >
            {isRtl ? <ChevronsRight /> : <ChevronsLeft />}
          </Button>
          <Button
            aria-label={t("dataTableTranslations.goToPreviousPage")}
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.previousPage()}
            size="icon"
            variant="outline"
          >
            {isRtl ? <ChevronRight /> : <ChevronLeft />}
          </Button>
          <Button
            aria-label={t("dataTableTranslations.goToNextPage")}
            className="size-8"
            disabled={!table.getCanNextPage()}
            onClick={() => table.nextPage()}
            size="icon"
            variant="outline"
          >
            {isRtl ? <ChevronLeft /> : <ChevronRight />}
          </Button>
          <Button
            aria-label={t("dataTableTranslations.goToLastPage")}
            className="hidden size-8 lg:flex"
            disabled={!table.getCanNextPage()}
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            size="icon"
            variant="outline"
          >
            {isRtl ? <ChevronsLeft /> : <ChevronsRight />}
          </Button>
        </div>
      </div>
    </div>
  );
}
