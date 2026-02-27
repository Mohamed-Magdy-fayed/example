"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { SelectDateField } from "@/components/general/select-date-field";
import { Button } from "@/components/ui/button";
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { createTask } from "@/features/tasks/actions";
import { useTranslation } from "@/lib/i18n/useTranslation";
import {
    type TaskPriority,
    type TaskStatus,
    taskPriorityValues,
    taskStatusValues,
} from "@/server/db/schema";

type TaskFormValues = {
    id: string;
    title: string;
    status: TaskStatus;
    priority: TaskPriority;
    assignee: string;
    dueDate: string;
    estimatedHours: number;
    completedPercentage: number;
};

interface TasksFormProps {
    setIsOpen?: (open: boolean) => void;
}

export function TasksForm({ setIsOpen }: TasksFormProps) {
    const router = useRouter();
    const [isPending, startTransition] = React.useTransition();
    const { t } = useTranslation();

    const taskFormSchema = React.useMemo(
        () =>
            z.object({
                id: z
                    .string()
                    .min(1, t("tasksTranslations.form.validation.idRequired")),
                title: z
                    .string()
                    .min(1, t("tasksTranslations.form.validation.titleRequired")),
                status: z.enum(taskStatusValues),
                priority: z.enum(taskPriorityValues),
                assignee: z
                    .string()
                    .min(1, t("tasksTranslations.form.validation.assigneeRequired")),
                dueDate: z
                    .string()
                    .min(1, t("tasksTranslations.form.validation.dueDateRequired"))
                    .refine(
                        (value) => !Number.isNaN(Date.parse(value)),
                        t("tasksTranslations.form.validation.dueDateInvalid"),
                    ),
                estimatedHours: z
                    .number()
                    .int()
                    .min(0, t("tasksTranslations.form.validation.estimatedHoursMin")),
                completedPercentage: z.number().min(0).max(100),
            }),
        [t],
    );

    const form = useForm<TaskFormValues>({
        resolver: zodResolver(taskFormSchema),
        defaultValues: {
            id: "",
            title: "",
            status: "todo" satisfies TaskStatus,
            priority: "medium" satisfies TaskPriority,
            assignee: "",
            dueDate: new Date().toISOString().slice(0, 10),
            estimatedHours: 0,
            completedPercentage: 0,
        },
    });

    const onSubmit = React.useCallback(
        (values: TaskFormValues) => {
            startTransition(async () => {
                try {
                    await createTask({
                        id: values.id,
                        title: values.title,
                        status: values.status,
                        priority: values.priority,
                        assignee: values.assignee,
                        dueDate: new Date(values.dueDate),
                        estimatedHours: values.estimatedHours,
                        completedPercentage: String(values.completedPercentage),
                    });

                    toast.success(t("tasksTranslations.form.toast.created"));
                    form.reset();
                    setIsOpen?.(false);
                    router.refresh();
                } catch (error) {
                    toast.error(
                        error instanceof Error
                            ? error.message
                            : t("tasksTranslations.form.toast.createFailed"),
                    );
                }
            });
        },
        [form, router, setIsOpen, t],
    );

    return (
        <form className="pt-6" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
                <Controller
                    control={form.control}
                    name="id"
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="task-id">
                                {t("tasksTranslations.form.labels.id")}
                            </FieldLabel>
                            <Input
                                {...field}
                                aria-invalid={fieldState.invalid}
                                autoComplete="off"
                                id="task-id"
                                placeholder={t("tasksTranslations.form.placeholders.id")}
                            />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />

                <Controller
                    control={form.control}
                    name="title"
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="task-title">
                                {t("tasksTranslations.form.labels.title")}
                            </FieldLabel>
                            <Input
                                {...field}
                                aria-invalid={fieldState.invalid}
                                autoComplete="off"
                                id="task-title"
                                placeholder={t("tasksTranslations.form.placeholders.title")}
                            />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />

                <div className="grid gap-4 sm:grid-cols-2">
                    <Controller
                        control={form.control}
                        name="status"
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="task-status">
                                    {t("tasksTranslations.form.labels.status")}
                                </FieldLabel>
                                <Select
                                    name={field.name}
                                    onValueChange={field.onChange}
                                    value={field.value}
                                >
                                    <SelectTrigger
                                        aria-invalid={fieldState.invalid}
                                        id="task-status"
                                    >
                                        <SelectValue
                                            placeholder={t(
                                                "tasksTranslations.form.placeholders.status",
                                            )}
                                        />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {taskStatusValues.map((value) => (
                                            <SelectItem key={value} value={value}>
                                                {t("tasksTranslations.statusValues", { status: value })}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />

                    <Controller
                        control={form.control}
                        name="priority"
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="task-priority">
                                    {t("tasksTranslations.form.labels.priority")}
                                </FieldLabel>
                                <Select
                                    name={field.name}
                                    onValueChange={field.onChange}
                                    value={field.value}
                                >
                                    <SelectTrigger
                                        aria-invalid={fieldState.invalid}
                                        id="task-priority"
                                    >
                                        <SelectValue
                                            placeholder={t(
                                                "tasksTranslations.form.placeholders.priority",
                                            )}
                                        />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {taskPriorityValues.map((value) => (
                                            <SelectItem key={value} value={value}>
                                                {t("tasksTranslations.priorityValues", {
                                                    priority: value,
                                                })}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />
                </div>

                <Controller
                    control={form.control}
                    name="assignee"
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="task-assignee">
                                {t("tasksTranslations.form.labels.assignee")}
                            </FieldLabel>
                            <Input
                                {...field}
                                aria-invalid={fieldState.invalid}
                                autoComplete="off"
                                id="task-assignee"
                                placeholder={t("tasksTranslations.form.placeholders.assignee")}
                            />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />

                <Controller
                    control={form.control}
                    name="dueDate"
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="task-due-date">
                                {t("tasksTranslations.form.labels.dueDate")}
                            </FieldLabel>
                            <SelectDateField
                                disabled={field.disabled}
                                mode="single"
                                setValue={(value) => {
                                    field.onChange(
                                        value instanceof Date
                                            ? value.toISOString().slice(0, 10)
                                            : "",
                                    );
                                }}
                                value={field.value ? new Date(field.value) : undefined}
                            />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />

                <div className="grid gap-4 sm:grid-cols-2">
                    <Controller
                        control={form.control}
                        name="estimatedHours"
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="task-estimated-hours">
                                    {t("tasksTranslations.form.labels.estimatedHours")}
                                </FieldLabel>
                                <Input
                                    aria-invalid={fieldState.invalid}
                                    id="task-estimated-hours"
                                    min={0}
                                    onChange={(e) =>
                                        field.onChange(
                                            e.currentTarget.value === ""
                                                ? 0
                                                : e.currentTarget.valueAsNumber,
                                        )
                                    }
                                    step={1}
                                    type="number"
                                    value={String(field.value ?? 0)}
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />

                    <Controller
                        control={form.control}
                        name="completedPercentage"
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="task-completed">
                                    {t("tasksTranslations.form.labels.completedPercentage")}
                                </FieldLabel>
                                <Input
                                    aria-invalid={fieldState.invalid}
                                    id="task-completed"
                                    max={100}
                                    min={0}
                                    onChange={(e) =>
                                        field.onChange(
                                            e.currentTarget.value === ""
                                                ? 0
                                                : e.currentTarget.valueAsNumber,
                                        )
                                    }
                                    step={1}
                                    type="number"
                                    value={String(field.value ?? 0)}
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />
                </div>

                <div className="flex justify-end gap-2">
                    <Button
                        disabled={isPending}
                        onClick={() => setIsOpen?.(false)}
                        type="button"
                        variant="outline"
                    >
                        {t("common.cancel")}
                    </Button>
                    <Button disabled={isPending} type="submit">
                        {isPending
                            ? t("tasksTranslations.form.buttons.creating")
                            : t("common.create")}
                    </Button>
                </div>
            </FieldGroup>
        </form>
    );
}
