"use client";

import { FormEvent, KeyboardEvent } from "react";
import { SendIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: FormEvent) => void;
  disabled: boolean;
}

export function MessageInput({
  value,
  onChange,
  onSubmit,
  disabled,
}: MessageInputProps) {
  const t = useTranslations("chat");
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit(e);
    }
  };

  return (
    <form onSubmit={onSubmit} className="border-t border-slate-200 dark:border-slate-800 px-3 py-2.5 sm:p-4 bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm">
      <div className="flex items-end gap-2">
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t("placeholder")}
          disabled={disabled}
          rows={1}
          className="resize-none min-h-[40px] max-h-[120px] rounded-xl text-sm sm:text-base"
        />
        <Button
          type="submit"
          disabled={disabled || !value.trim()}
          size="icon"
          className="rounded-xl shrink-0 size-10"
          aria-label={t("send")}
        >
          <SendIcon className="size-4" />
        </Button>
      </div>
      <p className="text-xs text-muted-foreground mt-2 hidden sm:block">
        {t("helperText")}
      </p>
    </form>
  );
}
