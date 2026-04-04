"use server";

import { cookies } from "next/headers";
import * as z from "zod";

const postThemeValidator = z.union([z.literal("light"), z.literal("dark")]);
export type Theme = z.infer<typeof postThemeValidator>;
const storageKey = "gateling-theme";

export async function getThemeFromCookie() {
	return (await cookies()).get(storageKey)?.value as Theme;
}

export async function setThemeCookie(data?: Theme) {
	const cookieStore = await cookies();
	if (!data) {
		cookieStore.delete(storageKey);
		return;
	}
	cookieStore.set(storageKey, data);
}
