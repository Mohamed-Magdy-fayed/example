"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { passwordResetRequestSchema } from "@/auth/schemas";
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

type FormValues = z.infer<typeof passwordResetRequestSchema>;

export function ForgotPasswordForm() {
	const router = useRouter();
	const { t } = useTranslation();
	const [status, setStatus] = useState<null | {
		status: "success" | "error";
		message: string;
	}>(null);
	const requestReset = api.auth.passwordReset.request.useMutation();

	const form = useForm<FormValues>({
		resolver: zodResolver(passwordResetRequestSchema),
		defaultValues: { email: "" },
	});

	const { errors } = form.formState;

	async function onSubmit(values: FormValues) {
		setStatus(null);
		try {
			await requestReset.mutateAsync(values);
			const params = new URLSearchParams({
				email: values.email,
				requested: "1",
			});
			router.push(`/reset-password?${params.toString()}`);
		} catch (caught) {
			const message =
				caught instanceof Error && caught.message
					? caught.message
					: t("authTranslations.passwordReset.request.emailError");
			setStatus({ status: "error", message });
		}
	}

	return (
		<form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
			<FieldGroup>
				{status && (
					<FieldDescription
						aria-live={status.status === "success" ? "polite" : "assertive"}
						className={
							status.status === "success"
								? "text-emerald-600"
								: "text-destructive"
						}
						role={status.status === "success" ? "status" : "alert"}
					>
						{status.message}
					</FieldDescription>
				)}
				<Field>
					<FieldLabel htmlFor="email">
						{t("authTranslations.passwordReset.emailLabel")}
					</FieldLabel>
					<InputGroup>
						<InputGroupInput
							aria-invalid={!!errors.email}
							autoComplete="email"
							id="email"
							type="email"
							{...form.register("email")}
						/>
					</InputGroup>
					<FieldError errors={[errors.email]} />
				</Field>
			</FieldGroup>
			<ButtonGroup className="w-full justify-end">
				<Button
					className="w-full"
					disabled={requestReset.isPending}
					type="submit"
				>
					{requestReset.isPending
						? t("authTranslations.passwordReset.submitting")
						: t("authTranslations.passwordReset.submit")}
				</Button>
			</ButtonGroup>
		</form>
	);
}
