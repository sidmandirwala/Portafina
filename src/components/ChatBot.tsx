"use client";

import { useChat } from "@ai-sdk/react";
import { TextStreamChatTransport } from "ai";
import { useState, useRef, useEffect, useCallback } from "react";

const FREE_LIMIT = 3;
const SIGNED_LIMIT = 6;

const NAME_REGEX = /^[a-zA-ZÀ-ÖØ-öø-ÿ' \-.]{2,100}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;

const SUGGESTED_QUESTIONS = [
  "What projects has Siddh built?",
  "Tell me about Siddh's experience",
  "What are Siddh's technical skills?",
  "Is Siddh open to opportunities?",
];

function getMessageText(message: { role: string; parts?: Array<{ type: string; text?: string }> }): string {
  if (!message.parts) return "";
  return message.parts
    .filter((p) => p.type === "text" && p.text)
    .map((p) => p.text)
    .join("");
}

function getTodayKey() {
  return new Date().toLocaleDateString("en-CA");
}

function getDailyCount(): number {
  try {
    const data = JSON.parse(localStorage.getItem("chat_limit") || "{}");
    return data.date === getTodayKey() ? data.count || 0 : 0;
  } catch { return 0; }
}

function saveDailyCount(count: number) {
  localStorage.setItem("chat_limit", JSON.stringify({ date: getTodayKey(), count }));
}

function isSigned(): boolean {
  try { return localStorage.getItem("chat_signed") === "true"; }
  catch { return false; }
}

function markSigned() {
  localStorage.setItem("chat_signed", "true");
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [showLabel, setShowLabel] = useState(true);
  const [dailyCount, setDailyCount] = useState(0);
  const [signed, setSigned] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [leadName, setLeadName] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [leadSubmitting, setLeadSubmitting] = useState(false);
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [formError, setFormError] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const loadedAtRef = useRef(Date.now());

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatWindowRef = useRef<HTMLDivElement>(null);
  const lastErrorRef = useRef<Error | undefined>(undefined);

  const { messages, sendMessage, status, error } = useChat({
    transport: new TextStreamChatTransport({ api: "/api/chat" }),
  });

  const isStreaming = status === "streaming" || status === "submitted";
  const currentLimit = signed ? SIGNED_LIMIT : FREE_LIMIT;
  const limitReached = dailyCount >= currentLimit;
  const fullyExhausted = signed && dailyCount >= SIGNED_LIMIT;
  const showUpgradePrompt = limitReached && !signed;

  const isTouchDevice = useCallback(
    () => typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches,
    [],
  );

  // Load persisted state
  useEffect(() => {
    setDailyCount(getDailyCount());
    setSigned(isSigned());
  }, []);

  // Roll back question count on chat error so user doesn't lose a slot
  useEffect(() => {
    if (error && error !== lastErrorRef.current) {
      lastErrorRef.current = error;
      setDailyCount((prev) => {
        const rolled = Math.max(0, prev - 1);
        saveDailyCount(rolled);
        return rolled;
      });
    }
  }, [error]);

  useEffect(() => {
    const timer = setTimeout(() => setShowLabel(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  // Lock body scroll on mobile when chat is open
  useEffect(() => {
    if (!isOpen) return;
    const mq = window.matchMedia("(max-width: 639px)");
    if (!mq.matches) return;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, status]);

  // Auto-focus input on desktop only (not touch devices — avoids keyboard popup)
  useEffect(() => {
    if (isOpen && !limitReached && !showForm && !isTouchDevice()) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen, limitReached, showForm, isTouchDevice]);

  useEffect(() => {
    if (isOpen && !isStreaming && !limitReached && !showForm && !isTouchDevice()) {
      inputRef.current?.focus();
    }
  }, [isStreaming, isOpen, limitReached, showForm, isTouchDevice]);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (chatWindowRef.current && !chatWindowRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setShowForm(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const submit = (text: string) => {
    if (limitReached || isStreaming || !text.trim()) return;
    const newCount = dailyCount + 1;
    setDailyCount(newCount);
    saveDailyCount(newCount);
    setInputValue("");
    sendMessage({ text });
    // Dismiss keyboard on touch devices so user can read the response
    if (isTouchDevice()) inputRef.current?.blur();
  };

  const handleChatSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    submit(inputValue);
  };

  const validateAndSubmitLead = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const name = leadName.trim();
    const email = leadEmail.trim();
    let valid = true;

    if (!NAME_REGEX.test(name)) {
      setNameError("Please enter a valid name (at least 2 characters)");
      valid = false;
    } else {
      setNameError("");
    }

    if (email.length > 254 || !EMAIL_REGEX.test(email)) {
      setEmailError("Please enter a valid email address");
      valid = false;
    } else {
      setEmailError("");
    }

    if (!valid) return;

    setLeadSubmitting(true);
    setFormError("");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, website: honeypot, loaded_at: loadedAtRef.current }),
      });
      if (res.ok) {
        setSigned(true);
        markSigned();
        setShowForm(false);
        setLeadName("");
        setLeadEmail("");
      } else if (res.status === 429) {
        setFormError("Too many requests. Please try again later.");
      } else {
        setFormError("Something went wrong. Please try again.");
      }
    } catch {
      setFormError("Something went wrong. Please try again.");
    } finally {
      setLeadSubmitting(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => { setIsOpen(!isOpen); setShowLabel(false); }}
        aria-label={isOpen ? "Close chat" : "Open chat"}
        className={`fixed bottom-6 right-6 z-[70] flex h-12 items-center justify-center rounded-full transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isOpen ? "scale-0 opacity-0" : "scale-100 opacity-100"
        } ${showLabel
          ? "w-[110px] gap-1.5 px-3 bg-accent-red text-white shadow-lg shadow-accent-red/25 hover:bg-red-600"
          : "w-12 bg-accent-red text-white shadow-lg shadow-accent-red/25 hover:bg-red-600 sm:bg-accent-red sm:text-white sm:shadow-lg sm:shadow-accent-red/25 sm:hover:bg-red-600 max-sm:bg-background/20 max-sm:backdrop-blur-sm max-sm:border max-sm:border-accent-red max-sm:text-accent-red max-sm:shadow-none"
        }`}
      >
        <svg
          className="h-6 w-6 shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
        <span
          className={`whitespace-nowrap text-[13px] font-medium transition-all duration-500 ${
            showLabel ? "w-auto opacity-100" : "w-0 opacity-0 overflow-hidden"
          }`}
        >
          Ask AI
        </span>
      </button>

      {/* Chat Window */}
      <div
        ref={chatWindowRef}
        className={`fixed z-[70] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isOpen
            ? "scale-100 opacity-100"
            : "pointer-events-none scale-95 opacity-0"
        } bottom-4 right-4 left-4 top-4 sm:bottom-6 sm:right-6 sm:left-auto sm:top-auto sm:h-[560px] sm:w-[400px]`}
      >
        <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-card-border bg-card" style={{ boxShadow: "0 0 80px 25px var(--chat-shadow)" }}>

          {/* Lead Form Overlay */}
          {showForm ? (
            <>
              <div className="flex items-center justify-between border-b border-card-border px-4 py-3">
                <div className="flex items-center gap-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/Supabase.svg" alt="Supabase" className="h-4.5 w-4.5 shrink-0" />
                  <h3 className="font-heading text-[15px] font-semibold text-foreground">
                    Quick Introduction
                  </h3>
                </div>
                <button
                  onClick={() => setShowForm(false)}
                  aria-label="Close form"
                  className="rounded-lg p-1.5 text-muted transition-colors hover:bg-background hover:text-foreground"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="flex flex-1 flex-col justify-center px-6 py-6">
                <p className="mb-2 text-center text-[15px] font-medium text-foreground">
                  Please enter your details
                </p>
                <p className="mb-6 text-center text-[12px] leading-relaxed text-muted">
                  This is solely for Siddh&apos;s knowledge that you visited his portfolio.
                  Your information will not be misused in any way — rest assured.
                  Please provide your genuine name and email. Stay true to yourself.
                </p>
                <form onSubmit={validateAndSubmitLead} className="relative flex flex-col gap-3">
                  {/* Honeypot — hidden from users, bots auto-fill it */}
                  <input
                    type="text"
                    name="website"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                    tabIndex={-1}
                    aria-hidden="true"
                    autoComplete="one-time-code"
                    className="absolute -left-[9999px] top-0 h-px w-px opacity-0 pointer-events-none overflow-hidden"
                  />
                  <div>
                    <input
                      value={leadName}
                      onChange={(e) => { setLeadName(e.target.value); setNameError(""); }}
                      placeholder="Your full name"
                      className={`w-full rounded-lg border bg-background px-4 py-2.5 text-[16px] sm:text-[14px] text-foreground placeholder:text-muted/60 focus:outline-none ${
                        nameError ? "border-accent-red" : "border-card-border focus:border-accent-red/50"
                      }`}
                    />
                    {nameError && <p className="mt-1 text-[11px] text-accent-red">{nameError}</p>}
                  </div>
                  <div>
                    <input
                      value={leadEmail}
                      onChange={(e) => { setLeadEmail(e.target.value); setEmailError(""); }}
                      placeholder="Your email address"
                      className={`w-full rounded-lg border bg-background px-4 py-2.5 text-[16px] sm:text-[14px] text-foreground placeholder:text-muted/60 focus:outline-none ${
                        emailError ? "border-accent-red" : "border-card-border focus:border-accent-red/50"
                      }`}
                    />
                    {emailError && <p className="mt-1 text-[11px] text-accent-red">{emailError}</p>}
                  </div>
                  <button
                    type="submit"
                    disabled={leadSubmitting}
                    className="mt-1 rounded-lg bg-accent-red px-4 py-2.5 text-[14px] font-medium text-white transition-colors hover:bg-red-600 disabled:opacity-50"
                  >
                    {leadSubmitting ? "Submitting..." : "Unlock more questions"}
                  </button>
                  {formError && (
                    <p className="mt-2 text-center text-[12px] text-accent-red">
                      {formError}
                    </p>
                  )}
                </form>
              </div>
            </>
          ) : (
            <>
              {/* Header */}
              <div className="flex items-center justify-between border-b border-card-border px-4 py-3">
                <div className="flex items-center gap-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/Gemini.svg" alt="Gemini" className="h-4.5 w-4.5 shrink-0" />
                  <h3 className="font-heading text-[15px] font-semibold text-foreground">
                    AI Assistant
                  </h3>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  aria-label="Close chat"
                  className="rounded-lg p-1.5 text-muted transition-colors hover:bg-background hover:text-foreground"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-4">
                {messages.length === 0 && (
                  <div className="flex h-full flex-col items-center justify-center">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent-red/10">
                      <svg className="h-6 w-6 text-accent-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <p className="mb-1 text-[15px] font-medium text-foreground">
                      Hi there! I&apos;m Siddh&apos;s AI assistant.
                    </p>
                    <p className="mb-6 text-center text-[13px] text-muted">
                      Ask me anything about his experience, projects, or skills.
                    </p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {SUGGESTED_QUESTIONS.map((q) => (
                        <button
                          key={q}
                          onClick={() => submit(q)}
                          className="rounded-full border border-card-border px-3 py-1.5 text-[13px] text-muted transition-all duration-200 hover:border-accent-red/50 hover:text-foreground"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {messages.map((message) => {
                  const text = getMessageText(message);
                  if (!text) return null;
                  return (
                    <div
                      key={message.id}
                      className={`mb-3 flex ${
                        message.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-[15px] leading-relaxed ${
                          message.role === "user"
                            ? "rounded-br-md bg-accent-red text-white"
                            : "rounded-bl-md bg-background text-foreground"
                        }`}
                      >
                        <MessageContent content={text} role={message.role} />
                      </div>
                    </div>
                  );
                })}

                {isStreaming && messages[messages.length - 1]?.role !== "assistant" && (
                  <div className="mb-3 flex justify-start">
                    <div className="rounded-2xl rounded-bl-md bg-background px-4 py-3">
                      <div className="flex gap-1.5">
                        <span className="h-2 w-2 animate-bounce rounded-full bg-muted [animation-delay:-0.3s]" />
                        <span className="h-2 w-2 animate-bounce rounded-full bg-muted [animation-delay:-0.15s]" />
                        <span className="h-2 w-2 animate-bounce rounded-full bg-muted" />
                      </div>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="mb-3 flex justify-start">
                    <div className="max-w-[85%] rounded-2xl rounded-bl-md bg-background px-4 py-2.5 text-[15px] leading-relaxed text-accent-red">
                      Something went wrong. Please try again in a moment.
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Fully Exhausted */}
              {fullyExhausted && (
                <div className="border-t border-card-border bg-background px-4 py-3 text-center">
                  <p className="text-[13px] leading-relaxed text-muted">
                    You have reached your daily question limit. For further inquiries,
                    please reach out to Siddh directly at{" "}
                    <a
                      href="mailto:sidmandirwala9@gmail.com"
                      className="font-medium text-accent-red transition-colors hover:text-red-400"
                    >
                      sidmandirwala9@gmail.com
                    </a>
                  </p>
                </div>
              )}

              {/* Unsigned limit reached — prompt to fill form */}
              {showUpgradePrompt && (
                <div className="border-t border-card-border bg-background px-4 py-3 text-center">
                  <p className="text-[13px] leading-relaxed text-muted">
                    You&apos;ve used your free questions.{" "}
                    <button
                      onClick={() => { setShowForm(true); setFormError(""); }}
                      className="font-medium text-accent-red transition-colors hover:text-red-400"
                    >
                      Fill a quick form
                    </button>
                    {" "}to unlock more!
                  </p>
                </div>
              )}

              {/* Input */}
              {!limitReached && (
                <form
                  onSubmit={handleChatSubmit}
                  className="border-t border-card-border px-3 py-3"
                >
                  <div className="flex items-center gap-2">
                    <input
                      ref={inputRef}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Ask about Siddh..."
                      disabled={isStreaming}
                      className="flex-1 rounded-xl border border-card-border bg-background px-4 py-2.5 text-[16px] sm:text-[15px] text-foreground placeholder:text-muted/60 focus:border-accent-red/50 focus:outline-none disabled:opacity-50"
                    />
                    <button
                      type="submit"
                      disabled={isStreaming || !inputValue.trim()}
                      aria-label="Send message"
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-red text-white transition-all duration-200 hover:bg-red-600 disabled:opacity-40"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19V5m0 0l-7 7m7-7l7 7" />
                      </svg>
                    </button>
                  </div>
                  <div className="mt-1.5 flex items-center justify-center gap-1.5 text-[11px] text-muted/50">
                    <span>
                      {currentLimit - dailyCount} question
                      {currentLimit - dailyCount !== 1 ? "s" : ""} remaining
                    </span>
                    {!signed && (
                      <>
                        <span>·</span>
                        <button
                          type="button"
                          onClick={() => { setShowForm(true); setFormError(""); }}
                          className="text-accent-red/70 transition-colors hover:text-accent-red"
                        >
                          Get more
                        </button>
                      </>
                    )}
                  </div>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function MessageContent({
  content,
  role,
}: {
  content: string;
  role: string;
}) {
  if (role === "user") {
    return <>{content}</>;
  }

  const lines = content.split("\n");
  return (
    <>
      {lines.map((line, i) => {
        if (!line.trim()) return <br key={i} />;

        // Escape HTML first, then apply bold formatting
        const escaped = escapeHtml(line);
        const formatted = escaped.replace(
          /\*\*(.*?)\*\*/g,
          '<strong class="font-semibold">$1</strong>'
        );

        if (line.trim().startsWith("- ") || line.trim().startsWith("* ")) {
          return (
            <div key={i} className="ml-2 flex gap-1.5">
              <span className="mt-0.5 text-muted">&#8226;</span>
              <span
                dangerouslySetInnerHTML={{
                  __html: formatted.replace(/^[\s]*[-*]\s/, ""),
                }}
              />
            </div>
          );
        }

        return (
          <p
            key={i}
            dangerouslySetInnerHTML={{ __html: formatted }}
            className={i < lines.length - 1 && lines[i + 1]?.trim() ? "mb-1" : ""}
          />
        );
      })}
    </>
  );
}
