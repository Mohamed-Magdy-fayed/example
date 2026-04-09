"use client";

import type { Column, ColumnMeta, Table } from "@tanstack/react-table";
import {
  CalendarIcon,
  ChevronsUpDown,
  GripVertical,
  ListFilter,
  PlusCircleIcon,
  Trash2,
  XIcon,
} from "lucide-react";
import { parseAsStringEnum, useQueryState } from "nuqs";
import * as React from "react";

import { dataTableConfig } from "@/components/data-table/config";
import { DataTableRangeFilter } from "@/components/data-table/data-table-range-filter";
import { useDebouncedCallback } from "@/components/data-table/hooks/use-debounced-callback";
import { DATA_TABLE_JOIN_OPERATOR_KEY } from "@/components/data-table/lib/constants";
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
  JoinOperator,
} from "@/components/data-table/types";
import { Badge } from "@/components/ui/badge";
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
import {
  Faceted,
  FacetedBadgeList,
  FacetedContent,
  FacetedEmpty,
  FacetedGroup,
  FacetedInput,
  FacetedItem,
  FacetedList,
  FacetedTrigger,
} from "@/components/ui/faceted";
import { Input } from "@/components/ui/input";
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

function getTranslatedOperatorLabel(
  operator: FilterOperator,
  t: ReturnType<typeof useTranslation>["t"],
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

interface DataTableFilterListProps<TData>
  extends React.ComponentProps<typeof PopoverContent> {
  table: Table<TData>;
  debounceMs?: number;
  throttleMs?: number;
  shallow?: boolean;
  disabled?: boolean;
}

export function DataTableFilterList<TData>({
  table,
  debounceMs = DEBOUNCE_MS,
  throttleMs = THROTTLE_MS,
  shallow = true,
  disabled,
  ...props
}: DataTableFilterListProps<TData>) {
  const { t } = useTranslation();
  const id = React.useId();
  const labelId = React.useId();
  const descriptionId = React.useId();
  const [open, setOpen] = React.useState(false);
  const addButtonRef = React.useRef<HTMLButtonElement>(null);

  const columns = React.useMemo(() => {
    return table
      .getAllColumns()
      .filter((column) => column.columnDef.enableColumnFilter);
  }, [table]);

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

  const [joinOperator, setJoinOperator] = useQueryState(
    table.options.meta?.queryKeys?.joinOperator ?? DATA_TABLE_JOIN_OPERATOR_KEY,
    parseAsStringEnum(["and", "or"]).withDefault("and").withOptions({
      clearOnDefault: true,
      shallow,
    }),
  );

  const onFilterAdd = React.useCallback(() => {
    const column = columns[0];

    if (!column) return;

    debouncedSetFilters([
      ...filters,
      {
        id: column.id as Extract<keyof TData, string>,
        value: "",
        variant: column.columnDef.meta?.variant ?? "text",
        operator: getDefaultFilterOperator(
          column.columnDef.meta?.variant ?? "text",
        ),
        filterId: generateId({ length: 8 }),
      },
    ]);
  }, [columns, filters, debouncedSetFilters]);

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

  const onFilterRemove = React.useCallback(
    (filterId: string) => {
      const updatedFilters = filters.filter(
        (filter) => filter.filterId !== filterId,
      );
      void setFilters(updatedFilters);
      requestAnimationFrame(() => {
        addButtonRef.current?.focus();
      });
    },
    [filters, setFilters],
  );

  const onFiltersReset = React.useCallback(() => {
    void setFilters(null);
    void setJoinOperator("and");
  }, [setFilters, setJoinOperator]);

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
    <Sortable
      getItemValue={(item) => item.filterId}
      onValueChange={setFilters}
      value={filters}
    >
      <Popover onOpenChange={setOpen} open={open}>
        <PopoverTrigger
          render={
            <Button
              className="font-normal text-sm"
              disabled={disabled}
              onKeyDown={onTriggerKeyDown}
              variant="outline"
            />
          }
        >
          <ListFilter className="text-muted-foreground" />
          {t("dataTableTranslations.filter")}
          {filters.length > 0 && (
            <Badge className="size-4 rounded-md" variant="secondary">
              {filters.length}
            </Badge>
          )}
        </PopoverTrigger>
        <PopoverContent
          aria-describedby={descriptionId}
          aria-labelledby={labelId}
          className="flex w-full max-w-(--radix-popover-content-available-width) flex-col gap-3.5 p-4 sm:min-w-[380px]"
          {...props}
        >
          <div className="flex flex-col gap-1">
            <h4 className="font-medium leading-none" id={labelId}>
              {filters.length > 0
                ? t("dataTableTranslations.filters")
                : t("dataTableTranslations.noFiltersApplied")}
            </h4>
            <p
              className={cn(
                "text-muted-foreground text-sm",
                filters.length > 0 && "sr-only",
              )}
              id={descriptionId}
            >
              {filters.length > 0
                ? t("dataTableTranslations.modifyFilters")
                : t("dataTableTranslations.addFilters")}
            </p>
          </div>
          {filters.length > 0 ? (
            <SortableContent
              render={
                <ScrollArea
                  className="pe-4"
                  role="list"
                  viewportClassName="flex max-h-40 flex-col gap-2 overflow-auto"
                />
              }
            >
              {filters.map((filter, index) => (
                <DataTableFilterItem<TData>
                  columns={columns}
                  filter={filter}
                  filterItemId={`${id}-filter-${filter.filterId}`}
                  index={index}
                  joinOperator={joinOperator}
                  key={filter.filterId}
                  onFilterRemove={onFilterRemove}
                  onFilterUpdate={onFilterUpdate}
                  setJoinOperator={setJoinOperator}
                />
              ))}
            </SortableContent>
          ) : null}
          <div className="flex w-full items-center gap-2">
            <Button onClick={onFilterAdd} ref={addButtonRef}>
              <PlusCircleIcon />
              {t("dataTableTranslations.addFilter")}
            </Button>
            {filters.length > 0 ? (
              <Button onClick={onFiltersReset} variant="outline">
                <XIcon />
                {t("dataTableTranslations.resetFilters")}
              </Button>
            ) : null}
          </div>
        </PopoverContent>
      </Popover>
      <SortableOverlay>
        <div className="flex items-center gap-2">
          <div className="h-7 min-w-12 rounded-sm bg-primary/10" />
          <div className="h-7 w-16 rounded-sm bg-primary/10 md:w-32" />
          <div className="h-7 w-16 rounded-sm bg-primary/10 md:w-32" />
          <div className="h-7 min-w-18 flex-1 rounded-sm bg-primary/10 md:min-w-36" />
          <div className="size-7 shrink-0 rounded-sm bg-primary/10" />
          <div className="size-7 shrink-0 rounded-sm bg-primary/10" />
        </div>
      </SortableOverlay>
    </Sortable>
  );
}

