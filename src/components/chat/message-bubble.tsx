"use client";

import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";
import { Message } from "./chat-interface";

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-3.5 py-2.5 sm:px-4 sm:py-3",
          isUser
            ? "bg-blue-600 text-white rounded-br-md"
            : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-md"
        )}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap break-words leading-relaxed text-sm sm:text-base">{message.content}</p>
        ) : (
          <div className="prose prose-sm dark:prose-invert max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
            <ReactMarkdown
              components={{
                p: ({ children }) => (
                  <p className="mb-3 last:mb-0 leading-relaxed">{children}</p>
                ),
                ul: ({ children }) => (
                  <ul className="mb-3 last:mb-0 list-disc pl-5 space-y-1">{children}</ul>
                ),
                ol: ({ children }) => (
                  <ol className="mb-3 last:mb-0 list-decimal pl-5 space-y-1">{children}</ol>
                ),
                li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                code: ({ children, className }) => {
                  const isInline = !className;
                  return isInline ? (
                    <code className="bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded text-sm font-mono">
                      {children}
                    </code>
                  ) : (
                    <code className="block bg-gray-200 dark:bg-gray-700 p-3 rounded text-sm overflow-x-auto font-mono my-2">
                      {children}
                    </code>
                  );
                },
                strong: ({ children }) => (
                  <strong className="font-semibold">{children}</strong>
                ),
                em: ({ children }) => <em className="italic">{children}</em>,
                a: ({ children, href }) => (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {children}
                  </a>
                ),
                h1: ({ children }) => (
                  <h1 className="text-lg font-bold mb-2 mt-4 first:mt-0">{children}</h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-base font-bold mb-2 mt-3 first:mt-0">{children}</h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-sm font-bold mb-2 mt-3 first:mt-0">{children}</h3>
                ),
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
