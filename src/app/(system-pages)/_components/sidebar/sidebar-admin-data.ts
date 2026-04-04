import {
    LayoutDashboardIcon,
    UsersIcon,
} from "lucide-react";

import type { ScreenKey } from "@/features/core/auth/core";
import { useTranslation } from "@/features/core/i18n/useTranslation";

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
        {
            screenKey: "employee",
            icon: UsersIcon,
            label: t("employeeTranslations.sidebarMenuLabel"),
            url: "/employee",
        },
    ];
};
