"use client";

import type React from "react";
import { cn } from "@/lib/utils";

export type ButtonGroupProps = React.ComponentProps<"div"> & {
    orientation?: "horizontal" | "vertical";
    attached?: boolean;
};

export function ButtonGroup({
    className,
    orientation = "horizontal",
    attached = false,
    ...props
}: ButtonGroupProps) {
    const direction = orientation === "vertical" ? "flex-col" : "flex-row";
    const attachedClasses =
        orientation === "vertical"
            ? "[&>button]:rounded-none [&>button:first-child]:rounded-t-md [&>button:last-child]:rounded-b-md [&>button:not(:last-child)]:border-b-0"
            : "[&>button]:rounded-none [&>button:first-child]:rounded-l-md [&>button:last-child]:rounded-r-md [&>button:not(:last-child)]:border-r-0";

    return (
        <div
            className={cn(
                "flex gap-2",
                direction,
                attached ? `inline-flex gap-0 ${attachedClasses}` : "",
                className,
            )}
            data-orientation={orientation}
            data-slot="button-group"
            {...props}
        />
    );
}
