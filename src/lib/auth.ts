export const runtime = "nodejs";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import db from "@/db/drizzle";
import { users, session, account, verification } from "@/db/schema";

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  database: drizzleAdapter(db, {
    provider: "mysql",
    schema: {
      user: users,
      session: session,
      account: account,
      verification: verification,
    },
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      // Pour les tests : afficher le lien dans la console
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("🔑 RESET PASSWORD LINK");
      console.log(`📧 Email: ${user.email}`);
      console.log(`🔗 Link: ${url}`);
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url, token }) => {
      // Pour les tests : afficher le lien dans la console (console.error pour ne pas être filtré par Turbopack)
      console.error("\n\n========== EMAIL VERIFICATION LINK ==========");
      console.error("Email: " + user.email);
      console.error("Link: " + url);
      console.error("==============================================\n\n");
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      prompt: "select_account",
      accessType: "offline",
    },
  },
  redirects: {
    signIn: async (user: (typeof users)["$inferSelect"]) => {
      const { hasCompletedOnboarding, createUserProfile } = await import(
        "@/lib/actions/profile"
      );

      // Check if a profile exists. If not, create one.
      const profileResult = await hasCompletedOnboarding(user.id);
      if (!profileResult.success && profileResult.error === "Profile not found") {
        // No profile exists, so create a default one.
        await createUserProfile({
          experienceLevel: "beginner",
          investmentObjectives: ["learning"],
          riskTolerance: "low",
        });
        // After creation, they need to go to onboarding.
        return "/onboarding";
      }

      // Now check the onboarding status from the (potentially just created) profile.
      const finalStatus = await hasCompletedOnboarding(user.id);
      return finalStatus.data ? "/dashboard" : "/onboarding";
    },
    signUp: "/onboarding", // Fallback for direct sign-ups
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
  user: {
    additionalFields: {
      nickname: { type: "string", required: false },
      phone: { type: "string", required: false },
      verified: { type: "boolean", defaultValue: false },
      verificationStatus: { type: "string", defaultValue: "pending" },
      idImageUrl: { type: "string", required: false },
      idType: { type: "string", required: false },
      rejectionReason: { type: "string", required: false },
      verifiedAt: { type: "date", required: false },
    },
  },
  telemetry: { enabled: false },
  trustedOrigins: [process.env.BETTER_AUTH_URL || "http://localhost:3000"],
  plugins: [nextCookies()], // must be last
});


export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session["user"];
