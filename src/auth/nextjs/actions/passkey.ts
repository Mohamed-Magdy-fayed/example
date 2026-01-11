"use server";

import type {
    AuthenticationResponseJSON,
    AuthenticatorTransportFuture,
    RegistrationResponseJSON,
    Uint8Array_,
    WebAuthnCredential,
} from "@simplewebauthn/server";
import {
    generateAuthenticationOptions,
    generateRegistrationOptions,
    verifyAuthenticationResponse,
    verifyRegistrationResponse,
} from "@simplewebauthn/server";
import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";

import { normalizeEmail } from "@/auth/core/helpers";
import { hashTokenValue } from "@/auth/core/token";
import {
    BiometricCredentialsTable,
    UsersTable,
    UserTokensTable,
} from "@/auth/tables";
import type {
    AuthenticationOptionsResult,
    PartialUser,
    PasskeyListItem,
    RegistrationOptionsResult,
    TypedResponse,
} from "@/auth/types";
import { env } from "@/env/server";
import { getT } from "@/lib/i18n/actions";
import { db } from "@/server/db";

const PASSKEY_CHALLENGE_TTL_MS = 1000 * 60 * 10;
const EXPECTED_ORIGIN = new URL(env.BASE_URL).origin;

const emailSchema = z.email();
const userIdSchema = z.uuid();
const deletePasskeySchema = z.object({ id: z.uuid(), userId: userIdSchema });
const authResponseSchema = z.custom<AuthenticationResponseJSON>();
const registrationResponseSchema = z.custom<RegistrationResponseJSON>();

const textEncoder = new TextEncoder();

const base64UrlRegex = /-/g;
const underscoreRegex = /_/g;

function normalizeBase64(base64Url: string) {
    const padding = "=".repeat((4 - (base64Url.length % 4)) % 4);
    return (base64Url + padding)
        .replace(base64UrlRegex, "+")
        .replace(underscoreRegex, "/");
}

function base64UrlToBuffer(value: string): Uint8Array {
    const cleaned = normalizeBase64(value);
    const buffer = Buffer.from(cleaned, "base64");
    return new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength);
}

function bufferToBase64Url(value: Uint8Array): string {
    const base64 = Buffer.from(value).toString("base64");
    return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/u, "");
}

function getRpId() {
    try {
        return new URL(env.BASE_URL).hostname;
    } catch (error) {
        console.error("Unable to derive RP ID", error);
        return null;
    }
}

async function upsertChallengeToken(options: {
    userId: string;
    challenge: string;
    operation: "passkey-registration" | "passkey-authentication";
}) {
    const challengeHash = hashTokenValue(options.challenge);
    const expiresAt = new Date(Date.now() + PASSKEY_CHALLENGE_TTL_MS);

    await db
        .delete(UserTokensTable)
        .where(
            and(
                eq(UserTokensTable.userId, options.userId),
                eq(UserTokensTable.type, "device_trust"),
            ),
        );

    await db.insert(UserTokensTable).values({
        userId: options.userId,
        tokenHash: challengeHash,
        type: "device_trust",
        expiresAt,
        metadata: { operation: options.operation, challenge: options.challenge },
    });
}

async function consumeChallengeToken(options: {
    userId: string;
    operation: "passkey-registration" | "passkey-authentication";
}) {
    const record = await db.query.UserTokensTable.findFirst({
        columns: {
            id: true,
            metadata: true,
            expiresAt: true,
            consumedAt: true,
            tokenHash: true,
        },
        where: and(
            eq(UserTokensTable.userId, options.userId),
            eq(UserTokensTable.type, "device_trust"),
        ),
        orderBy: [desc(UserTokensTable.createdAt)],
    });

    if (!record) return null;

    const metadata = (record.metadata ?? {}) as Record<string, unknown>;
    if (metadata.operation !== options.operation) {
        return null;
    }

    const challenge =
        typeof metadata.challenge === "string" ? metadata.challenge : null;

    if (!challenge) {
        await db.delete(UserTokensTable).where(eq(UserTokensTable.id, record.id));
        return null;
    }

    if (record.consumedAt != null || record.expiresAt.getTime() <= Date.now()) {
        await db.delete(UserTokensTable).where(eq(UserTokensTable.id, record.id));
        return null;
    }

    if (hashTokenValue(challenge) !== record.tokenHash) {
        await db.delete(UserTokensTable).where(eq(UserTokensTable.id, record.id));
        return null;
    }

    return { id: record.id, challenge };
}

