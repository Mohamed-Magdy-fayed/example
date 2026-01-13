// "use client";

// import { useCallback, useState } from "react";
// import { useForm } from "react-hook-form";
// import type { z } from "zod";
// import type {
// 	changePasswordSchema,
// 	createPasswordSchema,
// } from "@/auth/schemas";
// import { Button } from "@/components/ui/button";
// import { ButtonGroup } from "@/components/ui/button-group";
// import {
// 	Field,
// 	FieldDescription,
// 	FieldError,
// 	FieldGroup,
// 	FieldLabel,
// } from "@/components/ui/field";
// import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
// import { useTranslation } from "@/lib/i18n/useTranslation";
// import { api } from "@/trpc/react";

// export function ChangePasswordForm({ isCreate }: { isCreate?: boolean }) {
// 	type FormValues = typeof isCreate extends true
// 		? z.infer<typeof createPasswordSchema>
// 		: z.infer<typeof changePasswordSchema>;

// 	const { t } = useTranslation();

// 	const [status, setStatus] = useState<{
// 		type: "success" | "error";
// 		message: string;
// 	}>();
// 	const changePasswordMutation = api.auth.profile.changePassword.useMutation();
// 	const createPasswordMutation = api.auth.profile.createPassword.useMutation();

// 	const form = useForm<FormValues>({
// 		defaultValues: {
// 			currentPassword: "",
// 			newPassword: "",
// 			confirmPassword: "",
// 		},
// 	});

// 	const { errors } = form.formState;

// 	const onSubmit = useCallback(
// 		async (values: FormValues) => {
// 			form.clearErrors();
// 			setStatus(undefined);

// 			try {
// 				if (isCreate) {
// 					await createPasswordMutation.mutateAsync({
// 						newPassword: values.newPassword,
// 					});
// 				} else {
// 					await changePasswordMutation.mutateAsync({
// 						currentPassword: values.currentPassword ?? "",
// 						newPassword: values.newPassword,
// 					});
// 				}

// 				form.reset();
// 				setStatus({
// 					type: "success",
// 					message: t("authTranslations.profile.password.submit"),
// 				});
// 			} catch (caught) {
// 				const zodErrors =
// 					(caught as { data?: { zodError?: { fieldErrors?: Record<string, string[]> } } })
// 						?.data?.zodError?.fieldErrors;
// 				if (zodErrors) {
// 					for (const [field, messages] of Object.entries(zodErrors)) {
// 						const message = messages?.[0];
// 						if (message) {
// 							form.setError(field as keyof FormValues, {
// 								type: "server",
// 								message,
// 							});
// 						}
// 					}
// 				}

// 				const message =
// 					caught instanceof Error && caught.message
// 						? caught.message
// 						: t("authTranslations.error.description");
// 				setStatus({ type: "error", message });
// 			}
// 		},
// 		[form, isCreate, changePasswordMutation, createPasswordMutation, t],
// 	);

// 	return (
// 		<form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
// 			<FieldGroup>
// 				{status && (
// 					<FieldDescription
// 						className={
// 							status.type === "success"
// 								? "text-emerald-600"
// 								: "text-destructive"
// 						}
// 					>
// 						{status.message}
// 					</FieldDescription>
// 				)}
// 				{!isCreate && (
// 					<Field>
// 						<FieldLabel htmlFor="currentPassword">
// 							{t("authTranslations.profile.password.currentLabel")}
// 						</FieldLabel>
// 						<InputGroup>
// 							<InputGroupInput
// 								aria-invalid={!!errors.currentPassword}
// 								autoComplete="current-password"
// 								id="currentPassword"
// 								type="password"
// 								{...form.register("currentPassword")}
// 							/>
// 						</InputGroup>
// 						<FieldError errors={[errors.currentPassword]} />
// 					</Field>
// 				)}
// 				<Field>
// 					<FieldLabel htmlFor="newPassword">
// 						{t("authTranslations.profile.password.newLabel")}
// 					</FieldLabel>
// 					<InputGroup>
// 						<InputGroupInput
// 							aria-invalid={!!errors.newPassword}
// 							autoComplete="new-password"
// 							id="newPassword"
// 							type="password"
// 							{...form.register("newPassword")}
// 						/>
// 					</InputGroup>
// 					<FieldError errors={[errors.newPassword]} />
// 				</Field>
// 				<Field>
// 					<FieldLabel htmlFor="confirmPassword">
// 						{t("authTranslations.profile.password.confirmLabel")}
// 					</FieldLabel>
// 					<InputGroup>
// 						<InputGroupInput
// 							aria-invalid={!!errors.confirmPassword}
// 							autoComplete="new-password"
// 							id="confirmPassword"
// 							type="password"
// 							{...form.register("confirmPassword")}
// 						/>
// 					</InputGroup>
// 					<FieldError errors={[errors.confirmPassword]} />
// 				</Field>
// 			</FieldGroup>
// 			<ButtonGroup className="justify-end">
// 				<Button
// 					disabled={changePasswordMutation.isPending || createPasswordMutation.isPending}
// 					type="submit"
// 				>
// 					{changePasswordMutation.isPending || createPasswordMutation.isPending
// 						? t("authTranslations.profile.password.updating")
// 						: t("authTranslations.profile.password.submit")}
// 				</Button>
// 			</ButtonGroup>
// 		</form>
// 	);
// }
