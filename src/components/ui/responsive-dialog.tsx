"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";

interface ResponsiveDialogProps
    extends React.ComponentPropsWithoutRef<typeof Dialog> { }

export function ResponsiveDialog({ ...props }: ResponsiveDialogProps) {
    const isMobile = useIsMobile();

    return (
        <>
            <React.Activity mode={isMobile ? "hidden" : "visible"}>
                <Dialog {...props}>
                    <DialogContent className="p-4">
                        <DialogHeader className="sr-only">
                            <DialogTitle>Custom Dialog Title</DialogTitle>
                        </DialogHeader>
                        {props.children}
                    </DialogContent>
                </Dialog>
            </React.Activity>
            <React.Activity mode={!isMobile ? "hidden" : "visible"}>
                <Drawer {...props}>
                    <DrawerContent className="p-4">
                        <DrawerHeader className="sr-only">
                            <DrawerTitle>Custom Drawer Title</DrawerTitle>
                        </DrawerHeader>
                        {props.children}
                    </DrawerContent>
                </Drawer>
            </React.Activity>
        </>
    );
}
