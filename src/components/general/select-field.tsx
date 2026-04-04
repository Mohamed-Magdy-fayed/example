"use client";

import * as React from "react";

import {
    Combobox,
    ComboboxChip,
    ComboboxChips,
    ComboboxChipsInput,
    ComboboxCollection,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
    useComboboxAnchor,
} from "@/components/ui/combobox";
import { useTranslation } from "@/features/core/i18n/useTranslation";

type SelectOption = {
    value: string;
    label: string;
};

type MultipleSelectFieldProps = {
    multiple: true;
    value: string[] | null;
    setValue: (val: string[] | null) => void;
};

type SingleSelectFieldProps = {
    multiple?: false;
    value: string | null;
    setValue: (val: string | null) => void;
};

type SelectFieldProps = {
    options: SelectOption[];
    placeholder?: string;
} & (MultipleSelectFieldProps | SingleSelectFieldProps);

export function SelectField({
    options,
    placeholder,
    multiple,
    value,
    setValue,
}: SelectFieldProps) {
    const { t } = useTranslation();

    if (multiple) {
        return (
            <SelectFieldMulti
                emptyText={t("common.empty")}
                onValueChange={(val) => setValue(val.length > 0 ? val : null)}
                options={options}
                placeholder={placeholder}
                value={value ?? []}
            />
        );
    }

    return (
        <SelectFieldSingle
            emptyText={t("common.empty")}
            onValueChange={setValue}
            options={options}
            placeholder={placeholder}
            value={value}
        />
    );
}

/* ─── Single-select ─── */

function SelectFieldSingle({
    options,
    value,
    onValueChange,
    placeholder = "Select…",
    emptyText = "No results.",
}: {
    options: SelectOption[];
    value: string | null;
    onValueChange: (val: string | null) => void;
    placeholder?: string;
    emptyText?: string;
}) {
    const itemValues = React.useMemo(
        () => options.map((o) => o.value),
        [options],
    );
    const optionsByValue = React.useMemo(
        () => new Map(options.map((o) => [o.value, o.label])),
        [options],
    );
    const toLabel = React.useCallback(
        (val: string) => options.find((o) => o.value === val)?.label ?? val,
        [options],
    );

    return (
        <Combobox
            items={itemValues}
            value={value}
            onValueChange={onValueChange}
            itemToStringLabel={toLabel}
        >
            <ComboboxInput
                placeholder={placeholder}
                showClear={!!value}
            />
            <ComboboxContent>
                <ComboboxList>
                    <ComboboxEmpty>{emptyText}</ComboboxEmpty>
                    <ComboboxCollection>
                        {(itemValue) => (
                            <ComboboxItem key={itemValue} value={itemValue}>
                                {optionsByValue.get(itemValue) ?? itemValue}
                            </ComboboxItem>
                        )}
                    </ComboboxCollection>
                </ComboboxList>
            </ComboboxContent>
        </Combobox>
    );
}

/* ─── Multi-select ─── */

function SelectFieldMulti({
    options,
    value,
    onValueChange,
    placeholder = "Select…",
    emptyText = "No results.",
}: {
    options: SelectOption[];
    value: string[];
    onValueChange: (val: string[]) => void;
    placeholder?: string;
    emptyText?: string;
}) {
    const anchor = useComboboxAnchor();
    const itemValues = React.useMemo(
        () => options.map((o) => o.value),
        [options],
    );
    const optionsByValue = React.useMemo(
        () => new Map(options.map((o) => [o.value, o.label])),
        [options],
    );
    const toLabel = React.useCallback(
        (val: string) => options.find((o) => o.value === val)?.label ?? val,
        [options],
    );
    const selectedOptions = React.useMemo(
        () => options.filter((o) => value.includes(o.value)),
        [options, value],
    );

    return (
        <Combobox
            items={itemValues}
            value={value}
            onValueChange={onValueChange}
            itemToStringLabel={toLabel}
            multiple
        >
            <ComboboxChips ref={anchor}>
                {selectedOptions.map((item) => (
                    <ComboboxChip key={item.value}>
                        {item.label}
                    </ComboboxChip>
                ))}
                <ComboboxChipsInput placeholder={placeholder} />
            </ComboboxChips>
            <ComboboxContent anchor={anchor}>
                <ComboboxList>
                    <ComboboxEmpty>{emptyText}</ComboboxEmpty>
                    <ComboboxCollection>
                        {(itemValue) => (
                            <ComboboxItem key={itemValue} value={itemValue}>
                                {optionsByValue.get(itemValue) ?? itemValue}
                            </ComboboxItem>
                        )}
                    </ComboboxCollection>
                </ComboboxList>
            </ComboboxContent>
        </Combobox>
    );
}
