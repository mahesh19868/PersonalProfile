"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { site } from "@/data/profile";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const STARTER_PROMPTS = [
  "What do you do at VistaPrint / Cimpress?",
  "Summarize your shipping and carrier integration work.",
  "What tech stack do you work with today?",
];

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function DigitalTwinChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        `Hi—I'm ${site.shortName}'s Digital Twin. Ask me about my career, projects, skills, or how to get in touch.`,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    const el = listRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages, loading, open]);

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    setError(null);
    const userMessage: ChatMessage = {
      id: createId(),
      role: "user",
      content: trimmed,
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    const apiMessages = nextMessages
      .filter((m) => m.id !== "welcome")
      .map((m) => ({ role: m.role, content: m.content }));

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages }),
      });

      const data = (await res.json()) as { message?: string; error?: string };

      if (!res.ok) {
        throw new Error(data.error ?? "Something went wrong.");
      }

      if (!data.message) {
        throw new Error("Empty response from Digital Twin.");
      }

      setMessages((prev) => [
        ...prev,
        { id: createId(), role: "assistant", content: data.message! },
      ]);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Request failed.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    sendMessage(input);
  }

  return (
    <>
      <section
        id="twin"
        className="scroll-mt-24 border-t border-border bg-ink-elevated/30 py-16 lg:py-20"
        aria-labelledby="twin-heading"
      >
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-xl">
              <p className="text-xs font-medium uppercase tracking-[0.25em] text-accent">
                Digital Twin
              </p>
              <h2
                id="twin-heading"
                className="mt-4 font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight sm:text-4xl"
              >
                Chat with my career-aware assistant
              </h2>
              <p className="mt-4 text-text-muted">
                Powered by OpenAI ({site.shortName}&apos;s profile data). Ask about roles,
                shipping platforms, tech stack, or how to connect.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="inline-flex w-fit items-center gap-2 rounded-lg bg-accent px-6 py-3.5 text-sm font-semibold text-ink transition-all hover:shadow-[0_0_40px_var(--color-accent-glow)]"
            >
              Open chat
              <span aria-hidden>↗</span>
            </button>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex items-end justify-center p-4 sm:items-center sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby="twin-chat-title"
          >
            <button
              type="button"
              className="absolute inset-0 bg-ink/70 backdrop-blur-sm"
              aria-label="Close chat"
              onClick={() => setOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              className="relative flex h-[min(640px,85vh)] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-border-strong bg-ink-elevated shadow-[0_0_80px_-20px_var(--color-accent-glow)]"
            >
              <header className="flex items-center justify-between border-b border-border px-5 py-4">
                <div className="flex items-center gap-3">
                  <span
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-accent/30 bg-accent/10 font-[family-name:var(--font-display)] text-sm font-bold text-accent"
                    aria-hidden
                  >
                    DT
                  </span>
                  <div>
                    <h3
                      id="twin-chat-title"
                      className="font-[family-name:var(--font-display)] text-sm font-semibold text-text"
                    >
                      Digital Twin
                    </h3>
                    <p className="text-xs text-text-muted">Career Q&amp;A · gpt-5.2</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-lg border border-border px-3 py-1.5 text-xs text-text-muted transition-colors hover:border-accent/40 hover:text-text"
                >
                  Close
                </button>
              </header>

              <div
                ref={listRef}
                className="flex-1 space-y-4 overflow-y-auto px-5 py-4"
              >
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[90%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                        m.role === "user"
                          ? "bg-accent text-ink"
                          : "border border-border bg-frost text-text-muted"
                      }`}
                    >
                      {m.content}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="rounded-2xl border border-border bg-frost px-4 py-3 text-sm text-text-muted">
                      <span className="inline-flex gap-1" aria-live="polite">
                        <span className="animate-pulse">Thinking</span>
                        <span className="animate-pulse">…</span>
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {messages.length <= 1 && !loading && (
                <div className="flex flex-wrap gap-2 border-t border-border px-5 py-3">
                  {STARTER_PROMPTS.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => sendMessage(prompt)}
                      className="rounded-full border border-border px-3 py-1.5 text-left text-xs text-text-muted transition-colors hover:border-accent/40 hover:text-accent"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              )}

              {error && (
                <p className="px-5 pb-2 text-xs text-warm" role="alert">
                  {error}
                </p>
              )}

              <form
                onSubmit={onSubmit}
                className="border-t border-border p-4"
              >
                <div className="flex gap-2">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage(input);
                      }
                    }}
                    rows={2}
                    placeholder="Ask about my experience…"
                    disabled={loading}
                    className="min-h-[44px] flex-1 resize-none rounded-xl border border-border bg-ink px-3 py-2 text-sm text-text placeholder:text-text-muted/60 focus:border-accent/50 focus:outline-none disabled:opacity-60"
                  />
                  <button
                    type="submit"
                    disabled={loading || !input.trim()}
                    className="self-end rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-ink transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Send
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-[70] flex items-center gap-2 rounded-full border border-accent/40 bg-ink-elevated/95 px-5 py-3 text-sm font-medium text-accent shadow-[0_0_40px_-10px_var(--color-accent-glow)] backdrop-blur-md transition-transform hover:scale-[1.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          aria-label="Open Digital Twin chat"
        >
          <span
            className="flex h-2 w-2 rounded-full bg-accent shadow-[0_0_8px_var(--color-accent-glow)]"
            aria-hidden
          />
          Digital Twin
        </button>
      )}
    </>
  );
}
