import { usersRouter } from "@/features/users/router";
import { authRouter } from "@/server/api/routers/auth";
import { contactRouter } from "@/server/api/routers/contact-router";
import { branchRouter } from "@/server/api/routers/root/branchRouter";
import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
    auth: authRouter,
    root: createTRPCRouter({
        branch: branchRouter,
    }),
    users: usersRouter,
    contactRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
