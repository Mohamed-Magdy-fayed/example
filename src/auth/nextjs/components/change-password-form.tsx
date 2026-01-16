"use client";

import { useCallback, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import {
    changePasswordAction,
    createPasswordAction,
} from "@/auth/nextjs/actions";
import type {
    changePasswordSchema,
    createPasswordSchema,
} from "@/auth/schemas";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { useTranslation } from "@/lib/i18n/useTranslation";

export function ChangePasswordForm({ isCreate, callback }: { isCreate?: boolean, callback?: () => void }) {
    type FormValues = typeof isCreate extends true
        ? z.infer<typeof createPasswordSchema>
        : z.infer<typeof changePasswordSchema>;

    const { t } = useTranslation();
    const [isPending, startTransition] = useTransition();

    const form = useForm<FormValues>({
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
    });

    const { errors } = form.formState;

    const onSubmit = useCallback(
        (values: FormValues) => startTransition(async () => {
            if (isCreate) {
                const res = await createPasswordAction(values);
                if (res.isError) {
                    toast.error(res.message);
                    return;
                }
                toast.success(t("authTranslations.profile.password.submit"));
            } else {
                const res = await changePasswordAction(values);
                if (res.isError) {
                    toast.error(res.message);
                    return;
                }
                toast.success(t("authTranslations.profile.password.submit"));
            }

            callback?.();
        }),
        [isCreate, t, callback],
    );

    return (
        <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
                {!isCreate && (
                    <Field>
                        <FieldLabel htmlFor="currentPassword">
                            {t("authTranslations.profile.password.currentLabel")}
                        </FieldLabel>
                        <InputGroup>
                            <InputGroupInput
                                aria-invalid={!!errors.currentPassword}
                                autoComplete="current-password"
                                id="currentPassword"
                                type="password"
                                {...form.register("currentPassword")}
                            />
                        </InputGroup>
                        <FieldError errors={[errors.currentPassword]} />
                    </Field>
                )}
                <Field>
                    <FieldLabel htmlFor="newPassword">
                        {t("authTranslations.profile.password.newLabel")}
                    </FieldLabel>
                    <InputGroup>
                        <InputGroupInput
                            aria-invalid={!!errors.newPassword}
                            autoComplete="new-password"
                            id="newPassword"
                            type="password"
                            {...form.register("newPassword")}
                        />
                    </InputGroup>
                    <FieldError errors={[errors.newPassword]} />
                </Field>
                <Field>
                    <FieldLabel htmlFor="confirmPassword">
                        {t("authTranslations.profile.password.confirmLabel")}
                    </FieldLabel>
                    <InputGroup>
                        <InputGroupInput
                            aria-invalid={!!errors.confirmPassword}
                            autoComplete="new-password"
                            id="confirmPassword"
                            type="password"
                            {...form.register("confirmPassword")}
                        />
                    </InputGroup>
                    <FieldError errors={[errors.confirmPassword]} />
                </Field>
            </FieldGroup>
            <ButtonGroup className="justify-end">
                <Button
                    disabled={isPending}
                    type="submit"
                >
                    {isPending
                        ? t("authTranslations.profile.password.updating")
                        : t("authTranslations.profile.password.submit")}
                </Button>
            </ButtonGroup>
        </form>
    );
}
