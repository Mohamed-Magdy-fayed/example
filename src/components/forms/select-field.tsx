"use client";

import { useCallback } from "react";

import { SelectField } from "@/components/general/select-field";
import { FormBase, type FormFieldProps } from "./form-base";
import { useFieldContext } from "./hooks";

type SelectOption = {
    value: string;
    label: string;
};

type FormSelectFieldProps = FormFieldProps & {
    options: SelectOption[];
    placeholder?: string;
    multiple?: boolean;
};

export function FormSelectField({
    options,
    placeholder,
    multiple,
    ...props
}: FormSelectFieldProps) {
    const field = useFieldContext();

    const setSingleValue = useCallback(
        (val: string | null) => field.handleChange(val ?? ""),
        [field.handleChange],
    );

    const setMultipleValue = useCallback(
        (val: string[] | null) => field.handleChange(val ?? []),
        [field.handleChange],
    );

    if (multiple) {
        return (
            <FormBase {...props}>
                <SelectField
                    multiple
                    options={options}
                    placeholder={placeholder}
                    setValue={setMultipleValue}
                    value={field.state.value as string[]}
                />
            </FormBase>
        );
    }

    return (
        <FormBase {...props}>
            <SelectField
                options={options}
                placeholder={placeholder}
                setValue={setSingleValue}
                value={field.state.value as string}
            />
        </FormBase>
    );
}
