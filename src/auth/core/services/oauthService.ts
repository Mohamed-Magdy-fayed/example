import { and, eq, sql } from "drizzle-orm";
import type { OAuthConnection, TypedResponse } from "@/auth/config";
import {
    getConfiguredOAuthProviders,
    providerDisplayNames,
} from "@/auth/core/oauth/providers";
import {
    type OAuthProvider,
    UserCredentialsTable,
    UserOAuthAccountsTable,
} from "@/auth/tables";
import { db } from "@/server/db";

export async function listOAuthConnections(
    userId: string,
): Promise<TypedResponse<OAuthConnection[]>> {
    const accounts = await db.query.UserOAuthAccountsTable.findMany({
        columns: { provider: true, providerAccountId: true, createdAt: true },
        where: eq(UserOAuthAccountsTable.userId, userId),
    });

    const connectedMap = new Map<OAuthProvider, (typeof accounts)[number]>();
    for (const account of accounts) connectedMap.set(account.provider, account);

    const providerSet = new Set<OAuthProvider>(getConfiguredOAuthProviders());
    for (const account of accounts) providerSet.add(account.provider);

    const result: OAuthConnection[] = Array.from(providerSet).map((provider) => ({
        provider,
        displayName: providerDisplayNames[provider],
        connected: connectedMap.has(provider),
        connectedAt: connectedMap.get(provider)?.createdAt ?? null,
    }));

    return { isError: false, data: result };
}

export async function disconnectOAuthAccount(
    userId: string,
    provider: OAuthProvider,
): Promise<TypedResponse<{ disconnected: true }>> {
    const account = await db.query.UserOAuthAccountsTable.findFirst({
        columns: { providerAccountId: true },
        where: and(
            eq(UserOAuthAccountsTable.userId, userId),
            eq(UserOAuthAccountsTable.provider, provider),
        ),
    });

    if (!account) {
        return { isError: true, message: "OAuth account is not linked" };
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
            message: "Cannot disconnect the only sign-in method",
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

    return { isError: false, data: { disconnected: true } };
}
