"use client";

import { CheckIcon, XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";
import { z } from "zod";
import { useAppForm } from "@/components/forms/hooks";
import { Button } from "@/components/ui/button";
import { FieldGroup, FieldSet } from "@/components/ui/field";
import type { LookupItem } from "@/components/ui/search-lookup";
import type { User } from "@/drizzle/schema";
import { useTranslation } from "@/features/core/i18n/useTranslation";
import {
    createEmployeeAction,
    searchBranchesAction,
    updateEmployeeAction,
} from "@/features/users/actions";

interface UsersFormProps {
    setIsOpen?: (open: boolean) => void;
    initialValues?: Partial<User> & { branchIds: string[] };
}

export function UsersForm({ setIsOpen, initialValues }: UsersFormProps) {
    const router = useRouter();
    const [isPending, startTransition] = React.useTransition();
    const { t } = useTranslation();
    const isStandaloneCreate = !initialValues?.id && !setIsOpen;
    const [branchSearch, setBranchSearch] = React.useState("");
    const [branchResults, setBranchResults] = React.useState<
        Array<{ id: string; nameEn: string; nameAr: string }>
    >([]);
    const [branchLoading, setBranchLoading] = React.useState(false);

    React.useEffect(() => {
        const query = branchSearch.trim();

        let cancelled = false;
        const timer = setTimeout(async () => {
            setBranchLoading(true);
            const result = await searchBranchesAction({ query });
            if (cancelled) return;

            if (result.isError) {
                setBranchResults([]);
                setBranchLoading(false);
                return;
            }

            setBranchResults(result.data);
            setBranchLoading(false);
        }, 250);

        return () => {
            cancelled = true;
            clearTimeout(timer);
        };
    }, [branchSearch]);

    const branchItems: LookupItem[] = React.useMemo(
        () =>
            branchResults?.map(
                (branch: { id: string; nameEn: string; nameAr: string }) => ({
                    value: branch.id,
                    label: branch.nameEn,
                    description: branch.nameAr,
                }),
            ) ?? [],
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
                        const result = await updateEmployeeAction({
                            id: initialValues.id,
                            data: value,
                        });

                        if (result.isError) {
                            toast.error(result.message);
                            return;
                        }
                    } else {
                        const result = await createEmployeeAction(value);
                        if (result.isError) {
                            toast.error(result.message);
                            return;
                        }
                    }

                    toast.success(
                        t("employeeTranslations.actions.success", {
                            action: initialValues ? "update" : "create",
                            length: 1,
                        }),
                    );

                    if (isStandaloneCreate) {
                        form.reset();
                        setBranchSearch("");
                        setBranchResults([]);
                    } else {
                        setIsOpen?.(false);
                    }

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
                                    placeholder={t(
                                        "employeeTranslations.columns.name.placeholder",
                                    )}
                                />
                            )}
                        </form.AppField>

                        <form.AppField name="phone">
                            {(field) => (
                                <field.MobileField
                                    label={t("employeeTranslations.columns.phone.label")}
                                    placeholder={t(
                                        "employeeTranslations.columns.phone.placeholder",
                                    )}
                                />
                            )}
                        </form.AppField>
                    </div>

                    <form.AppField name="email">
                        {(field) => (
                            <field.EmailField
                                label={t("employeeTranslations.columns.email.label")}
                                placeholder={t(
                                    "employeeTranslations.columns.email.placeholder",
                                )}
                            />
                        )}
                    </form.AppField>

                    <form.AppField name="branchIds">
                        {(field) => (
                            <field.SearchLookupField
                                items={branchItems}
                                label={t("employeeTranslations.columns.branch.label")}
                                loading={branchLoading}
                                minChars={0}
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
                                placeholder={t(
                                    "employeeTranslations.columns.salary.placeholder",
                                )}
                            />
                        )}
                    </form.AppField>

                    <div className="flex justify-end gap-2">
                        <Button
                            disabled={isPending}
                            onClick={() => {
                                if (setIsOpen) {
                                    setIsOpen(false);
                                    return;
                                }

                                form.reset();
                                setBranchSearch("");
                                setBranchResults([]);
                            }}
                            type="button"
                            variant="destructive"
                        >
                            <XIcon />
                            {t("common.cancel")}
                        </Button>
                        <Button className="flex-1" disabled={isPending} type="submit">
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
