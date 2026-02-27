"use client";

import {
    BuildingIcon,
    ChevronsUpDown,
    MoreHorizontal,
    Plus,
    Trash2,
} from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import {
    deleteOrganizationAction,
    setActiveOrganizationForUserAction,
} from "@/auth/nextjs/actions";
import { OrganizationForm } from "@/auth/nextjs/components/organization-form";
import { useOrganization } from "@/auth/nextjs/components/organization-provider";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
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

    const [openDialog, setOpenDialog] = useState<"org:create" | undefined>(
        undefined,
    );
    const [editingOrg, setEditingOrg] = useState<
        { id: string; nameEn: string; nameAr: string } | undefined
    >(undefined);
    const [deletingOrg, setDeletingOrg] = useState<
        { id: string; nameEn: string; nameAr: string } | undefined
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
                <AlertDialog
                    onOpenChange={(open) =>
                        setDeletingOrg(open ? deletingOrg : undefined)
                    }
                    open={deletingOrg !== undefined}
                >
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>{t("common.areYouSure")}</AlertDialogTitle>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogAction
                                disabled={isPending}
                                onClick={() => {
                                    if (!deletingOrg) return;
                                    startTransition(async () => {
                                        const res = await deleteOrganizationAction(deletingOrg.id);
                                        if (res.isError) {
                                            toast.error(res.message);
                                            return;
                                        }
                                        toast.success(
                                            t(
                                                "authTranslations.org.actions.deleteOrganization.success",
                                            ),
                                        );
                                        setDeletingOrg(undefined);
                                    });
                                }}
                            >
                                {t("common.confirm")}
                            </AlertDialogAction>
                            <AlertDialogCancel disabled={isPending}>
                                {t("common.cancel")}
                            </AlertDialogCancel>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
                <ResponsiveDialog
                    onOpenChange={(val) => setOpenDialog(val ? "org:create" : undefined)}
                    open={openDialog === "org:create"}
                >
                    <Lead className="mb-4">{t("authTranslations.org.create.title")}</Lead>
                    <OrganizationForm onSuccess={() => setOpenDialog(undefined)} />
                </ResponsiveDialog>
                <ResponsiveDialog
                    onOpenChange={(open) => setEditingOrg(open ? editingOrg : undefined)}
                    open={editingOrg !== undefined}
                >
                    <Lead className="mb-4">{t("authTranslations.org.edit.title")}</Lead>
                    {editingOrg ? (
                        <OrganizationForm
                            onSuccess={() => setEditingOrg(undefined)}
                            organization={editingOrg}
                        />
                    ) : null}
                </ResponsiveDialog>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                            disabled={isPending}
                            size="lg"
                        >
                            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                <BuildingIcon />
                            </div>
                            <span className="truncate font-medium">
                                {!hasActiveOrg
                                    ? t("authTranslations.org.switcher.select")
                                    : locale === "ar"
                                        ? activeOrganization.nameAr
                                        : activeOrganization.nameEn}
                            </span>
                            <ChevronsUpDown className="ms-auto" />
                        </SidebarMenuButton>
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
                            <DropdownMenuSub key={organization.id}>
                                <DropdownMenuSubTrigger>
                                    <div className="flex-1 truncate">
                                        {locale === "ar"
                                            ? organization.nameAr
                                            : organization.nameEn}
                                    </div>
                                </DropdownMenuSubTrigger>
                                <DropdownMenuSubContent
                                    alignOffset={-4}
                                    sideOffset={6}
                                >
                                    <DropdownMenuItem
                                        disabled={isPending}
                                        onSelect={(e) => {
                                            e.preventDefault();
                                            setActiveOrganization(organization.id);
                                        }}
                                    >
                                        {t("authTranslations.org.switcher.setActive")}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onSelect={(e) => {
                                            e.preventDefault();
                                            setEditingOrg(organization);
                                        }}
                                    >
                                        {t("authTranslations.org.switcher.edit")}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onSelect={(e) => {
                                            e.preventDefault();
                                            setDeletingOrg(organization);
                                        }}
                                        variant="destructive"
                                    >
                                        <Trash2 className="size-4" />
                                        {t("common.delete")}
                                    </DropdownMenuItem>
                                </DropdownMenuSubContent>
                            </DropdownMenuSub>
                        ))}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onSelect={() => setOpenDialog("org:create")}>
                            {t("authTranslations.org.switcher.add")}
                            <Plus className="ms-auto size-4" />
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
