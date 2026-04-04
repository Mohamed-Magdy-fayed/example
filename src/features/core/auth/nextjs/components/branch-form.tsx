"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldSet,
} from "@/components/ui/field";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import {
    createBranchAction,
    updateBranchAction,
} from "@/features/core/auth/nextjs/actions";
import { createBranchSchema } from "@/features/core/auth/schemas";
import { useTranslation } from "@/features/core/i18n/useTranslation";
import { cn } from "@/lib/utils";

type FormValues = z.infer<typeof createBranchSchema>;
type BranchFormProps = {
    onSuccess?: () => void;
    branch?: { id: string; nameEn: string; nameAr: string };
};

export function BranchForm({
    onSuccess,
    branch,
}: BranchFormProps) {
    const { t } = useTranslation();
    const [isPending, startTransition] = useTransition();

    const defaultValues: FormValues = useMemo(
        () => ({
            nameEn: branch?.nameEn ?? "",
            nameAr: branch?.nameAr ?? "",
        }),
        [branch],
    );

    const form = useForm<FormValues>({
        resolver: zodResolver(createBranchSchema),
        defaultValues,
    });

    useEffect(() => {
        form.reset(defaultValues);
    }, [defaultValues, form]);

    const { errors } = form.formState;

    const isEdit = branch != null;

    const onSubmit = form.handleSubmit((values) => {
        startTransition(async () => {
            const result = isEdit
                ? await updateBranchAction({
                    ...values,
                    branchId: branch.id,
                })
                : await createBranchAction(values);

            if (result.isError) {
                toast.error(result.message);
                return;
            }

            if (!isEdit) {
                form.reset(defaultValues);
            }

            toast.success(
                t(
                    isEdit
                        ? "authTranslations.branch.actions.updateBranch.success"
                        : "authTranslations.branch.actions.createBranch.success",
                ),
            );
            onSuccess?.();
        });
    });

    return (
        <form className={cn("space-y-6")} onSubmit={onSubmit}>
            <FieldSet disabled={isPending}>
                <FieldGroup>
                    <Field>
                        <FieldLabel htmlFor="nameEn">
                            {t("authTranslations.branch.create.nameLabel")} (EN)
                        </FieldLabel>
                        <InputGroup>
                            <InputGroupInput
                                aria-invalid={!!errors.nameEn}
                                autoComplete="branch"
                                id="nameEn"
                                placeholder={t("authTranslations.branch.create.namePlaceholder")}
                                {...form.register("nameEn")}
                            />
                        </InputGroup>
                        <FieldError errors={[errors.nameEn]} />
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="nameAr">
                            {t("authTranslations.branch.create.nameLabel")} (AR)
                        </FieldLabel>
                        <InputGroup>
                            <InputGroupInput
                                aria-invalid={!!errors.nameAr}
                                autoComplete="branch"
                                id="nameAr"
                                placeholder={t("authTranslations.branch.create.namePlaceholder")}
                                {...form.register("nameAr")}
                            />
                        </InputGroup>
                        <FieldError errors={[errors.nameAr]} />
                    </Field>
                </FieldGroup>
                <ButtonGroup className="justify-start">
                    <Button type="submit">
                        {isPending
                            ? t(
                                isEdit
                                    ? "authTranslations.branch.edit.submitting"
                                    : "authTranslations.branch.create.submitting",
                            )
                            : t(
                                isEdit
                                    ? "authTranslations.branch.edit.submit"
                                    : "authTranslations.branch.create.submit",
                            )}
                    </Button>
                </ButtonGroup>
            </FieldSet>
        </form>
    );
}
