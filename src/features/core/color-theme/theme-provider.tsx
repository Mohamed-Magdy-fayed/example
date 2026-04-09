"use client";

import { createContext, type PropsWithChildren, startTransition, use } from "react";

import { setThemeCookie, type Theme } from "@/features/core/color-theme/theme";

type ThemeContextVal = { theme: Theme; setTheme: (data: Theme) => void };
type Props = PropsWithChildren<{ theme: Theme }>;

const ThemeContext = createContext<ThemeContextVal | null>(null);

export function ThemeProvider({ children, theme }: Props) {
	function setTheme(val: Theme) {
		document.documentElement.classList.toggle('dark')
		startTransition(async () => {
			await setThemeCookie(val);
		})
	}

	return (
		<ThemeContext.Provider value={{ theme, setTheme }}>
			{children}
		</ThemeContext.Provider>
	);
}

export function useTheme() {
	const val = use(ThemeContext);
	if (!val) throw new Error("useTheme called outside of ThemeProvider!");
	return val;
}
