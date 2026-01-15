"use client";

import { DropdownMenuGroup } from "@radix-ui/react-dropdown-menu";
import {
    ChevronsUpDown,
    LanguagesIcon,
    LogOut,
    MoonIcon,
    SunIcon,
    UserIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { startTransition, useState } from "react";

import { UserCard } from "@/app/(system-pages)/_components/sidebar/user-card";
import { signOutAction } from "@/auth/nextjs/actions";
import { useAuth } from "@/auth/nextjs/components/auth-provider";
import { ProfileForm } from "@/auth/nextjs/components/profile-form";
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
import { Swap, SwapOff, SwapOn } from "@/components/ui/swap";
import { useTranslation } from "@/lib/i18n/useTranslation";

export function SidebarUser() {
    const { isMobile } = useSidebar();
    const { t, setLocale, locale } = useTranslation();
    const { theme, setTheme } = useTheme();

    const [openDialog, setOpenDialog] = useState<"profile" | undefined>();

    const { isAuthenticated } = useAuth();
    if (!isAuthenticated) return <Skeleton className="h-12 w-full" />;

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <ResponsiveDialog
                    onOpenChange={(open) => setOpenDialog(open ? "profile" : undefined)}
                    open={openDialog === "profile"}
                >
                    <ProfileForm callback={() => setOpenDialog(undefined)} />
                </ResponsiveDialog>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            className="group/user-card data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                            size="lg"
                        >
                            <UserCard />
                            <ChevronsUpDown className="size-4 ltr:ml-auto rtl:mr-auto" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        align="end"
                        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                        side={isMobile ? "bottom" : "right"}
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="p-0 font-normal">
                            <UserCard />
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem onSelect={() => setOpenDialog("profile")}>
                                <UserIcon />
                                {t("authTranslations.profile.title")}
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem
                                onSelect={() => setTheme(theme === "light" ? "dark" : "light")}
                            >
                                <Swap animation="rotate" swapped={theme === "dark"}>
                                    <SwapOn>
                                        <MoonIcon />
                                    </SwapOn>
                                    <SwapOff>
                                        <SunIcon />
                                    </SwapOff>
                                </Swap>
                                {t("themeToggle")}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onSelect={() => setLocale(locale === "en" ? "ar" : "en")}
                            >
                                <LanguagesIcon />
                                {t("opposite")}
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() =>
                                startTransition(() => {
                                    signOutAction();
                                })
                            }
                            variant="destructive"
                        >
                            <LogOut />
                            {t("authTranslations.signOut")}
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
