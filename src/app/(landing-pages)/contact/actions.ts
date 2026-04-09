"use server";

import type { z } from "zod";
import { db } from "@/drizzle";
import { MessagesTable } from "@/drizzle/schemas/customer/messages-table";
import type { TypedResponse } from "@/features/core/auth/types";
import { getT } from "@/features/core/i18n/actions";
import { contactFormSchema } from "./schema";

export async function sendContactMessageAction(
    rawInput: z.infer<typeof contactFormSchema>,
): Promise<TypedResponse<{ sent: true }>> {
    const { t } = await getT();

    const parsed = contactFormSchema.safeParse(rawInput);
    if (!parsed.success) {
        return {
            isError: true,
            message: t("contact.form.error"),
        };
    }

    try {
        const [message] = await db
            .insert(MessagesTable)
            .values({
                ...parsed.data,
                contactReason: parsed.data.contactReason ?? "other",
            })
            .returning({ id: MessagesTable.id });

        if (!message) {
            return {
                isError: true,
                message: t("contact.form.error"),
            };
        }

        return {
            isError: false,
            sent: true,
        };
    } catch {
        return {
            isError: true,
            message: t("contact.form.error"),
        };
    }
}
