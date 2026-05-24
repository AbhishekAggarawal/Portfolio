"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import type { ChatMessage } from "@/types/chat";

function createId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

const initialMessage: ChatMessage = {
  id: "assistant-intro",
  role: "assistant",
  content:
    "Hi, I'm Abhishek's **AI portfolio assistant**. Here are a few things you can ask me:\n\n- **Projects** — past work in AI, data engineering, and full-stack development\n- **Skills** — technical stack and proficiency levels\n- **Experience** — AI/ML background, data engineering, and software development\n- **Certificates** — professional certifications and achievements\n- **Hiring fit** — what roles and work Abhishek is best suited for\n\nWhat would you like to explore?",
};

export function usePortfolioChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([initialMessage]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState("");
  const abortRef = useRef<AbortController | null>(null);

  const canSend = useMemo(() => !isStreaming, [isStreaming]);

  const sendMessage = useCallback(
    async (content: string) => {
      const trimmed = content.trim();
      if (!trimmed || isStreaming) return;

      const userMessage: ChatMessage = {
        id: createId(),
        role: "user",
        content: trimmed,
      };
      const assistantMessage: ChatMessage = {
        id: createId(),
        role: "assistant",
        content: "",
      };

      setError("");
      setMessages((current) => [...current, userMessage, assistantMessage]);
      setIsStreaming(true);

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [...messages, userMessage].map(({ role, content }) => ({ role, content })),
          }),
          signal: controller.signal,
        });

        if (!response.body) {
          throw new Error("No response stream returned.");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;

          const token = decoder.decode(value, { stream: true });
          setMessages((current) =>
            current.map((message) =>
              message.id === assistantMessage.id
                ? { ...message, content: `${message.content}${token}` }
                : message
            )
          );
        }
      } catch (caught) {
        if ((caught as Error).name !== "AbortError") {
          const fallback =
            "I could not reach the live AI backend. Once Groq and the RAG services are configured, I can answer with streamed context-aware responses.";
          setError(fallback);
          setMessages((current) =>
            current.map((message) =>
              message.id === assistantMessage.id && !message.content
                ? { ...message, content: fallback }
                : message
            )
          );
        }
      } finally {
        setIsStreaming(false);
        abortRef.current = null;
      }
    },
    [isStreaming, messages]
  );

  const stop = useCallback(() => {
    abortRef.current?.abort();
    setIsStreaming(false);
  }, []);

  return {
    messages,
    isStreaming,
    error,
    canSend,
    sendMessage,
    stop,
  };
}
