"use client";

import type { Column, Table } from "@tanstack/react-table";
import {
  BadgeCheck,
  CalendarIcon,
  Check,
  ListFilter,
  Text,
  X,
} from "lucide-react";
import { useQueryState } from "nuqs";
import * as React from "react";

import { DataTableRangeFilter } from "@/components/data-table/data-table-range-filter";
import { useDebouncedCallback } from "@/components/data-table/hooks/use-debounced-callback";
import {
  getDefaultFilterOperator,
  getFilterOperators,
} from "@/components/data-table/lib/data-table";
import { formatDate } from "@/components/data-table/lib/format";
import { generateId } from "@/components/data-table/lib/id";
import { getFiltersStateParser } from "@/components/data-table/lib/parsers";
import type {
  ExtendedColumnFilter,
  FilterOperator,
} from "@/components/data-table/types";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "@/features/core/i18n/useTranslation";
import { cn } from "@/lib/utils";

type TranslationFn = ReturnType<typeof useTranslation>["t"];

function getTranslatedOperatorLabel(
  operator: FilterOperator,
  t: TranslationFn,
) {
  switch (operator) {
    case "iLike":
      return t("dataTableTranslations.operators.contains");
    case "notILike":
      return t("dataTableTranslations.operators.doesNotContain");
    case "eq":
      return t("dataTableTranslations.operators.is");
    case "ne":
      return t("dataTableTranslations.operators.isNot");
    case "inArray":
      return t("dataTableTranslations.operators.hasAnyOf");
    case "notInArray":
      return t("dataTableTranslations.operators.hasNoneOf");
    case "isEmpty":
      return t("dataTableTranslations.operators.isEmpty");
    case "isNotEmpty":
      return t("dataTableTranslations.operators.isNotEmpty");
    case "lt":
      return t("dataTableTranslations.operators.isLessThan");
    case "lte":
      return t("dataTableTranslations.operators.isLessThanOrEqualTo");
    case "gt":
      return t("dataTableTranslations.operators.isGreaterThan");
    case "gte":
      return t("dataTableTranslations.operators.isGreaterThanOrEqualTo");
    case "isBetween":
      return t("dataTableTranslations.operators.isBetween");
    case "isRelativeToToday":
      return t("dataTableTranslations.operators.isRelativeToToday");
    default:
      return operator;
  }
}

const DEBOUNCE_MS = 300;
const THROTTLE_MS = 50;
const FILTER_SHORTCUT_KEY = "f";
const REMOVE_FILTER_SHORTCUTS = ["backspace", "delete"];

function getStartOfDayTimestamp(date: Date): number {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  return start.getTime();
}

function getEndOfDayTimestamp(date: Date): number {
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);
  return end.getTime();
}

interface DataTableFilterMenuProps<TData>
  extends React.ComponentProps<typeof PopoverContent> {
  table: Table<TData>;
  debounceMs?: number;
  throttleMs?: number;
  shallow?: boolean;
  disabled?: boolean;
}

