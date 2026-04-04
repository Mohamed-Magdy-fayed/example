"use server";

import type { ActionReturnType } from "@/components/ui/action-button";
import { db } from "@/server/db";
import { subscribersTable } from "@/server/db/schema";

export async function subscribeToNewsletter(email: string): ActionReturnType {
    try {
        await db
            .insert(subscribersTable)
            .values({ email })
            .onConflictDoNothing()
            .returning()
            .then((r) => r[0]);

        return {
            error: false,
            message: "Subscribed successfully",
        }
    } catch (error) {
        return {
            error: true,
            message: `Failed to subscribe ${error}`,
        };
    }
}