"use client";

import type { ComponentProps, ReactElement, ReactNode } from "react";
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
    trigger?: ReactElement;
    content?: ReactNode;
}) {
    return (
        <Dialog {...props}>
            {trigger && <DialogTrigger render={trigger} />}
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                <div className="pt-6">{content}</div>
            </DialogContent>
        </Dialog>
    );
}
