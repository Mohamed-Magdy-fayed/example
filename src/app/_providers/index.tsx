import { DirectionProvider } from "@base-ui/react";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import type { ReactNode } from "react";

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getAuth, getBranches } from "@/features/core/auth/nextjs/actions";
import { AuthProvider } from "@/features/core/auth/nextjs/components/auth-provider";
import { BranchProvider } from "@/features/core/auth/nextjs/components/branch-provider";
import { ThemeProvider } from "@/features/core/color-theme/theme-provider";
import { TranslationProvider } from "@/features/core/i18n/useTranslation";

export default async function Providers({
    locale,
    dir,
    theme,
    children,
}: {
    locale: string;
    dir: "ltr" | "rtl";
    theme: "light" | "dark";
    children: ReactNode;
}) {
    const authContextValue = await getAuth();
    const branchContextValue = authContextValue.isAuthenticated
        ? await getBranches()
        : null;

    return (
        <TranslationProvider defaultLocale={locale}>
            <AuthProvider value={authContextValue}>
                <TooltipProvider>
                    <BranchProvider value={branchContextValue}>
                        <ThemeProvider theme={theme}>
                            <DirectionProvider direction={dir}>
                                <NuqsAdapter>
                                    {children}
                                    <Toaster />
                                </NuqsAdapter>
                            </DirectionProvider>
                        </ThemeProvider>
                    </BranchProvider>
                </TooltipProvider>
            </AuthProvider>
        </TranslationProvider>
    );
}
