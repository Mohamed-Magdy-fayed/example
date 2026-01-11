import type { Cookies, PartialUser, SessionPayload } from "@/auth/types";
import { env } from "@/env/server";

// Seven days in seconds
const SESSION_EXPIRATION_SECONDS = 60 * 60 * 24 * 7;
const COOKIE_SESSION_KEY = "session-id";

function base64UrlEncode(data: string) {
	return Buffer.from(data, "utf8")
		.toString("base64")
		.replace(/\+/g, "-")
		.replace(/\//g, "_")
		.replace(/=/g, "");
}

function base64UrlDecode(encoded: string) {
	let input = encoded.replace(/-/g, "+").replace(/_/g, "/");
	while (input.length % 4) input += "=";
	return Buffer.from(input, "base64").toString("utf8");
}

async function getCryptoKey() {
	const keyData = new TextEncoder().encode(env.JWT_SECRET_KEY);
	return crypto.subtle.importKey(
		"raw",
		keyData,
		{ name: "HMAC", hash: "SHA-256" },
		false,
		["sign", "verify"],
	);
}

export async function createSession(
	user: PartialUser,
	cookies: Pick<Cookies, "set">,
): Promise<void> {
	const expirationTime =
		Math.floor(Date.now() / 1000) + SESSION_EXPIRATION_SECONDS;
	const payload: SessionPayload = {
		sessionId: crypto.randomUUID(),
		exp: expirationTime,
		user,
	};

	const header = { alg: "HS256", typ: "JWT" };
	const encodedHeader = base64UrlEncode(JSON.stringify(header));
	const encodedPayload = base64UrlEncode(JSON.stringify(payload));
	const dataToSign = `${encodedHeader}.${encodedPayload}`;

	const key = await getCryptoKey();
	const signature = await crypto.subtle.sign(
		"HMAC",
		key,
		new TextEncoder().encode(dataToSign),
	);
	const encodedSignature = base64UrlEncode(
		String.fromCharCode(...new Uint8Array(signature)),
	);

	const token = `${dataToSign}.${encodedSignature}`;

	cookies.set(COOKIE_SESSION_KEY, token, {
		secure: env.NODE_ENV === "production",
		httpOnly: true,
		sameSite: "lax",
		path: "/",
		expires: new Date(expirationTime * 1000),
	});
}

export async function getSessionFromCookie(
	cookies: Pick<Cookies, "get">,
): Promise<SessionPayload["user"] | null> {
	const token = cookies.get(COOKIE_SESSION_KEY)?.value;
	if (!token) return null;

	const parts = token.split(".");
	if (parts.length !== 3) return null;

	const [encodedHeader, encodedPayload, encodedSignature] = parts;
	if (!encodedHeader || !encodedPayload || !encodedSignature) return null;

	const key = await getCryptoKey();
	const dataToVerify = `${encodedHeader}.${encodedPayload}`;
	const signature = new Uint8Array(
		Array.from(base64UrlDecode(encodedSignature), (c) => c.charCodeAt(0)),
	);

	const isValid = await crypto.subtle.verify(
		"HMAC",
		key,
		signature,
		new TextEncoder().encode(dataToVerify),
	);

	if (!isValid) return null;

	const payload = JSON.parse(base64UrlDecode(encodedPayload)) as SessionPayload;
	if (Date.now() > payload.exp * 1000) return null;

	return payload.user;
}

export function removeSession(cookies: Pick<Cookies, "delete">) {
	cookies.delete(COOKIE_SESSION_KEY);
}

export async function refreshSession(
	cookies: Pick<Cookies, "get" | "set">,
) {
	const session = await getSessionFromCookie(cookies);
	if (!session) return;

	await createSession(session, cookies);
}
