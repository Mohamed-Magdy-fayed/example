"use client";

import { BuildingIcon, ChevronsUpDown, Plus, SettingsIcon } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { setActiveOrganizationForUserAction } from "@/auth/nextjs/actions";
import { OrganizationForm } from "@/auth/nextjs/components/organization-form";
import { OrganizationList } from "@/auth/nextjs/components/organization-list";
import { useOrganization } from "@/auth/nextjs/components/organization-provider";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ResponsiveDialog } from "@/components/ui/responsive-dialog";
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Lead } from "@/components/ui/typography";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTranslation } from "@/lib/i18n/useTranslation";

export function SidebarOrganization() {
    const isMobile = useIsMobile();
    const { t, locale } = useTranslation();
    const { hasActiveOrg, organizations, activeOrganization } = useOrganization();

    const [openDialog, setOpenDialog] = useState<
        "org:create" | "org:manage" | undefined
    >(undefined);
    const [isPending, startTransition] = useTransition();

    function setActiveOrganization(id: string) {
        startTransition(async () => {
            const res = await setActiveOrganizationForUserAction(id);
            if (res.isError) {
                toast.error(res.message);
            }

            toast.success(
                t("authTranslations.org.actions.setActiveOrganization.success"),
            );
        });
    }

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <ResponsiveDialog
                    onOpenChange={(val) => setOpenDialog(val ? "org:create" : undefined)}
                    open={openDialog === "org:create"}
                >
                    <Lead className="mb-4">{t("authTranslations.org.create.title")}</Lead>
                    <OrganizationForm onSuccess={() => setOpenDialog(undefined)} />
                </ResponsiveDialog>
                <ResponsiveDialog
                    onOpenChange={(val) => setOpenDialog(val ? "org:manage" : undefined)}
                    open={openDialog === "org:manage"}
                >
                    <Lead className="mb-4">{t("authTranslations.org.manage.title")}</Lead>
                    <OrganizationList />
                </ResponsiveDialog>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        {!hasActiveOrg ? null : (
                            <SidebarMenuButton
                                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                                disabled={isPending}
                                size="lg"
                            >
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                    <BuildingIcon />
                                </div>
                                <span className="truncate font-medium">
                                    {locale === "ar"
                                        ? activeOrganization.nameAr
                                        : activeOrganization.nameEn}
                                </span>
                                <ChevronsUpDown className="ms-auto" />
                            </SidebarMenuButton>
                        )}
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        align="start"
                        side={isMobile ? "bottom" : "right"}
                        sideOffset={4}
                    >
                        <DropdownMenuLabel>
                            {t("authTranslations.org.create.title")}
                        </DropdownMenuLabel>
                        {organizations.map((organization, index) => (
                            <DropdownMenuItem
                                key={organization.nameEn}
                                onClick={() => setActiveOrganization(organization.id)}
                            >
                                <div className="flex-1 truncate">
                                    {locale === "ar" ? organization.nameAr : organization.nameEn}
                                </div>
                                <DropdownMenuShortcut className="ms-auto">
                                    ⌘{index + 1}
                                </DropdownMenuShortcut>
                            </DropdownMenuItem>
                        ))}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onSelect={() => setOpenDialog("org:create")}>
                            {t("authTranslations.org.switcher.add")}
                            <Plus className="ms-auto size-4" />
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => setOpenDialog("org:manage")}>
                            {t("authTranslations.org.switcher.manage")}
                            <SettingsIcon className="ms-auto size-4" />
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