async function revokeChallengeToken(tokenId: string) {
    await db.delete(UserTokensTable).where(eq(UserTokensTable.id, tokenId));
}

export async function beginPasskeyAuthenticationAction(
    rawEmail: z.infer<typeof emailSchema>,
): Promise<AuthenticationOptionsResult> {
    const { t } = await getT();
    const parsedEmail = emailSchema.safeParse(rawEmail);
    if (!parsedEmail.success) {
        return { isError: true, message: t("authTranslations.passkeys.auth.error.userNotFound") };
    }

    const normalizedEmail = normalizeEmail(parsedEmail.data);
    type UserWithPasskeys = Pick<
        typeof UsersTable.$inferSelect,
        "id" | "email"
    > & {
        biometricCredentials: Array<
            Pick<
                typeof BiometricCredentialsTable.$inferSelect,
                "credentialId" | "transports"
            >
        >;
    };

    const user = (await db.query.UsersTable.findFirst({
        columns: { id: true, email: true },
        where: eq(UsersTable.email, normalizedEmail),
        with: {
            biometricCredentials: {
                columns: { credentialId: true, transports: true },
            },
        },
    })) as UserWithPasskeys | undefined;

    if (!user) {
        return {
            isError: true,
            message: t("authTranslations.passkeys.auth.error.userNotFound"),
        };
    }

    if (!user?.biometricCredentials || user.biometricCredentials.length === 0) {
        return {
            isError: true,
            message: t("authTranslations.passkeys.auth.error.noCredentials"),
        };
    }

    const rpId = getRpId();
    if (!rpId) {
        return {
            isError: true,
            message: t("authTranslations.passkeys.error.missingRpId"),
        };
    }

    const options = await generateAuthenticationOptions({
        rpID: rpId,
        allowCredentials: user.biometricCredentials.map((credential) => ({
            id: credential.credentialId,
            type: "public-key",
            transports: Array.isArray(credential.transports)
                ? (credential.transports as AuthenticatorTransportFuture[])
                : undefined,
        })),
        userVerification: "preferred",
    });

    await upsertChallengeToken({
        userId: user.id,
        challenge: options.challenge,
        operation: "passkey-authentication",
    });

    return { isError: false, options, email: user.email };
}

export async function beginPasskeyRegistrationAction(
    rawUserId: z.infer<typeof userIdSchema>,
): Promise<RegistrationOptionsResult> {
    const { t } = await getT();

    const parsedUserId = userIdSchema.safeParse(rawUserId);
    if (!parsedUserId.success) {
        return { isError: true, message: t("authTranslations.passkeys.auth.error.userNotFound") };
    }

    const user = await db.query.UsersTable.findFirst({
        columns: { id: true, email: true, name: true },
        where: eq(UsersTable.id, parsedUserId.data),
    });
    if (!user) {
        return {
            isError: true,
            message: t("authTranslations.passkeys.auth.error.userNotFound"),
        };
    }

    const rpId = getRpId();
    if (!rpId) {
        return {
            isError: true,
            message: t("authTranslations.passkeys.error.missingRpId"),
        };
    }

    const existing = await db.query.BiometricCredentialsTable.findMany({
        columns: { credentialId: true, transports: true },
        where: eq(BiometricCredentialsTable.userId, user.id),
    });

    const encodedUserId = textEncoder.encode(user.id);
    const userIdBytes = new Uint8Array(
        encodedUserId.buffer,
        encodedUserId.byteOffset,
        encodedUserId.byteLength,
    ) as Uint8Array<ArrayBuffer>;

    const options: PublicKeyCredentialCreationOptionsJSON =
        await generateRegistrationOptions({
            rpName: t("appName"),
            rpID: rpId,
            userID: userIdBytes,
            userName: user.email,
            userDisplayName: user.name ?? user.email,
            attestationType: "none",
            authenticatorSelection: {
                residentKey: "preferred",
                userVerification: "preferred",
            },
            excludeCredentials: existing.map((credential) => ({
                id: credential.credentialId,
                type: "public-key",
                transports: Array.isArray(credential.transports)
                    ? (credential.transports as AuthenticatorTransportFuture[])
                    : undefined,
            })),
        });

    await upsertChallengeToken({
        userId: user.id,
        challenge: options.challenge,
        operation: "passkey-registration",
    });

    return { isError: false, options };
}

