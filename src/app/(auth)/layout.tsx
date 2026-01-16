import type { ReactNode } from "react";
import { AuthPlaceholder } from "@/auth/nextjs/components/auth-page-placeholder";
import { Card, CardContent } from "@/components/ui/card";

type AuthLayoutProps = {
    children: ReactNode;
};

export default function AuthLayout({ children }: AuthLayoutProps) {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
            <div className="w-full max-w-sm md:max-w-4xl">
                <Card className="overflow-hidden p-0">
                    <CardContent className="grid p-0 md:grid-cols-2">
                        <div className="p-4">{children}</div>
                        <div className="relative hidden bg-muted p-4 md:block">
                            <AuthPlaceholder />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
