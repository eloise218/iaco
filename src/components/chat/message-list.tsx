"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageBubble } from "./message-bubble";
import { Message } from "./chat-interface";

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  isInitialLoading?: boolean;
  streamingContent?: string;
}

function WelcomeMessage() {
  const t = useTranslations("chat.welcome");

  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-4 py-4 sm:px-6 sm:py-8">
      <div className="max-w-md space-y-3 sm:space-y-4">
        <h3 className="text-lg sm:text-xl font-semibold">{t("title")}</h3>
        <p className="text-sm sm:text-base text-muted-foreground">
          {t("description")}
        </p>
        <div className="text-sm text-muted-foreground space-y-2">
          <p className="font-medium">{t("tryAsking")}</p>
          <ul className="space-y-1 text-left">
            <li>• {t("example1")}</li>
            <li>• {t("example2")}</li>
            <li>• {t("example3")}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-bl-md px-3.5 py-2.5 sm:px-4 sm:py-3">
        <div className="size-2 rounded-full bg-gray-400 animate-bounce [animation-delay:-0.3s]" />
        <div className="size-2 rounded-full bg-gray-400 animate-bounce [animation-delay:-0.15s]" />
        <div className="size-2 rounded-full bg-gray-400 animate-bounce" />
      </div>
    </div>
  );
}

export function MessageList({ messages, isLoading, isInitialLoading, streamingContent }: MessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages, isLoading, streamingContent]);

  return (
    <div className="flex-1 overflow-hidden">
      <ScrollArea className="h-full">
        <div className="p-3 space-y-2 sm:p-4 sm:space-y-3">
          {isInitialLoading ? null : messages.length === 0 && !isLoading ? (
            <WelcomeMessage />
          ) : (
            <>
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
              {streamingContent && (
                <MessageBubble
                  message={{
                    id: "streaming",
                    role: "assistant",
                    content: streamingContent,
                    createdAt: new Date(),
                  }}
                />
              )}
              {isLoading && !streamingContent && <TypingIndicator />}
            </>
          )}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>
    </div>
  );
}
