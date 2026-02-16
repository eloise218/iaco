/**
 * Alert Server Actions
 *
 * Server actions for crypto price alert CRUD operations and threshold checking.
 */

"use server";

import { eq, and } from "drizzle-orm";
import { headers } from "next/headers";
import db from "../../../db/drizzle";
import { cryptoAlerts } from "../../../db/schema";
import {
  createAlertSchema,
  acknowledgeAlertSchema,
  deleteAlertSchema,
  type CreateAlertInput,
  type AcknowledgeAlertInput,
  type DeleteAlertInput,
} from "../validations/alerts";
import type { ActionResponse, CryptoAlert } from "../types";
import { auth } from "../auth";
import { revalidatePath } from "next/cache";

const MAX_ACTIVE_ALERTS = 10;

/**
 * Create a new crypto price alert
 */
export async function createAlert(
  input: CreateAlertInput
): Promise<ActionResponse<CryptoAlert>> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user?.id) {
      return { success: false, error: "Authentication required" };
    }

    const validatedInput = createAlertSchema.parse(input);

    // Check active alerts limit
    const activeAlerts = await db
      .select()
      .from(cryptoAlerts)
      .where(
        and(
          eq(cryptoAlerts.userId, session.user.id),
          eq(cryptoAlerts.triggered, false),
          eq(cryptoAlerts.acknowledged, false)
        )
      );

    if (activeAlerts.length >= MAX_ACTIVE_ALERTS) {
      return {
        success: false,
        error: `Maximum ${MAX_ACTIVE_ALERTS} active alerts allowed`,
      };
    }

    // Fetch current price from Binance
    const priceResponse = await fetch(
      `https://api.binance.com/api/v3/ticker/price?symbol=${validatedInput.pairSymbol}`
    );
    if (!priceResponse.ok) {
      return { success: false, error: "Failed to fetch current price" };
    }

    const priceData = await priceResponse.json();
    const currentPrice = parseFloat(priceData.price);

    if (isNaN(currentPrice)) {
      return { success: false, error: "Invalid price data from Binance" };
    }

    const initialSide =
      currentPrice >= validatedInput.threshold ? "above" : "below";

    await db.insert(cryptoAlerts).values({
      userId: session.user.id,
      symbol: validatedInput.symbol,
      pairSymbol: validatedInput.pairSymbol,
      threshold: String(validatedInput.threshold),
      initialPrice: String(currentPrice),
      initialSide,
    });

    // Fetch the created alert
    const created = await db
      .select()
      .from(cryptoAlerts)
      .where(eq(cryptoAlerts.userId, session.user.id))
      .orderBy(cryptoAlerts.createdAt)
      .limit(1);

    revalidatePath("/dashboard");

    return {
      success: true,
      data: created[0] as CryptoAlert,
      message: "Alert created successfully",
    };
  } catch (error) {
    console.error("Error creating alert:", error);

    if (error instanceof Error && error.name === "ZodError") {
      return { success: false, error: "Invalid input data" };
    }

    return { success: false, error: "Failed to create alert" };
  }
}

/**
 * Get all alerts for the current user
 */
export async function getUserAlerts(): Promise<ActionResponse<CryptoAlert[]>> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user?.id) {
      return { success: false, error: "Authentication required" };
    }

    const alerts = await db
      .select()
      .from(cryptoAlerts)
      .where(eq(cryptoAlerts.userId, session.user.id))
      .orderBy(cryptoAlerts.createdAt);

    return { success: true, data: alerts as CryptoAlert[] };
  } catch (error) {
    console.error("Error fetching alerts:", error);
    return { success: false, error: "Failed to fetch alerts" };
  }
}

/**
 * Acknowledge a triggered alert
 */
