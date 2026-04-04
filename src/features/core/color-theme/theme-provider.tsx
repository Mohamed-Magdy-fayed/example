"use client";

import { ThemeProvider as NextThemeProvider, useTheme } from "next-themes";
import { useEffect } from "react";

import { setThemeCookie } from "@/features/core/color-theme/theme";

export { useTheme };

export function ThemeProvider({
	children,
	defaultTheme,
	...props
}: React.ComponentProps<typeof NextThemeProvider>) {
	const { theme } = useTheme();

	useEffect(() => {
		setThemeCookie(theme as "light" | "dark");
	}, [theme]);

	return (
		<NextThemeProvider
			attribute="class"
			defaultTheme={defaultTheme}
			disableTransitionOnChange
			enableSystem
			{...props}
		>
			{children}
		</NextThemeProvider>
	);
}
