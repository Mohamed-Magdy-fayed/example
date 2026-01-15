"use client";

import { useCallback, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type z from "zod";
import { updateProfileNameAction } from "@/auth/nextjs/actions";
import { useAuth } from "@/auth/nextjs/components/auth-provider";
import type { updateProfileSchema } from "@/auth/schemas";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldSet,
} from "@/components/ui/field";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { useTranslation } from "@/lib/i18n/useTranslation";

type FormValues = z.infer<typeof updateProfileSchema>;

export function ProfileForm({ callback }: { callback?: () => void }) {
    const { t } = useTranslation();
    const [isPending, startTransition] = useTransition();

    const { session } = useAuth();

    const form = useForm<FormValues>({
        defaultValues: {
            name: session?.user.name || "",
            phone: session?.user.phone || "",
        },
    });

    const { errors } = form.formState;

    const onSubmit = useCallback(
        (values: FormValues) => {
            startTransition(async () => {
                const res = await updateProfileNameAction(values);
                if (res.isError) {
                    toast.error(res.message);
                    return;
                }

                toast.success(t("authTranslations.profile.form.submit"));
                callback?.();
            });
        },
        [t, callback],
    );

    return (
        <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldSet disabled={isPending}>
                <FieldGroup>
                    <Field>
                        <FieldLabel htmlFor="name">
                            {t("authTranslations.profile.name.label")}
                        </FieldLabel>
                        <InputGroup>
                            <InputGroupInput
                                aria-invalid={!!errors.name}
                                id="name"
                                placeholder={t("authTranslations.profile.name.placeholder")}
                                {...form.register("name")}
                            />
                        </InputGroup>
                        <FieldError errors={[errors.name]} />
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="phone">
                            {t("authTranslations.profile.phone.label")}
                        </FieldLabel>
                        <InputGroup>
                            <InputGroupInput
                                aria-invalid={!!errors.phone}
                                id="phone"
                                placeholder={t("authTranslations.profile.phone.placeholder")}
                                {...form.register("phone")}
                            />
                        </InputGroup>
                        <FieldError errors={[errors.phone]} />
                    </Field>
                </FieldGroup>
                <ButtonGroup className="justify-end">
                    <Button disabled={isPending} type="submit">
                        {isPending
                            ? t("authTranslations.profile.form.saving")
                            : t("authTranslations.profile.form.submit")}
                    </Button>
                </ButtonGroup>
            </FieldSet>
        </form>
    );
}
