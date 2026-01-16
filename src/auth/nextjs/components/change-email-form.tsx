"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useActionState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { beginEmailChangeAction } from "@/auth/nextjs/actions";
import { useAuth } from "@/auth/nextjs/components/auth-provider";
import { changeEmailSchema } from "@/auth/schemas";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
	FieldSet,
} from "@/components/ui/field";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { useTranslation } from "@/lib/i18n/useTranslation";

type FormValues = z.infer<typeof changeEmailSchema>;

export function ChangeEmailForm() {
	const { t } = useTranslation();
	const { session } = useAuth();

	const currentEmail = session?.user.email;

	const [state, formAction, pending] = useActionState(
		async (_prevState: unknown, formData: FormData) =>
			beginEmailChangeAction(formData),
		null,
	);

	const form = useForm<FormValues>({
		resolver: zodResolver(changeEmailSchema),
		defaultValues: { newEmail: "", confirmEmail: "", currentPassword: "" },
	});

	return (
		<form action={formAction} className="space-y-6">
			<p>
				{state?.isError
					? state.message
					: state?.sent
						? t("authTranslations.profile.email.checkInbox")
						: t("authTranslations.profile.email.description")}
			</p>
			<FieldSet className="space-y-6" disabled={pending}>
				<FieldGroup>
					<FieldDescription className="text-start text-muted-foreground text-sm">
						{t("authTranslations.profile.email.current")} {currentEmail}
					</FieldDescription>
					<Field>
						<FieldLabel htmlFor="newEmail">
							{t("authTranslations.profile.email.newLabel")}
						</FieldLabel>
						<InputGroup>
							<InputGroupInput
								aria-invalid={!!form.formState.errors.newEmail}
								autoComplete="email"
								id="newEmail"
								type="email"
								{...form.register("newEmail")}
							/>
						</InputGroup>
						<FieldError errors={[form.formState.errors.newEmail]} />
					</Field>
					<Field>
						<FieldLabel htmlFor="confirmEmail">
							{t("authTranslations.profile.email.confirmLabel")}
						</FieldLabel>
						<InputGroup>
							<InputGroupInput
								aria-invalid={!!form.formState.errors.confirmEmail}
								autoComplete="email"
								id="confirmEmail"
								type="email"
								{...form.register("confirmEmail")}
							/>
						</InputGroup>
						<FieldError errors={[form.formState.errors.confirmEmail]} />
					</Field>
					<Field>
						<FieldLabel htmlFor="currentPassword">
							{t("authTranslations.profile.email.currentPasswordLabel")}
						</FieldLabel>
						<InputGroup>
							<InputGroupInput
								aria-invalid={!!form.formState.errors.currentPassword}
								autoComplete="current-password"
								id="currentPassword"
								type="password"
								{...form.register("currentPassword")}
							/>
						</InputGroup>
						<FieldError errors={[form.formState.errors.currentPassword]} />
					</Field>
				</FieldGroup>
				<ButtonGroup className="justify-end">
					<Button disabled={pending} type="submit">
						{pending
							? t("authTranslations.profile.email.sending")
							: t("authTranslations.profile.email.submit")}
					</Button>
				</ButtonGroup>
			</FieldSet>
		</form>
	);
}
