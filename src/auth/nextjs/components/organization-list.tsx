import { Trash2, X } from "lucide-react";
import { useCallback, useState, useTransition } from "react";

import { deleteOrganizationAction } from "@/auth/nextjs/actions";
import { useOrganization } from "@/auth/nextjs/components/organization-provider";
import {
    ActionBar,
    ActionBarClose,
    ActionBarGroup,
    ActionBarItem,
    ActionBarSelection,
    ActionBarSeparator,
} from "@/components/ui/action-bar";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { cn } from "@/lib/utils";

export function OrganizationList() {
    const { t, locale } = useTranslation();
    const { organizations } = useOrganization();

    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedOrganizationIds, setSelectedOrganizationIds] = useState<
        Set<string>
    >(new Set());
    const [portalContainer, setPortalContainer] = useState<HTMLDivElement | null>(
        null,
    );
    const [isPending, startTransition] = useTransition();

    const open = selectedOrganizationIds.size > 0;
    const onOpenChange = useCallback((open: boolean) => {
        if (!open) {
            setSelectedOrganizationIds(new Set());
        }
    }, []);

    const onItemSelect = useCallback(
        (id: string, checked: boolean) => {
            const newSelected = new Set(selectedOrganizationIds);
            if (checked) {
                newSelected.add(id);
            } else {
                newSelected.delete(id);
            }
            setSelectedOrganizationIds(newSelected);
        },
        [selectedOrganizationIds],
    );

    const onDelete = useCallback(() => {
        startTransition(async () => {
            for (const organizationId of selectedOrganizationIds) {
                await deleteOrganizationAction(organizationId);
            }
        });
    }, [selectedOrganizationIds]);

    return (
        <div
            className={cn("transition-all", open ? "pb-16" : undefined)}
            ref={setPortalContainer}
        >
            <AlertDialog onOpenChange={setIsDeleteOpen} open={isDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{t("common.areYouSure")}</AlertDialogTitle>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction onClick={onDelete}>
                            {t("common.confirm")}
                        </AlertDialogAction>
                        <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            {organizations.map((org) => (
                <Label
                    aria-disabled={isPending}
                    className={cn(
                        "flex cursor-pointer items-center gap-2.5 rounded-md border bg-card/70 px-4 py-2 transition-colors hover:bg-accent/70",
                        selectedOrganizationIds.has(org.id) && "bg-accent/70",
                        "aria-disabled:pointer-events-none aria-disabled:opacity-50",
                    )}
                    key={org.id}
                >
                    <Checkbox
                        checked={selectedOrganizationIds.has(org.id)}
                        onCheckedChange={(checked) =>
                            onItemSelect(org.id, checked === true)
                        }
                    />
                    <span className="truncate font-medium text-sm">
                        {locale === "en" ? org.nameEn : org.nameAr}
                    </span>
                </Label>
            ))}
            <ActionBar
                onOpenChange={onOpenChange}
                open={open}
                portalContainer={portalContainer}
            >
                <ActionBarSelection>
                    {t("dataTable.selected", { count: selectedOrganizationIds.size })}
                    <ActionBarSeparator />
                    <ActionBarClose>
                        <X />
                    </ActionBarClose>
                </ActionBarSelection>
                <ActionBarSeparator />
                <ActionBarGroup>
                    <ActionBarItem
                        disabled={isPending}
                        onSelect={(e) => {
                            e.preventDefault();
                            setIsDeleteOpen(true);
                        }}
                        variant="destructive"
                    >
                        <Trash2 />
                        {t("common.delete")}
                    </ActionBarItem>
                </ActionBarGroup>
            </ActionBar>
        </div>
    );
}
