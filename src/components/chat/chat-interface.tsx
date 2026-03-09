"use client";

import { useState, useEffect, FormEvent, useRef } from "react";
import { XIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { MessageList } from "./message-list";
import { MessageInput } from "./message-input";
import { DisclaimerBanner } from "./disclaimer-banner";
import { loadChatMessages } from "@/lib/actions/chat";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: Date | null;
}

interface ChatInterfaceProps {
  onClose: () => void;
}

export function ChatInterface({ onClose }: ChatInterfaceProps) {
  const t = useTranslations("chat");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [streamingContent, setStreamingContent] = useState("");
  const abortControllerRef = useRef<AbortController | null>(null);
  const router = useRouter();

  // Load message history on mount
  useEffect(() => {
    async function loadMessages() {
      const result = await loadChatMessages(50);
      if (result.success && result.data) {
        setMessages(result.data as Message[]);
      } else if (result.error) {
        toast.error(result.error);
      }
      setIsInitialLoading(false);
    }
    loadMessages();
  }, []);

  // Cleanup abort controller on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setIsLoading(true);
    setStreamingContent("");

    // Subtask 6.1: Implement optimistic UI update (show user message immediately)
    const optimisticMessage: Message = {
      id: `temp-${Date.now()}`,
      role: "user",
      content: userMessage,
      createdAt: new Date(),
    };
    setMessages((prev) => [...prev, optimisticMessage]);

    // Create abort controller for this request
    abortControllerRef.current = new AbortController();

    try {
      // Subtask 6.1: Call /api/chat with POST request
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage }),
        signal: abortControllerRef.current.signal,
      });

      // Subtask 6.1: Handle authentication errors with redirect
      if (response.status === 401) {
        toast.error(t("errors.signIn"));
        router.push("/sign-in?returnUrl=/");
        return;
      }

      // Subtask 6.3: Handle error responses
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error || t("errors.sendFailed");

        // Remove optimistic message on error
        setMessages((prev) => prev.filter((msg) => msg.id !== optimisticMessage.id));

        // Subtask 6.3: Provide retry option on failure
        toast.error(errorMessage, {
          action: {
            label: t("retry"),
            onClick: () => {
              setInput(userMessage);
            },
          },
        });

        return;
      }

      // Parse streaming response (plain text from toTextStreamResponse)
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("No response body");
      }

      let accumulatedContent = "";

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          break;
        }

        const chunk = decoder.decode(value, { stream: true });
        accumulatedContent += chunk;
        setStreamingContent(accumulatedContent);
      }

      // Subtask 6.2: Handle stream completion
      if (accumulatedContent) {
        const assistantMessage: Message = {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: accumulatedContent,
          createdAt: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
      }

      setStreamingContent("");
    } catch (error: unknown) {
      // Subtask 6.3: Handle partial responses from interrupted streams
      if (error instanceof Error && error.name === "AbortError") {
        // If we have partial streaming content, save it
        if (streamingContent) {
          const partialMessage: Message = {
            id: `assistant-${Date.now()}`,
            role: "assistant",
            content: streamingContent + `\n\n[${t("errors.interrupted")}]`,
            createdAt: new Date(),
          };
          setMessages((prev) => [...prev, partialMessage]);
        }
      } else {
        console.error("Chat submission error:", error);

        // Remove optimistic message on error
        setMessages((prev) => prev.filter((msg) => msg.id !== optimisticMessage.id));

        // Subtask 6.3: Display toast notifications for errors with retry
        toast.error(t("errors.sendFailed"), {
          action: {
            label: t("retry"),
            onClick: () => {
              setInput(userMessage);
            },
          },
        });
      }

      setStreamingContent("");
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 sm:py-2.5 border-b border-slate-200 dark:border-slate-800">
        <h2 className="text-sm sm:text-base font-semibold">{t("title")}</h2>
        <Button
          variant="ghost"
          size="icon"
          className="size-8 sm:size-9"
          onClick={onClose}
          aria-label="Close chat"
        >
          <XIcon className="size-4" />
        </Button>
      </div>

      {/* Disclaimer */}
      <DisclaimerBanner />

      {/* Message List */}
      <MessageList
        messages={messages}
        isLoading={isLoading}
        isInitialLoading={isInitialLoading}
        streamingContent={streamingContent}
      />

      {/* Message Input */}
      <MessageInput
        value={input}
        onChange={setInput}
        onSubmit={handleSubmit}
        disabled={isLoading}
      />
    </div>
  );
}
