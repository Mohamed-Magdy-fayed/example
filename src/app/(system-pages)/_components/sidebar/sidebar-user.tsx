"use client";

import { DropdownMenuGroup } from "@radix-ui/react-dropdown-menu";
import {
    ChevronsUpDown,
    ListTreeIcon,
    LockKeyhole,
    LogOut,
    MailIcon,
    MoonIcon,
    ShieldBanIcon,
    SunIcon,
    UserIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Activity, startTransition, useState } from "react";

import { UserCard } from "@/app/(system-pages)/_components/sidebar/user-card";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ResponsiveDialog } from "@/components/ui/responsive-dialog";
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { Status, StatusIndicator } from "@/components/ui/status";
import { Swap, SwapOff, SwapOn } from "@/components/ui/swap";
import { signOutAction } from "@/features/core/auth/nextjs/actions";
import { useAuth } from "@/features/core/auth/nextjs/components/auth-provider";
import { ChangeEmailForm } from "@/features/core/auth/nextjs/components/change-email-form";
import { ChangePasswordForm } from "@/features/core/auth/nextjs/components/change-password-form";
import { EmailVerificationNotice } from "@/features/core/auth/nextjs/components/email-verification-notice";
import { OAuthConnections } from "@/features/core/auth/nextjs/components/oauth-connections";
import { PasskeyManager } from "@/features/core/auth/nextjs/components/passkey-manager";
import { ProfileForm } from "@/features/core/auth/nextjs/components/profile-form";
import { useTranslation } from "@/features/core/i18n/useTranslation";
import { AuthManager } from "@/features/core/auth/nextjs/components/auth-manager";

export function SidebarUser() {
    const { isMobile } = useSidebar();
    const { t, setLocale, locale } = useTranslation();
    const { theme, setTheme } = useTheme();
    const { isAuthenticated, session } = useAuth();

    const [openDialog, setOpenDialog] = useState<
        "profile" | "password" | "email" | "oauth" | "passkeys" | undefined
    >();

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
