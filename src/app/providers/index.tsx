import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";

import { DirectionProvider } from "@/app/providers/direction-provider";
import { getAuth, getOrganizations } from "@/auth/nextjs/actions";
import { AuthProvider } from "@/auth/nextjs/components/auth-provider";
import { OrganizationProvider } from "@/auth/nextjs/components/organization-provider";
import { Toaster } from "@/components/ui/sonner";
import { getLocaleCookie } from "@/lib/i18n/actions";
import { TranslationProvider } from "@/lib/i18n/useTranslation";
import { TRPCReactProvider } from "@/trpc/react";
import ClientOAuthError from "./client-oauth-error";

export default async function Providers({ children }: { children: ReactNode }) {
    const authContextValue = await getAuth();
    const organizationContextValue = authContextValue.isAuthenticated
        ? await getOrganizations()
        : null;
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
                            <ClientOAuthError />
                        </DirectionProvider>
                    </ThemeProvider>
                </OrganizationProvider>
            </AuthProvider>
        </TranslationProvider>
    );
}
