"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeftIcon, FingerprintIcon } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Activity, useActionState, useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { oAuthSignIn, signInAction } from "@/auth/nextjs/actions";
import { useOauthProviderIcon } from "@/auth/nextjs/components/useOauthProviderIcon";
import { signInSchema } from "@/auth/schemas";
import { type OAuthProvider, oAuthProviderValues } from "@/auth/tables";
import { Button } from "@/components/ui/button";
import {
	Field,
	FieldDescription,
	FieldLabel,
	FieldSeparator,
	FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useTranslation } from "@/lib/i18n/useTranslation";

export function SignInForm() {
	const { t } = useTranslation();
	const [isPasskeyPending] = useState(false);
	const [step, setStep] = useState<"email" | "password">("email");
	const searchParams = useSearchParams();
	const getOauthProviderIcon = useOauthProviderIcon();

	const form = useForm<z.infer<typeof signInSchema>>({
		resolver: zodResolver(signInSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const [state, action, isPending] = useActionState(signInAction, null);

	// async function handlePasskeySignIn() {
	// 	setError(undefined);
	// 	setOauthError(undefined);

	// 	const emailValid = await form.trigger("email");
	// 	if (!emailValid) {
	// 		return;
	// 	}

	// 	const email = form.getValues("email");
	// 	if (!email) {
	// 		setError(t("authTranslations.passkeys.auth.error.emailRequired"));
	// 		return;
	// 	}

	// 	if (typeof window === "undefined" || !window.PublicKeyCredential) {
	// 		setError(t("authTranslations.passkeys.auth.error.unsupported"));
	// 		return;
	// 	}

	// 	try {
	// 		setIsPasskeyPending(true);
	// 		const beginResult = await beginPasskey.mutateAsync({ email });

	// 		const assertion = await startAuthentication({
	// 			optionsJSON: beginResult.options as any,
	// 		});
	// 		await completePasskey.mutateAsync({
	// 			email: beginResult.email,
	// 			response: assertion,
	// 		});

	// 		router.replace("/");
	// 		router.refresh();
	// 	} catch (caught) {
	// 		if (
	// 			caught instanceof DOMException &&
	// 			(caught.name === "NotAllowedError" || caught.name === "AbortError")
	// 		) {
	// 			setError(t("authTranslations.passkeys.auth.error.cancelled"));
	// 			return;
	// 		}

	// 		console.error("Passkey sign-in failed", caught);
	// 		setError(t("authTranslations.passkeys.auth.error.generic"));
	// 	} finally {
	// 		setIsPasskeyPending(false);
	// 	}
	// }

	async function handleOAuthClick(provider: OAuthProvider) {
		await oAuthSignIn(provider);
	}

	async function handleContinueEmail() {
		const isEmailValid = await form.trigger("email");
		if (isEmailValid) {
			setStep("password");
		}
	}

	function handleBackToEmail() {
		form.clearErrors("password");
		setStep("email");
	}

	const isEmailStep = step === "email";

	return (
		<form action={action} className="space-y-4 p-6 md:p-8">
			<div className="space-y-2 text-center">
				<h1 className="font-semibold text-3xl tracking-tight">
					{t("authTranslations.signIn.title")}
				</h1>
				<p className="text-muted-foreground text-sm">
					{t("authTranslations.signIn.description")}
				</p>
			</div>

			{state?.isError && (
				<FieldDescription
					aria-live="assertive"
					className="text-center text-destructive!"
					role="alert"
				>
					{state.message}
				</FieldDescription>
			)}
			{searchParams.get("error") != null && (
				<FieldDescription
					aria-live="assertive"
					className="text-center text-destructive!"
					role="alert"
				>
					{searchParams.get("error")}
				</FieldDescription>
			)}

			{oAuthProviderValues.length > 0 && (
				<div className="grid gap-2">
					{oAuthProviderValues.map((provider) => (
						<Button
							className="h-11 w-full justify-center gap-2"
							disabled={isPending || isPasskeyPending}
							key={provider}
							onClick={async () => await handleOAuthClick(provider)}
							type="button"
							variant="outline"
						>
							{getOauthProviderIcon(provider)}
							<span className="font-medium text-sm capitalize">{provider}</span>
						</Button>
					))}
				</div>
			)}

			<FieldSeparator className="mb-2 *:data-[slot=field-separator-content]:bg-card">
				{t("authTranslations.signIn.continueWith")}
			</FieldSeparator>

			<FieldSet className="grid gap-4" disabled={isPending}>
				<Activity mode={isEmailStep ? "visible" : "hidden"}>
					<Field className="grid gap-2">
						<FieldLabel htmlFor="email">
							{t("authTranslations.signIn.emailLabel")}
						</FieldLabel>
						<Input
							id="email"
							placeholder={t("authTranslations.emailPlaceholder")}
							required
							type="email"
							{...form.register("email")}
						/>
						{form.formState.errors.email?.message && (
							<FieldDescription className="text-destructive!">
								{String(form.formState.errors.email.message)}
							</FieldDescription>
						)}
					</Field>
					<Button
						className="w-full"
						disabled={isPending}
						onClick={handleContinueEmail}
						type="button"
					>
						{t("authTranslations.signIn.continue")}
					</Button>
				</Activity>
				<Activity mode={isEmailStep ? "hidden" : "visible"}>
					<Field className="grid gap-2">
						<div className="flex items-center">
							<FieldLabel htmlFor="password">
								{t("authTranslations.signIn.passwordLabel")}
							</FieldLabel>
							<Link
								className="ml-auto text-sm underline-offset-4 hover:underline"
								href="/forgot-password"
							>
								{t("authTranslations.signIn.forgotPassword")}
							</Link>
						</div>
						<Input
							id="password"
							required
							type="password"
							{...form.register("password")}
						/>
						{form.formState.errors.password?.message && (
							<FieldDescription className="text-destructive!">
								{String(form.formState.errors.password.message)}
							</FieldDescription>
						)}
					</Field>
					<div className="flex items-center gap-2">
						<Button
							disabled={isPending}
							onClick={handleBackToEmail}
							type="button"
							variant="outline"
						>
							<ArrowLeftIcon className="rtl:rotate-180" />
							{t("authTranslations.signIn.back")}
						</Button>
						<Button className="flex-1" disabled={isPending} type="submit">
							{t("authTranslations.signIn.submit")}
						</Button>
					</div>
				</Activity>

				<Button
					disabled={isPasskeyPending || isPending}
					// onClick={handlePasskeySignIn}
					type="button"
					variant="secondary"
				>
					<FingerprintIcon />
					{isPasskeyPending
						? t("authTranslations.passkeys.auth.pending")
						: t("authTranslations.passkeys.auth.button")}
				</Button>
			</FieldSet>

			<FieldDescription className="text-center">
				{t("authTranslations.signIn.noAccount")}{" "}
				<Link
					className="font-medium underline-offset-4 hover:underline"
					href={"/sign-up"}
				>
					{t("authTranslations.signIn.toSignUp")}
				</Link>
			</FieldDescription>
		</form>
	);
}
