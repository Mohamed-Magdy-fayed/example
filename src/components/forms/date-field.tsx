"use client";

import {
    type DateSelection,
    SelectDateField,
} from "@/components/general/select-date-field";
import type { Calendar } from "@/components/ui/calendar";
import { FormBase, type FormFieldProps } from "./form-base";
import { useFieldContext } from "./hooks";

type FormDateFieldProps = FormFieldProps & {
    placeholder?: string;
    title?: string;
    mode?: "single" | "multiple" | "range";
    disabled?: boolean;
    disabledDays?: React.ComponentProps<typeof Calendar>["disabled"];
};

export function FormDateField({
    placeholder,
    title,
    mode = "single",
    disabled,
    disabledDays,
    ...props
}: FormDateFieldProps) {
    const field = useFieldContext();

    return (
        <FormBase {...props}>
            <SelectDateField
                disabled={disabled}
                disabledDays={disabledDays}
                mode={mode}
                placeholder={placeholder}
                setValue={(val) => field.handleChange(val)}
                title={title ?? props.label}
                value={field.state.value as DateSelection}
            />
        </FormBase>
    );
}
