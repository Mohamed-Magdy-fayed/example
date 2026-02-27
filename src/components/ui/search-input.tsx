"use client";

import { SearchIcon, XIcon } from "lucide-react";
import type * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

function SearchInput({
    className,
    type = "text",
    value,
    defaultValue,
    onChange,
    ...props
}: React.ComponentProps<typeof Input>) {
    return (
        <div className="relative">
            <Input
                className={cn("ps-3 pe-12", className)}
                defaultValue={defaultValue}
                onChange={onChange}
                type={type}
                value={value}
                {...props}
            />
            {!value ? (
                <SearchIcon
                    aria-hidden="true"
                    className={cn(
                        "pointer-events-none absolute end-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground",
                    )}
                />
            ) : (
                <Button
                    className={cn(
                        "absolute end-1.5 top-1/2 size-5 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground",
                    )}
                    onClick={() => onChange?.({ target: { value: "" } } as any)}
                    size="icon"
                    type="button"
                    variant="ghost"
                >
                    <XIcon className="size-4" />
                    <span className="sr-only">Clear search input</span>
                </Button>
            )}
        </div>
    );
}

export { SearchInput };
