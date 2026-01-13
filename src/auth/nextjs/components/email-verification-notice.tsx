// "use client";

// import { useState, useTransition } from "react";

// import { Button } from "@/components/ui/button";
// import { useTranslation } from "@/lib/i18n/useTranslation";
// import { api } from "@/trpc/react";

// type EmailVerificationNoticeProps = { isVerified: boolean };

// type NoticeStatus = { success: boolean; message: string };

// export function EmailVerificationNotice({
// 	isVerified,
// }: EmailVerificationNoticeProps) {
// 	const { t } = useTranslation();
// 	const [status, setStatus] = useState<NoticeStatus | null>(null);
// 	const [isPending, startTransition] = useTransition();
// 	const sendVerification = api.auth.email.sendVerification.useMutation();

// 	if (isVerified) {
// 		return (
// 			<p className="text-muted-foreground text-sm">
// 				{t("authTranslations.emailVerification.alreadyVerifiedNote")}
// 			</p>
// 		);
// 	}

// 	return (
// 		<div className="rounded-md border border-amber-300 bg-amber-50 p-4 text-amber-900 text-sm shadow-sm dark:border-amber-800 dark:bg-amber-950 dark:text-amber-100">
// 			<p className="font-medium">
// 				{t("authTranslations.emailVerification.notice.title")}
// 			</p>
// 			<p className="mt-1">
// 				{t("authTranslations.emailVerification.notice.description")}
// 			</p>
// 			{status && (
// 				<p
// 					className={`mt-2 ${status.success ? "text-emerald-700 dark:text-emerald-400" : "text-destructive dark:text-red-400"}`}
// 				>
// 					{status.message}
// 				</p>
// 			)}
// 			<Button
// 				className="mt-3"
// 				disabled={isPending}
// 				onClick={() => {
// 					startTransition(async () => {
// 						setStatus(null);
// 						try {
// 							const origin =
// 								typeof window !== "undefined" ? window.location.origin : "";
// 							await sendVerification.mutateAsync({ origin });
// 							setStatus({
// 								success: true,
// 								message: t("authTranslations.emailVerification.sent"),
// 							});
// 						} catch (error) {
// 							const message =
// 								error instanceof Error && error.message
// 									? error.message
// 									: t("authTranslations.emailVerification.error.sendFailed");
// 							setStatus({ success: false, message });
// 						}
// 					});
// 				}}
// 				size="sm"
// 				type="button"
// 				variant="outline"
// 			>
// 				{isPending
// 					? t("authTranslations.emailVerification.notice.sending")
// 					: t("authTranslations.emailVerification.notice.sendButton")}
// 			</Button>
// 		</div>
// 	);
// }
