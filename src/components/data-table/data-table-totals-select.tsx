"use client";

import type { Table } from "@tanstack/react-table";
import { Sigma, XCircle } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
    Faceted,
    FacetedContent,
    FacetedItem,
    FacetedList,
    FacetedTrigger,
} from "@/components/ui/faceted";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "@/features/core/i18n/useTranslation";

interface DataTableTotalsSelectProps<TData> {
    table: Table<TData>;
    disabled?: boolean;
}

function isSummableColumn(variant: string | undefined) {
    return variant === "number" || variant === "range";
}

function toNumber(value: unknown): number | undefined {
    if (typeof value === "number") {
        return Number.isFinite(value) ? value : undefined;
    }

    if (typeof value === "string") {
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : undefined;
    }

    return undefined;
}

export function DataTableTotalsSelect<TData>({
    table,
    disabled,
}: DataTableTotalsSelectProps<TData>) {
    const { t } = useTranslation();
    const [selectedColumnId, setSelectedColumnId] = React.useState<
        string | undefined
    >(undefined);

    const summableColumns = React.useMemo(() => {
        return table
            .getVisibleLeafColumns()
            .filter((column) => isSummableColumn(column.columnDef.meta?.variant));
    }, [table]);

    React.useEffect(() => {
        const availableColumnIds = new Set(
            summableColumns.map((column) => column.id),
        );
        setSelectedColumnId((previous) =>
            previous && availableColumnIds.has(previous) ? previous : undefined,
        );
    }, [summableColumns]);

    const selectedRows = table.getFilteredSelectedRowModel().rows;
    const rowsForTotals =
        selectedRows.length > 0 ? selectedRows : table.getFilteredRowModel().rows;
    const serverTotalsByColumnId = table.options.meta?.totalsByColumnId;
    const useServerTotals = selectedRows.length === 0 && !!serverTotalsByColumnId;

    const totalsByColumnId = React.useMemo(() => {
        const totals = new Map<string, number>();

        for (const column of summableColumns) {
            let total = 0;

            if (useServerTotals) {
                const serverTotal = toNumber(serverTotalsByColumnId?.[column.id]);
                if (serverTotal !== undefined) {
                    total = serverTotal;
                }
            } else {
                for (const row of rowsForTotals) {
                    const numericValue = toNumber(row.getValue(column.id));
                    if (numericValue !== undefined) {
                        total += numericValue;
                    }
                }
            }

            totals.set(column.id, total);
        }

        return totals;
    }, [rowsForTotals, serverTotalsByColumnId, summableColumns, useServerTotals]);

    const selectedColumn = React.useMemo(
        () => summableColumns.find((column) => column.id === selectedColumnId),
        [selectedColumnId, summableColumns],
    );

    const numberFormatter = React.useMemo(
        () =>
            new Intl.NumberFormat(undefined, {
                maximumFractionDigits: 2,
            }),
        [],
    );

    const onReset = React.useCallback((event?: React.MouseEvent) => {
        event?.stopPropagation();
        setSelectedColumnId(undefined);
    }, []);

    const selectedTotal = selectedColumn
        ? totalsByColumnId.get(selectedColumn.id)
        : undefined;
    const formattedSelectedTotal =
        selectedColumn && selectedTotal !== undefined
            ? (selectedColumn.columnDef.meta?.sumFormatter?.(selectedTotal) ??
                numberFormatter.format(selectedTotal))
            : undefined;

    if (summableColumns.length === 0) {
        return null;
    }

    return (
        <Faceted
            onValueChange={(value) => setSelectedColumnId(value ?? undefined)}
            value={selectedColumnId ?? undefined}
        >
            <FacetedTrigger
                render={
                    <Button
                        aria-label={t("dataTableTranslations.totals")}
                        className="border-dashed font-normal"
                        disabled={disabled}
                        variant="outline"
                    />
                }
            >
                <Sigma className="text-muted-foreground" />
                {selectedColumn ? (
                    <span>
                        {selectedColumn.columnDef.meta?.label ?? selectedColumn.id}
                    </span>
                ) : (
                    <span>{t("dataTableTranslations.totals")}</span>
                )}
                {formattedSelectedTotal !== undefined && (
                    <>
                        <Separator
                            className="mx-0.5 my-auto data-[orientation=vertical]:h-4"
                            orientation="vertical"
                        />
                        <span className="font-medium text-sm">
                            {formattedSelectedTotal}
                        </span>
                    </>
                )}
                {selectedColumn && (
                    <div
                        aria-labelledby={t("dataTableTranslations.clearFilters")}
                        className="rounded-sm opacity-70 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        onClick={onReset}
                        role="button"
                        tabIndex={-1}
                    >
                        <XCircle className="size-3" />
                    </div>
                )}
            </FacetedTrigger>
            <FacetedContent className="w-min">
                <FacetedList>
                    {summableColumns.map((column) => (
                        <FacetedItem key={column.id} value={column.id}>
                            {column.columnDef.meta?.label ?? column.id}
                        </FacetedItem>
                    ))}
                </FacetedList>
            </FacetedContent>
        </Faceted>
        // <Select
        //     onValueChange={(value) => setSelectedColumnId(value ?? undefined)}
        //     value={selectedColumnId ?? null}
        // >
        //     <SelectTrigger className="border-dashed font-normal" disabled={disabled}>
        //         <Sigma className="text-muted-foreground" />
        //         {selectedColumn ? (
        //             <span>
        //                 {selectedColumn.columnDef.meta?.label ?? selectedColumn.id}
        //             </span>
        //         ) : (
        //             <span>{t("dataTableTranslations.totals")}</span>
        //         )}
        //         {formattedSelectedTotal !== undefined && (
        //             <>
        //                 <Separator
        //                     className="mx-0.5 data-[orientation=vertical]:h-4"
        //                     orientation="vertical"
        //                 />
        //                 <span className="font-medium text-sm">
        //                     {formattedSelectedTotal}
        //                 </span>
        //             </>
        //         )}
        //         {selectedColumn && (
        //             <div
        //                 aria-labelledby={t("dataTableTranslations.clearFilters")}
        //                 className="rounded-sm opacity-70 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        //                 onClick={onReset}
        //                 role="button"
        //                 tabIndex={-1}
        //             >
        //                 <XCircle className="size-3" />
        //             </div>
        //         )}
        //     </SelectTrigger>
        //     <SelectContent>
        //         {summableColumns.map((column) => (
        //             <SelectItem key={column.id} value={column.id}>
        //                 {column.columnDef.meta?.label ?? column.id}
        //             </SelectItem>
        //         ))}
        //     </SelectContent>
        // </Select>
    );
}
