import z from "zod";
import { translationKey } from "@/features/core/i18n/global";

export const contactReasons = [
    "demo",
    "pricing",
    "support",
    "partnership",
    "other",
] as const;

export const contactFormSchema = z.object({
    name: z
        .string()
        .min(1, translationKey("contact.form.fields.name.error.required")),
    email: z.email(translationKey("contact.form.fields.email.error.invalid")),
    company: z.string().optional(),
    phone: z.string().optional(),
    contactReason: z.enum(contactReasons).default("other").optional(),
    subject: z
        .string()
        .min(1, translationKey("contact.form.fields.subject.error.required")),
    message: z
        .string()
        .min(1, translationKey("contact.form.fields.message.error.required")),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
