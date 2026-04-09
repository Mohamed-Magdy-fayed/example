"use client";

import type { ColumnSort, SortDirection, Table } from "@tanstack/react-table";
import {
  ArrowDownUp,
  ChevronsUpDown,
  GripVertical,
  PlusCircleIcon,
  Trash2,
  XIcon,
} from "lucide-react";
import * as React from "react";
import { dataTableConfig } from "@/components/data-table/config";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sortable,
  SortableContent,
  SortableItem,
  SortableItemHandle,
  SortableOverlay,
} from "@/components/ui/sortable";
import { useTranslation } from "@/features/core/i18n/useTranslation";
import { cn } from "@/lib/utils";

const SORT_SHORTCUT_KEY = "s";
const REMOVE_SORT_SHORTCUTS = ["backspace", "delete"];

interface DataTableSortListProps<TData>
  extends React.ComponentProps<typeof PopoverContent> {
  table: Table<TData>;
  disabled?: boolean;
}

export function DataTableSortList<TData>({
  table,
  disabled,
  ...props
}: DataTableSortListProps<TData>) {
  const { t } = useTranslation();
  const id = React.useId();
  const labelId = React.useId();
  const descriptionId = React.useId();
  const [open, setOpen] = React.useState(false);
  const addButtonRef = React.useRef<HTMLButtonElement>(null);

  const sorting = table.getState().sorting;
  const onSortingChange = table.setSorting;

  const { columnLabels, columns } = React.useMemo(() => {
    const labels = new Map<string, string>();
    const sortingIds = new Set(sorting.map((s) => s.id));
    const availableColumns: { id: string; label: string }[] = [];

    for (const column of table.getAllColumns()) {
      if (!column.getCanSort()) continue;

      const label = column.columnDef.meta?.label ?? column.id;
      labels.set(column.id, label);

      if (!sortingIds.has(column.id)) {
        availableColumns.push({ id: column.id, label });
      }
    }

    return {
      columnLabels: labels,
      columns: availableColumns,
    };
  }, [sorting, table]);

  const onSortAdd = React.useCallback(() => {
    const firstColumn = columns[0];
    if (!firstColumn) return;

    onSortingChange((prevSorting) => [
      ...prevSorting,
      { id: firstColumn.id, desc: false },
    ]);
  }, [columns, onSortingChange]);

  const onSortUpdate = React.useCallback(
    (sortId: string, updates: Partial<ColumnSort>) => {
      onSortingChange((prevSorting) => {
        if (!prevSorting) return prevSorting;
        return prevSorting.map((sort) =>
          sort.id === sortId ? { ...sort, ...updates } : sort,
        );
      });
    },
    [onSortingChange],
  );

  const onSortRemove = React.useCallback(
    (sortId: string) => {
      onSortingChange((prevSorting) =>
        prevSorting.filter((item) => item.id !== sortId),
      );
    },
    [onSortingChange],
  );

  const onSortingReset = React.useCallback(
    () => onSortingChange(table.initialState.sorting),
    [onSortingChange, table.initialState.sorting],
  );

  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        (event.target instanceof HTMLElement &&
          event.target.contentEditable === "true")
      ) {
        return;
      }

      if (
        event.key.toLowerCase() === SORT_SHORTCUT_KEY &&
        (event.ctrlKey || event.metaKey) &&
        event.shiftKey
      ) {
        event.preventDefault();
        setOpen((prev) => !prev);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const onTriggerKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>) => {
      if (
        REMOVE_SORT_SHORTCUTS.includes(event.key.toLowerCase()) &&
        sorting.length > 0
      ) {
        event.preventDefault();
        onSortingReset();
      }
    },
    [sorting.length, onSortingReset],
  );

  return (
    <Sortable
      getItemValue={(item) => item.id}
      onValueChange={onSortingChange}
      value={sorting}
    >
      <Popover onOpenChange={setOpen} open={open}>
        <PopoverTrigger
          render={
            <Button
              disabled={disabled}
              onKeyDown={onTriggerKeyDown}
              variant="outline"
            />
          }
        >
          <ArrowDownUp className="text-muted-foreground" />
          {t("dataTableTranslations.sort")}
          {sorting.length > 0 && (
            <Badge className="size-4 rounded-md" variant="secondary">
              {sorting.length}
            </Badge>
          )}
        </PopoverTrigger>
        <PopoverContent
          aria-describedby={descriptionId}
          aria-labelledby={labelId}
          className="flex w-full max-w-(--radix-popover-content-available-width) flex-col gap-2 p-4"
          {...props}
        >
          <div className="flex flex-col gap-2">
            <h4 className="font-medium leading-none" id={labelId}>
              {sorting.length > 0
                ? t("dataTableTranslations.sortBy")
                : t("dataTableTranslations.noSorting")}
            </h4>
            <p
              className={cn(
                "text-muted-foreground text-sm",
                sorting.length > 0 && "sr-only",
              )}
              id={descriptionId}
            >
              {sorting.length > 0
                ? t("dataTableTranslations.modifySorting")
                : t("dataTableTranslations.addSorting")}
            </p>
          </div>
          {sorting.length > 0 && (
            <SortableContent
              render={
                <ScrollArea
                  className="pe-4"
                  role="list"
                  viewportClassName="flex max-h-40 flex-col gap-2"
                />
              }
            >
              {sorting.map((sort) => (
                <DataTableSortItem
                  columnLabels={columnLabels}
                  columns={columns}
                  key={sort.id}
                  onSortRemove={onSortRemove}
                  onSortUpdate={onSortUpdate}
                  sort={sort}
                  sortItemId={`${id}-sort-${sort.id}`}
                />
              ))}
            </SortableContent>
          )}
          <div className="flex w-full items-center gap-2">
            <Button
              className="rounded"
              disabled={columns.length === 0}
              onClick={onSortAdd}
              ref={addButtonRef}
              size="sm"
            >
              <PlusCircleIcon />
              {t("dataTableTranslations.addSort")}
            </Button>
            {sorting.length > 0 && (
              <Button
                className="rounded"
                onClick={onSortingReset}
                size="sm"
                variant="outline"
              >
                <XIcon />
                {t("dataTableTranslations.resetSorting")}
              </Button>
            )}
          </div>
        </PopoverContent>
      </Popover>
      <SortableOverlay>
        <div className="flex items-center gap-2">
          <div className="h-8 w-[180px] rounded-sm bg-primary/10" />
          <div className="h-8 w-24 rounded-sm bg-primary/10" />
          <div className="size-8 shrink-0 rounded-sm bg-primary/10" />
          <div className="size-8 shrink-0 rounded-sm bg-primary/10" />
        </div>
      </SortableOverlay>
    </Sortable>
  );
}