export async function acknowledgeAlert(
  input: AcknowledgeAlertInput
): Promise<ActionResponse> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user?.id) {
      return { success: false, error: "Authentication required" };
    }

    const validated = acknowledgeAlertSchema.parse(input);

    // Verify ownership and state
    const alert = await db
      .select()
      .from(cryptoAlerts)
      .where(
        and(
          eq(cryptoAlerts.id, validated.alertId),
          eq(cryptoAlerts.userId, session.user.id)
        )
      )
      .limit(1);

    if (alert.length === 0) {
      return { success: false, error: "Alert not found" };
    }

    if (!alert[0].triggered) {
      return { success: false, error: "Alert has not been triggered" };
    }

    if (alert[0].acknowledged) {
      return { success: false, error: "Alert already acknowledged" };
    }

    await db
      .update(cryptoAlerts)
      .set({
        acknowledged: true,
        acknowledgedAt: new Date(),
      })
      .where(eq(cryptoAlerts.id, validated.alertId));

    revalidatePath("/dashboard");

    return { success: true, message: "Alert acknowledged" };
  } catch (error) {
    console.error("Error acknowledging alert:", error);
    return { success: false, error: "Failed to acknowledge alert" };
  }
}

/**
 * Delete an alert
 */
export async function deleteAlert(
  input: DeleteAlertInput
): Promise<ActionResponse> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user?.id) {
      return { success: false, error: "Authentication required" };
    }

    const validated = deleteAlertSchema.parse(input);

    // Verify ownership
    const alert = await db
      .select()
      .from(cryptoAlerts)
      .where(
        and(
          eq(cryptoAlerts.id, validated.alertId),
          eq(cryptoAlerts.userId, session.user.id)
        )
      )
      .limit(1);

    if (alert.length === 0) {
      return { success: false, error: "Alert not found" };
    }

    await db.delete(cryptoAlerts).where(eq(cryptoAlerts.id, validated.alertId));

    revalidatePath("/dashboard");

    return { success: true, message: "Alert deleted" };
  } catch (error) {
    console.error("Error deleting alert:", error);
    return { success: false, error: "Failed to delete alert" };
  }
}

interface BinancePriceTicker {
  symbol: string;
  price: string;
}

/**
 * Check active alerts against current prices and trigger any that have crossed
 */
export async function checkAndTriggerAlerts(
  userId: string
): Promise<ActionResponse<CryptoAlert[]>> {
  try {
    // Get active (non-triggered, non-acknowledged) alerts
    const activeAlerts = await db
      .select()
      .from(cryptoAlerts)
      .where(
        and(
          eq(cryptoAlerts.userId, userId),
          eq(cryptoAlerts.triggered, false),
          eq(cryptoAlerts.acknowledged, false)
        )
      );

    if (activeAlerts.length === 0) {
      return { success: true, data: [] };
    }

    // Fetch current prices from Binance (bulk)
    const priceResponse = await fetch(
      "https://api.binance.com/api/v3/ticker/price"
    );
    if (!priceResponse.ok) {
      return { success: false, error: "Failed to fetch prices" };
    }

    const allPrices: BinancePriceTicker[] = await priceResponse.json();
    const priceMap = new Map(
      allPrices.map((p) => [p.symbol, parseFloat(p.price)])
    );

    const newlyTriggered: CryptoAlert[] = [];

    for (const alert of activeAlerts) {
      const currentPrice = priceMap.get(alert.pairSymbol);
      if (currentPrice === undefined) continue;

      const threshold = parseFloat(alert.threshold);
      const currentSide = currentPrice >= threshold ? "above" : "below";

      if (currentSide !== alert.initialSide) {
        // Threshold has been crossed
        await db
          .update(cryptoAlerts)
          .set({
            triggered: true,
            triggeredAt: new Date(),
            triggeredPrice: String(currentPrice),
          })
          .where(eq(cryptoAlerts.id, alert.id));

        newlyTriggered.push({
          ...alert,
          triggered: true,
          triggeredAt: new Date(),
          triggeredPrice: String(currentPrice),
        } as CryptoAlert);
      }
    }

    return { success: true, data: newlyTriggered };
  } catch (error) {
    console.error("Error checking alerts:", error);
    return { success: false, error: "Failed to check alerts" };
  }
}
