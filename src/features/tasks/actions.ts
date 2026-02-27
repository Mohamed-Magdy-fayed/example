"use server";

import { avg, count, eq, inArray, sum } from "drizzle-orm";
import { getCurrentUser } from "@/auth/nextjs";
import {
  buildOrderByFromSorting,
  buildWhereFromMeta,
} from "@/components/data-table/lib/drizzle-helpers";
import { toTypedFilters } from "@/components/data-table/lib/utils";
import type {
  DataTableFilterMap,
  DataTableListResult,
  DataTableQuery,
} from "@/components/data-table/types";
import {
  DRIZZLE_COLUMN_MAP,
  TASK_META_MAP,
  type TaskFilters,
  type TaskTableMeta,
} from "@/features/tasks/utils";
import { db } from "@/server/db";
import { type NewTask, type Task, TasksTable } from "@/server/db/schema";

export async function transformTaskFilters(
  filters: DataTableFilterMap,
): Promise<TaskFilters> {
  const typed = toTypedFilters<TaskFilters>(
    filters,
    ["title"],
    ["status", "priority", "assignee"],
  );

  return {
    title: typed.title,
    status: typed.status,
    priority: typed.priority,
    assignee: typed.assignee,
  } satisfies TaskFilters;
}

export async function fetchTasks(
  query: DataTableQuery<TaskFilters, Task>,
): Promise<DataTableListResult<Task, TaskTableMeta>> {
  const filters = query.filters ?? {};

  const whereExpr = buildWhereFromMeta(filters, TASK_META_MAP);

  const totalRows = await db
    .select({
      total: count(TasksTable.id),
      total_estimated_hours: sum(TasksTable.estimatedHours),
      avg_completion: avg(TasksTable.completedPercentage),
    })
    .from(TasksTable)
    .where(whereExpr);

  const orderBy = buildOrderByFromSorting(query.sorting, DRIZZLE_COLUMN_MAP);

  const rows = await db
    .select()
    .from(TasksTable)
    .where(whereExpr)
    .orderBy(...(orderBy ?? []))
    .limit(query.pagination.perPage)
    .offset(
      ((query.pagination.page ?? 1) - 1) * (query.pagination.perPage ?? 10),
    );

  return {
    rows,
    total: totalRows[0]?.total ?? 0,
    meta: {
      averageCompletion: Number(totalRows[0]?.avg_completion) ?? 0,
      totalEstimatedHours: Number(totalRows[0]?.total_estimated_hours) ?? 0,
    },
  };
}

export async function createTask(input: Omit<NewTask, "createdBy">) {
  "use server";

  const { id: createdBy } = await getCurrentUser({ redirectIfNotFound: true });

  const [task] = await db
    .insert(TasksTable)
    .values({ ...input, createdBy })
    .returning();

  return task;
}

export async function updateTask(input: Task) {
  "use server";

  const [task] = await db
    .update(TasksTable)
    .set(input)
    .where(eq(TasksTable.id, input.id))
    .returning();

  return task;
}

export async function deleteTasks(input: { ids: string[] }) {
  "use server";

  const deletedRows = await db
    .delete(TasksTable)
    .where(inArray(TasksTable.id, input.ids))
    .returning({ id: TasksTable.id });

  return deletedRows;
}
