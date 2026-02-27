ALTER TABLE "user_oauth_accounts" ALTER COLUMN "provider" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."oauth_provider";--> statement-breakpoint
CREATE TYPE "public"."oauth_provider" AS ENUM('google', 'github');--> statement-breakpoint
ALTER TABLE "user_oauth_accounts" ALTER COLUMN "provider" SET DATA TYPE "public"."oauth_provider" USING "provider"::"public"."oauth_provider";