export async function completePasskeyAuthenticationAction(
    rawEmail: z.infer<typeof emailSchema>,
    rawAssertion: z.infer<typeof authResponseSchema>,
): Promise<TypedResponse<PartialUser>> {
    const { t } = await getT();
    const parsedEmail = emailSchema.safeParse(rawEmail);

    const parsedAssertion = authResponseSchema.safeParse(rawAssertion);
    if (!parsedEmail.success || !parsedAssertion.success) {
        return {
            isError: true,
            message: t("authTranslations.passkeys.auth.error.userNotFound"),
        };
    }

    const normalizedEmail = normalizeEmail(parsedEmail.data);
    type UserWithAuthenticationPasskeys = Pick<
        typeof UsersTable.$inferSelect,
        "id" | "email" | "role"
    > & {
        biometricCredentials: Array<
            Pick<
                typeof BiometricCredentialsTable.$inferSelect,
                | "id"
                | "credentialId"
                | "publicKey"
                | "signCount"
                | "transports"
                | "isBackupEligible"
                | "isBackupState"
            >
        >;
    };

    const user = (await db.query.UsersTable.findFirst({
        columns: { id: true, email: true, role: true },
        where: eq(UsersTable.email, normalizedEmail),
        with: {
            biometricCredentials: {
                columns: {
                    id: true,
                    credentialId: true,
                    publicKey: true,
                    signCount: true,
                    transports: true,
                    isBackupEligible: true,
                    isBackupState: true,
                },
            },
        },
    })) as UserWithAuthenticationPasskeys | undefined;

    if (!user) {
        return {
            isError: true,
            message: t("authTranslations.passkeys.auth.error.userNotFound"),
        };
    }

    const challenge = await consumeChallengeToken({
        userId: user.id,
        operation: "passkey-authentication",
    });

    if (!challenge) {
        return {
            isError: true,
            message: t("authTranslations.passkeys.auth.error.invalidChallenge"),
        };
    }

    const rpId = getRpId();
    if (!rpId) {
        await revokeChallengeToken(challenge.id);
        return {
            isError: true,
            message: t("authTranslations.passkeys.error.missingRpId"),
        };
    }

    const credential = user.biometricCredentials.find(
        (item) => item.credentialId === parsedAssertion.data.id,
    );

    if (!credential) {
        await revokeChallengeToken(challenge.id);
        return {
            isError: true,
            message: t("authTranslations.passkeys.auth.error.credentialMismatch"),
        };
    }

    const storedCredential: WebAuthnCredential = {
        id: credential.credentialId,
        publicKey: base64UrlToBuffer(credential.publicKey) as Uint8Array_,
        counter: credential.signCount ?? 0,
        transports: Array.isArray(credential.transports)
            ? (credential.transports as AuthenticatorTransportFuture[])
            : undefined,
    };

    const verification = await verifyAuthenticationResponse({
        response: parsedAssertion.data,
        expectedChallenge: challenge.challenge,
        expectedOrigin: EXPECTED_ORIGIN,
        expectedRPID: rpId,
        credential: storedCredential,
        requireUserVerification: true,
    });

    if (!verification.verified || !verification.authenticationInfo) {
        await revokeChallengeToken(challenge.id);
        return {
            isError: true,
            message: t("authTranslations.passkeys.auth.error.generic"),
        };
    }

    const { newCounter, credentialDeviceType, credentialBackedUp } =
        verification.authenticationInfo;

    await db
        .update(BiometricCredentialsTable)
        .set({
            signCount: newCounter,
            lastUsedAt: new Date(),
            isBackupEligible: credentialDeviceType === "multiDevice",
            isBackupState: credentialBackedUp,
            isUserVerified: verification.authenticationInfo.userVerified ?? true,
        })
        .where(eq(BiometricCredentialsTable.id, credential.id));

    await revokeChallengeToken(challenge.id);

    await db
        .update(UsersTable)
        .set({ lastSignInAt: new Date() })
        .where(eq(UsersTable.id, user.id));

    return {
        isError: false,
        id: user.id, role: user.role,
    };
}

