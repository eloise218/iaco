"use client";

import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { acknowledgeAlert, deleteAlert } from "@/lib/actions/alerts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircleIcon,
  TrashIcon,
  WarningCircleIcon,
  CircleIcon,
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
      <div className="space-y-3">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="bg-slate-900/60 rounded-xl border border-slate-800/50 p-4 animate-pulse"
          >
            <div className="h-4 bg-slate-800 rounded w-1/3 mb-2" />
            <div className="h-3 bg-slate-800 rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (alerts.length === 0) {
    return (
      <div className="bg-slate-900/60 rounded-xl border border-slate-800/50 p-8 text-center">
        <p className="text-slate-400 font-medium">{t("empty.title")}</p>
        <p className="text-sm text-slate-500 mt-1">{t("empty.description")}</p>
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

  const formatPrice = (price: string) => {
    const num = parseFloat(price);
    return `$${num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 8 })}`;
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "";
    return new Date(date).toLocaleString();
  };

  return (
    <div className="space-y-4">
      {/* Triggered alerts first */}
      {triggered.length > 0 && (
        <div className="space-y-2">
          {triggered.map((alert) => (
            <div
              key={alert.id}
              className="bg-amber-500/10 rounded-xl border border-amber-500/30 p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <WarningCircleIcon
                    className="w-5 h-5 text-amber-400"
                    weight="fill"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white">
                        {alert.symbol}
                      </span>
                      <Badge
                        variant="outline"
                        className="border-amber-500/50 text-amber-400 text-xs"
                      >
                        {t("status.triggered")}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-400">
                      {t("card.threshold")}: {formatPrice(alert.threshold)}
                    </p>
                    {alert.triggeredPrice && (
                      <p className="text-xs text-amber-400/80">
                        {t("card.triggeredAt", {
                          price: formatPrice(alert.triggeredPrice),
                          date: formatDate(alert.triggeredAt),
                        })}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleAcknowledge(alert.id)}
                    className="bg-amber-500 hover:bg-amber-600 text-black text-xs"
                  >
                    <CheckCircleIcon className="w-4 h-4 mr-1" />
                    {t("actions.acknowledge")}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(alert.id)}
                    className="text-slate-400 hover:text-red-400 hover:bg-red-500/10"
                  >
                    <TrashIcon className="w-4 h-4" />
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
              className="bg-slate-900/60 rounded-xl border border-slate-800/50 p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white">
                        {alert.symbol}
                      </span>
                      <Badge
                        variant="outline"
                        className="border-emerald-500/50 text-emerald-400 text-xs"
                      >
                        {t("status.active")}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-400">
                      {t("card.threshold")}: {formatPrice(alert.threshold)}
                      <span className="text-slate-500 ml-2">
                        ({t("card.initialSide", {
                          side:
                            alert.initialSide === "above"
                              ? t("card.sideAbove")
                              : t("card.sideBelow"),
                        })})
                      </span>
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDelete(alert.id)}
                  className="text-slate-400 hover:text-red-400 hover:bg-red-500/10"
                >
                  <TrashIcon className="w-4 h-4" />
                </Button>
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
              className="bg-slate-900/40 rounded-xl border border-slate-800/30 p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CircleIcon className="w-5 h-5 text-slate-600" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-400">
                        {alert.symbol}
                      </span>
                      <Badge
                        variant="outline"
                        className="border-slate-600 text-slate-500 text-xs"
                      >
                        {t("status.acknowledged")}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-500">
                      {t("card.threshold")}: {formatPrice(alert.threshold)}
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDelete(alert.id)}
                  className="text-slate-500 hover:text-red-400 hover:bg-red-500/10"
                >
                  <TrashIcon className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
