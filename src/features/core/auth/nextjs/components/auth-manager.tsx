"use client";

import { UserIcon, MailIcon, ShieldBanIcon, ListTreeIcon, LockKeyhole, MoonIcon, SunIcon, LogOut, PhoneIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { Activity, startTransition, useState } from "react";

import { UserCard } from "@/app/(system-pages)/_components/sidebar/user-card";
import { ResponsiveDialog } from "@/components/ui/responsive-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Status, StatusIndicator } from "@/components/ui/status";
import { Swap, SwapOn, SwapOff } from "@/components/ui/swap";
import { signOutAction } from "@/features/core/auth/nextjs/actions";
import { useAuth } from "@/features/core/auth/nextjs/components/auth-provider";
import { ChangeEmailForm } from "@/features/core/auth/nextjs/components/change-email-form";
import { ChangePhoneForm } from "@/features/core/auth/nextjs/components/change-phone-form";
import { ChangePasswordForm } from "@/features/core/auth/nextjs/components/change-password-form";
import { EmailVerificationNotice } from "@/features/core/auth/nextjs/components/email-verification-notice";
import { OAuthConnections } from "@/features/core/auth/nextjs/components/oauth-connections";
import { PasskeyManager } from "@/features/core/auth/nextjs/components/passkey-manager";
import { ProfileForm } from "@/features/core/auth/nextjs/components/profile-form";
import { useTranslation } from "@/features/core/i18n/useTranslation";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

export function AuthManager({ trigger }: { trigger: React.ReactNode }) {
    const { t, setLocale, locale } = useTranslation();
    const { theme, setTheme } = useTheme();
    const { isAuthenticated, session } = useAuth();
    const isMobile = useIsMobile();

    const [openDialog, setOpenDialog] = useState<
        "profile" | "phone" | "email" | "password" | "oauth" | "passkeys" | undefined
    >();

    if (!isAuthenticated) return <Skeleton className="h-12 w-full" />;

    const hasEmail = !!session.user.email;
    const isEmailVerified = !!session.user.emailVerifiedAt;

    return (
        <>
            <ResponsiveDialog
                onOpenChange={(open) => setOpenDialog(open ? "profile" : undefined)}
                open={openDialog === "profile"}
            >
                <ProfileForm callback={() => setOpenDialog(undefined)} />
            </ResponsiveDialog>
            <ResponsiveDialog
                onOpenChange={(open) => setOpenDialog(open ? "phone" : undefined)}
                open={openDialog === "phone"}
            >
                <ChangePhoneForm onDone={() => setOpenDialog(undefined)} />
            </ResponsiveDialog>
            <ResponsiveDialog
                onOpenChange={(open) => setOpenDialog(open ? "email" : undefined)}
                open={openDialog === "email"}
            >
                <div className="flex flex-col gap-4">
                    <EmailVerificationNotice
                        isVerified={!!session.user.emailVerifiedAt}
                        onClose={() => setOpenDialog(undefined)}
                    />
                    <Activity
                        mode={isEmailVerified || !hasEmail ? "visible" : "hidden"}
                    >
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
                    {trigger}
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
                        <DropdownMenuItem onSelect={() => setOpenDialog("phone")}>
                            <PhoneIcon />
                            {t("authTranslations.profile.phone.change")}
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => setOpenDialog("email")}>
                            <MailIcon />
                            {!hasEmail
                                ? t("authTranslations.profile.email.add")
                                : !isEmailVerified
                                    ? t("authTranslations.emailVerification.verifyEmail")
                                    : t("authTranslations.profile.email.change")}
                            {hasEmail && !isEmailVerified && (
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
                            <ListTreeIcon />
                            {t("authTranslations.oauth.manage")}
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => setOpenDialog("passkeys")}>
                            <LockKeyhole />
                            {t("authTranslations.passkeys.manage")}
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup className="grid grid-cols-2 gap-2">
                        <Button asChild variant="outline">
                            <Swap
                                animation="rotate"
                                onSwappedChange={(val) => {
                                    startTransition(() => {
                                        setTheme(val ? "dark" : "light");
                                    });
                                }}
                                swapped={theme === "dark"}
                            >
                                <SwapOn>
                                    <MoonIcon />
                                </SwapOn>
                                <SwapOff>
                                    <SunIcon />
                                </SwapOff>
                            </Swap>
                        </Button>
                        <Button asChild variant="outline">
                            <Swap
                                animation="scale"
                                onSwappedChange={(val) => setLocale(val ? "en" : "ar")}
                                swapped={locale === "en"}
                            >
                                <SwapOn>AR</SwapOn>
                                <SwapOff>EN</SwapOff>
                            </Swap>
                        </Button>
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
        </>
    )
}