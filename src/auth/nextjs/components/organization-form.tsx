"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

import {
    createOrganizationAction,
    updateOrganizationAction,
} from "@/auth/nextjs/actions";
import { createOrganizationSchema } from "@/auth/schemas";
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
import { useTranslation } from "@/lib/i18n/useTranslation";
import { cn } from "@/lib/utils";

type FormValues = z.infer<typeof createOrganizationSchema>;
type OrganizationFormProps = {
    onSuccess?: () => void;
    organization?: { id: string; nameEn: string; nameAr: string };
};

export function OrganizationForm({ onSuccess, organization }: OrganizationFormProps) {
    const { t } = useTranslation();
    const [isPending, startTransition] = useTransition();

    const defaultValues: FormValues = useMemo(
        () => ({
            nameEn: organization?.nameEn ?? "",
            nameAr: organization?.nameAr ?? "",
        }),
        [organization],
    );

    const form = useForm<FormValues>({
        resolver: zodResolver(createOrganizationSchema),
        defaultValues,
    });

    useEffect(() => {
        form.reset(defaultValues);
    }, [defaultValues, form]);

    const { errors } = form.formState;

    const isEdit = organization != null;

    const onSubmit = form.handleSubmit((values) => {
        startTransition(async () => {
            const result = isEdit
                ? await updateOrganizationAction({
                    ...values,
                    organizationId: organization.id,
                })
                : await createOrganizationAction(values);

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
                        ? "authTranslations.org.actions.updateOrganization.success"
                        : "authTranslations.org.actions.createOrganization.success",
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
                            {t("authTranslations.org.create.nameLabel")} (EN)
                        </FieldLabel>
                        <InputGroup>
                            <InputGroupInput
                                aria-invalid={!!errors.nameEn}
                                autoComplete="organization"
                                id="nameEn"
                                placeholder={t("authTranslations.org.create.namePlaceholder")}
                                {...form.register("nameEn")}
                            />
                        </InputGroup>
                        <FieldError errors={[errors.nameEn]} />
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="nameAr">
                            {t("authTranslations.org.create.nameLabel")} (AR)
                        </FieldLabel>
                        <InputGroup>
                            <InputGroupInput
                                aria-invalid={!!errors.nameAr}
                                autoComplete="organization"
                                id="nameAr"
                                placeholder={t("authTranslations.org.create.namePlaceholder")}
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
                                    ? "authTranslations.org.edit.submitting"
                                    : "authTranslations.org.create.submitting",
                            )
                            : t(
                                isEdit
                                    ? "authTranslations.org.edit.submit"
                                    : "authTranslations.org.create.submit",
                            )}
                    </Button>
                </ButtonGroup>
            </FieldSet>
        </form>
    );
}
