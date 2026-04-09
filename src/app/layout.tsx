import "./globals.css";

import type { Metadata } from "next";

import Providers from "@/app/_providers";
import { getThemeFromCookie } from "@/features/core/color-theme/theme";
import { getLocaleCookie } from "@/features/core/i18n/actions";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
	title: "Gateling Example",
	description: "Gateling full stack application blueprint",
	icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	const locale = await getLocaleCookie();
	const theme = await getThemeFromCookie();
	const dir = locale === "ar" ? "rtl" : "ltr";

	return (
		<html
			className={cn("ltr:font-sans rtl:font-arabic-sans", theme)}
			dir={dir}
			lang={locale}
			suppressHydrationWarning
		>
			<body>
				<Providers dir={dir} locale={locale} theme={theme}>
					{children}
				</Providers>
			</body>
		</html>
	);
}
