"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { AlertCircleIcon, ChevronDownIcon } from "lucide-react";

export function DisclaimerBanner() {
  const t = useTranslations("chat.disclaimer");
  const [expanded, setExpanded] = useState(false);

  return (
    <button
      type="button"
      onClick={() => setExpanded(!expanded)}
      className="w-full text-left bg-amber-50 dark:bg-amber-950/20 border-b border-amber-200 dark:border-amber-900 px-3 py-2 transition-all duration-200"
    >
      <div className="flex items-center gap-2">
        <AlertCircleIcon className="size-3.5 text-amber-600 dark:text-amber-500 shrink-0" />
        <p className="text-[11px] text-amber-800 dark:text-amber-200 flex-1">
          {expanded ? (
            <>
              <strong>{t("expandedBold")}</strong> {t("expandedText")}
            </>
          ) : (
            <span>
              <strong>{t("shortBold")}</strong> {t("shortText")}
            </span>
          )}
        </p>
        <ChevronDownIcon
          className={`size-3.5 text-amber-600 dark:text-amber-500 shrink-0 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
        />
      </div>
    </button>
  );
}
