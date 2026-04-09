"use client";

import type { ComponentProps, ReactElement, ReactNode } from "react";
import * as React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer";
import { useTranslation } from "@/features/core/i18n/useTranslation";
import { useIsMobile } from "@/hooks/use-mobile";

export function DataTableSheet({
    isUpdate = false,
    trigger,
    content,
    ...props
}: ComponentProps<typeof Dialog> & {
    isUpdate?: boolean;
    trigger?: ReactElement<{ onClick?: (event: unknown) => void }>;
    content?: ReactNode;
}) {
    const { t } = useTranslation();
    const isMobile = useIsMobile();

    const title = isUpdate ? t("common.edit") : t("common.add");

    if (isMobile) {
        return (
            <>
                {trigger &&
                    React.cloneElement(trigger, {
                        onClick: (event: unknown) => {
                            if (typeof trigger.props.onClick === "function") {
                                trigger.props.onClick(event);
                            }
                            props.onOpenChange?.(true, {} as never);
                        },
                    })}
                <Drawer
                    defaultOpen={props.defaultOpen}
                    modal={props.modal === undefined ? undefined : props.modal !== false}
                    onOpenChange={(open) => props.onOpenChange?.(open, {} as never)}
                    open={props.open}
                >
                    <DrawerContent>
                        <DrawerHeader>
                            <DrawerTitle>{title}</DrawerTitle>
                        </DrawerHeader>
                        <div className="px-4 pb-4">{content}</div>
                    </DrawerContent>
                </Drawer>
            </>
        );
    }

    return (
        <Dialog {...props}>
            {trigger && <DialogTrigger render={trigger} />}
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                <div className="px-4">{content}</div>
            </DialogContent>
        </Dialog>
    );
}
