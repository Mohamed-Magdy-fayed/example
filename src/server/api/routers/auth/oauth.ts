import { cookies } from "next/headers";
import { z } from "zod";

import { getOAuthClient } from "@/features/core/auth/core";
import { oAuthProviderValues } from "@/features/core/auth/tables/user-oauth-accounts-table";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const oauthRouter = createTRPCRouter({
    init: publicProcedure
        .input(z.object({ provider: z.enum(oAuthProviderValues) }))
        .mutation(async ({ input }) => {
            const oAuthClient = getOAuthClient(input.provider);
            const url = oAuthClient.createAuthUrl(await cookies());
            return { url };
        }),
});
