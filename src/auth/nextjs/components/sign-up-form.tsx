"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useActionState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { oAuthSignIn, signUpAction } from "@/auth/nextjs/actions";
import { useOauthProviderIcon } from "@/auth/nextjs/components/useOauthProviderIcon";
import { signUpSchema } from "@/auth/schemas";
import {
	type OAuthProvider,
	oAuthProviderValues,
} from "@/auth/tables/user-oauth-accounts-table";
import { Button } from "@/components/ui/button";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldLabel,
	FieldSeparator,
	FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useTranslation } from "@/lib/i18n/useTranslation";

export function SignUpForm() {
	const { t } = useTranslation();

	const [state, action, isPending] = useActionState(signUpAction, null);

	const searchParams = useSearchParams();
	const getOauthProviderIcon = useOauthProviderIcon();

	const form = useForm<z.infer<typeof signUpSchema>>({
		resolver: zodResolver(signUpSchema),
		defaultValues: {
			name: "",
			phone: "",
			email: "",
			password: "",
		},
	});

	async function handleOAuthClick(provider: OAuthProvider) {
		oAuthSignIn(provider);
	}

	return (
		<form action={action} className="space-y-4 p-6 md:p-8">
			<div className="space-y-2 text-center">
				<h1 className="font-semibold text-3xl tracking-tight">
					{t("authTranslations.signUp.title")}
				</h1>
				<p className="text-muted-foreground text-sm">
					{t("authTranslations.signUp.description")}
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
			{searchParams.get("error") && (
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
							disabled={isPending}
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

			<FieldSet className="grid gap-2" disabled={isPending}>
				<Field className="grid gap-2">
					<FieldLabel htmlFor="name">
						{t("authTranslations.signUp.nameLabel")}
					</FieldLabel>
					<Input id="name" type="text" {...form.register("name")} />
					<FieldError errors={[form.formState.errors.name]} />
				</Field>

				<Field className="grid gap-2">
					<FieldLabel htmlFor="email">
						{t("authTranslations.signUp.emailLabel")}
					</FieldLabel>
					<Input
						id="email"
						placeholder={t("authTranslations.emailPlaceholder")}
						type="email"
						{...form.register("email")}
					/>
					<FieldError errors={[form.formState.errors.email]} />
				</Field>

				<Field className="grid gap-2">
					<FieldLabel htmlFor="phone">
						{t("authTranslations.signUp.phoneLabel")}
					</FieldLabel>
					<Input id="phone" type="tel" {...(form.register("phone") as any)} />
					<FieldError errors={[form.formState.errors.phone]} />
				</Field>

				<Field className="grid gap-2">
					<FieldLabel htmlFor="password">
						{t("authTranslations.signUp.passwordLabel")}
					</FieldLabel>
					<Input id="password" type="password" {...form.register("password")} />
					<FieldError errors={[form.formState.errors.password]} />
				</Field>

				<Button className="w-full" disabled={isPending} type="submit">
					{isPending
						? t("authTranslations.signUp.submitting")
						: t("authTranslations.signUp.submit")}
				</Button>
			</FieldSet>

			<FieldDescription className="text-center">
				{t("authTranslations.signIn.hasAccount")}{" "}
				<Link
					className="font-medium underline-offset-4 hover:underline"
					href={"/sign-in"}
				>
					{t("authTranslations.signUp.toSignIn")}
				</Link>
			</FieldDescription>
		</form>
	);
}
