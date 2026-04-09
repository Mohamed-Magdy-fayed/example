"use client";

import type { Table } from "@tanstack/react-table";
import { Settings2 } from "lucide-react";
import * as React from "react";

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
import { useTranslation } from "@/features/core/i18n/useTranslation";

interface DataTableViewOptionsProps<TData>
  extends React.ComponentProps<typeof PopoverContent> {
  table: Table<TData>;
  disabled?: boolean;
}

export function DataTableViewOptions<TData>({
  table,
  disabled,
  ...props
}: DataTableViewOptionsProps<TData>) {
  const { t } = useTranslation();

  const columns = React.useMemo(
    () =>
      table
        .getAllColumns()
        .filter(
          (column) =>
            typeof column.accessorFn !== "undefined" && column.getCanHide(),
        ),
    [table],
  );

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            aria-label={t("dataTableTranslations.toggleColumns")}
            className="ms-auto flex"
            disabled={disabled}
            role="combobox"
            variant="outline"
          />
        }
      >
        <Settings2 className="text-muted-foreground" />
        {t("dataTableTranslations.view")}
      </PopoverTrigger>
      <PopoverContent className="w-max p-0" {...props}>
        <Command>
          <CommandInput placeholder={t("dataTableTranslations.searchFields")} />
          <CommandList>
            <CommandEmpty>{t("dataTableTranslations.noColumns")}</CommandEmpty>
            <CommandGroup>
              {columns.map((column) => (
                <CommandItem
                  data-checked={column.getIsVisible()}
                  key={column.id}
                  onSelect={() =>
                    column.toggleVisibility(!column.getIsVisible())
                  }
                >
                  <span className="truncate">
                    {column.columnDef.meta?.label ?? column.id}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
