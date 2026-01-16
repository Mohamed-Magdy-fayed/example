"use client";

import { useEffect } from "react";
import { toast } from "sonner";

export function ClientOAuthError() {
    useEffect(() => {
        try {
            const cookie = document.cookie
                .split("; ")
                .find((c) => c.startsWith("oauthError="));
            if (!cookie) return;
            const value = decodeURIComponent(cookie.split("=")[1] || "");
            if (value) toast.error(value);
            // clear the cookie
            document.cookie = "oauthError=; path=/; max-age=0";
        } catch (e) {
            // ignore
        }
    }, []);

    return null;
}

export default ClientOAuthError;
