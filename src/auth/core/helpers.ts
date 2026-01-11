import { DrizzleError } from "drizzle-orm";

import type { TypedResponse } from "@/auth/types";

export function normalizeEmail(email: string) {
    return email.trim().toLowerCase();
}

export function authError(error: unknown): TypedResponse<never> {
    const message =
        error instanceof Error
            ? error.message
            : error instanceof DrizzleError
                ? error.message
                : "Unknown error";

    return { isError: true, message };
}

export function formDataToObject(formData: FormData) {
    return Object.fromEntries(
        Array.from(formData.entries()).map(([key, value]) => [
            key,
            typeof value === "string" ? value : value.name,
        ]),
    );
}
