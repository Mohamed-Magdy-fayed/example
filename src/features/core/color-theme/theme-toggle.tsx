"use client";

import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Swap, SwapOff, SwapOn } from "@/components/ui/swap";
import { useTheme } from "@/features/core/color-theme/theme-provider";

export function ThemeToggle() {
	const { theme, setTheme } = useTheme();

	return (
		<Button aria-label="Toggle theme" asChild variant="ghost">
			<Swap
				animation="rotate"
				onSwappedChange={(val) => setTheme(val ? "dark" : "light")}
				swapped={theme === "dark"}
			>
				<SwapOn>
					<Moon />
				</SwapOn>
				<SwapOff>
					<Sun />
				</SwapOff>
			</Swap>
		</Button>
	);
}
