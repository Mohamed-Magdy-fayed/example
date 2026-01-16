"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { requestPasswordResetAction } from "@/auth/nextjs/actions";
import { passwordResetRequestSchema } from "@/auth/schemas";
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

type FormValues = z.infer<typeof passwordResetRequestSchema>;

export function ForgotPasswordForm() {
    const router = useRouter();
    const { t } = useTranslation();
    const [isPending, startTransition] = useTransition();

    const form = useForm<FormValues>({
        resolver: zodResolver(passwordResetRequestSchema),
        defaultValues: { email: "" },
    });

    const { errors } = form.formState;

    function onSubmit(values: FormValues) {
        startTransition(async () => {
            const res = await requestPasswordResetAction(values);
            if (res.isError) {
                toast.error(res.message || "");
                return;
            }

            toast.success(t("authTranslations.passwordReset.request.success"));
            router.push(`/reset-password`);
        })
    }

    return (
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
                <Field>
                    <FieldLabel htmlFor="email">
                        {t("authTranslations.passwordReset.emailLabel")}
                    </FieldLabel>
                    <InputGroup>
                        <InputGroupInput
                            aria-invalid={!!errors.email}
                            autoComplete="email"
                            id="email"
                            type="email"
                            {...form.register("email")}
                        />
                    </InputGroup>
                    <FieldError errors={[errors.email]} />
                </Field>
            </FieldGroup>
            <ButtonGroup className="w-full justify-end">
                <Button
                    className="w-full"
                    disabled={isPending}
                    type="submit"
                >
                    {isPending
                        ? t("authTranslations.passwordReset.submitting")
                        : t("authTranslations.passwordReset.submit")}
                </Button>
            </ButtonGroup>
        </form>
    );
}
