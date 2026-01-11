"use client";

import { useCallback, useState, useTransition } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { useTranslation } from "@/lib/i18n/useTranslation";

import { api } from "@/trpc/react";

type ProfileFormProps = {
	defaultValues: {
		displayName: string | null;
		givenName: string | null;
		familyName: string | null;
		locale: string | null;
		timezone: string | null;
	};
};

type FormValues = {
	name?: string;
	givenName?: string;
	familyName?: string;
	locale?: string;
	timezone?: string;
};

export function ProfileForm({ defaultValues }: ProfileFormProps) {
	const { t } = useTranslation();
	const [status, setStatus] = useState<{
		type: "success" | "error";
		message: string;
	}>();
	const [isPending, startTransition] = useTransition();
	const updateProfileMutation = api.auth.profile.updateProfile.useMutation();

	const form = useForm<FormValues>({
		defaultValues: {
			name: defaultValues.displayName ?? "",
			givenName: defaultValues.givenName ?? "",
			familyName: defaultValues.familyName ?? "",
			locale: defaultValues.locale ?? "",
			timezone: defaultValues.timezone ?? "",
		},
	});

	const { errors } = form.formState;

	const onSubmit = useCallback(
		(values: FormValues) => {
			startTransition(async () => {
				form.clearErrors();
				setStatus(undefined);

				const name = values.name?.trim();

				try {
					await updateProfileMutation.mutateAsync({
						name: name && name.length > 0 ? name : "",
					});
					setStatus({
						type: "success",
						message: t("authTranslations.profile.form.submit"),
					});
				} catch (caught) {
					const zodErrors =
						(caught as { data?: { zodError?: { fieldErrors?: Record<string, string[]> } } })
							?.data?.zodError?.fieldErrors;
					if (zodErrors) {
						for (const [field, messages] of Object.entries(zodErrors)) {
							const message = messages?.[0];
							if (message) {
								form.setError(field as keyof FormValues, {
									type: "server",
									message,
								});
							}
						}
					}

					const message =
						caught instanceof Error && caught.message
							? caught.message
							: t("authTranslations.profile.error.invalidInput");
					setStatus({ type: "error", message });
				}
			});
		},
		[form, t, updateProfileMutation],
	);

	return (
		<form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
			<FieldGroup>
				{status && (
					<FieldDescription
						className={
							status.type === "success"
								? "text-emerald-600"
								: "text-destructive"
						}
					>
						{status.message}
					</FieldDescription>
				)}
				<Field>
					<FieldLabel htmlFor="name">
						{t("authTranslations.profile.displayName.label")}
					</FieldLabel>
					<InputGroup>
						<InputGroupInput
							aria-invalid={!!errors.name}
							id="name"
							placeholder={t(
								"authTranslations.profile.displayName.placeholder",
							)}
							{...form.register("name")}
						/>
					</InputGroup>
					<FieldError errors={[errors.name]} />
				</Field>
				<div className="grid gap-4 md:grid-cols-2">
					<Field>
						<FieldLabel htmlFor="givenName">
							{t("authTranslations.profile.givenName.label")}
						</FieldLabel>
						<InputGroup>
							<InputGroupInput
								aria-invalid={!!errors.givenName}
								id="givenName"
								placeholder={t(
									"authTranslations.profile.givenName.placeholder",
								)}
								{...form.register("givenName")}
							/>
						</InputGroup>
						<FieldError errors={[errors.givenName]} />
					</Field>
					<Field>
						<FieldLabel htmlFor="familyName">
							{t("authTranslations.profile.familyName.label")}
						</FieldLabel>
						<InputGroup>
							<InputGroupInput
								aria-invalid={!!errors.familyName}
								id="familyName"
								placeholder={t(
									"authTranslations.profile.familyName.placeholder",
								)}
								{...form.register("familyName")}
							/>
						</InputGroup>
						<FieldError errors={[errors.familyName]} />
					</Field>
				</div>
				<div className="grid gap-4 md:grid-cols-2">
					<Field>
						<FieldLabel htmlFor="locale">
							{t("authTranslations.profile.locale.label")}
						</FieldLabel>
						<InputGroup>
							<InputGroupInput
								aria-invalid={!!errors.locale}
								id="locale"
								placeholder={t("authTranslations.profile.locale.placeholder")}
								{...form.register("locale")}
							/>
						</InputGroup>
						<FieldError errors={[errors.locale]} />
					</Field>
					<Field>
						<FieldLabel htmlFor="timezone">
							{t("authTranslations.profile.timezone.label")}
						</FieldLabel>
						<InputGroup>
							<InputGroupInput
								aria-invalid={!!errors.timezone}
								id="timezone"
								placeholder={t("authTranslations.profile.timezone.placeholder")}
								{...form.register("timezone")}
							/>
						</InputGroup>
						<FieldError errors={[errors.timezone]} />
					</Field>
				</div>
			</FieldGroup>
			<ButtonGroup className="justify-end">
				<Button disabled={isPending} type="submit">
					{isPending
						? t("authTranslations.profile.form.saving")
						: t("authTranslations.profile.form.submit")}
				</Button>
			</ButtonGroup>
		</form>
	);
}
