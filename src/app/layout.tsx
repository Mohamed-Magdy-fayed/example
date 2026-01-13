import "./globals.css";

import type { Metadata } from "next";
import { Figtree, Geist } from "next/font/google";
import Providers from "@/app/providers";
import { getLocaleCookie } from "@/lib/i18n/actions";
import { cn } from "@/lib/utils";

const figtree = Figtree({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
	title: "Gateling Example",
	description: "Gateling full stack application blueprint",
	icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
	subsets: ["latin"],
	variable: "--font-geist-sans",
});

export default async function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	const locale = await getLocaleCookie();

	return (
		<html
			className={cn(geist.variable, figtree.variable)}
			dir={locale === "ar" ? "rtl" : "ltr"}
			lang={locale}
			suppressHydrationWarning
		>
			<body>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
