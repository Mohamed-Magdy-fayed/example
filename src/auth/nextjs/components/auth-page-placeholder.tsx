"use client";

import { FingerprintPattern, LockIcon, ShieldCheckIcon } from "lucide-react";
import { Lead } from "@/components/ui/typography";
import { useTranslation } from "@/lib/i18n/useTranslation";

export function AuthPlaceholder() {
    const { t } = useTranslation();

    return (
        <div className="grid h-full w-full place-content-center gap-4">
            <div className="grid grid-cols-2 gap-4">
                <ShieldCheckIcon />
                <FingerprintPattern />
                <LockIcon />
            </div>
            <Lead className="text-center font-mono text-2xl text-foreground text-shadow-lg text-shadow-primary">
                {t("appName")}
            </Lead>
        </div>
    );
}
