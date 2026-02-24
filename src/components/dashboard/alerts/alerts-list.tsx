"use client";

import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { acknowledgeAlert, deleteAlert, toggleAlert } from "@/lib/actions/alerts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircleIcon,
  TrashIcon,
  WarningCircleIcon,
  CircleIcon,
  ToggleLeftIcon,
  ToggleRightIcon,
  TrendUpIcon,
  CurrencyDollarIcon,
} from "@phosphor-icons/react";
import type { CryptoAlert } from "@/lib/types";

interface AlertsListProps {
  alerts: CryptoAlert[];
  isLoading: boolean;
  onRefresh: () => void;
}

export function AlertsList({ alerts, isLoading, onRefresh }: AlertsListProps) {
  const t = useTranslations("dashboard.alerts");

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="bg-slate-900/60 rounded-lg sm:rounded-xl border border-slate-800/50 p-3 sm:p-4 animate-pulse"
          >
            <div className="h-3 sm:h-4 bg-slate-800 rounded w-1/3 mb-2" />
            <div className="h-2.5 sm:h-3 bg-slate-800 rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (alerts.length === 0) {
    return (
      <div className="bg-slate-900/60 rounded-lg sm:rounded-xl border border-slate-800/50 p-5 sm:p-8 text-center">
        <p className="text-slate-400 font-medium text-sm sm:text-base">{t("empty.title")}</p>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">{t("empty.description")}</p>
      </div>
    );
  }

  const active = alerts.filter((a) => !a.triggered && !a.acknowledged);
  const triggered = alerts.filter((a) => a.triggered && !a.acknowledged);
  const acknowledged = alerts.filter((a) => a.acknowledged);

  const handleAcknowledge = async (alertId: string) => {
    const result = await acknowledgeAlert({ alertId });
    if (result.success) {
      toast.success(t("actions.acknowledgeSuccess"));
      onRefresh();
    } else {
      toast.error(result.error || t("actions.error"));
    }
  };

  const handleDelete = async (alertId: string) => {
    const result = await deleteAlert({ alertId });
    if (result.success) {
      toast.success(t("actions.deleteSuccess"));
      onRefresh();
    } else {
      toast.error(result.error || t("actions.error"));
    }
  };

  const handleToggle = async (alertId: string, isActive: boolean) => {
    const result = await toggleAlert({ alertId, isActive });
    if (result.success) {
      toast.success(result.message || t("actions.toggleSuccess"));
      onRefresh();
    } else {
      toast.error(result.error || t("actions.error"));
    }
  };

  const isVolatility = (alert: CryptoAlert) => alert.alertType === "volatility";

  const formatThreshold = (alert: CryptoAlert) => {
    if (isVolatility(alert)) {
      return `${parseFloat(alert.threshold)}%`;
    }
    const num = parseFloat(alert.threshold);
    return `$${num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 8 })}`;
  };

  const formatPrice = (price: string) => {
    const num = parseFloat(price);
    return `$${num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 8 })}`;
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "";
    return new Date(date).toLocaleString();
  };

  const TypeBadge = ({ alert }: { alert: CryptoAlert }) => (
    <Badge
      variant="outline"
      className={
        isVolatility(alert)
          ? "border-purple-500/50 text-purple-400 text-[10px] sm:text-xs"
          : "border-amber-500/50 text-amber-400 text-[10px] sm:text-xs"
      }
    >
      {isVolatility(alert) ? (
        <TrendUpIcon className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-0.5 sm:mr-1" />
      ) : (
        <CurrencyDollarIcon className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-0.5 sm:mr-1" />
      )}
      {isVolatility(alert) ? t("type.volatility") : t("type.price")}
    </Badge>
  );

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Triggered alerts first */}
      {triggered.length > 0 && (
        <div className="space-y-2">
          {triggered.map((alert) => (
            <div
              key={alert.id}
              className="bg-amber-500/10 rounded-lg sm:rounded-xl border border-amber-500/30 p-3 sm:p-4"
            >
              <div className="flex items-start sm:items-center justify-between gap-2">
                <div className="flex items-start sm:items-center gap-2 sm:gap-3 min-w-0">
                  <WarningCircleIcon
                    className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 shrink-0 mt-0.5 sm:mt-0"
                    weight="fill"
                  />
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                      <span className="font-semibold text-white text-sm sm:text-base">
                        {alert.symbol}
                      </span>
                      <TypeBadge alert={alert} />
                      <Badge
                        variant="outline"
                        className="border-amber-500/50 text-amber-400 text-[10px] sm:text-xs"
                      >
                        {t("status.triggered")}
                      </Badge>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-400">
                      {isVolatility(alert)
                        ? `${t("card.volatilityThreshold")}: ${formatThreshold(alert)}`
                        : `${t("card.threshold")}: ${formatThreshold(alert)}`}
                    </p>
                    {alert.triggeredPrice && (
                      <p className="text-[10px] sm:text-xs text-amber-400/80">
                        {t("card.triggeredAt", {
                          price: formatPrice(alert.triggeredPrice),
                          date: formatDate(alert.triggeredAt),
                        })}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                  <Button
                    size="sm"
                    onClick={() => handleAcknowledge(alert.id)}
                    className="bg-amber-500 hover:bg-amber-600 text-black text-[10px] sm:text-xs h-7 sm:h-8 px-2 sm:px-3"
                  >
                    <CheckCircleIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-0.5 sm:mr-1" />
                    <span className="hidden sm:inline">{t("actions.acknowledge")}</span>
                    <span className="sm:hidden">OK</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(alert.id)}
                    className="text-slate-400 hover:text-red-400 hover:bg-red-500/10 h-7 sm:h-8 w-7 sm:w-8 p-0"
                  >
                    <TrashIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Active alerts */}
      {active.length > 0 && (
        <div className="space-y-2">
          {active.map((alert) => (
            <div
              key={alert.id}
              className={`rounded-lg sm:rounded-xl border p-3 sm:p-4 ${
                alert.isActive === false
                  ? "bg-slate-900/30 border-slate-800/30 opacity-60"
                  : "bg-slate-900/60 border-slate-800/50"
              }`}
            >
              <div className="flex items-start sm:items-center justify-between gap-2">
                <div className="flex items-start sm:items-center gap-2 sm:gap-3 min-w-0">
                  {alert.isActive === false ? (
                    <CircleIcon className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-slate-600 shrink-0 mt-1 sm:mt-0" />
                  ) : (
                    <span className="relative flex h-2.5 w-2.5 sm:h-3 sm:w-3 shrink-0 mt-1 sm:mt-0">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 sm:h-3 sm:w-3 bg-emerald-500" />
                    </span>
                  )}
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                      <span className="font-semibold text-white text-sm sm:text-base">
                        {alert.symbol}
                      </span>
                      <TypeBadge alert={alert} />
                      <Badge
                        variant="outline"
                        className={
                          alert.isActive === false
                            ? "border-slate-600 text-slate-500 text-[10px] sm:text-xs"
                            : "border-emerald-500/50 text-emerald-400 text-[10px] sm:text-xs"
                        }
                      >
                        {alert.isActive === false
                          ? t("status.paused")
                          : t("status.active")}
                      </Badge>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-400">
                      {isVolatility(alert)
                        ? `${t("card.volatilityThreshold")}: ${formatThreshold(alert)}`
                        : (
                          <>
                            {t("card.threshold")}: {formatThreshold(alert)}
                            <span className="text-slate-500 ml-1 sm:ml-2">
                              ({t("card.initialSide", {
                                side:
                                  alert.initialSide === "above"
                                    ? t("card.sideAbove")
                                    : t("card.sideBelow"),
                              })})
                            </span>
                          </>
                        )}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleToggle(alert.id, !alert.isActive)}
                    className="text-slate-400 hover:text-white h-7 sm:h-8 w-7 sm:w-8 p-0"
                    title={alert.isActive ? t("actions.pause") : t("actions.activate")}
                  >
                    {alert.isActive === false ? (
                      <ToggleLeftIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                    ) : (
                      <ToggleRightIcon className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" weight="fill" />
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(alert.id)}
                    className="text-slate-400 hover:text-red-400 hover:bg-red-500/10 h-7 sm:h-8 w-7 sm:w-8 p-0"
                  >
                    <TrashIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Acknowledged alerts */}
      {acknowledged.length > 0 && (
        <div className="space-y-2 opacity-60">
          {acknowledged.map((alert) => (
            <div
              key={alert.id}
              className="bg-slate-900/40 rounded-lg sm:rounded-xl border border-slate-800/30 p-3 sm:p-4"
            >
              <div className="flex items-start sm:items-center justify-between gap-2">
                <div className="flex items-start sm:items-center gap-2 sm:gap-3 min-w-0">
                  <CircleIcon className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600 shrink-0 mt-0.5 sm:mt-0" />
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                      <span className="font-semibold text-slate-400 text-sm sm:text-base">
                        {alert.symbol}
                      </span>
                      <TypeBadge alert={alert} />
                      <Badge
                        variant="outline"
                        className="border-slate-600 text-slate-500 text-[10px] sm:text-xs"
                      >
                        {t("status.acknowledged")}
                      </Badge>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-500">
                      {isVolatility(alert)
                        ? `${t("card.volatilityThreshold")}: ${formatThreshold(alert)}`
                        : `${t("card.threshold")}: ${formatThreshold(alert)}`}
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDelete(alert.id)}
                  className="text-slate-500 hover:text-red-400 hover:bg-red-500/10 h-7 sm:h-8 w-7 sm:w-8 p-0 shrink-0"
                >
                  <TrashIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
