"use client";

import type { ComponentProps, ReactNode } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

export function DataTableModal({
    title = "",
    trigger,
    content,
    ...props
}: ComponentProps<typeof Dialog> & {
    title?: string;
    trigger?: ReactNode;
    content?: ReactNode;
}) {
    return (
        <Dialog {...props}>
            {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                <div className="pt-6">{content}</div>
            </DialogContent>
        </Dialog>
    );
}
