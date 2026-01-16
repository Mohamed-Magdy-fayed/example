import { type NextRequest, NextResponse } from "next/server";
import { getSessionFromCookie, hasPermission, refreshSession, type ScreenKey } from "@/auth/core";

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
    const pathname = request.nextUrl.pathname;

    const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));

    if (!user) {
        if (isAuthRoute) {
            return NextResponse.next();
        } else {
            return NextResponse.redirect(new URL("/sign-in", request.url));
        }
    } else {
        if (isAuthRoute) {
            return NextResponse.redirect(new URL("/", request.url));
        } else {
            const screenKey = request.nextUrl.pathname as unknown as ScreenKey;
            if (!hasPermission(user, "screens", "view", { screenKey })) {
                return NextResponse.rewrite(new URL("/unauthorized", request.url));
            } else {
                return NextResponse.next();
            }
        }
    }
}

export const config = {
    matcher: [
        "/((?!_next)(?!api)(?!unauthorized)(?!$)(?![^?]*\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    ],
};
