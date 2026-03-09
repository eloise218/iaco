export const runtime = "nodejs";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { Resend } from "resend";
import db from "@/db/drizzle";
import { users, session, account, verification } from "@/db/schema";

import { logger } from "./logger";

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
      logger.info("auth", `Sending reset password email to: ${user.email}`);
      try {
        const { data, error } = await resend.emails.send({
          from: "IACO <noreply@iaco.app>",
          to: user.email,
          subject: "Réinitialise ton mot de passe - IACO",
          html: `<h2>Réinitialisation de mot de passe</h2>
            <p>Clique sur le lien ci-dessous pour réinitialiser ton mot de passe :</p>
            <a href="${url}" style="display:inline-block;padding:12px 24px;background:#6366f1;color:white;text-decoration:none;border-radius:8px;">Réinitialiser mon mot de passe</a>
            <p style="margin-top:16px;color:#666;">Si tu n'as pas demandé cette réinitialisation, ignore cet email.</p>`,
        });
        if (error) {
          logger.error("auth", "Error sending reset email", error);
        } else {
          logger.info("auth", `Reset email sent successfully, id: ${data?.id}`);
        }
      } catch (err) {
        logger.error("auth", "Exception sending reset email", err);
      }
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      logger.info("auth", `Sending verification email to: ${user.email}`);

      if (process.env.NODE_ENV === "development") {
        console.log(`\n✉️  Verification email for ${user.email}:`);
        console.log(url);
        console.log();
      }

      try {
        const { data, error } = await resend.emails.send({
          from: "IACO <noreply@iaco.app>",
          to: user.email,
          subject: "Vérifie ton adresse email - IACO",
          html: `<h2>Bienvenue sur IACO !</h2>
            <p>Clique sur le lien ci-dessous pour vérifier ton adresse email :</p>
            <a href="${url}" style="display:inline-block;padding:12px 24px;background:#6366f1;color:white;text-decoration:none;border-radius:8px;">Vérifier mon email</a>
            <p style="margin-top:16px;color:#666;">Si tu n'as pas créé de compte, ignore cet email.</p>`,
        });
        if (error) {
          logger.error("auth", "Error sending verification email", error);
        } else {
          logger.info("auth", `Verification email sent successfully, id: ${data?.id}`);
        }
      } catch (err) {
        logger.error("auth", "Exception sending verification email", err);
      }
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
      try {
        // Refresh cookie consent timestamp on login (extends 6-month window)
        try {
          const { refreshCookieConsent } = await import(
            "@/lib/actions/cookie-consent"
          );
          await refreshCookieConsent(user.id);
        } catch {
          // Non-blocking
        }

        // Check onboarding status directly via DB (no headers() dependency)
        const { eq } = await import("drizzle-orm");
        const { userProfiles } = await import("@/db/schema");
        const profile = await db
          .select({ completedOnboarding: userProfiles.completedOnboarding })
          .from(userProfiles)
          .where(eq(userProfiles.userId, user.id))
          .limit(1);

        if (profile.length === 0) {
          // Create a default profile directly via DB
          await db.insert(userProfiles).values({
            userId: user.id,
            experienceLevel: "beginner",
            investmentObjectives: ["learning"],
            riskTolerance: "low",
            completedOnboarding: false,
          });
          return "/fr/onboarding";
        }

        return profile[0].completedOnboarding ? "/fr/dashboard" : "/fr/onboarding";
      } catch (err) {
        logger.error("auth", "Error in signIn redirect callback", err);
        return "/fr/onboarding";
      }
    },
    signUp: "/fr/onboarding", // Fallback for direct sign-ups
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
      stripeCustomerId: { type: "string", required: false },
      isPremium: { type: "boolean", defaultValue: false },
      premiumSince: { type: "date", required: false },
    },
  },
  telemetry: { enabled: false },
  trustedOrigins: [process.env.BETTER_AUTH_URL || "http://localhost:3000"],
  plugins: [nextCookies()], // must be last
});


export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session["user"];