interface DataTableSortItemProps {
  sort: ColumnSort;
  sortItemId: string;
  columns: { id: string; label: string }[];
  columnLabels: Map<string, string>;
  onSortUpdate: (sortId: string, updates: Partial<ColumnSort>) => void;
  onSortRemove: (sortId: string) => void;
}

function DataTableSortItem({
  sort,
  sortItemId,
  columns,
  columnLabels,
  onSortUpdate,
  onSortRemove,
}: DataTableSortItemProps) {
  const { t } = useTranslation();
  const fieldListboxId = `${sortItemId}-field-listbox`;
  const fieldTriggerId = `${sortItemId}-field-trigger`;
  const directionListboxId = `${sortItemId}-direction-listbox`;

  const [showFieldSelector, setShowFieldSelector] = React.useState(false);
  const [showDirectionSelector, setShowDirectionSelector] =
    React.useState(false);

  const onItemKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (showFieldSelector || showDirectionSelector) {
        return;
      }

      if (REMOVE_SORT_SHORTCUTS.includes(event.key.toLowerCase())) {
        event.preventDefault();
        onSortRemove(sort.id);
      }
    },
    [sort.id, showFieldSelector, showDirectionSelector, onSortRemove],
  );

  return (
    <SortableItem asChild value={sort.id}>
      <div
        className="flex items-center gap-2"
        id={sortItemId}
        onKeyDown={onItemKeyDown}
        role="listitem"
        tabIndex={-1}
      >
        <Popover onOpenChange={setShowFieldSelector} open={showFieldSelector}>
          <PopoverTrigger
            render={
              <Button
                aria-controls={fieldListboxId}
                className="flex-1 justify-between rounded font-normal"
                id={fieldTriggerId}
                size="sm"
                variant="outline"
              />
            }
          >
            <span className="truncate">{columnLabels.get(sort.id)}</span>
            <ChevronsUpDown className="opacity-50" />
          </PopoverTrigger>
          <PopoverContent
            className="w-(--radix-popover-trigger-width) p-0"
            id={fieldListboxId}
          >
            <Command>
              <CommandInput
                placeholder={t("dataTableTranslations.searchFields")}
              />
              <CommandList>
                <CommandEmpty>
                  {t("dataTableTranslations.noFieldsFound")}
                </CommandEmpty>
                <CommandGroup>
                  {columns.map((column) => (
                    <CommandItem
                      key={column.id}
                      onSelect={(value) => onSortUpdate(sort.id, { id: value })}
                      value={column.id}
                    >
                      <span className="truncate">{column.label}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        <Select
          onOpenChange={setShowDirectionSelector}
          onValueChange={(value) =>
            onSortUpdate(sort.id, {
              desc: (value as SortDirection | null) === "desc",
            })
          }
          open={showDirectionSelector}
          value={sort.desc ? "desc" : "asc"}
        >
          <SelectTrigger
            aria-controls={directionListboxId}
            className="w-24 rounded"
            size="sm"
          >
            <SelectValue
              render={() => (
                <span className="truncate">
                  {sort.desc
                    ? t("dataTableTranslations.desc")
                    : t("dataTableTranslations.asc")}
                </span>
              )}
            />
          </SelectTrigger>
          <SelectContent
            className="min-w-(--radix-select-trigger-width)"
            id={directionListboxId}
          >
            {dataTableConfig.sortOrders.map((order) => (
              <SelectItem key={order.value} value={order.value}>
                {order.value === "asc"
                  ? t("dataTableTranslations.asc")
                  : t("dataTableTranslations.desc")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          aria-controls={sortItemId}
          className="shrink-0 rounded"
          onClick={() => onSortRemove(sort.id)}
          size="icon"
          variant="outline"
        >
          <Trash2 />
        </Button>

        <SortableItemHandle asChild>
          <Button className="shrink-0 rounded" size="icon" variant="outline">
            <GripVertical />
          </Button>
        </SortableItemHandle>
      </div>
    </SortableItem>
  );
}
