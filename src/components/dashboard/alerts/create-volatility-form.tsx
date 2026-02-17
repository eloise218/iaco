"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { createAlert } from "@/lib/actions/alerts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  TrendUpIcon,
  MagnifyingGlassIcon,
  CaretUpDownIcon,
} from "@phosphor-icons/react";
import type { BinanceSymbolInfo } from "@/lib/types";

interface CreateVolatilityFormProps {
  onAlertCreated?: () => void;
}

export function CreateVolatilityForm({
  onAlertCreated,
}: CreateVolatilityFormProps) {
  const t = useTranslations("dashboard.alerts.createVolatility");
  const tCreate = useTranslations("dashboard.alerts.create");
  const [open, setOpen] = useState(false);
  const [comboboxOpen, setComboboxOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [symbols, setSymbols] = useState<BinanceSymbolInfo[]>([]);
  const [selectedSymbol, setSelectedSymbol] =
    useState<BinanceSymbolInfo | null>(null);
  const [threshold, setThreshold] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced search for symbols
  useEffect(() => {
    if (!searchQuery || searchQuery.length < 1) {
      setSymbols([]);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      try {
        const response = await fetch(
          `/api/binance-symbols?q=${encodeURIComponent(searchQuery)}`
        );
        if (response.ok) {
          const data = await response.json();
          setSymbols(data);
        }
      } catch {
        // Ignore search errors
      }
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchQuery]);

  const handleSubmit = async () => {
    if (!selectedSymbol || !threshold) return;

    const thresholdNum = parseFloat(threshold);
    if (isNaN(thresholdNum) || thresholdNum <= 0 || thresholdNum > 100) {
      toast.error(t("error"));
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await createAlert({
        symbol: selectedSymbol.baseAsset,
        pairSymbol: selectedSymbol.symbol,
        threshold: thresholdNum,
        alertType: "volatility",
      });

      if (result.success) {
        toast.success(t("success"));
        setOpen(false);
        resetForm();
        onAlertCreated?.();
      } else {
        toast.error(result.error || t("error"));
      }
    } catch {
      toast.error(t("error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSelectedSymbol(null);
    setThreshold("");
    setSearchQuery("");
    setSymbols([]);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) resetForm();
      }}
    >
      <DialogTrigger asChild>
        <Button
          size="sm"
          className="bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 border border-purple-500/30"
        >
          <TrendUpIcon className="w-4 h-4 mr-2" weight="bold" />
          {t("button")}
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-slate-900 border-slate-800 text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white">{t("title")}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          {/* Symbol Search */}
          <div className="space-y-2">
            <Label className="text-slate-300">Crypto</Label>
            <Popover open={comboboxOpen} onOpenChange={setComboboxOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={comboboxOpen}
                  className="w-full justify-between bg-slate-800 border-slate-700 text-white hover:bg-slate-700 hover:text-white"
                >
                  {selectedSymbol
                    ? `${selectedSymbol.baseAsset} (${selectedSymbol.symbol})`
                    : tCreate("searchPlaceholder")}
                  <CaretUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0 bg-slate-800 border-slate-700">
                <Command className="bg-slate-800">
                  <CommandInput
                    placeholder={tCreate("searchPlaceholder")}
                    className="text-white"
                    value={searchQuery}
                    onValueChange={setSearchQuery}
                  />
                  <CommandList>
                    <CommandEmpty className="text-slate-400 py-4 text-center text-sm">
                      {searchQuery.length < 1 ? (
                        <span className="flex items-center justify-center gap-2">
                          <MagnifyingGlassIcon className="w-4 h-4" />
                          {tCreate("searchPlaceholder")}
                        </span>
                      ) : (
                        tCreate("noResults")
                      )}
                    </CommandEmpty>
                    <CommandGroup>
                      {symbols.map((s) => (
                        <CommandItem
                          key={s.symbol}
                          value={s.symbol}
                          onSelect={() => {
                            setSelectedSymbol(s);
                            setComboboxOpen(false);
                          }}
                          className="text-white hover:bg-slate-700 cursor-pointer"
                        >
                          <span className="font-medium">{s.baseAsset}</span>
                          <span className="ml-2 text-slate-400 text-xs">
                            {s.symbol}
                          </span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* Threshold Input (percentage) */}
          <div className="space-y-2">
            <Label className="text-slate-300">{t("threshold")}</Label>
            <div className="relative">
              <Input
                type="number"
                step="0.1"
                min="0.1"
                max="100"
                placeholder={t("thresholdPlaceholder")}
                value={threshold}
                onChange={(e) => setThreshold(e.target.value)}
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 pr-8"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                %
              </span>
            </div>
            <p className="text-xs text-slate-500">{t("hint")}</p>
          </div>

          {/* Submit */}
          <Button
            onClick={handleSubmit}
            disabled={!selectedSymbol || !threshold || isSubmitting}
            className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold"
          >
            {isSubmitting ? tCreate("creating") : t("submit")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
