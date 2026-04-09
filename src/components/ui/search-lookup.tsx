"use client";

import { ChevronDownIcon, XIcon } from "lucide-react";
import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput,
    InputGroupText,
} from "@/components/ui/input-group";
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
    maxResults?: number;
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
    const { t } = useTranslation();
    const {
        items,
        placeholder = "Search...",
        emptyText = t("dataTableTranslations.noResults"),
        loading = false,
        onSearch,
        minChars = 0,
        maxResults = 10,
        className,
    } = props;

    const isMulti = props.multiple === true;

    const rootRef = React.useRef<HTMLDivElement>(null);
    const inputRef = React.useRef<HTMLInputElement>(null);

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

    React.useEffect(() => {
        if (isMulti) return;

        const selectedValue = props.value as string | null;
        if (!selectedValue) {
            setSearch("");
            return;
        }

        const selected = items.find((item) => item.value === selectedValue);
        if (selected) {
            setSearch(selected.label);
        }
    }, [isMulti, items, props.value]);

    React.useEffect(() => {
        if (!open) return;

        const handlePointerDown = (event: MouseEvent) => {
            if (!rootRef.current) return;
            if (!rootRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handlePointerDown);
        return () => {
            document.removeEventListener("mousedown", handlePointerDown);
        };
    }, [open]);

    React.useEffect(() => {
        if (!open) return;
        onSearch?.(search);
    }, [open, onSearch]);

    const handleSearchChange = React.useCallback(
        (val: string) => {
            setSearch(val);
            if (!open) {
                setOpen(true);
                return;
            }
            onSearch?.(val);
        },
        [onSearch, open],
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
                onSearch?.("");
                setOpen(true);
                inputRef.current?.focus();
            } else {
                (props.onValueChange as (val: string | null) => void)(item.value);
                setSearch(item.label);
                setOpen(false);
            }
        },
        [isMulti, onSearch, props.value, props.onValueChange],
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
            onSearch?.("");
        },
        [isMulti, onSearch, props.onValueChange],
    );

    const insufficientChars = minChars > 0 && search.length < minChars;

    const filteredItems = React.useMemo(() => {
        const trimmed = search.trim().toLowerCase();
        const source = onSearch
            ? items
            : items.filter((item) => {
                if (!trimmed) return true;
                return (
                    item.label.toLowerCase().includes(trimmed) ||
                    item.description?.toLowerCase().includes(trimmed)
                );
            });

        return source.slice(0, maxResults);
    }, [items, maxResults, onSearch, search]);

    const openLookup = React.useCallback(() => {
        setOpen(true);
    }, []);

    return (
        <div className={cn("relative w-full", className)} ref={rootRef}>
            <InputGroup
                className={cn(
                    "w-full px-1 font-normal",
                    isMulti && "h-auto min-h-8",
                    !hasValue && !search && "text-muted-foreground",
                )}
                role="combobox"
            >
                {isMulti && selectedItems.length > 0 ? (
                    <InputGroupText className="flex min-w-0 max-w-full flex-wrap gap-1 py-1">
                        {selectedItems.map((item) => (
                            <Badge key={item.value} variant="outline">
                                {item.label}
                                <Button
                                    className="rounded-full bg-transparent opacity-50 hover:bg-transparent hover:opacity-100"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleRemove(item.value);
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" || e.key === " ") {
                                            e.stopPropagation();
                                            handleRemove(item.value);
                                        }
                                    }}
                                    tabIndex={-1}
                                    type="button"
                                    variant="secondary"
                                >
                                    <XIcon />
                                </Button>
                            </Badge>
                        ))}
                    </InputGroupText>
                ) : null}

                <InputGroupInput
                    onChange={(e) => handleSearchChange(e.target.value)}
                    onFocus={openLookup}
                    placeholder={hasValue ? undefined : placeholder}
                    ref={inputRef}
                    value={search}
                />

                {(hasValue || search.length > 0) && (
                    <InputGroupButton
                        onClick={handleClear}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                                e.stopPropagation();
                                handleClear(e as unknown as React.MouseEvent);
                            }
                        }}
                        tabIndex={-1}
                    >
                        <XIcon />
                    </InputGroupButton>
                )}

                <InputGroupAddon align="inline-end" className="pe-0">
                    <InputGroupButton
                        onClick={() => {
                            const next = !open;
                            setOpen(next);
                            if (next) {
                                inputRef.current?.focus();
                            }
                        }}
                    >
                        <ChevronDownIcon
                            className={cn("transition-transform", open && "rotate-180")}
                        />
                    </InputGroupButton>
                </InputGroupAddon>
            </InputGroup>

            {open && (
                <div className="absolute top-full z-50 mt-1 w-full rounded-lg bg-popover p-0 text-popover-foreground shadow-md outline-hidden ring-1 ring-foreground/10">
                    <Command shouldFilter={false}>
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
                                    {filteredItems.map((item) => {
                                        const isSelected = selectedValues.has(item.value);
                                        return (
                                            <CommandItem
                                                data-checked={isSelected}
                                                key={item.value}
                                                keywords={
                                                    item.description ? [item.description] : undefined
                                                }
                                                onSelect={() => handleSelect(item)}
                                                value={item.label}
                                            >
                                                <span className="flex w-full min-w-0 items-center justify-between gap-3">
                                                    {item.description && (
                                                        <span
                                                            className="shrink-0 text-right text-[0.625rem] text-muted-foreground leading-snug"
                                                            dir="rtl"
                                                        >
                                                            <HighlightMatch
                                                                query={search}
                                                                text={item.description}
                                                            />
                                                        </span>
                                                    )}
                                                    <span className="min-w-0 truncate text-right">
                                                        <HighlightMatch query={search} text={item.label} />
                                                    </span>
                                                </span>
                                            </CommandItem>
                                        );
                                    })}
                                </>
                            )}
                        </CommandList>
                    </Command>
                </div>
            )}
        </div>
    );
}

export { SearchLookup, type LookupItem, type SearchLookupProps };
