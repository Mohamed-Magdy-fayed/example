import { DrizzleError } from "drizzle-orm";
import z from "zod";

import { type Action, hasPermission, type Resource } from "@/features/core/auth/core";
import { getCurrentUser } from "@/features/core/auth/nextjs";
import type { User } from "@/features/core/auth/tables";
import type { PartialUser, TypedResponse } from "@/features/core/auth/types";
import { getT } from "@/features/core/i18n/actions";
import { mapDrizzleError } from "@/lib/action-error";

type CurrentUser = PartialUser | User | null;
type FullUser = Extract<NonNullable<CurrentUser>, { email: string }>;
type CurrentUserFor<W extends boolean> = W extends true
    ? FullUser
    : CurrentUser;
type TFunction = Awaited<ReturnType<typeof getT>>["t"];

type PermissionData = Parameters<typeof hasPermission>[3];
type Permission<ResourceKey extends Resource = Resource> = {
    resource: ResourceKey;
    action: Action<ResourceKey>;
    data?: PermissionData;
};

type InferArgs<Schema extends z.ZodTypeAny | undefined> =
    Schema extends z.ZodTypeAny ? [z.infer<Schema>] : unknown[];

type HandlerReturn<Handler> = Handler extends (
    options: any,
) => Promise<TypedResponse<infer R>>
    ? TypedResponse<R>
    : TypedResponse<unknown>;

type CreateServerFnOptions<
    Schema extends z.ZodTypeAny | undefined,
    Args extends unknown[],
    WithFullUser extends boolean,
    Handler extends (options: {
        args: Args;
        currentUser: CurrentUserFor<WithFullUser>;
        t: TFunction;
    }) => Promise<TypedResponse<any>>,
> = {
    permission?: Permission<Resource>;
    withFullUser?: WithFullUser;
    schema?: Schema;
    handler: Handler;
};

export function createServerFn<
    Schema extends z.ZodTypeAny | undefined = undefined,
    Args extends unknown[] = InferArgs<Schema>,
    WithFullUser extends boolean = false,
    Handler extends (options: {
        args: Args;
        currentUser: CurrentUserFor<WithFullUser>;
        t: TFunction;
    }) => Promise<TypedResponse<any>> = (options: {
        args: Args;
        currentUser: CurrentUserFor<WithFullUser>;
        t: TFunction;
    }) => Promise<TypedResponse<unknown>>,
>(options: CreateServerFnOptions<Schema, Args, WithFullUser, Handler>) {
    return async (...args: Args): Promise<HandlerReturn<Handler>> => {
        const { t } = await getT();

        try {
            let currentUser = null;
            let parsedArgs: Args = args as Args;

            if (options.permission || options.withFullUser) {
                if (options.withFullUser) {
                    currentUser = await getCurrentUser({
                        withFullUser: true,
                        redirectIfNotFound: true,
                    });
                } else {
                    currentUser = await getCurrentUser({
                        redirectIfNotFound: true,
                    });
                }
            }

            if (options.schema) {
                const parsed = options.schema.safeParse(args[0]);
                if (!parsed.success) {
                    return {
                        isError: true,
                        message: z.prettifyError(parsed.error),
                    } as HandlerReturn<Handler>;
                }

                parsedArgs = [parsed.data] as Args;
            }

            if (options.permission) {
                const { resource, action, data } = options.permission;
                const isAuthorized =
                    currentUser != null &&
                    hasPermission(currentUser, resource, action, data);

                if (!isAuthorized) {
                    return {
                        isError: true,
                        message: t("authTranslations.unauthorized", {
                            action,
                            resource,
                        }),
                    } as HandlerReturn<Handler>;
                }
            }

            return options.handler({
                args: parsedArgs,
                currentUser: currentUser as CurrentUserFor<WithFullUser>,
                t,
            }) as HandlerReturn<Handler>;
        } catch (error) {
            if (error instanceof z.ZodError) {
                return {
                    isError: true,
                    message: z.prettifyError(error),
                } as HandlerReturn<Handler>;
            }

            if (error instanceof DrizzleError) {
                return {
                    isError: true,
                    message: mapDrizzleError(error).message,
                } as HandlerReturn<Handler>;
            }

            if (error instanceof Error) {
                return {
                    isError: true,
                    message: error.message,
                } as HandlerReturn<Handler>;
            }

            return {
                isError: true,
                message: t("error", { error: JSON.stringify(error) }),
            } as HandlerReturn<Handler>;
        }
    };
}
