"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import db from "../../../db/drizzle";
import { cookieConsent } from "../../../db/schema";
import { ActionResponse } from "../types";
import { auth } from "../auth";

const SIX_MONTHS_MS = 6 * 30 * 24 * 60 * 60 * 1000;

/**
 * Save or update cookie consent for the authenticated user.
 */
export async function saveCookieConsent(
  consentedAt: string
): Promise<ActionResponse> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user?.id) {
      return { success: false, error: "Authentication required" };
    }

    const existing = await db
      .select()
      .from(cookieConsent)
      .where(eq(cookieConsent.userId, session.user.id))
      .limit(1);

    if (existing.length > 0) {
      await db
        .update(cookieConsent)
        .set({ lastRefreshedAt: new Date() })
        .where(eq(cookieConsent.userId, session.user.id));
    } else {
      await db.insert(cookieConsent).values({
        userId: session.user.id,
        consentedAt: new Date(consentedAt),
        lastRefreshedAt: new Date(),
      });
    }

    return { success: true };
  } catch (error) {
    console.error("Error saving cookie consent:", error);
    return { success: false, error: "Failed to save cookie consent" };
  }
}

/**
 * Check if the authenticated user has valid (non-expired) cookie consent.
 */
export async function checkCookieConsent(): Promise<
  ActionResponse<{ consented: boolean }>
> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user?.id) {
      return { success: true, data: { consented: false } };
    }

    const existing = await db
      .select()
      .from(cookieConsent)
      .where(eq(cookieConsent.userId, session.user.id))
      .limit(1);

    if (existing.length === 0) {
      return { success: true, data: { consented: false } };
    }

    const lastRefreshed = existing[0].lastRefreshedAt.getTime();
    if (Date.now() - lastRefreshed > SIX_MONTHS_MS) {
      await db
        .delete(cookieConsent)
        .where(eq(cookieConsent.userId, session.user.id));
      return { success: true, data: { consented: false } };
    }

    return { success: true, data: { consented: true } };
  } catch (error) {
    console.error("Error checking cookie consent:", error);
    return { success: false, error: "Failed to check cookie consent" };
  }
}

/**
 * Refresh consent timestamp for a given user (called from auth.ts on login).
 * Uses userId directly since auth callback already has the user object.
 */
export async function refreshCookieConsent(
  userId: string
): Promise<void> {
  try {
    const existing = await db
      .select()
      .from(cookieConsent)
      .where(eq(cookieConsent.userId, userId))
      .limit(1);

    if (existing.length > 0) {
      await db
        .update(cookieConsent)
        .set({ lastRefreshedAt: new Date() })
        .where(eq(cookieConsent.userId, userId));
    }
  } catch (error) {
    console.error("Error refreshing cookie consent:", error);
  }
}
