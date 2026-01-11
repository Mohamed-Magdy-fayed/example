import { AuthPlaceholder } from "@/auth/nextjs/components/auth-page-placeholder";
import { SignInForm } from "@/auth/nextjs/components/sign-in-form";
import { Card, CardContent } from "@/components/ui/card";

export default async function SignInPage() {
    return (
        <main className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
            <div className="w-full max-w-sm md:max-w-4xl">
                <div className="flex flex-col gap-6">
                    <Card className="overflow-hidden p-0">
                        <CardContent className="grid p-0 md:grid-cols-2">
                            <SignInForm />
                            <div className="relative hidden bg-muted md:block">
                                <AuthPlaceholder />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </main>
    );
}
