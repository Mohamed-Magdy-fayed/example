"use server";

import { db } from "@/drizzle";
import { subscribersTable } from "@/drizzle/schema";
import type { TypedResponse } from "@/features/core/auth/types";

export async function subscribeToNewsletter(
    email: string,
): Promise<TypedResponse<{ message: string }>> {
    try {
        await db
            .insert(subscribersTable)
            .values({ email })
            .onConflictDoNothing()
            .returning()
            .then((r) => r[0]);

        return {
            isError: false,
            message: "Subscribed successfully",
        };
    } catch (error) {
        return {
            isError: true,
            message: `Failed to subscribe ${error}`,
        };
    }
}