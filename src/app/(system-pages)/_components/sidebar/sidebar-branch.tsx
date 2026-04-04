"use client";

import { BuildingIcon, ChevronsUpDown, EditIcon, ListStartIcon, Plus, Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

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
import {
    deleteBranchAction,
    setActiveBranchForUserAction,
} from "@/features/core/auth/nextjs/actions";
import { BranchForm } from "@/features/core/auth/nextjs/components/branch-form";
import { useBranch } from "@/features/core/auth/nextjs/components/branch-provider";
import { useTranslation } from "@/features/core/i18n/useTranslation";
import { useIsMobile } from "@/hooks/use-mobile";

export function SidebarBranch() {
    const isMobile = useIsMobile();
    const { t, locale } = useTranslation();
    const { hasActiveOrg, branches, activeBranch } = useBranch();

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

    function setActiveBranch(id: string) {
        startTransition(async () => {
            const res = await setActiveBranchForUserAction(id);
            if (res.isError) {
                toast.error(res.message);
            }

            toast.success(
                t("authTranslations.branch.actions.setActiveBranch.success"),
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
                                        const res = await deleteBranchAction(deletingOrg.id);
                                        if (res.isError) {
                                            toast.error(res.message);
                                            return;
                                        }
                                        toast.success(
                                            t(
                                                "authTranslations.branch.actions.deleteBranch.success",
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
                    <Lead className="mb-4">{t("authTranslations.branch.create.title")}</Lead>
                    <BranchForm onSuccess={() => setOpenDialog(undefined)} />
                </ResponsiveDialog>
                <ResponsiveDialog
                    onOpenChange={(open) => setEditingOrg(open ? editingOrg : undefined)}
                    open={editingOrg !== undefined}
                >
                    <Lead className="mb-4">{t("authTranslations.branch.edit.title")}</Lead>
                    {editingOrg ? (
                        <BranchForm
                            onSuccess={() => setEditingOrg(undefined)}
                            branch={editingOrg}
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
                                    ? t("authTranslations.branch.switcher.select")
                                    : locale === "ar"
                                        ? activeBranch.nameAr
                                        : activeBranch.nameEn}
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
                            {t("authTranslations.branch.create.title")}
                        </DropdownMenuLabel>
                        {branches.map((branch) => (
                            <DropdownMenuSub key={branch.id}>
                                <DropdownMenuSubTrigger>
                                    <div className="flex-1 truncate">
                                        {locale === "ar"
                                            ? branch.nameAr
                                            : branch.nameEn}
                                    </div>
                                </DropdownMenuSubTrigger>
                                <DropdownMenuSubContent alignOffset={-4} sideOffset={6}>
                                    <DropdownMenuItem
                                        disabled={isPending}
                                        onSelect={(e) => {
                                            e.preventDefault();
                                            setActiveBranch(branch.id);
                                        }}
                                    >
                                        <ListStartIcon />
                                        {t("authTranslations.branch.switcher.setActive")}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onSelect={(e) => {
                                            e.preventDefault();
                                            setEditingOrg(branch);
                                        }}
                                    >
                                        <EditIcon />
                                        {t("authTranslations.branch.switcher.edit")}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onSelect={(e) => {
                                            e.preventDefault();
                                            setDeletingOrg(branch);
                                        }}
                                        variant="destructive"
                                    >
                                        <Trash2 />
                                        {t("common.delete")}
                                    </DropdownMenuItem>
                                </DropdownMenuSubContent>
                            </DropdownMenuSub>
                        ))}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={(e) => {
                            e.preventDefault();
                            setOpenDialog("org:create");
                        }}>
                            <Plus className="size-4" />
                            {t("authTranslations.branch.switcher.add")}
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
