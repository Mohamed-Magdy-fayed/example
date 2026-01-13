// "use client";

// import { zodResolver } from "@hookform/resolvers/zod";
// import Link from "next/link";
// import { type ChangeEvent, useState } from "react";
// import { Controller, useForm } from "react-hook-form";
// import type { z } from "zod";
// import { passwordResetSubmissionSchema } from "@/auth/schemas";
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

// type FormValues = z.infer<typeof passwordResetSubmissionSchema>;

// export function ResetPasswordForm({
// 	initialEmail = "",
// }: {
// 	initialEmail?: string;
// }) {
// 	const { t } = useTranslation();
// 	const [status, setStatus] = useState<null | {
// 		status: "success" | "error";
// 		message: string;
// 	}>(null);
// 	const submitReset = api.auth.passwordReset.submit.useMutation();

// 	const form = useForm<FormValues>({
// 		resolver: zodResolver(passwordResetSubmissionSchema),
// 		defaultValues: { email: initialEmail, otp: "", password: "" },
// 	});

// 	const { errors } = form.formState;

// 	async function onSubmit(values: FormValues) {
// 		setStatus(null);
// 		try {
// 			await submitReset.mutateAsync(values);
// 			form.reset({ email: values.email, otp: "", password: "" });
// 			setStatus({ status: "success", message: t("authTranslations.passwordReset.reset.success") });
// 		} catch (caught) {
// 			const message =
// 				caught instanceof Error && caught.message
// 					? caught.message
// 					: t("authTranslations.passwordReset.reset.error");
// 			setStatus({ status: "error", message });
// 		}
// 	}

// 	return (
// 		<form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
// 			<FieldGroup>
// 				{status && (
// 					<FieldDescription
// 						aria-live={status.status === "success" ? "polite" : "assertive"}
// 						className={
// 							status.status === "success"
// 								? "text-emerald-600"
// 								: "text-destructive"
// 						}
// 						role={status.status === "success" ? "status" : "alert"}
// 					>
// 						{status.message}
// 					</FieldDescription>
// 				)}
// 				<Field>
// 					<FieldLabel htmlFor="email">
// 						{t("authTranslations.passwordReset.emailLabel")}
// 					</FieldLabel>
// 					<InputGroup>
// 						<InputGroupInput
// 							aria-invalid={!!errors.email}
// 							autoComplete="email"
// 							id="email"
// 							type="email"
// 							{...form.register("email")}
// 						/>
// 					</InputGroup>
// 					<FieldError errors={[errors.email]} />
// 				</Field>
// 				<Field>
// 					<FieldLabel htmlFor="otp">
// 						{t("authTranslations.passwordReset.otpLabel")}
// 					</FieldLabel>
// 					<Controller
// 						control={form.control}
// 						name="otp"
// 						render={({ field }) => (
// 							<InputGroup>
// 								<InputGroupInput
// 									aria-invalid={!!errors.otp}
// 									autoComplete="one-time-code"
// 									inputMode="numeric"
// 									maxLength={6}
// 									onChange={(event: ChangeEvent<HTMLInputElement>) =>
// 										field.onChange(event.target.value.replace(/\D/g, ""))
// 									}
// 									value={field.value}
// 								/>
// 							</InputGroup>
// 						)}
// 					/>
// 					<p className="text-muted-foreground text-xs">
// 						{t("authTranslations.passwordReset.otpHelp")}
// 					</p>
// 					<FieldError errors={[errors.otp]} />
// 				</Field>
// 				<Field>
// 					<FieldLabel htmlFor="password">
// 						{t("authTranslations.passwordReset.newPasswordLabel")}
// 					</FieldLabel>
// 					<InputGroup>
// 						<InputGroupInput
// 							aria-invalid={!!errors.password}
// 							autoComplete="new-password"
// 							id="password"
// 							type="password"
// 							{...form.register("password")}
// 						/>
// 					</InputGroup>
// 					<FieldError errors={[errors.password]} />
// 				</Field>
// 			</FieldGroup>
// 			<ButtonGroup className="justify-between">
// 				<Button asChild variant="link">
// 					<Link href="/sign-in">
// 						{t("authTranslations.passwordReset.backToSignIn")}
// 					</Link>
// 				</Button>
// 				<Button disabled={submitReset.isPending} type="submit">
// 					{submitReset.isPending
// 						? t("authTranslations.passwordReset.reset.submitting")
// 						: t("authTranslations.passwordReset.reset.submit")}
// 				</Button>
// 			</ButtonGroup>
// 		</form>
// 	);
// }
