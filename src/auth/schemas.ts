import { z } from "zod";
import { userRoleValues } from "@/auth/tables";

export const passwordSchema = z
	.string().min(6, "authTranslations.passwordMinLength")
	.superRefine((value, ctx) => {
		if (!/[a-z]/.test(value)) {
			ctx.addIssue({
				code: "custom",
				message: "authTranslations.passwordLowercase",
			});
		}

		if (!/[A-Z]/.test(value)) {
			ctx.addIssue({
				code: "custom",
				message: "authTranslations.passwordUppercase",
			});
		}

		if (!/[0-9]/.test(value)) {
			ctx.addIssue({
				code: "custom",
				message: "authTranslations.passwordNumber",
			});
		}

		if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
			ctx.addIssue({
				code: "custom",
				message: "authTranslations.passwordSpecialChar",
			});
		}
	});

export const signInSchema = z.object({
	email: z.email(),
	password: z.string().min(6, "authTranslations.passwordMinLength"),
});

export const signUpSchema = z.object({
	name: z.string(),
	email: z.email(),
	phone: z.string(),
	password: passwordSchema,
});

export const changeEmailSchema = z
	.object({
		newEmail: z.email(),
		confirmEmail: z.email(),
		currentPassword: z.string(),
	})
	.superRefine((values, ctx) => {
		if (values.newEmail !== values.confirmEmail) {
			ctx.addIssue({
				code: "custom",
				path: ["confirmEmail"],
				message: "authTranslations.emailMismatch",
			});
		}
	});

export const sessionSchema = z.object({
	sessionId: z.string(),
	exp: z.number(),
	user: z.object({
		id: z.string(),
		role: z.enum(userRoleValues),
	}),
});

export const passwordResetRequestSchema = z.object({ email: z.email() });
export const passwordResetSubmissionSchema = z.object({
	email: z.email(),
	otp: z.string().trim().regex(/^[0-9]{6}$/u, "authTranslations.validation.otpSixDigits"),
	password: passwordSchema,
});

export const changePasswordSchema = z
	.object({
		currentPassword: z.string(),
		newPassword: passwordSchema,
		confirmPassword: z.string(),
	})
	.superRefine((values, ctx) => {
		if (values.newPassword !== values.confirmPassword) {
			ctx.addIssue({
				code: "custom",
				path: ["confirmPassword"],
				message: "authTranslations.passwordMismatch",
			});
		}
	});

export const createPasswordSchema = z
	.object({
		newPassword: passwordSchema,
		confirmPassword: z.string(),
	})
	.superRefine((values, ctx) => {
		if (values.newPassword !== values.confirmPassword) {
			ctx.addIssue({
				code: "custom",
				path: ["confirmPassword"],
				message: "authTranslations.passwordMismatch",
			});
		}
	});

export const updateProfileSchema = z.object({
	name: z.string().trim(),
	phone: z.string().trim(),
});

export const createOrganizationSchema = z.object({
	nameEn: z.string(),
	nameAr: z.string(),
});
