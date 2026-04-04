"use client";

import { ChevronDownIcon, XIcon } from "lucide-react";
import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupText,
} from "@/components/ui/input-group";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Spinner } from "@/components/ui/spinner";
import { useTranslation } from "@/features/core/i18n/useTranslation";
import { cn } from "@/lib/utils";

/* ─── Types ─── */

type LookupItem = {
    value: string;
    label: string;
    description?: string;
};

type SearchLookupBaseProps = {
    items: LookupItem[];
    placeholder?: string;
    emptyText?: string;
    loading?: boolean;
    onSearch?: (query: string) => void;
    minChars?: number;
    className?: string;
};

type SearchLookupSingleProps = SearchLookupBaseProps & {
    multiple?: false;
    value: string | null;
    onValueChange: (val: string | null) => void;
};

type SearchLookupMultiProps = SearchLookupBaseProps & {
    multiple: true;
    value: string[];
    onValueChange: (val: string[]) => void;
};

type SearchLookupProps = SearchLookupSingleProps | SearchLookupMultiProps;

/* ─── Highlight helper ─── */

function HighlightMatch({ text, query }: { text: string; query: string }) {
    if (!query.trim()) return <>{text}</>;

    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(${escaped})`, "gi");
    const parts = text.split(regex);

    return (
        <>
            {parts.map((part, i) =>
                regex.test(part) ? (
                    <mark
                        className="rounded-sm bg-primary/20 px-0.5 text-foreground"
                        key={`${part}-${i}`}
                    >
                        {part}
                    </mark>
                ) : (
                    <span key={`${part}-${i}`}>{part}</span>
                ),
            )}
        </>
    );
}

/* ─── Component ─── */

function SearchLookup(props: SearchLookupProps) {
    const {
        items,
        placeholder = "Search…",
        emptyText = "No results found.",
        loading = false,
        onSearch,
        minChars = 0,
        className,
    } = props;

    const isMulti = props.multiple === true;
    const { t } = useTranslation();

    const [open, setOpen] = React.useState(false);
    const [search, setSearch] = React.useState("");

    const selectedValues = React.useMemo<Set<string>>(() => {
        if (isMulti) return new Set(props.value);
        return props.value ? new Set([props.value]) : new Set();
    }, [isMulti, props.value]);

    const selectedItems = React.useMemo(
        () => items.filter((item) => selectedValues.has(item.value)),
        [items, selectedValues],
    );

    const hasValue = isMulti
        ? (props.value as string[]).length > 0
        : !!props.value;

    const handleSearchChange = React.useCallback(
        (val: string) => {
            setSearch(val);
            onSearch?.(val);
        },
        [onSearch],
    );

    const handleSelect = React.useCallback(
        (item: LookupItem) => {
            if (isMulti) {
                const current = props.value as string[];
                const next = current.includes(item.value)
                    ? current.filter((v) => v !== item.value)
                    : [...current, item.value];
                (props.onValueChange as (val: string[]) => void)(next);
                setSearch("");
            } else {
                (props.onValueChange as (val: string | null) => void)(item.value);
                setSearch("");
                setOpen(false);
            }
        },
        [isMulti, props.value, props.onValueChange],
    );

    const handleRemove = React.useCallback(
        (val: string) => {
            if (isMulti) {
                const next = (props.value as string[]).filter((v) => v !== val);
                (props.onValueChange as (val: string[]) => void)(next);
            }
        },
        [isMulti, props.value, props.onValueChange],
    );

    const handleClear = React.useCallback(
        (e: React.MouseEvent) => {
            e.stopPropagation();
            if (isMulti) {
                (props.onValueChange as (val: string[]) => void)([]);
            } else {
                (props.onValueChange as (val: string | null) => void)(null);
            }
            setSearch("");
        },
        [isMulti, props.onValueChange],
    );

    const insufficientChars = minChars > 0 && search.length < minChars;

    return (
        <Popover onOpenChange={setOpen} open={open}>
            <PopoverTrigger asChild>
                <InputGroup
                    className={cn(
                        "w-full font-normal px-1",
                        isMulti && "h-auto min-h-8",
                        !hasValue && "text-muted-foreground",
                        className,
                    )}
                    role="combobox"
                >
                    {isMulti && selectedItems.length > 0 ? (
                        <InputGroupText className="flex flex-wrap gap-1 w-full">
                            {selectedItems.length >= 3 ? (
                                <Badge variant="secondary">
                                    {t("common.selectedCount", {
                                        count: String(selectedItems.length),
                                    })}
                                </Badge>
                            ) : (
                                selectedItems.map((item) => (
                                    <Badge key={item.value} variant="secondary">
                                        {item.label}
                                        <Button
                                            className="-me-1 rounded-sm opacity-50 hover:opacity-100"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleRemove(item.value);
                                            }}
                                            onKeyDown={(e) => {
                                                if (
                                                    e.key === "Enter" ||
                                                    e.key === " "
                                                ) {
                                                    e.stopPropagation();
                                                    handleRemove(item.value);
                                                }
                                            }}
                                            tabIndex={-1}
                                            type="button"
                                            variant="ghost"
                                        >
                                            <XIcon />
                                        </Button>
                                    </Badge>
                                ))
                            )}
                        </InputGroupText>
                    ) : (
                        <InputGroupAddon
                            align="inline-start"
                            className="w-full justify-start truncate"
                        >
                            {!isMulti && selectedItems[0]?.label
                                ? selectedItems[0].label
                                : placeholder}
                        </InputGroupAddon>
                    )}
                    {hasValue && (
                        <InputGroupButton
                            onClick={handleClear}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                    e.stopPropagation();
                                    handleClear(
                                        e as unknown as React.MouseEvent,
                                    );
                                }
                            }}
                            tabIndex={-1}
                        >
                            <XIcon />
                        </InputGroupButton>
                    )}
                    <InputGroupButton>
                        <ChevronDownIcon />
                    </InputGroupButton>
                </InputGroup>
            </PopoverTrigger>
            <PopoverContent
                align="start"
                className="w-(--radix-popover-trigger-width) p-0"
            >
                <Command shouldFilter={!onSearch}>
                    <CommandInput
                        onValueChange={handleSearchChange}
                        placeholder={placeholder}
                        value={search}
                    />
                    <CommandList>
                        {loading ? (
                            <div className="flex items-center justify-center py-4">
                                <Spinner className="size-4" />
                            </div>
                        ) : insufficientChars ? (
                            <p className="py-4 text-center text-muted-foreground text-xs">
                                {t("common.typeAtLeast", { count: String(minChars) })}
                            </p>
                        ) : (
                            <>
                                <CommandEmpty>{emptyText}</CommandEmpty>
                                {items.map((item) => {
                                    const isSelected = selectedValues.has(
                                        item.value,
                                    );
                                    return (
                                        <CommandItem
                                            data-checked={isSelected}
                                            key={item.value}
                                            keywords={
                                                item.description
                                                    ? [item.description]
                                                    : undefined
                                            }
                                            onSelect={() => handleSelect(item)}
                                            value={item.label}
                                        >
                                            <span className="flex min-w-0 flex-col gap-0.5">
                                                <span>
                                                    {onSearch ? (
                                                        <HighlightMatch
                                                            query={search}
                                                            text={item.label}
                                                        />
                                                    ) : (
                                                        item.label
                                                    )}
                                                </span>
                                                {item.description && (
                                                    <span className="text-[0.625rem] text-muted-foreground leading-snug">
                                                        {onSearch ? (
                                                            <HighlightMatch
                                                                query={search}
                                                                text={
                                                                    item.description
                                                                }
                                                            />
                                                        ) : (
                                                            item.description
                                                        )}
                                                    </span>
                                                )}
                                            </span>
                                        </CommandItem>
                                    );
                                })}
                            </>
                        )}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}

export { SearchLookup, type LookupItem, type SearchLookupProps };