interface DataTableFilterItemProps<TData> {
  filter: ExtendedColumnFilter<TData>;
  index: number;
  filterItemId: string;
  joinOperator: JoinOperator;
  setJoinOperator: (value: JoinOperator) => void;
  columns: Column<TData>[];
  onFilterUpdate: (
    filterId: string,
    updates: Partial<Omit<ExtendedColumnFilter<TData>, "filterId">>,
  ) => void;
  onFilterRemove: (filterId: string) => void;
}

function DataTableFilterItem<TData>({
  filter,
  index,
  filterItemId,
  joinOperator,
  setJoinOperator,
  columns,
  onFilterUpdate,
  onFilterRemove,
}: DataTableFilterItemProps<TData>) {
  const { t } = useTranslation();
  const [showFieldSelector, setShowFieldSelector] = React.useState(false);
  const [showOperatorSelector, setShowOperatorSelector] = React.useState(false);
  const [showValueSelector, setShowValueSelector] = React.useState(false);

  const column = columns.find((column) => column.id === filter.id);

  const joinOperatorListboxId = `${filterItemId}-join-operator-listbox`;
  const fieldListboxId = `${filterItemId}-field-listbox`;
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
    <SortableItem asChild value={filter.filterId}>
      <div
        className="flex items-center gap-2"
        id={filterItemId}
        onKeyDown={onItemKeyDown}
        role="listitem"
        tabIndex={-1}
      >
        <div className="min-w-12 text-start">
          {index === 0 ? (
            <span className="text-muted-foreground text-sm">
              {t("dataTableTranslations.where")}
            </span>
          ) : index === 1 ? (
            <Select
              onValueChange={(value) =>
                setJoinOperator((value ?? "and") as JoinOperator)
              }
              value={joinOperator}
            >
              <SelectTrigger
                aria-controls={joinOperatorListboxId}
                aria-label={t("dataTableTranslations.selectJoinOperator")}
                className="rounded text-sm"
                size="default"
              >
                <SelectValue
                  placeholder={
                    joinOperator === "and"
                      ? t("dataTableTranslations.joinOperators.and")
                      : t("dataTableTranslations.joinOperators.or")
                  }
                  render={
                    <span>
                      {joinOperator === "and"
                        ? t("dataTableTranslations.joinOperators.and")
                        : t("dataTableTranslations.joinOperators.or")}
                    </span>
                  }
                />
              </SelectTrigger>
              <SelectContent
                className="min-w-(--radix-select-trigger-width)"
                id={joinOperatorListboxId}
                position="popper"
              >
                {dataTableConfig.joinOperators.map((joinOperator) => (
                  <SelectItem key={joinOperator} value={joinOperator}>
                    {joinOperator === "and"
                      ? t("dataTableTranslations.joinOperators.and")
                      : t("dataTableTranslations.joinOperators.or")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <span className="text-muted-foreground text-sm">
              {joinOperator === "and"
                ? t("dataTableTranslations.joinOperators.and")
                : t("dataTableTranslations.joinOperators.or")}
            </span>
          )}
        </div>

        <Popover onOpenChange={setShowFieldSelector} open={showFieldSelector}>
          <PopoverTrigger
            render={
              <Button
                aria-controls={fieldListboxId}
                className="justify-between rounded font-normal text-sm"
                variant="outline"
              />
            }
          >
            <span className="truncate">
              {columns.find((column) => column.id === filter.id)?.columnDef.meta
                ?.label ?? t("dataTableTranslations.selectField")}
            </span>
            <ChevronsUpDown className="opacity-50" />
          </PopoverTrigger>
          <PopoverContent
            align="start"
            className="w-min p-0"
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
                      data-checked={column.id === filter.id}
                      key={column.id}
                      onSelect={(value) => {
                        onFilterUpdate(filter.filterId, {
                          id: value as Extract<keyof TData, string>,
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
                      <span className="truncate">
                        {column.columnDef.meta?.label}
                      </span>
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
            className="rounded text-sm"
          >
            <span className="truncate">
              {getTranslatedOperatorLabel(filter.operator, t)}
            </span>
          </SelectTrigger>
          <SelectContent id={operatorListboxId}>
            {filterOperators.map((operator) => (
              <SelectItem key={operator.value} value={operator.value}>
                {getTranslatedOperatorLabel(operator.value, t)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex-1">
          {onFilterInputRender({
            filter,
            inputId,
            column,
            columnMeta,
            onFilterUpdate,
            showValueSelector,
            setShowValueSelector,
            t,
          })}
        </div>

        <Button
          aria-controls={filterItemId}
          className="rounded"
          onClick={() => onFilterRemove(filter.filterId)}
          size="icon"
          variant="outline"
        >
          <Trash2 />
        </Button>

        <SortableItemHandle asChild>
          <Button className="rounded" size="icon" variant="outline">
            <GripVertical />
          </Button>
        </SortableItemHandle>
      </div>
    </SortableItem>
  );
}

function onFilterInputRender<TData>({
  filter,
  inputId,
  column,
  columnMeta,
  onFilterUpdate,
  showValueSelector,
  setShowValueSelector,
  t,
}: {
  filter: ExtendedColumnFilter<TData>;
  inputId: string;
  column: Column<TData>;
  columnMeta?: ColumnMeta<TData, unknown>;
  onFilterUpdate: (
    filterId: string,
    updates: Partial<Omit<ExtendedColumnFilter<TData>, "filterId">>,
  ) => void;
  showValueSelector: boolean;
  setShowValueSelector: (value: boolean) => void;
  t: ReturnType<typeof useTranslation>["t"];
}) {
  if (filter.operator === "isEmpty" || filter.operator === "isNotEmpty") {
    return (
      <div
        aria-label={`${columnMeta?.label} filter is ${filter.operator === "isEmpty" ? "empty" : "not empty"
          }`}
        aria-live="polite"
        className="h-7 w-full rounded border bg-transparent dark:bg-input/30"
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
          aria-describedby={`${inputId}-description`}
          aria-label={`${columnMeta?.label} filter value`}
          className="w-full rounded text-sm"
          defaultValue={
            typeof filter.value === "string" ? filter.value : undefined
          }
          id={inputId}
          inputMode={isNumber ? "numeric" : undefined}
          onChange={(event) =>
            onFilterUpdate(filter.filterId, {
              value: event.target.value,
            })
          }
          placeholder={
            columnMeta?.placeholder ?? t("dataTableTranslations.enterValue")
          }
          type={isNumber ? "number" : filter.variant}
        />
      );
    }

    case "boolean": {
      if (Array.isArray(filter.value)) return null;

      const inputListboxId = `${inputId}-listbox`;

      return (
        <Select
          onOpenChange={setShowValueSelector}
          onValueChange={(value) =>
            onFilterUpdate(filter.filterId, {
              value: value ?? "",
            })
          }
          open={showValueSelector}
          value={typeof filter.value === "string" ? filter.value : undefined}
        >
          <SelectTrigger
            aria-controls={inputListboxId}
            aria-label={`${columnMeta?.label} boolean filter`}
            className="w-full rounded text-sm"
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
            <SelectItem value="true">
              {t("dataTableTranslations.true")}
            </SelectItem>
            <SelectItem value="false">
              {t("dataTableTranslations.false")}
            </SelectItem>
          </SelectContent>
        </Select>
      );
    }

    case "select":
    case "multiSelect": {
      const inputListboxId = `${inputId}-listbox`;

      const multiple = filter.variant === "multiSelect";
      const selectedValues = multiple
        ? Array.isArray(filter.value)
          ? filter.value
          : []
        : typeof filter.value === "string"
          ? filter.value
          : undefined;

      return (
        <Faceted
          multiple={multiple}
          onOpenChange={setShowValueSelector}
          onValueChange={(value) => {
            onFilterUpdate(filter.filterId, {
              value: value ?? undefined,
            });
          }}
          open={showValueSelector}
          value={selectedValues}
        >
          <FacetedTrigger
            render={
              <Button
                aria-controls={inputListboxId}
                aria-label={`${columnMeta?.label} filter value${multiple ? "s" : ""}`}
                className="w-full"
                id={inputId}
                variant="outline"
              />
            }
          >
            <FacetedBadgeList
              options={columnMeta?.options}
              placeholder={
                columnMeta?.placeholder ??
                t("dataTableTranslations.selectOptions")
              }
            />
          </FacetedTrigger>
          <FacetedContent id={inputListboxId}>
            <FacetedInput
              aria-label={`Search ${columnMeta?.label} options`}
              placeholder={
                columnMeta?.placeholder ??
                t("dataTableTranslations.searchOptions")
              }
            />
            <FacetedList>
              <FacetedEmpty>{t("common.noOptionsFound")}</FacetedEmpty>
              <FacetedGroup>
                {columnMeta?.options?.map((option) => (
                  <FacetedItem key={option.value} value={option.value}>
                    {option.icon && <option.icon />}
                    <span>{option.label}</span>
                    {option.count && <span>{option.count}</span>}
                  </FacetedItem>
                ))}
              </FacetedGroup>
            </FacetedList>
          </FacetedContent>
        </Faceted>
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
                aria-label={`${columnMeta?.label} date filter`}
                className={cn(
                  "w-full justify-start rounded text-start font-normal text-sm",
                  !filter.value && "text-muted-foreground",
                )}
                id={inputId}
                variant="outline"
              />
            }
          >
            <CalendarIcon />
            <span className="truncate">{displayValue}</span>
          </PopoverTrigger>
          <PopoverContent
            align="start"
            className="w-min p-0"
            id={inputListboxId}
          >
            {filter.operator === "isBetween" ? (
              <Calendar
                aria-label={`Select ${columnMeta?.label} date range`}
                autoFocus
                captionLayout="dropdown"
                mode="range"
                onSelect={(date) => {
                  onFilterUpdate(filter.filterId, {
                    value: date
                      ? [
                        (date.from?.getTime() ?? "").toString(),
                        (date.to?.getTime() ?? "").toString(),
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
                aria-label={`Select ${columnMeta?.label} date`}
                autoFocus
                captionLayout="dropdown"
                mode="single"
                onSelect={(date) => {
                  onFilterUpdate(filter.filterId, {
                    value: (date?.getTime() ?? "").toString(),
                  });
                  setShowValueSelector(false);
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
