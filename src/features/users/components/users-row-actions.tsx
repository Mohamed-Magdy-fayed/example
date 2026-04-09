"use client";

import { InfoIcon, MoreHorizontal, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";
import DataTableInfoModal from "@/components/data-table/data-table-info-modal";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { User } from "@/drizzle/schema";
import { useTranslation } from "@/features/core/i18n/useTranslation";
import { deleteEmployeesAction } from "@/features/users/actions";

interface UsersRowActionsProps {
    user: User;
}

export function UsersRowActions({ user }: UsersRowActionsProps) {
    const { t } = useTranslation();
    const router = useRouter();
    const [showInfo, setShowInfo] = React.useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);
    const [isPending, startTransition] = React.useTransition();

    const onDelete = React.useCallback(() => {
        startTransition(async () => {
            const result = await deleteEmployeesAction({ ids: [user.id] });

            if (result.isError) {
                toast.error(
                    result.message ||
                    t("employeeTranslations.actions.error", {
                        action: "delete",
                    }),
                );
                return;
            }

            toast.success(
                t("employeeTranslations.actions.success", {
                    action: "delete",
                    length: 1,
                }),
            );
            setShowDeleteConfirm(false);
            router.refresh();
        });
    }, [router, t, user.id]);

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger
                    render={
                        <Button aria-label={t("common.actions")} size="icon" variant="ghost">
                            <MoreHorizontal className="size-4" />
                        </Button>
                    }
                />
                <DropdownMenuContent align="end" className="w-36">
                    <DropdownMenuItem onClick={() => setShowInfo(true)}>
                        <InfoIcon className="size-4" />
                        {t("common.info")}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => setShowDeleteConfirm(true)}
                        variant="destructive"
                    >
                        <Trash2 className="size-4" />
                        {t("common.delete")}
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <DataTableInfoModal
                entity={user}
                entityName={t("employeeTranslations.sidebarMenuLabel")}
                onOpenChange={setShowInfo}
                open={showInfo}
            />

            <AlertDialog onOpenChange={setShowDeleteConfirm} open={showDeleteConfirm}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{t("common.areYouSure")}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {t("common.deleteConfirmation")}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isPending}>
                            {t("common.cancel")}
                        </AlertDialogCancel>
                        <AlertDialogAction
                            disabled={isPending}
                            onClick={onDelete}
                            variant="destructive"
                        >
                            {t("common.delete")}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
