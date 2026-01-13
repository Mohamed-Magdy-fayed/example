// "use client";

// import { useTransition } from "react";

// import type { OAuthProvider } from "@/auth/tables/user-oauth-accounts-table";
// import { Button } from "@/components/ui/button";
// import { useTranslation } from "@/lib/i18n/useTranslation";
// import { api } from "@/trpc/react";

// type OAuthConnectionControlsProps = {
// 	provider: OAuthProvider;
// 	connected: boolean;
// 	onDisconnected?: (provider: OAuthProvider, message?: string) => void;
// 	onError?: (message: string) => void;
// };

// export function OAuthConnectionControls({
// 	provider,
// 	connected,
// 	onDisconnected,
// 	onError,
// }: OAuthConnectionControlsProps) {
// 	const { t } = useTranslation();
// 	const [isPending, startTransition] = useTransition();
// 	const disconnect = api.auth.oauth.disconnect.useMutation();

// 	async function startOAuth(provider: OAuthProvider) {
// 		const res = await fetch("/api/oauth/start", {
// 			method: "POST",
// 			headers: { "Content-Type": "application/json" },
// 			body: JSON.stringify({ provider }),
// 		});
// 		if (!res.ok) {
// 			const message = await res.text();
// 			throw new Error(
// 				message || t("authTranslations.oauth.error.connectFailed"),
// 			);
// 		}
// 		const data = (await res.json()) as { url?: string };
// 		if (!data.url)
// 			throw new Error(t("authTranslations.oauth.error.connectFailed"));
// 		window.location.href = data.url;
// 	}

// 	if (connected) {
// 		return (
// 			<Button
// 				disabled={isPending}
// 				onClick={() => {
// 					startTransition(async () => {
// 						try {
// 							await disconnect.mutateAsync({ provider });
// 							onDisconnected?.(provider);
// 						} catch (error) {
// 							const message =
// 								error instanceof Error && error.message
// 									? error.message
// 									: t("authTranslations.oauth.connections.disconnectFailed");
// 							if (onError) {
// 								onError(message);
// 								return;
// 							}
// 							window.alert(message);
// 						}
// 					});
// 				}}
// 				size="sm"
// 				variant="destructive"
// 			>
// 				{isPending
// 					? t("authTranslations.oauth.connections.disconnecting")
// 					: t("authTranslations.oauth.connections.disconnect")}
// 			</Button>
// 		);
// 	}

// 	return (
// 		<Button
// 			disabled={isPending}
// 			onClick={() => {
// 				startTransition(async () => {
// 					try {
// 						await startOAuth(provider);
// 					} catch (error) {
// 						const message =
// 							error instanceof Error && error.message
// 								? error.message
// 								: t("authTranslations.oauth.error.connectFailed");
// 						if (onError) {
// 							onError(message);
// 							return;
// 						}
// 						window.alert(message);
// 					}
// 				});
// 			}}
// 			size="sm"
// 			variant="outline"
// 		>
// 			{isPending
// 				? t("authTranslations.oauth.connections.connecting")
// 				: t("authTranslations.oauth.connections.connect")}
// 		</Button>
// 	);
// }