export async function completePasskeyRegistrationAction(
    rawAttestation: z.infer<typeof registrationResponseSchema>,
    rawUserId: z.infer<typeof userIdSchema>,
): Promise<TypedResponse<{ userId: string }>> {
    const { t } = await getT();

    const parsedAttestation = registrationResponseSchema.safeParse(rawAttestation);
    const parsedUserId = userIdSchema.safeParse(rawUserId);
    if (!parsedAttestation.success || !parsedUserId.success) {
        return {
            isError: true,
            message: t("authTranslations.passkeys.register.invalidChallenge"),
        };
    }

    const userId = parsedUserId.data;
    const challenge = await consumeChallengeToken({
        userId,
        operation: "passkey-registration",
    });

    if (!challenge) {
        return {
            isError: true,
            message: t("authTranslations.passkeys.register.invalidChallenge"),
        };
    }

    const rpId = getRpId();
    if (!rpId) {
        await revokeChallengeToken(challenge.id);
        return {
            isError: true,
            message: t("authTranslations.passkeys.error.missingRpId"),
        };
    }

    const verification = await verifyRegistrationResponse({
        response: parsedAttestation.data,
        expectedChallenge: challenge.challenge,
        expectedOrigin: EXPECTED_ORIGIN,
        expectedRPID: rpId,
        requireUserVerification: true,
    });

    if (!verification.verified || !verification.registrationInfo) {
        await revokeChallengeToken(challenge.id);
        return {
            isError: true,
            message: t("authTranslations.passkeys.register.error"),
        };
    }

    const { credential, credentialDeviceType, credentialBackedUp, userVerified } =
        verification.registrationInfo;

    const credentialId = credential.id;
    const credentialPublicKey = credential.publicKey;
    const transports = Array.isArray(credential.transports)
        ? credential.transports
        : parsedAttestation.data.response.transports &&
            Array.isArray(parsedAttestation.data.response.transports)
            ? parsedAttestation.data.response.transports
            : null;

    await db
        .delete(BiometricCredentialsTable)
        .where(eq(BiometricCredentialsTable.credentialId, credentialId));

    await db.insert(BiometricCredentialsTable).values({
        userId,
        credentialId,
        publicKey: bufferToBase64Url(credentialPublicKey),
        signCount: credential.counter,
        label: null,
        transports,
        isBackupEligible: credentialDeviceType === "multiDevice",
        isBackupState: credentialBackedUp,
        isUserVerified: userVerified,
    });

    await revokeChallengeToken(challenge.id);

    return {
        isError: false,
        userId,
    };
}

export async function listPasskeysAction(
    rawUserId: z.infer<typeof userIdSchema>,
): Promise<TypedResponse<{ data: PasskeyListItem[] }>> {
    const { t } = await getT();
    const parsed = userIdSchema.safeParse(rawUserId);
    if (!parsed.success) {
        return {
            isError: true,
            message: t("authTranslations.error.badRequest"),
        };
    }

    const credentials = await db.query.BiometricCredentialsTable.findMany({
        columns: {
            id: true,
            label: true,
            createdAt: true,
            lastUsedAt: true,
            isBackupEligible: true,
            isBackupState: true,
            transports: true,
        },
        where: eq(BiometricCredentialsTable.userId, parsed.data),
        orderBy: (table, { desc }) => desc(table.createdAt),
    });

    const data: PasskeyListItem[] = credentials.map((cred) => ({
        id: cred.id,
        label: cred.label,
        createdAt: cred.createdAt.toISOString(),
        lastUsedAt: cred.lastUsedAt?.toISOString() ?? null,
        isBackupEligible: cred.isBackupEligible,
        isBackupState: cred.isBackupState,
        transports: Array.isArray(cred.transports)
            ? (cred.transports as string[])
            : [],
    }));

    return { isError: false, data };
}

export async function deletePasskeyAction(
    rawInput: z.infer<typeof deletePasskeySchema>,
): Promise<TypedResponse<{ message: string }>> {
    const { t } = await getT();

    const parsed = deletePasskeySchema.safeParse(rawInput);

    if (!parsed.success) {
        return {
            isError: true,
            message: t("authTranslations.error.badRequest"),
        };
    }

    const { id, userId } = parsed.data;

    const credential = await db.query.BiometricCredentialsTable.findFirst({
        columns: { id: true, userId: true },
        where: eq(BiometricCredentialsTable.id, id),
    });

    if (!credential || credential.userId !== userId) {
        return {
            isError: true,
            message: t("authTranslations.passkeys.delete.notFound"),
        };
    }

    await db
        .delete(BiometricCredentialsTable)
        .where(eq(BiometricCredentialsTable.id, credential.id));

    return {
        isError: false,
        message: t("authTranslations.passkeys.delete.success"),
    };
}
