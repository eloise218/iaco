"use server";

import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import db from "@/db/drizzle";
import { users } from "@/db/schema";
import { auth } from "../auth";
import type { ActionResponse } from "../types";

export async function getPremiumStatus(): Promise<
  ActionResponse<{ isPremium: boolean; premiumSince: Date | null }>
> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return { success: false, error: "Authentication required" };
    }

    const [user] = await db
      .select({
        isPremium: users.isPremium,
        premiumSince: users.premiumSince,
      })
      .from(users)
      .where(eq(users.id, session.user.id))
      .limit(1);

    return {
      success: true,
      data: {
        isPremium: user?.isPremium ?? false,
        premiumSince: user?.premiumSince ?? null,
      },
    };
  } catch (error) {
    console.error("getPremiumStatus error:", error);
    return { success: false, error: "Failed to get premium status" };
  }
}
