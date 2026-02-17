/**
 * Alert Validation Schemas
 *
 * Zod schemas for validating crypto alert creation and management.
 */

import { z } from "zod";

export const createAlertSchema = z.object({
  symbol: z.string().min(1, "Symbol is required").max(20),
  pairSymbol: z.string().min(1, "Pair symbol is required").max(20),
  threshold: z
    .number()
    .positive("Threshold must be a positive number")
    .finite("Threshold must be a finite number"),
  alertType: z.enum(["price", "volatility"]).default("price"),
});

export const acknowledgeAlertSchema = z.object({
  alertId: z.string().length(36, "Invalid alert ID"),
});

export const deleteAlertSchema = z.object({
  alertId: z.string().length(36, "Invalid alert ID"),
});

export const toggleAlertSchema = z.object({
  alertId: z.string().length(36, "Invalid alert ID"),
  isActive: z.boolean(),
});

export type CreateAlertInput = z.infer<typeof createAlertSchema>;
export type AcknowledgeAlertInput = z.infer<typeof acknowledgeAlertSchema>;
export type DeleteAlertInput = z.infer<typeof deleteAlertSchema>;
export type ToggleAlertInput = z.infer<typeof toggleAlertSchema>;
