import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";
import { Toaster } from "sonner";

import { DirectionProvider } from "@/app/providers/direction-provider";
import { getAuth, getOrganizations } from "@/auth/nextjs/actions";
import { AuthProvider } from "@/auth/nextjs/components/auth-provider";
import { OrganizationProvider } from "@/auth/nextjs/components/organization-provider";
import { getLocaleCookie } from "@/lib/i18n/actions";
import { TranslationProvider } from "@/lib/i18n/useTranslation";
import { TRPCReactProvider } from "@/trpc/react";

export default async function Providers({ children }: { children: ReactNode }) {
    const authContextValue = await getAuth();
    const organizationContextValue = await getOrganizations();
    const locale = await getLocaleCookie();

    return (
        <TranslationProvider defaultLocale={locale}>
            <AuthProvider value={authContextValue}>
                <OrganizationProvider value={organizationContextValue}>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="system"
                        disableTransitionOnChange
                        enableSystem
                    >
                        <DirectionProvider>
                            <TRPCReactProvider>{children}</TRPCReactProvider>
                            <Toaster />
                        </DirectionProvider>
                    </ThemeProvider>
                </OrganizationProvider>
            </AuthProvider>
        </TranslationProvider>
    );
}
