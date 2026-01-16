"use client";

import { DropdownMenuGroup } from "@radix-ui/react-dropdown-menu";
import {
    ChevronsUpDown,
    LanguagesIcon,
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
import { signOutAction } from "@/auth/nextjs/actions";
import { useAuth } from "@/auth/nextjs/components/auth-provider";
import { ChangeEmailForm } from "@/auth/nextjs/components/change-email-form";
import { ChangePasswordForm } from "@/auth/nextjs/components/change-password-form";
import { EmailVerificationNotice } from "@/auth/nextjs/components/email-verification-notice";
import { OAuthConnections } from "@/auth/nextjs/components/oauth-connections";
import { PasskeyManager } from "@/auth/nextjs/components/passkey-manager";
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
import { Status, StatusIndicator } from "@/components/ui/status";
import { useTranslation } from "@/lib/i18n/useTranslation";

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
            <SidebarMenuItem>
                <ResponsiveDialog
                    onOpenChange={(open) => setOpenDialog(open ? "profile" : undefined)}
                    open={openDialog === "profile"}
                >
                    <ProfileForm callback={() => setOpenDialog(undefined)} />
                </ResponsiveDialog>
                <ResponsiveDialog
                    onOpenChange={(open) => setOpenDialog(open ? "email" : undefined)}
                    open={openDialog === "email"}
                >
                    <div className="flex flex-col gap-4">
                        <EmailVerificationNotice
                            isVerified={!!session.user.emailVerified}
                        />
                        <Activity mode={session.user.emailVerified ? "visible" : "hidden"}>
                            <ChangeEmailForm />
                        </Activity>
                    </div>
                </ResponsiveDialog>
                <ResponsiveDialog
                    onOpenChange={(open) => setOpenDialog(open ? "password" : undefined)}
                    open={openDialog === "password"}
                >
                    <ChangePasswordForm
                        callback={() => setOpenDialog(undefined)}
                        isCreate={!session?.hasPassword}
                    />
                </ResponsiveDialog>
                <ResponsiveDialog
                    onOpenChange={(open) => setOpenDialog(open ? "oauth" : undefined)}
                    open={openDialog === "oauth"}
                >
                    <OAuthConnections />
                </ResponsiveDialog>
                <ResponsiveDialog
                    onOpenChange={(open) => setOpenDialog(open ? "passkeys" : undefined)}
                    open={openDialog === "passkeys"}
                >
                    <PasskeyManager />
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
                            <DropdownMenuItem onSelect={() => setOpenDialog("email")}>
                                <MailIcon />
                                {!session.user.emailVerified
                                    ? t("authTranslations.emailVerification.verifyEmail")
                                    : t("authTranslations.profile.email.change")}
                                {!session.user.emailVerified && (
                                    <Status className="ms-auto" variant="warning">
                                        <StatusIndicator />
                                    </Status>
                                )}
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => setOpenDialog("password")}>
                                <ShieldBanIcon />
                                {t("authTranslations.profile.password.createOrChange", {
                                    isChange: session?.hasPassword ? "true" : "false",
                                })}
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => setOpenDialog("oauth")}>
                                <UserIcon />
                                {t("authTranslations.oauth.manage")}
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => setOpenDialog("passkeys")}>
                                <UserIcon />
                                {t("authTranslations.passkeys.manage")}
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem
                                onSelect={(e) => {
                                    e.preventDefault();
                                    setTheme(theme === "dark" ? "light" : "dark");
                                }}
                            >
                                {theme === "dark" ? <MoonIcon /> : <SunIcon />}
                                {t("themeToggle")}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onSelect={(e) => {
                                    e.preventDefault();
                                    setLocale(locale === "en" ? "ar" : "en");
                                }}
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
