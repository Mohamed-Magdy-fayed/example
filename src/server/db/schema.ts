export * from "@/features/core/auth/tables";
export * from "./schemas/customer/messages-table";
export * from "./schemas/customer/subscribers-table";

import {
    integer,
    numeric,
    pgEnum,
    pgTable,
    text,
    timestamp,
} from "drizzle-orm/pg-core";
import { createdAt, createdBy } from "@/server/db/schemas/helpers";

export const taskStatusValues = [
    "backlog",
    "todo",
    "in-progress",
    "review",
    "blocked",
    "done",
] as const;
export const taskStatusEnum = pgEnum("task_status", taskStatusValues);
export type TaskStatus = (typeof taskStatusValues)[number];

export const taskPriorityValues = [
    "low",
    "medium",
    "high",
    "critical",
] as const;
export const taskPriorityEnum = pgEnum("task_priority", taskPriorityValues);
export type TaskPriority = (typeof taskPriorityValues)[number];

export const TasksTable = pgTable("tasks", {
    id: text("id").primaryKey(),
    title: text("title").notNull(),
    status: taskStatusEnum("status").notNull(),
    priority: taskPriorityEnum("priority").notNull(),
    assignee: text("assignee").notNull(),
    dueDate: timestamp("due_date").notNull(),
    estimatedHours: integer("estimated_hours").notNull(),
    completedPercentage: numeric("completed_percentage", {
        precision: 5,
        scale: 2,
    })
        .notNull()
        .default("0"),

    createdAt,
    createdBy,
});

export type Task = typeof TasksTable.$inferSelect;
export type NewTask = typeof TasksTable.$inferInsert;
