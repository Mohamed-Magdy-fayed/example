"use client";

import type { ComponentPropsWithoutRef } from "react";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";

interface ResponsiveDialogProps
    extends ComponentPropsWithoutRef<typeof Dialog> { }

export function ResponsiveDialog({ ...props }: ResponsiveDialogProps) {
    const isMobile = useIsMobile();
    const isModal = props.modal === undefined ? undefined : props.modal !== false;

    if (isMobile) {
        return (
            <Drawer
                defaultOpen={props.defaultOpen}
                modal={isModal}
                onOpenChange={(open) => props.onOpenChange?.(open, {} as never)}
                open={props.open}
            >
                <DrawerContent>
                    <DrawerHeader className="sr-only hidden">
                        <DrawerTitle>Custom Drawer Title</DrawerTitle>
                    </DrawerHeader>
                    <div className="p-4">{props.children as React.ReactNode}</div>
                </DrawerContent>
            </Drawer>
        );
    }

    return (
        <Dialog {...props}>
            <DialogContent>
                <DialogHeader className="sr-only hidden">
                    <DialogTitle>Custom Dialog Title</DialogTitle>
                </DialogHeader>
                <div className="p-4">{props.children as React.ReactNode}</div>
            </DialogContent>
        </Dialog>
    );
}
