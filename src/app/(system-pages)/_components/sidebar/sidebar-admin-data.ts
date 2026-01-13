import {
    LayoutDashboardIcon,
} from "lucide-react";

import type { ScreenKey } from "@/auth/core";
import { useTranslation } from "@/lib/i18n/useTranslation";

type NavLink = {
    screenKey: ScreenKey;
    icon: React.ComponentType<any>;
    label: string;
    url: string;
};

export const useMainNavLinks = (): (NavLink & {
    children?: NavLink[];
})[] => {
    const { t } = useTranslation();

    return [
        {
            screenKey: "dashboard",
            icon: LayoutDashboardIcon,
            label: t("common.dashboard"),
            url: "/dashboard",
        },
    ];
};
