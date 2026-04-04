"use client";

import { useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";
import { z } from "zod";

import { useAppForm } from "@/components/forms/hooks";
import { Button } from "@/components/ui/button";
import { FieldGroup, FieldSet } from "@/components/ui/field";
import type { LookupItem } from "@/components/ui/search-lookup";
import { useTranslation } from "@/features/core/i18n/useTranslation";
import { type User, type UserRole, userRoleValues } from "@/server/db/schema";
import { api } from "@/trpc/react";
import { CheckIcon, XIcon } from "lucide-react";

interface UsersFormProps {
    setIsOpen?: (open: boolean) => void;
    initialValues?: Partial<User> & { branchIds: string[] };
}

export function UsersForm({ setIsOpen, initialValues }: UsersFormProps) {
    const router = useRouter();
    const [isPending, startTransition] = React.useTransition();
    const { t } = useTranslation();
    const [branchSearch, setBranchSearch] = React.useState("");

    const createUserMutation = api.users.create.useMutation();
    const updateUserMutation = api.users.update.useMutation();

    const { data: branchResults, isLoading: branchLoading } =
        api.root.branch.searchBranches.useQuery(
            { query: branchSearch },
            { enabled: branchSearch.length >= 1 },
        );

    const branchItems: LookupItem[] = React.useMemo(
        () =>
            branchResults?.map((branch) => ({
                value: branch.id,
                label: branch.nameEn,
                description: branch.nameAr,
            })) ?? [],
        [branchResults],
    );

    const userFormSchema = React.useMemo(
        () =>
            z.object({
                name: z
                    .string()
                    .min(1, t("employeeTranslations.form.validation.nameRequired")),
                email: z
                    .email()
                    .min(1, t("employeeTranslations.form.validation.emailRequired")),
                phone: z.string(),
                branchIds: z.array(z.uuid()),
                role: z.enum(userRoleValues),
                lastSignInAt: z.date(),
                salary: z.number(),
            }),
        [t],
    );
    type UserFormValues = z.infer<typeof userFormSchema>;

    const form = useAppForm({
        defaultValues: {
            name: initialValues?.name ?? "",
            email: initialValues?.email ?? "",
            phone: initialValues?.phone ?? "",
            branchIds: initialValues?.branchIds ?? [],
            role: initialValues?.role ?? "employee",
            lastSignInAt: initialValues?.lastSignInAt ?? new Date(),
            salary: initialValues?.salary ?? 0,
        } satisfies UserFormValues as UserFormValues,
        validators: {
            onSubmit: userFormSchema,
        },
        onSubmit: async ({ value }) => {
            startTransition(async () => {
                try {
                    if (initialValues?.id) {
                        await updateUserMutation.mutateAsync({
                            id: initialValues.id,
                            data: value,
                        });
                    } else {
                        await createUserMutation.mutateAsync(value);
                    }

                    toast.success(
                        t("employeeTranslations.actions.success", {
                            action: initialValues ? "update" : "create",
                            length: 1,
                        }),
                    );
                    form.reset();
                    setIsOpen?.(false);
                    router.refresh();
                } catch (error) {
                    toast.error(
                        error instanceof Error
                            ? error.message
                            : t("employeeTranslations.actions.error", {
                                action: initialValues ? "update" : "create",
                            }),
                    );
                }
            });
        },
    });

    return (
        <form
            className="pt-6"
            onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit();
            }}
        >
            <FieldSet disabled={isPending}>
                <FieldGroup>
                    <div className="grid gap-4">
                        <form.AppField name="name">
                            {(field) => (
                                <field.StringField
                                    label={t("employeeTranslations.columns.name.label")}
                                    placeholder={t("employeeTranslations.columns.name.placeholder")}
                                />
                            )}
                        </form.AppField>

                        <form.AppField name="phone">
                            {(field) => (
                                <field.MobileField
                                    label={t("employeeTranslations.columns.phone.label")}
                                    placeholder={t("employeeTranslations.columns.phone.placeholder")}
                                />
                            )}
                        </form.AppField>
                    </div>

                    <form.AppField name="email">
                        {(field) => (
                            <field.EmailField
                                label={t("employeeTranslations.columns.email.label")}
                                placeholder={t("employeeTranslations.columns.email.placeholder")}
                            />
                        )}
                    </form.AppField>

                    <form.AppField name="role">
                        {(field) => (
                            <field.SelectField
                                label={t("employeeTranslations.columns.role.label")}
                                options={userRoleValues.map((role) => ({
                                    value: role,
                                    label: t("employeeTranslations.columns.role.filterValues", {
                                        role,
                                    }),
                                }))}
                                placeholder={t("employeeTranslations.columns.role.placeholder")}
                            />
                        )}
                    </form.AppField>

                    <form.AppField name="branchIds">
                        {(field) => (
                            <field.SearchLookupField
                                items={branchItems}
                                label={t("employeeTranslations.columns.branch.label")}
                                loading={branchLoading}
                                minChars={1}
                                multiple
                                onSearch={setBranchSearch}
                                placeholder={t(
                                    "employeeTranslations.columns.branch.placeholder",
                                )}
                            />
                        )}
                    </form.AppField>

                    <form.AppField name="lastSignInAt">
                        {(field) => (
                            <field.DateField
                                label={t("employeeTranslations.columns.lastSignInAt.label")}
                                mode="single"
                            />
                        )}
                    </form.AppField>

                    <form.AppField name="salary">
                        {(field) => (
                            <field.NumberField
                                label={t("employeeTranslations.columns.salary.label")}
                                placeholder={t("employeeTranslations.columns.salary.placeholder")}
                            />
                        )}
                    </form.AppField>

                    <div className="flex justify-end gap-2">
                        <Button
                            disabled={isPending}
                            onClick={() => setIsOpen?.(false)}
                            type="button"
                            variant="destructive"
                        >
                            <XIcon />
                            {t("common.cancel")}
                        </Button>
                        <Button disabled={isPending} type="submit" className="flex-1">
                            <CheckIcon />
                            {isPending
                                ? initialValues
                                    ? t("employeeTranslations.form.submitButton.loadingUpdate")
                                    : t("employeeTranslations.form.submitButton.loadingCreate")
                                : initialValues
                                    ? t("employeeTranslations.form.submitButton.update")
                                    : t("employeeTranslations.form.submitButton.create")}
                        </Button>
                    </div>
                </FieldGroup>
            </FieldSet>
        </form>
    );
}
