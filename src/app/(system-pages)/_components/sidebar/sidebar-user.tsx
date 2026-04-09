"use client";

import { ChevronsUpDown } from "lucide-react";

import { UserCard } from "@/app/(system-pages)/_components/sidebar/user-card";
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { AuthManager } from "@/features/core/auth/nextjs/components/auth-manager";
import { useAuth } from "@/features/core/auth/nextjs/components/auth-provider";

export function SidebarUser() {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) return <Skeleton className="h-12 w-full" />;

    return (
        <SidebarMenu>
            <SidebarMenuItem id="tour3">
                <AuthManager
                    trigger={
                        <SidebarMenuButton
                            className="group/user-card data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                            size="lg"
                        >
                            <UserCard />
                            <ChevronsUpDown className="size-4 ltr:ml-auto rtl:mr-auto" />
                        </SidebarMenuButton>
                    }
                />
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
