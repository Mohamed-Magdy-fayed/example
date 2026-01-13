import Image from "next/image";

// import { ForgotPasswordForm } from "@/auth/nextjs/components/forgot-password-form";
import { Card, CardContent } from "@/components/ui/card";
import { getT } from "@/lib/i18n/actions";

export default async function ForgotPasswordPage() {
    const { t } = await getT();

    return (
        <main className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
            <div className="w-full max-w-sm md:max-w-4xl">
                <div className="flex flex-col gap-6">
                    <Card className="overflow-hidden p-0">
                        <CardContent className="grid p-0 md:grid-cols-2">
                            {/* <ForgotPasswordForm /> */}
                            <div className="relative hidden bg-muted md:block">
                                <Image
                                    alt={t("authTranslations.signIn.imageAlt")}
                                    className="object-cover"
                                    fill
                                    sizes="(min-width: 768px) 50vw, 100vw"
                                    src="/placeholder.png"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </main>
    );
}
