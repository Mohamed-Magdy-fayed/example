"use client";

import { Activity, type ComponentPropsWithoutRef } from "react";

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

    return (
        <>
            <Activity mode={isMobile ? "hidden" : "visible"}>
                <Dialog {...props}>
                    <DialogContent>
                        <DialogHeader className="sr-only hidden">
                            <DialogTitle>Custom Dialog Title</DialogTitle>
                        </DialogHeader>
                        <div className="p-4">
                            {props.children}
                        </div>
                    </DialogContent>
                </Dialog>
            </Activity>
            <Activity mode={!isMobile ? "hidden" : "visible"}>
                <Drawer {...props}>
                    <DrawerContent>
                        <DrawerHeader className="sr-only hidden">
                            <DrawerTitle>Custom Drawer Title</DrawerTitle>
                        </DrawerHeader>
                        <div className="p-4">
                            {props.children}
                        </div>
                    </DrawerContent>
                </Drawer>
            </Activity>
        </>
    );
}
