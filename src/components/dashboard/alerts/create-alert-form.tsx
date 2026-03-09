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
import { BellIcon, MagnifyingGlassIcon, CaretUpDownIcon } from "@phosphor-icons/react";
import type { BinanceSymbolInfo } from "@/lib/types";

interface CreateAlertFormProps {
  onAlertCreated?: () => void;
}

export function CreateAlertForm({ onAlertCreated }: CreateAlertFormProps) {
  const t = useTranslations("dashboard.alerts.create");
  const [open, setOpen] = useState(false);
  const [comboboxOpen, setComboboxOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [symbols, setSymbols] = useState<BinanceSymbolInfo[]>([]);
  const [selectedSymbol, setSelectedSymbol] = useState<BinanceSymbolInfo | null>(null);
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [threshold, setThreshold] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingPrice, setIsLoadingPrice] = useState(false);
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

  // Fetch current price when symbol is selected
  useEffect(() => {
    if (!selectedSymbol) {
      setCurrentPrice(null);
      return;
    }

    setIsLoadingPrice(true);
    fetch(
      `https://api.binance.com/api/v3/ticker/price?symbol=${selectedSymbol.symbol}`
    )
      .then((res) => res.json())
      .then((data) => {
        setCurrentPrice(parseFloat(data.price));
      })
      .catch(() => {
        setCurrentPrice(null);
      })
      .finally(() => {
        setIsLoadingPrice(false);
      });
  }, [selectedSymbol]);

  const handleSubmit = async () => {
    if (!selectedSymbol || !threshold) return;

    const thresholdNum = parseFloat(threshold);
    if (isNaN(thresholdNum) || thresholdNum <= 0) {
      toast.error(t("error"));
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await createAlert({
        symbol: selectedSymbol.baseAsset,
        pairSymbol: selectedSymbol.symbol,
        threshold: thresholdNum,
        alertType: "price",
      });

      if (result.success) {
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
    setCurrentPrice(null);
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
          className="bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 border border-amber-500/30"
        >
          <BellIcon className="w-4 h-4 mr-2" weight="bold" />
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
                    : t("searchPlaceholder")}
                  <CaretUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0 bg-slate-800 border-slate-700">
                <Command className="bg-slate-800">
                  <CommandInput
                    placeholder={t("searchPlaceholder")}
                    className="text-white"
                    value={searchQuery}
                    onValueChange={setSearchQuery}
                  />
                  <CommandList>
                    <CommandEmpty className="text-slate-400 py-4 text-center text-sm">
                      {searchQuery.length < 1 ? (
                        <span className="flex items-center justify-center gap-2">
                          <MagnifyingGlassIcon className="w-4 h-4" />
                          {t("searchPlaceholder")}
                        </span>
                      ) : (
                        t("noResults")
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

          {/* Current Price Display */}
          {selectedSymbol && (
            <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
              <span className="text-sm text-slate-400">{t("currentPrice")}</span>
              <p className="text-lg font-semibold text-white">
                {isLoadingPrice
                  ? "..."
                  : currentPrice !== null
                    ? `$${currentPrice.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 8 })}`
                    : "-"}
              </p>
            </div>
          )}

          {/* Threshold Input */}
          <div className="space-y-2">
            <Label className="text-slate-300">{t("threshold")}</Label>
            <Input
              type="number"
              step="any"
              min="0"
              placeholder={t("thresholdPlaceholder")}
              value={threshold}
              onChange={(e) => setThreshold(e.target.value)}
              className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
            />
          </div>

          {/* Submit */}
          <Button
            onClick={handleSubmit}
            disabled={!selectedSymbol || !threshold || isSubmitting}
            className="w-full bg-amber-500 hover:bg-amber-600 text-black font-semibold"
          >
            {isSubmitting ? t("creating") : t("submit")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
