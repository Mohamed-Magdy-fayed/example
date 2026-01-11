"use server";

import { and, eq, sql } from "drizzle-orm";
import { z } from "zod";

import {
    type OAuthProvider,
    oAuthProviderValues,
    UserCredentialsTable,
    UserOAuthAccountsTable,
} from "@/auth/tables";
import type { OAuthConnection, TypedResponse } from "@/auth/types";
import { getT } from "@/lib/i18n/actions";
import { db } from "@/server/db";

const userIdSchema = z.uuid();
const providerSchema = z.enum(oAuthProviderValues);

export async function listOAuthConnectionsAction(
    userIdRaw: z.infer<typeof userIdSchema>,
): Promise<TypedResponse<{ data: OAuthConnection[] }>> {
    const { t } = await getT();
    const parsed = userIdSchema.safeParse(userIdRaw);
    if (!parsed.success) {
        return {
            isError: true,
            message: t("authTranslations.error.badRequest"),
        };
    }

    const userId = parsed.data;
    const accounts = await db.query.UserOAuthAccountsTable.findMany({
        columns: { provider: true, providerAccountId: true, createdAt: true },
        where: eq(UserOAuthAccountsTable.userId, userId),
    });

    const connectedMap = new Map<OAuthProvider, (typeof accounts)[number]>();
    for (const account of accounts) connectedMap.set(account.provider, account);

    const providerSet = new Set<OAuthProvider>(oAuthProviderValues);
    for (const account of accounts) providerSet.add(account.provider);

    const result: OAuthConnection[] = Array.from(providerSet).map((provider) => ({
        provider,
        displayName: provider,
        connected: connectedMap.has(provider),
        connectedAt: connectedMap.get(provider)?.createdAt ?? null,
    }));

    return { isError: false, data: result };
}

const disconnectOAuthAccountInputSchema = z.object({
    userId: userIdSchema,
    provider: providerSchema,
});
export async function disconnectOAuthAccountAction(
    rawInput: z.infer<typeof disconnectOAuthAccountInputSchema>,
): Promise<TypedResponse<{ disconnected: true }>> {
    const { t } = await getT();
    const parsed = disconnectOAuthAccountInputSchema.safeParse(rawInput);

    if (!parsed.success) {
        return {
            isError: true,
            message: t("authTranslations.error.badRequest"),
        };
    }

    const { userId, provider } = parsed.data;

    const account = await db.query.UserOAuthAccountsTable.findFirst({
        columns: { providerAccountId: true },
        where: and(
            eq(UserOAuthAccountsTable.userId, userId),
            eq(UserOAuthAccountsTable.provider, provider),
        ),
    });

    if (!account) {
        return {
            isError: true,
            message: t("authTranslations.oauth.connections.notLinked"),
        };
    }

    const [credentialCountRows, providerCountRows] = await Promise.all([
        db
            .select({ count: sql<number>`count(1)::int` })
            .from(UserCredentialsTable)
            .where(eq(UserCredentialsTable.userId, userId)),
        db
            .select({ count: sql<number>`count(1)::int` })
            .from(UserOAuthAccountsTable)
            .where(eq(UserOAuthAccountsTable.userId, userId)),
    ]);

    const hasPassword = Number(credentialCountRows[0]?.count ?? 0) > 0;
    const totalProviders = Number(providerCountRows[0]?.count ?? 0);

    if (!hasPassword && totalProviders <= 1) {
        return {
            isError: true,
            message: t("authTranslations.oauth.connections.onlyMethod"),
        };
    }

    await db
        .delete(UserOAuthAccountsTable)
        .where(
            and(
                eq(UserOAuthAccountsTable.userId, userId),
                eq(UserOAuthAccountsTable.provider, provider),
            ),
        );

    return { isError: false, disconnected: true };
}