export function DataTableFilterMenu<TData>({
  table,
  debounceMs = DEBOUNCE_MS,
  throttleMs = THROTTLE_MS,
  shallow = true,
  disabled,
  ...props
}: DataTableFilterMenuProps<TData>) {
  const { t } = useTranslation();
  const id = React.useId();

  const columns = React.useMemo(() => {
    return table
      .getAllColumns()
      .filter((column) => column.columnDef.enableColumnFilter);
  }, [table]);

  const [open, setOpen] = React.useState(false);
  const [selectedColumn, setSelectedColumn] =
    React.useState<Column<TData> | null>(null);
  const [inputValue, setInputValue] = React.useState("");
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const onOpenChange = React.useCallback((open: boolean) => {
    setOpen(open);

    if (!open) {
      setTimeout(() => {
        setSelectedColumn(null);
        setInputValue("");
      }, 100);
    }
  }, []);

  const onInputKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (
        REMOVE_FILTER_SHORTCUTS.includes(event.key.toLowerCase()) &&
        !inputValue &&
        selectedColumn
      ) {
        event.preventDefault();
        setSelectedColumn(null);
      }
    },
    [inputValue, selectedColumn],
  );

  const [filters, setFilters] = useQueryState(
    table.options.meta?.queryKeys?.filters ?? "filters",
    getFiltersStateParser<TData>(columns.map((field) => field.id))
      .withDefault([])
      .withOptions({
        clearOnDefault: true,
        shallow,
        throttleMs,
      }),
  );
  const debouncedSetFilters = useDebouncedCallback(setFilters, debounceMs);

  const onFilterAdd = React.useCallback(
    (column: Column<TData>, value: string) => {
      if (!value.trim() && column.columnDef.meta?.variant !== "boolean") {
        return;
      }

      const filterValue =
        column.columnDef.meta?.variant === "multiSelect" ? [value] : value;

      const newFilter: ExtendedColumnFilter<TData> = {
        id: column.id as Extract<keyof TData, string>,
        value: filterValue,
        variant: column.columnDef.meta?.variant ?? "text",
        operator: getDefaultFilterOperator(
          column.columnDef.meta?.variant ?? "text",
        ),
        filterId: generateId({ length: 8 }),
      };

      debouncedSetFilters([...filters, newFilter]);
      setOpen(false);

      setTimeout(() => {
        setSelectedColumn(null);
        setInputValue("");
      }, 100);
    },
    [filters, debouncedSetFilters],
  );

  const onFilterRemove = React.useCallback(
    (filterId: string) => {
      const updatedFilters = filters.filter(
        (filter) => filter.filterId !== filterId,
      );
      debouncedSetFilters(updatedFilters);
      requestAnimationFrame(() => {
        triggerRef.current?.focus();
      });
    },
    [filters, debouncedSetFilters],
  );

  const onFilterUpdate = React.useCallback(
    (
      filterId: string,
      updates: Partial<Omit<ExtendedColumnFilter<TData>, "filterId">>,
    ) => {
      debouncedSetFilters((prevFilters) => {
        const updatedFilters = prevFilters.map((filter) => {
          if (filter.filterId === filterId) {
            return { ...filter, ...updates } as ExtendedColumnFilter<TData>;
          }
          return filter;
        });
        return updatedFilters;
      });
    },
    [debouncedSetFilters],
  );

  const onFiltersReset = React.useCallback(() => {
    debouncedSetFilters([]);
  }, [debouncedSetFilters]);

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
        event.key.toLowerCase() === FILTER_SHORTCUT_KEY &&
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
        REMOVE_FILTER_SHORTCUTS.includes(event.key.toLowerCase()) &&
        filters.length > 0
      ) {
        event.preventDefault();
        onFilterRemove(filters[filters.length - 1]?.filterId ?? "");
      }
    },
    [filters, onFilterRemove],
  );

  return (
    <div className="flex flex-wrap items-center gap-2" role="list">
      {filters.map((filter) => (
        <DataTableFilterItem
          columns={columns}
          filter={filter}
          filterItemId={`${id}-filter-${filter.filterId}`}
          key={filter.filterId}
          onFilterRemove={onFilterRemove}
          onFilterUpdate={onFilterUpdate}
        />
      ))}
      {filters.length > 0 && (
        <Button
          aria-label={t("dataTableTranslations.resetAllFilters")}
          className="size-8"
          onClick={onFiltersReset}
          size="icon"
          variant="outline"
        >
          <X />
        </Button>
      )}
      <Popover onOpenChange={onOpenChange} open={open}>
        <PopoverTrigger
          render={
            <Button
              aria-label={t("dataTableTranslations.openFilterMenu")}
              className={cn(filters.length > 0 && "size-8", "h-8 font-normal")}
              disabled={disabled}
              onKeyDown={onTriggerKeyDown}
              ref={triggerRef}
              size={filters.length > 0 ? "icon" : "sm"}
              variant="outline"
            />
          }
        >
          <ListFilter className="text-muted-foreground" />
          {filters.length > 0 ? null : t("dataTableTranslations.filter")}
        </PopoverTrigger>
        <PopoverContent
          className="w-full max-w-(--radix-popover-content-available-width) p-0"
          {...props}
        >
          <Command className="[&_[cmdk-input-wrapper]_svg]:hidden" loop>
            <CommandInput
              onKeyDown={onInputKeyDown}
              onValueChange={setInputValue}
              placeholder={
                selectedColumn
                  ? (selectedColumn.columnDef.meta?.label ?? selectedColumn.id)
                  : t("dataTableTranslations.searchFields")
              }
              ref={inputRef}
              value={inputValue}
            />
            <CommandList>
              {selectedColumn ? (
                <>
                  {selectedColumn.columnDef.meta?.options && (
                    <CommandEmpty>{t("dataTableTranslations.noOptionsFound")}</CommandEmpty>
                  )}
                  <FilterValueSelector
                    column={selectedColumn}
                    onSelect={(value) => onFilterAdd(selectedColumn, value)}
                    t={t}
                    value={inputValue}
                  />
                </>
              ) : (
                <>
                  <CommandEmpty>{t("dataTableTranslations.noFieldsFound")}</CommandEmpty>
                  <CommandGroup>
                    {columns.map((column) => (
                      <CommandItem
                        key={column.id}
                        onSelect={() => {
                          setSelectedColumn(column);
                          setInputValue("");
                          requestAnimationFrame(() => {
                            inputRef.current?.focus();
                          });
                        }}
                        value={column.id}
                      >
                        {column.columnDef.meta?.icon && (
                          <column.columnDef.meta.icon />
                        )}
                        <span className="truncate">
                          {column.columnDef.meta?.label ?? column.id}
                        </span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

interface DataTableFilterItemProps<TData> {
  filter: ExtendedColumnFilter<TData>;
  filterItemId: string;
  columns: Column<TData>[];
  onFilterUpdate: (
    filterId: string,
    updates: Partial<Omit<ExtendedColumnFilter<TData>, "filterId">>,
  ) => void;
  onFilterRemove: (filterId: string) => void;
}

function DataTableFilterItem<TData>({
  filter,
  filterItemId,
  columns,
  onFilterUpdate,
  onFilterRemove,
}: DataTableFilterItemProps<TData>) {
  {
    const { t } = useTranslation();
    const [showFieldSelector, setShowFieldSelector] = React.useState(false);
    const [showOperatorSelector, setShowOperatorSelector] =
      React.useState(false);
    const [showValueSelector, setShowValueSelector] = React.useState(false);

    const column = columns.find((column) => column.id === filter.id);

    const operatorListboxId = `${filterItemId}-operator-listbox`;
    const inputId = `${filterItemId}-input`;

    const columnMeta = column?.columnDef.meta;
    const filterOperators = getFilterOperators(filter.variant);

    const onItemKeyDown = React.useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (
          event.target instanceof HTMLInputElement ||
          event.target instanceof HTMLTextAreaElement
        ) {
          return;
        }

        if (showFieldSelector || showOperatorSelector || showValueSelector) {
          return;
        }

        if (REMOVE_FILTER_SHORTCUTS.includes(event.key.toLowerCase())) {
          event.preventDefault();
          onFilterRemove(filter.filterId);
        }
      },
      [
        filter.filterId,
        showFieldSelector,
        showOperatorSelector,
        showValueSelector,
        onFilterRemove,
      ],
    );

    if (!column) return null;

    return (
      <div
        className="flex h-8 items-center rounded-md bg-background"
        id={filterItemId}
        key={filter.filterId}
        onKeyDown={onItemKeyDown}
        role="listitem"
      >
        <Popover onOpenChange={setShowFieldSelector} open={showFieldSelector}>
          <PopoverTrigger
            render={
              <Button
                className="rounded-none rounded-s-md border border-e-0 font-normal dark:bg-input/30"
                size="sm"
                variant="ghost"
              />
            }
          >
            {columnMeta?.icon && (
              <columnMeta.icon className="text-muted-foreground" />
            )}
            {columnMeta?.label ?? column.id}
          </PopoverTrigger>
          <PopoverContent align="start" className="w-48 p-0">
            <Command loop>
              <CommandInput placeholder={t("dataTableTranslations.searchFields")} />
              <CommandList>
                <CommandEmpty>{t("dataTableTranslations.noFieldsFound")}</CommandEmpty>
                <CommandGroup>
                  {columns.map((column) => (
                    <CommandItem
                      key={column.id}
                      onSelect={() => {
                        onFilterUpdate(filter.filterId, {
                          id: column.id as Extract<keyof TData, string>,
                          variant: column.columnDef.meta?.variant ?? "text",
                          operator: getDefaultFilterOperator(
                            column.columnDef.meta?.variant ?? "text",
                          ),
                          value: "",
                        });

                        setShowFieldSelector(false);
                      }}
                      value={column.id}
                    >
                      {column.columnDef.meta?.icon && (
                        <column.columnDef.meta.icon />
                      )}
                      <span className="truncate">
                        {column.columnDef.meta?.label ?? column.id}
                      </span>
                      <Check
                        className={cn(
                          "ms-auto",
                          column.id === filter.id ? "opacity-100" : "opacity-0",
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        <Select
          onOpenChange={setShowOperatorSelector}
          onValueChange={(value) =>
            onFilterUpdate(filter.filterId, {
              operator: (value ?? filter.operator) as FilterOperator,
              value:
                value === "isEmpty" || value === "isNotEmpty"
                  ? ""
                  : filter.value,
            })
          }
          open={showOperatorSelector}
          value={filter.operator}
        >
          <SelectTrigger
            aria-controls={operatorListboxId}
            className="h-8 rounded-none border-e-0 px-2.5 lowercase data-size:h-8 [&_svg]:hidden"
          >
            <SelectValue
              placeholder={getTranslatedOperatorLabel(filter.operator, t)}
            />
          </SelectTrigger>
          <SelectContent id={operatorListboxId}>
            {filterOperators.map((operator) => (
              <SelectItem
                className="lowercase"
                key={operator.value}
                value={operator.value}
              >
                {getTranslatedOperatorLabel(operator.value, t)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {onFilterInputRender({
          filter,
          column,
          inputId,
          t,
          onFilterUpdate,
          showValueSelector,
          setShowValueSelector,
        })}
        <Button
          aria-controls={filterItemId}
          className="h-full rounded-none rounded-e-md border border-s-0 px-1.5 font-normal dark:bg-input/30"
          onClick={() => onFilterRemove(filter.filterId)}
          size="sm"
          variant="ghost"
        >
          <X className="size-3.5" />
        </Button>
      </div>
    );
  }
}

interface FilterValueSelectorProps<TData> {
  column: Column<TData>;
  value: string;
  onSelect: (value: string) => void;
  t: TranslationFn;
}

function FilterValueSelector<TData>({
  column,
  value,
  onSelect,
  t,
}: FilterValueSelectorProps<TData>) {
  const variant = column.columnDef.meta?.variant ?? "text";

  switch (variant) {
    case "boolean":
      return (
        <CommandGroup>
          <CommandItem onSelect={() => onSelect("true")} value="true">
            {t("dataTableTranslations.true")}
          </CommandItem>
          <CommandItem onSelect={() => onSelect("false")} value="false">
            {t("dataTableTranslations.false")}
          </CommandItem>
        </CommandGroup>
      );

    case "select":
    case "multiSelect":
      return (
        <CommandGroup>
          {column.columnDef.meta?.options?.map((option) => (
            <CommandItem
              key={option.value}
              onSelect={() => onSelect(option.value)}
              value={option.value}
            >
              {option.icon && <option.icon />}
              <span className="truncate">{option.label}</span>
              {option.count && (
                <span className="ms-auto font-mono text-xs">
                  {option.count}
                </span>
              )}
            </CommandItem>
          ))}
        </CommandGroup>
      );

    case "date":
    case "dateRange":
      return (
        <Calendar
          autoFocus
          captionLayout="dropdown"
          mode="single"
          onSelect={(date) => onSelect(date?.getTime().toString() ?? "")}
          selected={value ? new Date(value) : undefined}
        />
      );

    default: {
      const isEmpty = !value.trim();

      return (
        <CommandGroup>
          <CommandItem
            disabled={isEmpty}
            onSelect={() => onSelect(value)}
            value={value}
          >
            {isEmpty ? (
              <>
                <Text />
                <span>{t("dataTableTranslations.typeToAddFilter")}</span>
              </>
            ) : (
              <>
                <BadgeCheck />
                <span className="truncate">
                  {t("dataTableTranslations.filterByValue", { value })}
                </span>
              </>
            )}
          </CommandItem>
        </CommandGroup>
      );
    }
  }
}

function onFilterInputRender<TData>({
  filter,
  column,
  inputId,
  t,
  onFilterUpdate,
  showValueSelector,
  setShowValueSelector,
}: {
  filter: ExtendedColumnFilter<TData>;
  column: Column<TData>;
  inputId: string;
  t: TranslationFn;
  onFilterUpdate: (
    filterId: string,
    updates: Partial<Omit<ExtendedColumnFilter<TData>, "filterId">>,
  ) => void;
  showValueSelector: boolean;
  setShowValueSelector: (value: boolean) => void;
}) {
  if (filter.operator === "isEmpty" || filter.operator === "isNotEmpty") {
    return (
      <div
        aria-label={t("dataTableTranslations.filterStatus", {
          title: column.columnDef.meta?.label ?? column.id,
          status:
            filter.operator === "isEmpty"
              ? t("dataTableTranslations.empty")
              : t("dataTableTranslations.notEmpty"),
        })}
        aria-live="polite"
        className="h-full w-16 rounded-none border bg-transparent px-1.5 py-0.5 text-muted-foreground dark:bg-input/30"
        id={inputId}
        role="status"
      />
    );
  }

  switch (filter.variant) {
    case "text":
    case "number":
    case "range": {
      if (
        (filter.variant === "range" && filter.operator === "isBetween") ||
        filter.operator === "isBetween"
      ) {
        return (
          <DataTableRangeFilter
            className="size-full max-w-28 gap-0 **:data-[slot='range-min']:border-e-0 [&_input]:rounded-none [&_input]:px-1.5"
            column={column}
            filter={filter}
            inputId={inputId}
            onFilterUpdate={onFilterUpdate}
          />
        );
      }

      const isNumber =
        filter.variant === "number" || filter.variant === "range";

      return (
        <Input
          className="h-full w-24 rounded-none px-1.5"
          defaultValue={typeof filter.value === "string" ? filter.value : ""}
          id={inputId}
          inputMode={isNumber ? "numeric" : undefined}
          onChange={(event) =>
            onFilterUpdate(filter.filterId, { value: event.target.value })
          }
          placeholder={column.columnDef.meta?.placeholder ?? t("dataTableTranslations.enterValue")}
          type={isNumber ? "number" : "text"}
        />
      );
    }

    case "boolean": {
      const inputListboxId = `${inputId}-listbox`;

      return (
        <Select
          onOpenChange={setShowValueSelector}
          onValueChange={(value) =>
            onFilterUpdate(filter.filterId, {
              value: (value ?? "true") as "true" | "false",
            })
          }
          open={showValueSelector}
          value={typeof filter.value === "string" ? filter.value : "true"}
        >
          <SelectTrigger
            aria-controls={inputListboxId}
            className="rounded-none bg-transparent px-1.5 py-0.5 [&_svg]:hidden"
            id={inputId}
          >
            <SelectValue
              placeholder={
                filter.value
                  ? t("dataTableTranslations.true")
                  : t("dataTableTranslations.false")
              }
            />
          </SelectTrigger>
          <SelectContent id={inputListboxId}>
            <SelectItem value="true">{t("dataTableTranslations.true")}</SelectItem>
            <SelectItem value="false">{t("dataTableTranslations.false")}</SelectItem>
          </SelectContent>
        </Select>
      );
    }

    case "select":
    case "multiSelect": {
      const inputListboxId = `${inputId}-listbox`;

      const options = column.columnDef.meta?.options ?? [];
      const selectedValues = Array.isArray(filter.value)
        ? filter.value
        : [filter.value];

      const selectedOptions = options.filter((option) =>
        selectedValues.includes(option.value),
      );

      return (
        <Popover onOpenChange={setShowValueSelector} open={showValueSelector}>
          <PopoverTrigger
            render={
              <Button
                aria-controls={inputListboxId}
                className="h-full min-w-16 rounded-none border px-1.5 font-normal dark:bg-input/30"
                id={inputId}
                size="sm"
                variant="ghost"
              />
            }
          >
            {selectedOptions.length === 0 ? (
              filter.variant === "multiSelect" ? (
                t("dataTableTranslations.selectOptions")
              ) : (
                t("dataTableTranslations.selectOption")
              )
            ) : (
              <>
                <div className="flex items-center -space-x-2 rtl:space-x-reverse">
                  {selectedOptions.map((selectedOption) =>
                    selectedOption.icon ? (
                      <div
                        className="rounded-full border bg-background p-0.5"
                        key={selectedOption.value}
                      >
                        <selectedOption.icon className="size-3.5" />
                      </div>
                    ) : null,
                  )}
                </div>
                <span className="truncate">
                  {selectedOptions.length > 1
                    ? t("dataTableTranslations.selected", {
                      count: selectedOptions.length,
                    })
                    : selectedOptions[0]?.label}
                </span>
              </>
            )}
          </PopoverTrigger>
          <PopoverContent
            align="start"
            className="w-48 p-0"
            id={inputListboxId}
          >
            <Command>
              <CommandInput placeholder={t("dataTableTranslations.searchOptions")} />
              <CommandList>
                <CommandEmpty>{t("dataTableTranslations.noOptionsFound")}</CommandEmpty>
                <CommandGroup>
                  {options.map((option) => (
                    <CommandItem
                      key={option.value}
                      onSelect={() => {
                        const value =
                          filter.variant === "multiSelect"
                            ? selectedValues.includes(option.value)
                              ? selectedValues.filter((v) => v !== option.value)
                              : [...selectedValues, option.value]
                            : option.value;
                        onFilterUpdate(filter.filterId, { value });
                      }}
                      value={option.value}
                    >
                      {option.icon && <option.icon />}
                      <span className="truncate">{option.label}</span>
                      {filter.variant === "multiSelect" && (
                        <Check
                          className={cn(
                            "ms-auto",
                            selectedValues.includes(option.value)
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      );
    }

    case "date":
    case "dateRange": {
      const inputListboxId = `${inputId}-listbox`;

      const dateValue = Array.isArray(filter.value)
        ? filter.value.filter(Boolean)
        : [filter.value, filter.value].filter(Boolean);

      const startDate = dateValue[0]
        ? new Date(Number(dateValue[0]))
        : undefined;
      const endDate = dateValue[1] ? new Date(Number(dateValue[1])) : undefined;

      const isSameDate =
        startDate &&
        endDate &&
        startDate.toDateString() === endDate.toDateString();

      const displayValue =
        filter.operator === "isBetween" && dateValue.length === 2 && !isSameDate
          ? `${formatDate(startDate, { month: "short" })} - ${formatDate(endDate, { month: "short" })}`
          : startDate
            ? formatDate(startDate, { month: "short" })
            : t("dataTableTranslations.pickDate");

      return (
        <Popover onOpenChange={setShowValueSelector} open={showValueSelector}>
          <PopoverTrigger
            render={
              <Button
                aria-controls={inputListboxId}
                className={cn(
                  "h-full rounded-none border px-1.5 font-normal dark:bg-input/30",
                  !filter.value && "text-muted-foreground",
                )}
                id={inputId}
                size="sm"
                variant="ghost"
              />
            }
          >
            <CalendarIcon className="size-3.5" />
            <span className="truncate">{displayValue}</span>
          </PopoverTrigger>
          <PopoverContent
            align="start"
            className="w-auto p-0"
            id={inputListboxId}
          >
            {filter.operator === "isBetween" ? (
              <Calendar
                autoFocus
                captionLayout="dropdown"
                mode="range"
                onSelect={(date) => {
                  const fromTimestamp = date?.from
                    ? getStartOfDayTimestamp(date.from)
                    : undefined;
                  const toTimestamp = date?.to
                    ? getEndOfDayTimestamp(date.to)
                    : fromTimestamp
                      ? getEndOfDayTimestamp(new Date(fromTimestamp))
                      : undefined;

                  onFilterUpdate(filter.filterId, {
                    value:
                      fromTimestamp || toTimestamp
                        ? [
                          (fromTimestamp ?? "").toString(),
                          (toTimestamp ?? "").toString(),
                        ]
                        : [],
                  });
                }}
                selected={
                  dateValue.length === 2
                    ? {
                      from: new Date(Number(dateValue[0])),
                      to: new Date(Number(dateValue[1])),
                    }
                    : {
                      from: new Date(),
                      to: new Date(),
                    }
                }
              />
            ) : (
              <Calendar
                autoFocus
                captionLayout="dropdown"
                mode="single"
                onSelect={(date) => {
                  onFilterUpdate(filter.filterId, {
                    value: date
                      ? [
                        getStartOfDayTimestamp(date).toString(),
                        getEndOfDayTimestamp(date).toString(),
                      ]
                      : "",
                  });
                }}
                selected={
                  dateValue[0] ? new Date(Number(dateValue[0])) : undefined
                }
              />
            )}
          </PopoverContent>
        </Popover>
      );
    }

    default:
      return null;
  }
}
