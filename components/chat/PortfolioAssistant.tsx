"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Bot, Send, Sparkles, Square, UserRound } from "lucide-react";
import { usePortfolioChat } from "@/hooks/usePortfolioChat";
import { formatMarkdown } from "@/lib/utils";

const suggestedPrompts = [
  "Tell me about Abhishek's projects",
  "What are his strongest skills?",
  "What technologies does he work with?",
  "What kind of work should I hire him for?",
];

export default function PortfolioAssistant() {
  const [input, setInput] = useState("");
  const { messages, isStreaming, canSend, sendMessage, stop } = usePortfolioChat();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next = input;
    setInput("");
    await sendMessage(next);
  }

  return (
    <section id="bot" className="container relative z-10 mx-auto py-20">
      <div className="grid gap-10 lg:grid-cols-[0.42fr_0.58fr] lg:items-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6 }}
          className="space-y-7"
        >
          <div className="inline-flex items-center gap-3 rounded-full border border-[#1d4f8f] bg-[#07172e]/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#7ebdff]">
            <Sparkles className="h-4 w-4" />
            RAG portfolio assistant
          </div>
          <div>
            <h2 className="text-[34px] font-medium leading-tight text-white sm:text-[48px]">
              Ask my AI assistant
            </h2>
            <p className="mt-5 max-w-[620px] text-sm leading-7 text-white/68 sm:text-base">
              Explore my work through an AI assistant capable of explaining my projects, technical strengths, and engineering experience with contextual understanding.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {suggestedPrompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => sendMessage(prompt)}
                className="rounded-lg border border-[#17345e] bg-[#071225]/90 px-5 py-4 text-left text-sm text-white/72 transition hover:border-[#168dff] hover:text-white"
              >
                {prompt}
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-2xl border border-[#1d4f8f]/80 bg-[#061225]/85 shadow-[0_0_90px_rgba(22,141,255,0.18)] backdrop-blur-xl"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_10%,rgba(46,231,255,0.14),transparent_28%),radial-gradient(circle_at_88%_18%,rgba(75,109,255,0.14),transparent_30%)]" />
          <div className="relative border-b border-white/10 p-5">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-[#168dff] to-[#4b6dff] text-white shadow-[0_0_30px_rgba(22,141,255,0.45)]">
                  <Bot className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-semibold text-white">Abhishek AI</p>
                  <p className="text-xs text-[#8ecbff]">Groq + RAG ready</p>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/60">
                <span className="h-2 w-2 rounded-full bg-[#2ee7ff] shadow-[0_0_10px_#2ee7ff]" />
                online
              </div>
            </div>
          </div>

          <div ref={scrollRef} className="relative h-[430px] space-y-5 overflow-y-auto p-5">
            {messages.map((message) => (
              <div key={message.id} className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                {message.role === "assistant" && (
                  <div className="mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#0d88ff]/20 text-[#7ebdff]">
                    <Bot className="h-4 w-4" />
                  </div>
                )}
                <div
                  className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-7 ${
                    message.role === "user"
                      ? "bg-gradient-to-r from-[#087bff] to-[#4b6dff] text-white"
                      : "border border-white/10 bg-white/[0.055] text-white/75"
                  }`}
                >
                  {message.role === "assistant" && message.content ? (
                    <div
                      className="msg-formatted"
                      dangerouslySetInnerHTML={{ __html: formatMarkdown(message.content) }}
                    />
                  ) : message.role === "user" ? (
                    message.content
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[#9dccff]">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current" />
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current [animation-delay:120ms]" />
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current [animation-delay:240ms]" />
                    </span>
                  )}
                </div>
                {message.role === "user" && (
                  <div className="mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/10 text-white">
                    <UserRound className="h-4 w-4" />
                  </div>
                )}
              </div>
            ))}
          </div>

          <form onSubmit={onSubmit} className="relative border-t border-white/10 p-4">
            <div className="flex gap-3 rounded-xl border border-[#1d4f8f] bg-[#071225] p-2">
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask about projects, skills, resume, or hiring fit..."
                className="min-w-0 flex-1 bg-transparent px-3 text-sm text-white outline-none placeholder:text-white/38"
              />
              {isStreaming ? (
                <button type="button" onClick={stop} className="grid h-11 w-11 place-items-center rounded-lg bg-white/10 text-white">
                  <Square className="h-4 w-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!canSend || !input.trim()}
                  className="grid h-11 w-11 place-items-center rounded-lg bg-gradient-to-r from-[#087bff] to-[#4b6dff] text-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Send className="h-4 w-4" />
                </button>
              )}
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
