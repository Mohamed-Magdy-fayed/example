import type { ColumnDef } from "@tanstack/react-table";

import {
  DataTableColumnHeader,
  selectColumn,
} from "@/components/data-table/data-table-column-header";
import type { DataTableColumnsContext } from "@/components/data-table/types";
import type { User } from "@/drizzle/schema";
import type { mainTranslations } from "@/features/core/i18n/global";
import type { TFunction } from "@/features/core/i18n/lib";
import { useTranslation } from "@/features/core/i18n/useTranslation";
import { UsersRowActions } from "@/features/users/components/users-row-actions";
import type { UserCounts } from "@/features/users/utils";
import {
  type DateRangePreset,
  getTodayRange,
  getYesterdayRange,
} from "@/lib/date-range";
import { formatCurrency, formatDate } from "@/lib/formatters";

export function getUserColumns(
  context: DataTableColumnsContext<UserCounts>,
  t: TFunction<typeof mainTranslations>,
): ColumnDef<User, unknown>[] {
  const counts = (context.counts ?? {}) as Partial<UserCounts>;
  const roleOptions = counts.role;
  const datePresets: DateRangePreset[] = [
    {
      id: "today",
      label: t("common.today"),
      getRange: getTodayRange,
    },
    {
      id: "yesterday",
      label: t("common.yesterday"),
      getRange: getYesterdayRange,
    },
  ];

  return [
    selectColumn as ColumnDef<User, unknown>,
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          label={t("employeeTranslations.columns.name.label")}
        />
      ),
      cell: ({ row }) => (
        <span className="font-medium">{row.original.name}</span>
      ),
      enableColumnFilter: true,
      meta: {
        label: t("employeeTranslations.columns.name.label"),
        placeholder: t("employeeTranslations.columns.name.searchPlaceholder"),
        variant: "text",
      },
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          label={t("employeeTranslations.columns.email.label")}
        />
      ),
      cell: ({ row }) => (
        <span className="text-muted-foreground text-sm">
          {row.original.email}
        </span>
      ),
      enableColumnFilter: true,
      meta: {
        label: t("employeeTranslations.columns.email.label"),
        placeholder: t("employeeTranslations.columns.email.searchPlaceholder"),
        variant: "text",
      },
    },
    {
      accessorKey: "phone",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          label={t("employeeTranslations.columns.phone.label")}
        />
      ),
      cell: ({ row }) => (
        <span className="text-muted-foreground text-sm">
          {row.original.phone}
        </span>
      ),
      enableColumnFilter: true,
      meta: {
        label: t("employeeTranslations.columns.phone.label"),
        placeholder: t("employeeTranslations.columns.phone.searchPlaceholder"),
        variant: "text",
      },
    },
    {
      accessorKey: "role",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          label={t("employeeTranslations.columns.role.label")}
        />
      ),
      cell: ({ row }) =>
        t("employeeTranslations.columns.role.filterValues", {
          role: row.original.role,
        }),
      enableColumnFilter: true,
      meta: {
        label: t("employeeTranslations.columns.role.label"),
        variant: "multiSelect",
        options: roleOptions,
      },
    },
    {
      accessorKey: "salary",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          label={t("employeeTranslations.columns.salary.label")}
        />
      ),
      cell: ({ row }) => formatCurrency(row.original.salary || 0),
      enableColumnFilter: true,
      meta: {
        label: t("employeeTranslations.columns.salary.label"),
        variant: "range",
        sumFormatter: (value) => formatCurrency(value),
      },
    },
    {
      accessorKey: "lastSignInAt",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          label={t("employeeTranslations.columns.lastSignInAt.label")}
        />
      ),
      cell: ({ row }) => (
        <span className="text-muted-foreground text-sm">
          {row.original.lastSignInAt
            ? formatDate(row.original.lastSignInAt)
            : "-"}
        </span>
      ),
      enableColumnFilter: true,
      meta: {
        label: t("employeeTranslations.columns.lastSignInAt.label"),
        variant: "dateRange",
        datePresets,
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          label={t("employeeTranslations.columns.createdAt.label")}
        />
      ),
      cell: ({ row }) => (
        <span className="text-muted-foreground text-sm">
          {formatDate(row.original.createdAt)}
        </span>
      ),
      enableColumnFilter: true,
      meta: {
        label: t("employeeTranslations.columns.createdAt.label"),
        variant: "dateRange",
        datePresets,
      },
    },
    {
      id: "actions",
      header: () => t("common.actions"),
      cell: ({ row }) => <UsersRowActions user={row.original} />,
      size: 52,
      minSize: 52,
      maxSize: 52,
      enableSorting: false,
      enableHiding: false,
      enableColumnFilter: false,
    },
  ];
}

export function useUserColumns(
  context: DataTableColumnsContext<UserCounts>,
): ColumnDef<User, unknown>[] {
  const { t } = useTranslation();

  return getUserColumns(context, t);
}
