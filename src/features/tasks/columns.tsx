import type { ColumnDef } from "@tanstack/react-table";
import {
  DataTableColumnHeader,
  selectColumn,
} from "@/components/data-table/components/data-table-column-header";
import { formatDate } from "@/components/data-table/lib/format";
import type { DataTableColumnsContext } from "@/components/data-table/types";
import { Badge } from "@/components/ui/badge";
import type { TaskCounts } from "@/features/tasks/utils";
import type { mainTranslations } from "@/lib/i18n/global";
import type { TFunction } from "@/lib/i18n/lib";
import { cn } from "@/lib/utils";
import type { Task } from "@/server/db/schema";

export function getTaskColumns(
  context: DataTableColumnsContext<TaskCounts>,
  t?: TFunction<typeof mainTranslations>,
): ColumnDef<Task, unknown>[] {
  const counts = (context.counts ?? {}) as Partial<TaskCounts>;

  const tr = (
    key: Parameters<TFunction<typeof mainTranslations>>[0],
    fallback: string,
  ) => {
    if (!t) return fallback;
    return t(key, {});
  };

  const statusOptions = counts.status;
  const priorityOptions = counts.priority;
  const assigneeOptions = counts.assignee;

  return [
    selectColumn,
    {
      accessorKey: "id",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={tr("tasksTranslations.columns.id", "Task")}
        />
      ),
      cell: ({ row }) => (
        <span className="font-mono text-muted-foreground text-xs">
          {row.original.id}
        </span>
      ),
      enableHiding: false,
      enableSorting: true,
    },
    {
      accessorKey: "title",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={tr("tasksTranslations.columns.title", "Title")}
        />
      ),
      cell: ({ row }) => (
        <span className="font-medium">{row.original.title}</span>
      ),
      enableColumnFilter: true,
      meta: {
        label: tr("tasksTranslations.filters.title.label", "Search title"),
        placeholder: tr(
          "tasksTranslations.filters.title.placeholder",
          "Search tasks...",
        ),
        variant: "text" as const,
      },
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={tr("tasksTranslations.columns.status", "Status")}
        />
      ),
      cell: ({ row }) => (
        <Badge variant={statusVariant(row.original.status)}>
          {t
            ? t("tasksTranslations.statusValues", {
              status: row.original.status,
            })
            : row.original.status}
        </Badge>
      ),
      enableColumnFilter: true,
      meta: {
        label: tr("tasksTranslations.filters.status.label", "Status"),
        variant: "multiSelect" as const,
        options: statusOptions,
      },
    },
    {
      accessorKey: "priority",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={tr("tasksTranslations.columns.priority", "Priority")}
        />
      ),
      cell: ({ row }) => (
        <Badge variant={priorityVariant(row.original.priority)}>
          {t
            ? t("tasksTranslations.priorityValues", {
              priority: row.original.priority,
            })
            : row.original.priority}
        </Badge>
      ),
      enableColumnFilter: true,
      meta: {
        label: tr("tasksTranslations.filters.priority.label", "Priority"),
        variant: "multiSelect",
        options: priorityOptions,
      },
    },
    {
      accessorKey: "assignee",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={tr("tasksTranslations.columns.assignee", "Assignee")}
        />
      ),
      cell: ({ row }) => (
        <span className="flex items-center gap-2">
          <span className="inline-flex size-8 items-center justify-center rounded-full bg-secondary font-medium text-secondary-foreground text-sm uppercase">
            {row.original.assignee.slice(0, 2)}
          </span>
          <span className="font-medium">{row.original.assignee}</span>
        </span>
      ),
      enableColumnFilter: true,
      meta: {
        label: tr("tasksTranslations.filters.assignee.label", "Assignee"),
        variant: "multiSelect" as const,
        options: assigneeOptions,
      },
    },
    {
      accessorKey: "dueDate",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={tr("tasksTranslations.columns.dueDate", "Due")}
        />
      ),
      cell: ({ row }) => (
        <span className="text-muted-foreground text-sm">
          {formatDate(row.original.dueDate)}
        </span>
      ),
      enableColumnFilter: true,
      meta: {
        label: tr("tasksTranslations.filters.dueDate.label", "Due date"),
        variant: "dateRange" as const,
      },
    },
    {
      accessorKey: "estimatedHours",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={tr("tasksTranslations.columns.estimatedHours", "Estimate")}
        />
      ),
      cell: ({ row }) => (
        <span className="font-mono text-sm">
          {row.original.estimatedHours}h
        </span>
      ),
      enableColumnFilter: true,
      meta: {
        label: tr(
          "tasksTranslations.filters.estimatedHours.label",
          "Estimated hours",
        ),
        variant: "range" as const,
        unit: "h",
      },
    },
    {
      accessorKey: "completedPercentage",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={tr(
            "tasksTranslations.columns.completedPercentage",
            "Progress",
          )}
        />
      ),
      cell: ({ row }) => {
        const percentage = Number(row.original.completedPercentage);
        return (
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-24 overflow-hidden rounded-full bg-muted">
              <div
                className={cn("h-full bg-primary", {
                  "bg-orange-500": percentage < 50,
                  "bg-lime-500": percentage >= 50 && percentage < 90,
                  "bg-emerald-500": percentage >= 90,
                })}
                style={{ width: `${percentage}%` }}
              />
            </div>
            <span className="font-mono text-muted-foreground text-xs">
              {percentage}%
            </span>
          </div>
        );
      },
    },
  ];
}

function statusVariant(status: Task["status"]) {
  switch (status) {
    case "done":
      return "secondary" as const;
    case "blocked":
      return "destructive" as const;
    case "in-progress":
    case "review":
      return "default" as const;
    default:
      return "outline" as const;
  }
}

function priorityVariant(priority: Task["priority"]) {
  switch (priority) {
    case "critical":
      return "destructive" as const;
    case "high":
      return "default" as const;
    case "medium":
      return "secondary" as const;
    default:
      return "outline" as const;
  }
}
