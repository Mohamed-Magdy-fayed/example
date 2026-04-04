import { createTRPCRouter } from "@/server/api/trpc";
import { emailRouter } from "./email";
import { oauthRouter } from "./oauth";
import { otpRouter } from "./otp";
import { phoneRouter } from "./phone";
import { profileRouter } from "./profile";

export const authRouter = createTRPCRouter({
    otp: otpRouter,
    oauth: oauthRouter,
    email: emailRouter,
    profile: profileRouter,
    phone: phoneRouter,
});
