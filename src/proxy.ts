import { type NextRequest, NextResponse } from "next/server";
import { getSessionFromCookie, hasPermission, refreshSession, type ScreenKey } from "@/auth/core";

const publicRoutes = [
    "/api",
    "/",
];

const authRoutes = [
    "/sign-in",
    "/sign-up",
    "/forgot-password",
    "/reset-password",
];

export async function proxy(request: NextRequest) {
    const response = (await middlewareAuth(request)) ?? NextResponse.next();

    await refreshSession({
        set: response.cookies.set,
        get: response.cookies.get,
    });

    return response;
}

async function middlewareAuth(request: NextRequest) {
    const user = await getSessionFromCookie(request.cookies);

    if (publicRoutes.some(route => request.nextUrl.pathname.startsWith(route))) {
        return NextResponse.next();
    }

    if (authRoutes.some(route => request.nextUrl.pathname.startsWith(route)) && user != null) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    if (user == null) {
        return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    const screenKey = request.nextUrl.pathname as unknown as ScreenKey;
    if (!hasPermission(user, "screens", "view", { screenKey })) {
        return NextResponse.rewrite(new URL("/unauthorized", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    ],
};
