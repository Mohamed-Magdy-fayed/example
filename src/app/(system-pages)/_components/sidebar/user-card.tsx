import Link from "next/link";
import type { ComponentProps } from "react";

import { getInitials } from "@/auth/core";
import { useAuth } from "@/auth/nextjs/components/auth-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function UserCard({ className, ...props }: ComponentProps<"div">) {
    const user = useAuth().session?.user;

    if (!user) return <Skeleton className="h-12 w-full" />;

    const { name, email, imageUrl } = user;

    return (
        <div
            className={cn(
                "group/user-card flex items-center gap-2 text-left text-sm",
                className,
            )}
            {...props}
        >
            <Avatar className="h-8 w-8 rounded-lg rtl:order-0">
                <AvatarImage alt={name ?? ""} src={imageUrl || undefined} />
                <AvatarFallback className="rounded-lg">
                    {getInitials(name ?? "")}
                </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-sm leading-tight ltr:text-left rtl:text-right">
                <Link
                    className="truncate font-semibold group-hover/user-card:text-primary"
                    href={
                        email ? "/admin/users_management/account" : "/student/my_account"
                    }
                >
                    {name}
                </Link>
                <span className="truncate text-xs">{email}</span>
            </div>
        </div>
    );
}
