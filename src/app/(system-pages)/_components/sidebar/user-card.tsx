import type { ComponentProps } from "react";

import { getInitials } from "@/auth/core";
import { useAuth } from "@/auth/nextjs/components/auth-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { P, Small } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

export function UserCard({ className, ...props }: ComponentProps<"div">) {
    const user = useAuth().session?.user;

    if (!user) return <Skeleton className="h-12 w-full" />;

    const { name, email, imageUrl } = user;

    return (
        <div
            className={cn(
                "group/user-card flex items-center gap-2 text-start text-sm",
                className,
            )}
            {...props}
        >
            <Avatar className="h-8 w-8">
                <AvatarImage alt={name ?? ""} src={imageUrl || undefined} />
                <AvatarFallback className="rounded-lg">
                    {getInitials(name ?? "")}
                </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-sm leading-tight">
                <Small>{name}</Small>
                <P>{email}</P>
            </div>
        </div>
    );
}
