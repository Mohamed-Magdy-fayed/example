"use client";

import { SendIcon } from "lucide-react";
import { toast } from "sonner";

import {
    FormBase,
    type FormFieldProps,
    useAppForm,
    useFieldContext,
} from "@/components/forms";
import { Button } from "@/components/ui/button";
import { FieldGroup, FieldSet } from "@/components/ui/field";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "@/features/core/i18n/useTranslation";
import {
    type ContactFormData,
    contactFormSchema,
} from "@/server/db/schemas/customer/messages-table";
import { api } from "@/trpc/react";

function FormTextareaField({
    placeholder,
    rows = 5,
    autoFocus,
    ...props
}: FormFieldProps & {
    placeholder?: string;
    rows?: number;
}) {
    const field = useFieldContext<string>();
    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

    return (
        <FormBase {...props}>
            <Textarea
                aria-invalid={isInvalid}
                autoFocus={autoFocus}
                id={field.name}
                name={field.name}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder={placeholder}
                rows={rows}
                value={field.state.value}
            />
        </FormBase>
    );
}

export default function ContactForm() {
    const { t } = useTranslation();

    const sendMessageMutation = api.contactRouter.sendMessage.useMutation();

    const form = useAppForm({
        defaultValues: {
            name: "",
            email: "",
            company: "",
            message: "",
            phone: "",
            contactReason: "other",
            subject: "",
        } satisfies ContactFormData as ContactFormData,
        validators: {
            onSubmit: contactFormSchema,
        },
        onSubmit: async ({ value }) => {
            try {
                const payload = {
                    ...value,
                    contactReason: value.contactReason || "other",
                } satisfies ContactFormData as ContactFormData;

                const isSuccess = await sendMessageMutation.mutateAsync(payload);

                if (isSuccess) {
                    form.reset();
                    toast.success(t("contact.form.success"));
                } else {
                    toast.error(t("contact.form.error"));
                }
            } catch (error) {
                toast.error(
                    error instanceof Error ? error.message : t("contact.form.error"),
                );
            }
        },
    });

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit();
            }}
        >
            <FieldSet disabled={sendMessageMutation.isPending} className="gap-6">
                <FieldGroup>
                    <div className="grid md:grid-cols-2 gap-4">
                        <form.AppField name="name">
                            {(field) => (
                                <field.StringField
                                    autoFocus
                                    label={t("contact.form.fields.name.label")}
                                    placeholder={t("contact.form.fields.name.placeholder")}
                                />
                            )}
                        </form.AppField>
                        <form.AppField name="email">
                            {(field) => (
                                <field.EmailField
                                    label={t("contact.form.fields.email.label")}
                                    placeholder={t("contact.form.fields.email.placeholder")}
                                />
                            )}
                        </form.AppField>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <form.AppField name="company">
                            {(field) => (
                                <field.StringField
                                    label={t("contact.form.fields.company.label")}
                                    placeholder={t("contact.form.fields.company.placeholder")}
                                />
                            )}
                        </form.AppField>
                        <form.AppField name="phone">
                            {(field) => (
                                <field.MobileField
                                    label={t("contact.form.fields.phone.label")}
                                    placeholder={t("contact.form.fields.phone.placeholder")}
                                />
                            )}
                        </form.AppField>
                    </div>

                    <form.AppField name="contactReason">
                        {(field) => (
                            <field.SelectField
                                label={t("contact.form.fields.reason.label")}
                                options={[
                                    {
                                        value: "demo",
                                        label: t("contact.form.fields.reason.options.demo"),
                                    },
                                    {
                                        value: "pricing",
                                        label: t("contact.form.fields.reason.options.pricing"),
                                    },
                                    {
                                        value: "support",
                                        label: t("contact.form.fields.reason.options.support"),
                                    },
                                    {
                                        value: "partnership",
                                        label: t(
                                            "contact.form.fields.reason.options.partnership",
                                        ),
                                    },
                                    {
                                        value: "other",
                                        label: t("contact.form.fields.reason.options.other"),
                                    },
                                ]}
                                placeholder={t(
                                    "contact.form.fields.reason.placeholder",
                                )}
                            />
                        )}
                    </form.AppField>

                    <form.AppField name="subject">
                        {(field) => (
                            <field.StringField
                                label={t("contact.form.fields.subject.label")}
                                placeholder={t("contact.form.fields.subject.placeholder")}
                            />
                        )}
                    </form.AppField>

                    <form.AppField name="message">
                        {() => (
                            <FormTextareaField
                                label={t("contact.form.fields.message.label")}
                                placeholder={t("contact.form.fields.message.placeholder")}
                                rows={5}
                            />
                        )}
                    </form.AppField>

                    <Button
                        type="submit"
                        className="w-full hover:translate-y-0.5 transition-transform duration-300"
                    >
                        <LoadingSwap isLoading={sendMessageMutation.isPending}>
                            <SendIcon />
                            {t("contact.form.submit")}
                        </LoadingSwap>
                    </Button>
                </FieldGroup>
            </FieldSet>
        </form>
    );
}
