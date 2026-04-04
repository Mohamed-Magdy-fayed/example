"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

import { useAppForm } from "@/components/forms/hooks";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { resetPasswordAction } from "@/features/core/auth/nextjs/actions";
import { passwordResetSubmissionSchema } from "@/features/core/auth/schemas";
import { useTranslation } from "@/features/core/i18n/useTranslation";
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from "@/components/ui/input-otp";
import { FieldSet } from "@/components/ui/field";
import { BackLink } from "@/components/general/back-link";
import { Spinner } from "@/components/ui/spinner";
import { SaveIcon } from "lucide-react";
import { LoadingSwap } from "@/components/ui/loading-swap";

export function ResetPasswordForm({
    initialPhone = "",
}: {
    initialPhone?: string;
}) {
    const { t } = useTranslation();
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const form = useAppForm({
        defaultValues: { phone: initialPhone, otp: "", password: "" },
        validators: { onSubmit: passwordResetSubmissionSchema },
        onSubmit: async ({ value }) => {
            startTransition(async () => {
                const res = await resetPasswordAction(value);
                if (res.isError) {
                    toast.error(res.message);
                    return;
                }

                toast.success(t("authTranslations.passwordReset.reset.success"));
                router.push(`/sign-in`);
            });
        },
    });

    return (
        <form className="space-y-6" onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
        }}>
            <FieldSet disabled={isPending}>
                <form.AppField name="phone">
                    {(field) => (
                        <field.MobileField
                            autoFocus
                            label={t("authTranslations.signIn.phoneLabel")}
                            placeholder="012 3456789"
                        />
                    )}
                </form.AppField>

                <div dir="ltr">
                    <form.AppField name="otp">
                        {(field) => (
                            <InputOTP
                                autoFocus
                                containerClassName="justify-center"
                                disabled={isPending}
                                maxLength={6}
                                onChange={(val) => field.handleChange(val)}
                                value={field.state.value}
                            >
                                <InputOTPGroup>
                                    <InputOTPSlot index={0} />
                                    <InputOTPSlot index={1} />
                                    <InputOTPSlot index={2} />
                                </InputOTPGroup>
                                <InputOTPSeparator />
                                <InputOTPGroup>
                                    <InputOTPSlot index={3} />
                                    <InputOTPSlot index={4} />
                                    <InputOTPSlot index={5} />
                                </InputOTPGroup>
                            </InputOTP>
                        )}
                    </form.AppField>
                </div>

                <form.AppField name="password">
                    {(field) => (
                        <field.PasswordField
                            label={t(
                                "authTranslations.passwordReset.newPasswordLabel",
                            )}
                            placeholder={t("authTranslations.passwordPlaceholder")}
                        />
                    )}
                </form.AppField>
            </FieldSet>
            <ButtonGroup>
                <BackLink variant={"outline"} href="/forgot-password" />
                <Button disabled={isPending} type="submit">
                    <LoadingSwap isLoading={isPending}>
                        <SaveIcon />
                        {t("authTranslations.passwordReset.reset.submit")}
                    </LoadingSwap>
                </Button>
            </ButtonGroup>
        </form>
    );
}
