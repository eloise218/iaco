"use client";

import { useTranslations } from "next-intl";
import { useAlertsPolling } from "@/hooks/use-alerts-polling";
import { CreateAlertForm } from "./create-alert-form";
import { CreateVolatilityForm } from "./create-volatility-form";
import { AlertsList } from "./alerts-list";
import { BellIcon } from "@phosphor-icons/react";

export function AlertsSection() {
  const t = useTranslations("dashboard.alerts");
  const { alerts, isLoading, refetch } = useAlertsPolling();

  return (
    <div>
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h2 className="text-base sm:text-xl font-semibold text-white flex items-center gap-2">
          <BellIcon className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" weight="fill" />
          {t("title")}
        </h2>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <CreateAlertForm onAlertCreated={refetch} />
          <CreateVolatilityForm onAlertCreated={refetch} />
        </div>
      </div>
      <AlertsList alerts={alerts} isLoading={isLoading} onRefresh={refetch} />
    </div>
  );
}
