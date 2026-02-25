"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { CryptoAlert } from "@/lib/types";

const POLL_INTERVAL = 30_000; // 30 seconds
const STORAGE_KEY = "notified_alert_ids";

function loadNotifiedIds(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    return new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"));
  } catch {
    return new Set();
  }
}

function saveNotifiedIds(ids: Set<string>) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
  } catch { /* quota exceeded or private browsing */ }
}

export function useAlertsPolling() {
  const [alerts, setAlerts] = useState<CryptoAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newlyTriggered, setNewlyTriggered] = useState<CryptoAlert[]>([]);
  const previousTriggeredIds = useRef<Set<string>>(loadNotifiedIds());

  const fetchAlerts = useCallback(async () => {
    try {
      const response = await fetch("/api/alerts/check");
      if (!response.ok) throw new Error("Failed to fetch alerts");

      const result = await response.json();
      if (result.success && result.data) {
        const currentAlerts: CryptoAlert[] = result.data;

        // Detect newly triggered alerts (for toast notification)
        const triggered = currentAlerts.filter(
          (a) => a.triggered && !previousTriggeredIds.current.has(a.id)
        );
        if (triggered.length > 0) {
          setNewlyTriggered(triggered);
          triggered.forEach((a) => previousTriggeredIds.current.add(a.id));
        }

        // Clean up IDs of alerts that are no longer triggered (acknowledged or deleted)
        const activeTriggeredIds = new Set(
          currentAlerts.filter((a) => a.triggered).map((a) => a.id)
        );
        for (const id of previousTriggeredIds.current) {
          if (!activeTriggeredIds.has(id)) {
            previousTriggeredIds.current.delete(id);
          }
        }
        saveNotifiedIds(previousTriggeredIds.current);

        setAlerts(currentAlerts);
        setError(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchAlerts]);

  const clearNewlyTriggered = useCallback(() => {
    setNewlyTriggered([]);
  }, []);

  return {
    alerts,
    isLoading,
    error,
    newlyTriggered,
    clearNewlyTriggered,
    refetch: fetchAlerts,
  };
}
