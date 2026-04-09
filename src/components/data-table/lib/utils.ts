import type { Column } from "@tanstack/react-table";
import { dataTableConfig } from "@/components/data-table/config";
import type {
  ExtendedColumnFilter,
  FilterOperator,
  FilterVariant,
} from "@/components/data-table/types";
import { cn } from "@/lib/utils";

export function getCommonPinningStyles<TData>({
  column,
  withBorder = false,
}: {
  column: Column<TData>;
  withBorder?: boolean;
}): string {
  const isPinned = column.getIsPinned();
  const isLastLeftPinnedColumn =
    isPinned === "left" && column.getIsLastColumn("left");
  const isFirstRightPinnedColumn =
    isPinned === "right" && column.getIsFirstColumn("right");

  const classes: (string | undefined | false)[] = [];

  if (isPinned) {
    classes.push("sticky", "z-10", "bg-inherit");

    if (isPinned === "left") {
      classes.push("start-0");
    } else if (isPinned === "right") {
      classes.push("end-0");
    }

    if (withBorder) {
      classes.push(
        isLastLeftPinnedColumn &&
        "shadow-[-4px_0_4px_-4px_hsl(var(--border))_inset]",
        isFirstRightPinnedColumn &&
        "shadow-[4px_0_4px_-4px_hsl(var(--border))_inset]",
      );
    }
  } else {
    classes.push("relative");
  }

  return cn(classes);
}

export function getFilterOperators(filterVariant: FilterVariant) {
  const operatorMap: Record<
    FilterVariant,
    { label: string; value: FilterOperator }[]
  > = {
    text: dataTableConfig.textOperators,
    number: dataTableConfig.numericOperators,
    range: dataTableConfig.numericOperators,
    date: dataTableConfig.dateOperators,
    dateRange: dataTableConfig.dateOperators,
    boolean: dataTableConfig.booleanOperators,
    select: dataTableConfig.selectOperators,
    multiSelect: dataTableConfig.multiSelectOperators,
  };

  return operatorMap[filterVariant] ?? dataTableConfig.textOperators;
}

export function getDefaultFilterOperator(filterVariant: FilterVariant) {
  const operators = getFilterOperators(filterVariant);

  return operators[0]?.value ?? (filterVariant === "text" ? "iLike" : "eq");
}

export function getValidFilters<TData>(
  filters: ExtendedColumnFilter<TData>[],
): ExtendedColumnFilter<TData>[] {
  return filters.filter(
    (filter) =>
      filter.operator === "isEmpty" ||
      filter.operator === "isNotEmpty" ||
      (Array.isArray(filter.value)
        ? filter.value.length > 0
        : filter.value !== "" &&
        filter.value !== null &&
        filter.value !== undefined),
  );
}

export function toTypedFilters<TFilters>(
  filters: Record<string, unknown>,
  stringKeys: string[] = [],
  arrayKeys: string[] = [],
): Partial<TFilters> {
  const result: Record<string, unknown> = {};

  for (const key of stringKeys) {
    const value = filters[key];
    result[key] = typeof value === "string" && value.length > 0 ? value : undefined;
  }

  for (const key of arrayKeys) {
    const value = filters[key];
    if (Array.isArray(value) && value.length > 0) {
      const filtered = (value as unknown[]).filter(
        (v): v is string => typeof v === "string" && v.length > 0,
      );

      result[key] = filtered.length > 0 ? filtered : undefined;
    } else {
      result[key] = undefined;
    }
  }

  return result as Partial<TFilters>;
}
