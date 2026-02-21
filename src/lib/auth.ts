export const runtime = "nodejs";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { Resend } from "resend";
import db from "@/db/drizzle";
import { users, session, account, verification } from "@/db/schema";

const resend = new Resend(process.env.RESEND_API_KEY);

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
      console.log("🔑 RESET PASSWORD LINK:", url);
      await resend.emails.send({
        from: "IACO <onboarding@resend.dev>",
        to: user.email,
        subject: "Réinitialise ton mot de passe - IACO",
        html: `<h2>Réinitialisation de mot de passe</h2>
          <p>Clique sur le lien ci-dessous pour réinitialiser ton mot de passe :</p>
          <a href="${url}" style="display:inline-block;padding:12px 24px;background:#6366f1;color:white;text-decoration:none;border-radius:8px;">Réinitialiser mon mot de passe</a>
          <p style="margin-top:16px;color:#666;">Si tu n'as pas demandé cette réinitialisation, ignore cet email.</p>`,
      });
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      console.error("\n========== EMAIL VERIFICATION LINK ==========");
      console.error("Email: " + user.email);
      console.error("Link: " + url);
      console.error("==============================================\n");
      await resend.emails.send({
        from: "IACO <onboarding@resend.dev>",
        to: user.email,
        subject: "Vérifie ton adresse email - IACO",
        html: `<h2>Bienvenue sur IACO !</h2>
          <p>Clique sur le lien ci-dessous pour vérifier ton adresse email :</p>
          <a href="${url}" style="display:inline-block;padding:12px 24px;background:#6366f1;color:white;text-decoration:none;border-radius:8px;">Vérifier mon email</a>
          <p style="margin-top:16px;color:#666;">Si tu n'as pas créé de compte, ignore cet email.</p>`,
      });
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
