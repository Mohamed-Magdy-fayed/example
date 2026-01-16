"use client";

import { useTransition } from "react";
import { toast } from "sonner";

import { beginEmailVerificationAction } from "@/auth/nextjs/actions";
import { useAuth } from "@/auth/nextjs/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Status, StatusIndicator, StatusLabel } from "@/components/ui/status";
import { H3, P } from "@/components/ui/typography";
import { useTranslation } from "@/lib/i18n/useTranslation";

export function EmailVerificationNotice({
    isVerified,
}: {
    isVerified?: boolean;
}) {
    const { t } = useTranslation();
    const { session } = useAuth();
    const [isPending, startTransition] = useTransition();

    if (isVerified) {
        return (
            <Status variant="success">
                <StatusIndicator />
                <StatusLabel>
                    {t("authTranslations.emailVerification.alreadyVerifiedNote")}
                </StatusLabel>
            </Status>
        );
    }

    return (
        <div>
            <H3>{t("authTranslations.emailVerification.notice.title")}</H3>
            <P>{session?.user.email}</P>
            <Status variant="error">
                <StatusIndicator />
                <StatusLabel>
                    {t("authTranslations.emailVerification.heading")}
                </StatusLabel>
            </Status>
            <div className="flex items-center gap-4 pt-4">
                <Button
                    disabled={isPending}
                    onClick={() => {
                        startTransition(async () => {
                            const res = await beginEmailVerificationAction();
                            if (res.isError) {
                                toast.error(res.message);
                            }

                            toast.success(t("authTranslations.emailVerification.sent"));
                        });
                    }}
                    type="button"
                >
                    {isPending
                        ? t("authTranslations.emailVerification.notice.sending")
                        : t("authTranslations.emailVerification.notice.sendButton")}
                </Button>
                <Button variant="destructive">{t("common.cancel")}</Button>
            </div>
        </div>
    );
}
