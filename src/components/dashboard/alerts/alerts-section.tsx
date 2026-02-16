"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useAlertsPolling } from "@/hooks/use-alerts-polling";
import { CreateAlertForm } from "./create-alert-form";
import { AlertsList } from "./alerts-list";
import { BellIcon } from "@phosphor-icons/react";

export function AlertsSection() {
  const t = useTranslations("dashboard.alerts");
  const { alerts, isLoading, newlyTriggered, clearNewlyTriggered, refetch } =
    useAlertsPolling();

  useEffect(() => {
    if (newlyTriggered.length > 0) {
      newlyTriggered.forEach((alert) => {
        toast.warning(
          t("triggered.notification", {
            symbol: alert.symbol,
            price: alert.triggeredPrice ?? "N/A",
          }),
          { duration: 10000 }
        );
      });
      clearNewlyTriggered();
    }
  }, [newlyTriggered, clearNewlyTriggered, t]);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <BellIcon className="w-5 h-5 text-amber-400" weight="fill" />
          {t("title")}
        </h2>
        <CreateAlertForm onAlertCreated={refetch} />
      </div>
      <AlertsList alerts={alerts} isLoading={isLoading} onRefresh={refetch} />
    </div>
  );
}
