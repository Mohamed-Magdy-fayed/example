"use client";

import PhoneInput, {
    type Country,
    parsePhoneNumber,
} from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { ChevronDownIcon } from "lucide-react";
import { type ComponentProps, memo, useCallback, useMemo } from "react";

import {
    ButtonGroup,
    ButtonGroupSeparator,
} from "@/components/ui/button-group";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput,
} from "@/components/ui/input-group";
import { useTranslation } from "@/features/core/i18n/useTranslation";
import { cn } from "@/lib/utils";

const countryOptions = [
    { code: "EG", label: "Egypt", flagUrl: "/flags/eg.png" },
    { code: "MA", label: "Morocco", flagUrl: "/flags/ma.png" },
    { code: "TN", label: "Tunisia", flagUrl: "/flags/tn.png" },
    { code: "DZ", label: "Algeria", flagUrl: "/flags/dz.png" },
    { code: "LY", label: "Libya", flagUrl: "/flags/ly.png" },
    { code: "JO", label: "Jordan", flagUrl: "/flags/jo.png" },
    { code: "LB", label: "Lebanon", flagUrl: "/flags/lb.png" },
    { code: "SY", label: "Syria", flagUrl: "/flags/sy.png" },
    { code: "IQ", label: "Iraq", flagUrl: "/flags/iq.png" },
    { code: "SA", label: "Saudi Arabia", flagUrl: "/flags/sa.png" },
    { code: "AE", label: "United Arab Emirates", flagUrl: "/flags/ae.png" },
    { code: "KW", label: "Kuwait", flagUrl: "/flags/kw.png" },
    { code: "OM", label: "Oman", flagUrl: "/flags/om.png" },
    { code: "QA", label: "Qatar", flagUrl: "/flags/qa.png" },
    { code: "BH", label: "Bahrain", flagUrl: "/flags/bh.png" },
    { code: "YE", label: "Yemen", flagUrl: "/flags/ye.png" },
];

const countryCodes = countryOptions.map((op) => op.code as Country);

interface MobileNumberInputProps {
    value: string;
    placeholder: string;
    inputProps?: ComponentProps<"input">;
    setValue: (val: string) => void;
    onError?: (isError: boolean) => void;
}

function PhoneContainer(props: ComponentProps<"div">) {
    return <InputGroup {...props} />;
}

function PhoneInputComponent(props: ComponentProps<"input">) {
    return (
        <InputGroupInput
            {...props}
            className={cn("rtl:text-end!", props.className)}
        />
    );
}

const CountrySelect = memo(function CountrySelect({
    onChange,
    value,
    iconComponent,
}: {
    onChange: (val: string) => void;
    value: string;
    iconComponent?: (props: { country: Country }) => React.ReactNode;
}) {
    const { t } = useTranslation();

    return (
        <InputGroupAddon align="inline-end">
            <DropdownMenu>
                <ButtonGroup>
                    <div className="grid place-content-center">
                        {iconComponent?.({ country: value as Country })}
                    </div>
                    <ButtonGroupSeparator className="mx-2" />
                    <DropdownMenuTrigger asChild>
                        <InputGroupButton tabIndex={-1} variant="ghost">
                            {value}
                            <ChevronDownIcon />
                        </InputGroupButton>
                    </DropdownMenuTrigger>
                </ButtonGroup>
                <DropdownMenuContent align="end">
                    <DropdownMenuGroup>
                        {countryOptions.map((option) => (
                            <DropdownMenuItem
                                key={option.code}
                                onSelect={() => onChange(option.code)}
                            >
                                {iconComponent?.({
                                    country: option.code as Country,
                                })}
                                {t("countries", { country: option.code })}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </InputGroupAddon>
    );
});

export const MobileNumberInput = memo(function MobileNumberInput({
    value,
    placeholder,
    inputProps,
    setValue,
    onError,
}: MobileNumberInputProps) {
    const handleChange = useCallback(
        (val: string | undefined) => {
            setValue(!val ? "" : val.toString().startsWith("+") ? val.slice(1) : val);

            if (val && onError) {
                const isInvalid = !parsePhoneNumber(val)?.isValid();
                onError(isInvalid);
            }
        },
        [setValue, onError],
    );

    const formattedValue = useMemo(() => (value ? `+${value}` : value), [value]);

    return (
        <PhoneInput
            addInternationalOption={false}
            autoComplete="off"
            containerComponent={PhoneContainer}
            countries={countryCodes}
            countrySelectComponent={CountrySelect}
            defaultCountry="EG"
            inputComponent={PhoneInputComponent}
            limitMaxLength={true}
            numberInputProps={inputProps}
            onChange={handleChange}
            placeholder={placeholder}
            value={formattedValue}
        />
    );
});
