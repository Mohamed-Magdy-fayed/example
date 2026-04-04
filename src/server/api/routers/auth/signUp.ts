import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";

import {
    generateSalt,
    hashPassword,
} from "@/features/core/auth/core/passwordHasher";
import { customerDetailsStepSchema } from "@/features/core/auth/schemas";
import { UserCredentialsTable, UsersTable } from "@/features/core/auth/tables";
import { publicProcedure } from "@/server/api/trpc";
import { assertPhoneVerified } from "@/server/whatsapp/otp";

export const signUpProcedure = publicProcedure
    .input(customerDetailsStepSchema)
    .mutation(async ({ ctx, input }) => {
        // Verify the phone was actually verified via OTP
        await assertPhoneVerified(input.phone, input.verificationId).catch(() => {
            throw new TRPCError({
                code: "FORBIDDEN",
                message: "Phone number not verified",
            });
        });

        const email = input.email?.trim() || null;

        const user = await ctx.db.transaction(async (trx) => {
            // Check for duplicate phone
            const existingByPhone = await trx.query.UsersTable.findFirst({
                columns: { id: true },
                where: eq(UsersTable.phone, input.phone),
            });

            if (existingByPhone) {
                throw new TRPCError({
                    code: "CONFLICT",
                    message: "authTranslations.signUp.error.duplicate",
                });
            }

            // Check for duplicate email (only if provided)
            if (email) {
                const existingByEmail = await trx.query.UsersTable.findFirst({
                    columns: { id: true },
                    where: eq(UsersTable.email, email),
                });

                if (existingByEmail) {
                    throw new TRPCError({
                        code: "CONFLICT",
                        message: "authTranslations.signUp.error.duplicate",
                    });
                }
            }

            const [created] = await trx
                .insert(UsersTable)
                .values({
                    name: input.name,
                    email,
                    phone: input.phone,
                    role: "customer",
                    phoneVerifiedAt: new Date(),
                    createdBy: "self",
                })
                .returning({
                    id: UsersTable.id,
                    role: UsersTable.role,
                });

            if (!created) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "authTranslations.signUp.error.generic",
                });
            }

            const salt = generateSalt();
            const passwordHash = await hashPassword(input.password, salt);
            await trx.insert(UserCredentialsTable).values({
                userId: created.id,
                passwordHash,
                passwordSalt: salt,
            });

            return created;
        });

        return { user };
    });
