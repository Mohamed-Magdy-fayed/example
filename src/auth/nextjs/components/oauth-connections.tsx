// "use client";

// import { useMemo } from "react";

// import { useTranslation } from "@/lib/i18n/useTranslation";
// import { api } from "@/trpc/react";
// import { OAuthConnectionControls } from "./oauth-connection-controls";

// function formatDate(value: Date | null) {
// 	if (!value) return null;
// 	return new Intl.DateTimeFormat(undefined, {
// 		dateStyle: "medium",
// 		timeStyle: "short",
// 	}).format(value);
// }

// export function OAuthConnections() {
// 	const { t } = useTranslation();
// 	const connectionsQuery = api.auth.oauth.listConnections.useQuery();

// 	const content = useMemo(() => {
// 		if (connectionsQuery.isLoading) {
// 			return (
// 				<p className="text-muted-foreground text-sm">
// 					{t("authTranslations.oauth.connections.loading")}
// 				</p>
// 			);
// 		}

// 		if (connectionsQuery.error) {
// 			return (
// 				<p className="text-destructive text-sm">
// 					{connectionsQuery.error.message || t("authTranslations.oauth.connections.loadError")}
// 				</p>
// 			);
// 		}

// 		const connections = connectionsQuery.data ?? [];
// 		if (connections.length === 0) {
// 			return (
// 				<p className="text-muted-foreground text-sm">
// 					{t("authTranslations.oauth.connections.empty")}
// 				</p>
// 			);
// 		}

// 		return connections.map((connection) => {
// 			const connectedAt = formatDate(connection.connectedAt ?? null);
// 			const statusCopy = connection.connected
// 				? connectedAt
// 					? t("authTranslations.oauth.connections.connectedAt", {
// 						date: connectedAt,
// 					})
// 					: t("authTranslations.oauth.connections.connected")
// 				: t("authTranslations.oauth.connections.notConnected");

// 			return (
// 				<div
// 					className="flex items-center justify-between rounded-md border border-muted-foreground/20 p-3"
// 					key={connection.provider}
// 				>
// 					<div>
// 						<p className="font-medium">{connection.displayName}</p>
// 						<p className="text-muted-foreground text-sm">{statusCopy}</p>
// 					</div>
// 					<OAuthConnectionControls
// 						connected={connection.connected}
// 						provider={connection.provider}
// 					/>
// 				</div>
// 			);
// 		});
// 	}, [connectionsQuery.data, connectionsQuery.error, connectionsQuery.isLoading, t]);

// 	return <div className="space-y-3">{content}</div>;
// }
