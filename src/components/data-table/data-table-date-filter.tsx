"use client";

import type { Column } from "@tanstack/react-table";
import { ar, enUS } from "date-fns/locale";
import { CalendarIcon, XCircle } from "lucide-react";
import * as React from "react";
import type { DateRange } from "react-day-picker";
import { formatDate } from "@/components/data-table/lib/format";
import { DateRangePresets } from "@/components/general/date-range-presets";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "@/features/core/i18n/useTranslation";
import type { DateRangePreset } from "@/lib/date-range";
import { cn } from "@/lib/utils";

type DateSelection = Date[] | DateRange;

function getIsDateRange(value: DateSelection): value is DateRange {
  return value && typeof value === "object" && !Array.isArray(value);
}

function parseAsDate(timestamp: number | string | undefined): Date | undefined {
  if (!timestamp) return undefined;
  const numericTimestamp =
    typeof timestamp === "string" ? Number(timestamp) : timestamp;
  const date = new Date(numericTimestamp);
  return !Number.isNaN(date.getTime()) ? date : undefined;
}

function parseColumnFilterValue(value: unknown) {
  if (value === null || value === undefined) {
    return [];
  }

  if (Array.isArray(value)) {
    return value.map((item) => {
      if (typeof item === "number" || typeof item === "string") {
        return item;
      }
      return undefined;
    });
  }

  if (typeof value === "string" || typeof value === "number") {
    return [value];
  }

  return [];
}

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

interface DataTableDateFilterProps<TData> {
  column: Column<TData, unknown>;
  title?: string;
  multiple?: boolean;
  presets?: DateRangePreset[];
  inPopover?: boolean;
}

export function DataTableDateFilter<TData>({
  column,
  title,
  multiple,
  presets = [],
  inPopover,
}: DataTableDateFilterProps<TData>) {
  const { locale, t } = useTranslation();
  const [open, setOpen] = React.useState(false);
  const columnFilterValue = column.getFilterValue();
  const calendarLocale = locale === "ar" ? ar : enUS;

  const selectedDates = React.useMemo<DateSelection>(() => {
    if (!columnFilterValue) {
      return multiple ? { from: undefined, to: undefined } : [];
    }

    if (multiple) {
      const timestamps = parseColumnFilterValue(columnFilterValue);
      return {
        from: parseAsDate(timestamps[0]),
        to: parseAsDate(timestamps[1]),
      };
    }

    const timestamps = parseColumnFilterValue(columnFilterValue);
    const date = parseAsDate(timestamps[0]);
    return date ? [date] : [];
  }, [columnFilterValue, multiple]);

  const onSelect = React.useCallback(
    (date: Date | DateRange | undefined) => {
      if (!date) {
        column.setFilterValue(undefined);
        return;
      }

      if (multiple && !("getTime" in date)) {
        const from = date.from ? getStartOfDayTimestamp(date.from) : undefined;
        const to = date.to
          ? getEndOfDayTimestamp(date.to)
          : from
            ? getEndOfDayTimestamp(new Date(from))
            : undefined;
        column.setFilterValue(from || to ? [from, to] : undefined);
        if (from || to) {
          setOpen(false);
        }
      } else if (!multiple && "getTime" in date) {
        column.setFilterValue([
          getStartOfDayTimestamp(date),
          getEndOfDayTimestamp(date),
        ]);
        setOpen(false);
      }
    },
    [column, multiple],
  );

  const onReset = React.useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation();
      column.setFilterValue(undefined);
    },
    [column],
  );

  const hasValue = React.useMemo(() => {
    if (multiple) {
      if (!getIsDateRange(selectedDates)) return false;
      return selectedDates.from || selectedDates.to;
    }
    if (!Array.isArray(selectedDates)) return false;
    return selectedDates.length > 0;
  }, [multiple, selectedDates]);

  const formatDateRange = React.useCallback((range: DateRange) => {
    if (!range.from && !range.to) return "";
    if (range.from && range.to) {
      return `${formatDate(range.from)} - ${formatDate(range.to)}`;
    }
    return formatDate(range.from ?? range.to);
  }, []);

  const label = React.useMemo(() => {
    if (multiple) {
      if (!getIsDateRange(selectedDates)) return null;

      const hasSelectedDates = selectedDates.from || selectedDates.to;
      const dateText = hasSelectedDates ? formatDateRange(selectedDates) : null;

      return (
        <span className="flex items-center gap-2">
          <span>{title}</span>
          {dateText && (
            <>
              <Separator
                className="mx-0.5 data-[orientation=vertical]:h-4"
                orientation="vertical"
              />
              <span>{dateText}</span>
            </>
          )}
        </span>
      );
    }

    if (getIsDateRange(selectedDates)) return null;

    const hasSelectedDate = selectedDates.length > 0;
    const dateText = hasSelectedDate ? formatDate(selectedDates[0]) : null;

    return (
      <span className="flex items-center gap-2">
        <span>{title}</span>
        {dateText && (
          <>
            <Separator
              className="mx-0.5 data-[orientation=vertical]:h-4"
              orientation="vertical"
            />
            <span>{dateText}</span>
          </>
        )}
      </span>
    );
  }, [selectedDates, multiple, formatDateRange, title]);

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger
        render={
          <Button
            className={cn(
              "h-8 border-dashed font-normal",
              inPopover && "w-full justify-start text-start",
            )}
            size="sm"
            variant="outline"
          />
        }
      >
        {!inPopover &&
          (hasValue ? (
            <div
              aria-label={t("dataTableTranslations.clearFilter", {
                title: title ?? column.id,
              })}
              className="rounded-sm opacity-70 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              onClick={onReset}
              role="button"
              tabIndex={0}
            >
              <XCircle />
            </div>
          ) : (
            <CalendarIcon />
          ))}
        {label}
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className={cn(inPopover ? "w-[min(22rem,88vw)]" : "w-auto", "p-0")}
      >
        {multiple ? (
          <Calendar
            autoFocus
            captionLayout="dropdown"
            locale={calendarLocale}
            mode="range"
            onSelect={onSelect}
            selected={
              getIsDateRange(selectedDates)
                ? selectedDates
                : { from: undefined, to: undefined }
            }
          />
        ) : (
          <Calendar
            captionLayout="dropdown"
            locale={calendarLocale}
            mode="single"
            onSelect={onSelect}
            selected={
              !getIsDateRange(selectedDates) ? selectedDates[0] : undefined
            }
          />
        )}
        <DateRangePresets
          onSelect={(range) => {
            column.setFilterValue([range.from.getTime(), range.to.getTime()]);
            setOpen(false);
          }}
          presets={presets}
        />
      </PopoverContent>
    </Popover>
  );
}
