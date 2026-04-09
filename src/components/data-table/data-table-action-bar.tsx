"use client";

import type { Table } from "@tanstack/react-table";
import { Loader, X } from "lucide-react";
import * as React from "react";
import * as ReactDOM from "react-dom";

import { getSelectedRowCount } from "@/components/data-table/lib/selection";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTranslation } from "@/features/core/i18n/useTranslation";
import { cn } from "@/lib/utils";

interface DataTableActionBarProps<TData>
    extends React.HTMLAttributes<HTMLDivElement> {
    table: Table<TData>;
    visible?: boolean;
    container?: Element | DocumentFragment | null;
}

function DataTableActionBar<TData>({
    table,
    visible: visibleProp,
    container: containerProp,
    children,
    className,
    ...props
}: DataTableActionBarProps<TData>) {
    const [mounted, setMounted] = React.useState(false);

    React.useLayoutEffect(() => {
        setMounted(true);
    }, []);

    React.useEffect(() => {
        function onKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") {
                table.resetRowSelection(true);
            }
        }

        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [table]);

    const container =
        containerProp ?? (mounted ? globalThis.document?.body : null);

    if (!container) return null;

    const selectedRowsCount = getSelectedRowCount(table as Table<unknown>);
    const visible = visibleProp ?? selectedRowsCount > 0;

    return ReactDOM.createPortal(
        visible ? (
            <div
                aria-orientation="horizontal"
                className={cn(
                    "fixed inset-x-0 bottom-6 z-50 mx-auto flex w-fit animate-fade-in-up flex-wrap items-center justify-center gap-2 rounded-md border bg-background p-2 text-foreground shadow-sm transition-all duration-200 ease-in-out",
                    className,
                )}
                role="toolbar"
                {...props}
            >
                {children}
            </div>
        ) : null,
        container,
    );
}

interface DataTableActionBarActionProps
    extends React.ComponentProps<typeof Button> {
    tooltip?: string;
    isPending?: boolean;
}

function DataTableActionBarAction({
    size = "sm",
    tooltip,
    isPending,
    disabled,
    className,
    children,
    ...props
}: DataTableActionBarActionProps) {
    const trigger = (
        <Button
            className={cn(
                "gap-1.5 [&>svg]:size-3.5",
                size === "icon" ? "size-7" : "h-8",
                className,
            )}
            disabled={disabled || isPending}
            size={size}
            variant={props.variant}
            {...props}
        >
            {isPending ? <Loader className="animate-spin" /> : children}
        </Button>
    );

    if (!tooltip) return trigger;

    return (
        <Tooltip>
            <TooltipTrigger render={trigger} />
            <TooltipContent
                className="border bg-accent font-semibold text-foreground dark:bg-zinc-900 [&>span]:hidden"
                sideOffset={6}
            >
                <p>{tooltip}</p>
            </TooltipContent>
        </Tooltip>
    );
}

interface DataTableActionBarSelectionProps<TData> {
    table: Table<TData>;
}

function DataTableActionBarSelection<TData>({
    table,
}: DataTableActionBarSelectionProps<TData>) {
    const { t } = useTranslation();
    const selectedRowsCount = getSelectedRowCount(table as Table<unknown>);

    const onClearSelection = React.useCallback(() => {
        table.resetRowSelection(true);
    }, [table]);

    return (
        <div className="flex h-8 items-center rounded-md border ps-2.5 pe-1">
            <span className="whitespace-nowrap text-xs">
                {t("dataTableTranslations.selected", {
                    count: selectedRowsCount,
                })}
            </span>
            <Separator
                className="ms-2 me-1 data-[orientation=vertical]:h-4"
                orientation="vertical"
            />
            <Tooltip>
                <TooltipTrigger
                    render={
                        <Button
                            className="size-5"
                            onClick={onClearSelection}
                            size="icon"
                            variant="ghost"
                        >
                            <X className="size-3.5" />
                        </Button>
                    }
                />
                <TooltipContent
                    className="flex items-center gap-2 border bg-accent px-2 py-1 font-semibold text-foreground dark:bg-zinc-900 [&>span]:hidden"
                    sideOffset={10}
                >
                    <p>{t("dataTableTranslations.clearSelection")}</p>
                    <kbd className="select-none rounded border bg-background px-1.5 py-px font-mono font-normal text-[0.7rem] text-foreground shadow-xs">
                        <abbr className="no-underline" title="Escape">
                            Esc
                        </abbr>
                    </kbd>
                </TooltipContent>
            </Tooltip>
        </div>
    );
}

export {
    DataTableActionBar,
    DataTableActionBarAction,
    DataTableActionBarSelection,
};
