/**
 * Alert Server Actions
 *
 * Server actions for crypto price/volatility alert CRUD operations and threshold checking.
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
  toggleAlertSchema,
  type CreateAlertInput,
  type AcknowledgeAlertInput,
  type DeleteAlertInput,
  type ToggleAlertInput,
} from "../validations/alerts";
import type { ActionResponse, CryptoAlert } from "../types";
import { auth } from "../auth";
import { revalidatePath } from "next/cache";

const MAX_ACTIVE_ALERTS = 10;

/**
 * Create a new crypto alert (price or volatility)
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

    const alertType = validatedInput.alertType || "price";

    // For price alerts: initialSide based on current price vs threshold
    // For volatility alerts: initialSide is not meaningful, default to "above"
    const initialSide =
      alertType === "volatility"
        ? "above"
        : currentPrice >= validatedInput.threshold
          ? "above"
          : "below";

    await db.insert(cryptoAlerts).values({
      userId: session.user.id,
      symbol: validatedInput.symbol,
      pairSymbol: validatedInput.pairSymbol,
      alertType,
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

/**
 * Toggle alert active state
 */
export async function toggleAlert(
  input: ToggleAlertInput
): Promise<ActionResponse> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user?.id) {
      return { success: false, error: "Authentication required" };
    }

    const validated = toggleAlertSchema.parse(input);

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

    await db
      .update(cryptoAlerts)
      .set({ isActive: validated.isActive })
      .where(eq(cryptoAlerts.id, validated.alertId));

    revalidatePath("/dashboard");

    return {
      success: true,
      message: validated.isActive ? "Alert activated" : "Alert deactivated",
    };
  } catch (error) {
    console.error("Error toggling alert:", error);
    return { success: false, error: "Failed to toggle alert" };
  }
}

interface BinancePriceTicker {
  symbol: string;
  price: string;
}

interface Binance24hrTicker {
  symbol: string;
  priceChangePercent: string;
  lastPrice: string;
}

/**
 * Check active alerts against current prices and trigger any that have crossed
 */
export async function checkAndTriggerAlerts(
  userId: string
): Promise<ActionResponse<CryptoAlert[]>> {
  try {
    // Get active (non-triggered, non-acknowledged, isActive) alerts
    const activeAlerts = await db
      .select()
      .from(cryptoAlerts)
      .where(
        and(
          eq(cryptoAlerts.userId, userId),
          eq(cryptoAlerts.triggered, false),
          eq(cryptoAlerts.acknowledged, false),
          eq(cryptoAlerts.isActive, true)
        )
      );

    if (activeAlerts.length === 0) {
      return { success: true, data: [] };
    }

    const priceAlerts = activeAlerts.filter(
      (a) => !a.alertType || a.alertType === "price"
    );
    const volatilityAlerts = activeAlerts.filter(
      (a) => a.alertType === "volatility"
    );

    const newlyTriggered: CryptoAlert[] = [];

    // --- Check price alerts ---
    if (priceAlerts.length > 0) {
      const priceResponse = await fetch(
        "https://api.binance.com/api/v3/ticker/price"
      );
      if (priceResponse.ok) {
        const allPrices: BinancePriceTicker[] = await priceResponse.json();
        const priceMap = new Map(
          allPrices.map((p) => [p.symbol, parseFloat(p.price)])
        );

        for (const alert of priceAlerts) {
          const currentPrice = priceMap.get(alert.pairSymbol);
          if (currentPrice === undefined) continue;

          const threshold = parseFloat(alert.threshold);
          const currentSide = currentPrice >= threshold ? "above" : "below";

          if (currentSide !== alert.initialSide) {
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
      }
    }

    // --- Check volatility alerts ---
    if (volatilityAlerts.length > 0) {
      // Get unique symbols needed
      const symbols = [...new Set(volatilityAlerts.map((a) => a.pairSymbol))];

      // Fetch 24hr tickers for needed symbols
      const tickerPromises = symbols.map(async (symbol) => {
        const res = await fetch(
          `https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`
        );
        if (!res.ok) return null;
        return (await res.json()) as Binance24hrTicker;
      });

      const tickers = await Promise.all(tickerPromises);
      const tickerMap = new Map<string, Binance24hrTicker>();
      for (const t of tickers) {
        if (t) tickerMap.set(t.symbol, t);
      }

      for (const alert of volatilityAlerts) {
        const ticker = tickerMap.get(alert.pairSymbol);
        if (!ticker) continue;

        const changePercent = Math.abs(parseFloat(ticker.priceChangePercent));
        const threshold = parseFloat(alert.threshold);

        if (changePercent >= threshold) {
          await db
            .update(cryptoAlerts)
            .set({
              triggered: true,
              triggeredAt: new Date(),
              triggeredPrice: ticker.lastPrice,
            })
            .where(eq(cryptoAlerts.id, alert.id));

          newlyTriggered.push({
            ...alert,
            triggered: true,
            triggeredAt: new Date(),
            triggeredPrice: ticker.lastPrice,
          } as CryptoAlert);
        }
      }
    }

    return { success: true, data: newlyTriggered };
  } catch (error) {
    console.error("Error checking alerts:", error);
    return { success: false, error: "Failed to check alerts" };
  }
}
