import type { PgColumn } from "drizzle-orm/pg-core";
import {
    buildCountQuery,
    buildMetaMapFromColumns,
    buildWhereFromMeta,
} from "@/components/data-table/lib/drizzle-helpers";
import type {
    DataTableCountFetcherMap,
    DataTableQuery,
    Option,
} from "@/components/data-table/types";
import { getTaskColumns } from "@/features/tasks/columns";
import { getT } from "@/lib/i18n/actions";
import {
    type Task,
    type TaskPriority,
    type TaskStatus,
    TasksTable,
} from "@/server/db/schema";

export interface TaskFilters {
    title?: string;
    status?: TaskStatus[];
    priority?: TaskPriority[];
    assignee?: string[];
}

export interface TaskTableMeta {
    totalEstimatedHours: number;
    averageCompletion: number;
}

export interface TaskCounts {
    status: Option<TaskStatus>[];
    priority: Option<TaskPriority>[];
    assignee: Option<string>[];
}

export const BASE_TASK_COLUMNS = getTaskColumns({
    counts: {} as TaskCounts,
    features: undefined,
});

export const DRIZZLE_COLUMN_MAP: Record<string, PgColumn> = {
    id: TasksTable.id,
    title: TasksTable.title,
    status: TasksTable.status,
    priority: TasksTable.priority,
    assignee: TasksTable.assignee,
    dueDate: TasksTable.dueDate,
    estimatedHours: TasksTable.estimatedHours,
    completedPercentage: TasksTable.completedPercentage,
};

export const TASK_META_MAP = buildMetaMapFromColumns(
    BASE_TASK_COLUMNS,
    DRIZZLE_COLUMN_MAP,
);

async function buildFacetCounts(
    query: DataTableQuery<TaskFilters, Task>,
): Promise<TaskCounts> {
    const filters = query?.filters ?? {};
    const whereExprStatus = buildWhereFromMeta(
        { ...filters, status: undefined },
        TASK_META_MAP,
    );
    const whereExprPriority = buildWhereFromMeta(
        { ...filters, priority: undefined },
        TASK_META_MAP,
    );
    const whereExprAssignee = buildWhereFromMeta(
        { ...filters, assignee: undefined },
        TASK_META_MAP,
    );

    const { t } = await getT();

    const [statusRows, priorityRows, assigneeRows] = await Promise.all([
        buildCountQuery({
            column: "status",
            table: TasksTable,
            whereExpr: whereExprStatus,
            label: (status) => t("tasksTranslations.statusValues", { status }),
        }),
        buildCountQuery({
            column: "priority",
            table: TasksTable,
            whereExpr: whereExprPriority,
            label: (priority) => t("tasksTranslations.priorityValues", { priority }),
        }),
        buildCountQuery({
            column: "assignee",
            table: TasksTable,
            whereExpr: whereExprAssignee,
        }),
    ]);

    return {
        status: statusRows,
        priority: priorityRows,
        assignee: assigneeRows,
    };
}

export const taskCountFetchers: DataTableCountFetcherMap<
    TaskFilters,
    TaskCounts,
    Task
> = {
    status: async (query) => {
        const counts = await buildFacetCounts(query);
        return counts.status;
    },
    priority: async (query) => {
        const counts = await buildFacetCounts(query);
        return counts.priority;
    },
    assignee: async (query) => {
        const counts = await buildFacetCounts(query);
        return counts.assignee;
    },
};
