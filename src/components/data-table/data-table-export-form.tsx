import type { Table } from "@tanstack/react-table";
import { CheckIcon, DownloadCloudIcon, XCircleIcon } from "lucide-react";
import {
    type Dispatch,
    type SetStateAction,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import { DataTableActionBarAction } from "@/components/data-table/data-table-action-bar";
import { type CsvExportColumn, exportToCsv } from "@/components/data-table/lib/export";
import type { StringKeyOf } from "@/components/data-table/types";
import { Badge } from "@/components/ui/badge";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "@/features/core/i18n/useTranslation";
import { cn } from "@/lib/utils";

export default function ExportForm<TData>({
    table,
    data,
    fileName,
    selectedData,
    handleExport,
    isOpen,
    setIsOpen,
    isLoading,
}: {
    table: Table<TData>;
    data: TData[];
    fileName: string;
    sheetName: string;
    isLoading: boolean;
    selectedData: TData[];
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    handleExport?: (columns: CsvExportColumn[]) => void | Promise<void>;
}) {
    const { t } = useTranslation();

    const exportableColumns = useMemo(() => {
        return table
            .getAllLeafColumns()
            .filter((column) => {
                const accessorKey = (column.columnDef as { accessorKey?: unknown }).accessorKey;
                return typeof accessorKey === "string";
            })
            .map((column) => {
                const accessorKey = (column.columnDef as { accessorKey: StringKeyOf<TData> }).accessorKey;
                const label =
                    typeof column.columnDef.meta?.label === "string"
                        ? column.columnDef.meta.label
                        : accessorKey;

                return {
                    key: accessorKey,
                    label,
                };
            });
    }, [table]);

    const visibleExportKeys = useMemo(() => {
        return table
            .getVisibleLeafColumns()
            .map((column) => (column.columnDef as { accessorKey?: StringKeyOf<TData> }).accessorKey)
            .filter((key): key is StringKeyOf<TData> => typeof key === "string");
    }, [table]);

    const exportListHeight = useMemo(() => {
        const itemHeight = 32;
        const verticalPadding = 8;
        const maxHeight = 300;

        return Math.min(exportableColumns.length * itemHeight + verticalPadding, maxHeight);
    }, [exportableColumns.length]);

    const [exportKeys, setExportKeys] = useState<StringKeyOf<TData>[]>([]);

    useEffect(() => {
        if (!isOpen || exportKeys.length > 0) return;

        setExportKeys(visibleExportKeys);
    }, [isOpen, exportKeys.length, visibleExportKeys]);

    const onItemSelect = useCallback(
        (key: StringKeyOf<TData>, isSelected: boolean) => {
            const newSelectedValues = new Set(exportKeys);
            if (isSelected) {
                newSelectedValues.delete(key);
            } else {
                newSelectedValues.add(key);
            }
            const filterValues = Array.from(newSelectedValues);
            setExportKeys(filterValues.length ? filterValues : []);
        },
        [exportKeys],
    );

    return (
        <Popover onOpenChange={setIsOpen} open={isOpen}>
            <PopoverTrigger
                render={
                    <DataTableActionBarAction className="border-dashed" variant="outline">
                        {exportKeys.length > 0 ? (
                            <div
                                aria-label={"Clear selection"}
                                className="rounded-sm opacity-70 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                onClick={() => setExportKeys([])}
                                role="button"
                                tabIndex={0}
                            >
                                <XCircleIcon />
                            </div>
                        ) : (
                            <DownloadCloudIcon />
                        )}
                        {t("dataTableTranslations.export.export")}
                        {exportKeys.length > 0 && (
                            <>
                                <Separator
                                    className="mx-0.5 data-[orientation=vertical]:h-4"
                                    orientation="vertical"
                                />
                                <Badge className="rounded-sm px-1 font-normal lg:hidden" variant="secondary">
                                    {exportKeys.length}
                                </Badge>
                                <div className="hidden items-center gap-1 lg:flex">
                                    {exportKeys.length > 2 ? (
                                        <Badge className="rounded-sm px-1 font-normal" variant="secondary">
                                            {t("dataTableTranslations.selected", {
                                                count: exportKeys.length,
                                            })}
                                        </Badge>
                                    ) : (
                                        exportKeys
                                            .filter((key) => exportKeys.includes(key))
                                            .map((key) => (
                                                <Badge className="rounded-sm px-1 font-normal" key={key} variant="secondary">
                                                    {exportableColumns.find((column) => column.key === key)?.label ?? key}
                                                </Badge>
                                            ))
                                    )}
                                </div>
                            </>
                        )}
                    </DataTableActionBarAction>
                }
            />
            <PopoverContent align="start" className="w-[12.5rem] p-0">
                <Command>
                    <CommandInput
                        placeholder={t("dataTableTranslations.export.searchPlaceholder")}
                    />
                    <CommandList className="max-h-full">
                        <CommandEmpty>{t("dataTableTranslations.noResults")}</CommandEmpty>
                        <ScrollArea
                            className="w-full"
                            style={{ height: `${exportListHeight}px` }}
                        >
                            <CommandGroup>
                                {exportableColumns.map(({ key, label }) => {
                                    const isSelected = exportKeys.includes(key);

                                    return (
                                        <CommandItem
                                            key={key}
                                            onSelect={() => onItemSelect(key, isSelected)}
                                        >
                                            <div
                                                className={cn(
                                                    "flex size-4 items-center justify-center rounded-sm border border-primary",
                                                    isSelected
                                                        ? "bg-primary"
                                                        : "opacity-50 [&_svg]:invisible",
                                                )}
                                            >
                                                <CheckIcon className="text-background rtl:scale-100 dark:text-foreground" />
                                            </div>
                                            <span className="truncate">{label}</span>
                                        </CommandItem>
                                    );
                                })}
                            </CommandGroup>
                        </ScrollArea>
                        {exportKeys.length > 0 && (
                            <>
                                <CommandSeparator />
                                <CommandGroup>
                                    <CommandItem
                                        className="justify-center text-center"
                                        disabled={isLoading}
                                        onSelect={async () => {
                                            setIsOpen(false);
                                            const selectedColumns = exportableColumns
                                                .filter((column) => exportKeys.includes(column.key))
                                                .map((column) => ({
                                                    key: column.key,
                                                    header: column.label,
                                                }));

                                            if (handleExport) {
                                                await handleExport(selectedColumns);
                                                return;
                                            }

                                            if (selectedData.length > 0) {
                                                const exportData = selectedData.map((item) =>
                                                    exportKeys.reduce(
                                                        (acc, key) => {
                                                            acc[key] = item[key];
                                                            return acc;
                                                        },
                                                        {} as Partial<TData>,
                                                    ),
                                                );
                                                return exportToCsv(exportData as Array<Record<string, unknown>>, fileName, {
                                                    columns: selectedColumns,
                                                });
                                            }

                                            exportToCsv(
                                                data.map((item) =>
                                                    exportKeys.reduce(
                                                        (acc, key) => {
                                                            acc[key] = item[key];
                                                            return acc;
                                                        },
                                                        {} as Partial<TData>,
                                                    ),
                                                ),
                                                fileName,
                                                {
                                                    columns: selectedColumns,
                                                },
                                            );
                                        }}
                                    >
                                        {t("dataTableTranslations.export.export")}
                                    </CommandItem>
                                </CommandGroup>
                            </>
                        )}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
