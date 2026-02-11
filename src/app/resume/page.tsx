"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/components/ThemeProvider";
import ChatBot from "@/components/ChatBot";
import PdfViewer from "@/components/PdfViewer";

const NAME_REGEX = /^[a-zA-Z\s]{3,}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const RESUME_PATH = "/Siddh Mandirwala Resume.pdf";

function isSigned(): boolean {
  try {
    return localStorage.getItem("chat_signed") === "true";
  } catch {
    return false;
  }
}

function markSigned() {
  localStorage.setItem("chat_signed", "true");
}

export default function ResumePage() {
  const { theme, toggleTheme } = useTheme();
  const [signed, setSigned] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [leadName, setLeadName] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [leadSubmitting, setLeadSubmitting] = useState(false);
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [formSuccess, setFormSuccess] = useState(false);

  useEffect(() => {
    setSigned(isSigned());
  }, []);

  const handleDownload = useCallback(() => {
    if (signed) {
      const a = document.createElement("a");
      a.href = RESUME_PATH;
      a.download = "Siddh_Mandirwala_Resume.pdf";
      a.click();
    } else {
      setShowForm(true);
    }
  }, [signed]);

  const validateAndSubmitLead = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const name = leadName.trim();
    const email = leadEmail.trim();
    let valid = true;

    if (!NAME_REGEX.test(name)) {
      setNameError("Please enter a valid name (letters only, at least 3 characters)");
      valid = false;
    } else {
      setNameError("");
    }

    if (!EMAIL_REGEX.test(email)) {
      setEmailError("Please enter a valid email address");
      valid = false;
    } else {
      setEmailError("");
    }

    if (!valid) return;

    setLeadSubmitting(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });
      if (res.ok) {
        setSigned(true);
        markSigned();
        setFormSuccess(true);
        setLeadName("");
        setLeadEmail("");
        // Auto-trigger download after form success
        setTimeout(() => {
          const a = document.createElement("a");
          a.href = RESUME_PATH;
          a.download = "Siddh_Mandirwala_Resume.pdf";
          a.click();
          setShowForm(false);
          setFormSuccess(false);
        }, 1500);
      }
    } catch {
      // silently fail
    } finally {
      setLeadSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-background">
      {/* Decorative vertical lines matching portfolio */}
      <div className="pointer-events-none fixed inset-y-0 left-0 right-0 z-[60] mx-auto hidden max-w-7xl px-6 xl:block">
        <div className="absolute inset-y-0 left-6 w-px bg-card-border" />
        <div className="absolute inset-y-0 right-6 w-px bg-card-border" />
      </div>

      {/* Top bar */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 right-0 z-50 border-b border-card-border bg-background/80 backdrop-blur-md"
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <a
            href="/"
            className="font-heading text-lg font-bold tracking-tight text-foreground lg:text-xl"
          >
            SM<span className="text-accent-red">.</span>
          </a>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Back to portfolio */}
            <a
              href="/"
              className="group flex items-center gap-1.5 rounded-full border border-card-border px-3 py-2 text-sm font-medium text-muted transition-all duration-300 hover:border-muted/60 hover:text-foreground sm:px-4 md:text-base"
            >
              <svg
                className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-x-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                />
              </svg>
              <span className="hidden sm:inline">Portfolio</span>
            </a>

            {/* Download button */}
            <button
              onClick={handleDownload}
              className="group flex items-center gap-2 rounded-full border border-card-border px-4 py-2 text-sm font-medium text-foreground transition-all duration-300 hover:border-accent-red hover:text-accent-red md:px-5 md:text-base"
            >
              <svg
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 5v14m0 0l-7-7m7 7l7-7"
                />
              </svg>
              Download
            </button>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="relative flex h-9 w-9 items-center justify-center rounded-full border border-card-border bg-card transition-colors duration-300 hover:border-muted/60"
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            >
              <AnimatePresence mode="wait" initial={false}>
                {theme === "dark" ? (
                  <motion.svg
                    key="sun"
                    initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.25 }}
                    className="h-4 w-4 text-amber-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                  >
                    <circle cx="12" cy="12" r="5" />
                    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                  </motion.svg>
                ) : (
                  <motion.svg
                    key="moon"
                    initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.25 }}
                    className="h-4 w-4 text-slate-700"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                  >
                    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                  </motion.svg>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </motion.header>

      {/* PDF Viewer */}
      <main className="pt-[73px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-4xl px-4 py-4 sm:px-6 sm:py-5 md:px-8 md:py-6"
        >
          <PdfViewer src={RESUME_PATH} />
        </motion.div>
      </main>

      {/* Lead Form Modal Overlay */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowForm(false);
                setFormSuccess(false);
              }
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-md overflow-hidden rounded-2xl border border-card-border bg-card"
              style={{ boxShadow: "0 0 80px 25px var(--chat-shadow)" }}
            >
              {/* Form Header */}
              <div className="flex items-center justify-between border-b border-card-border px-6 py-4">
                <div className="flex items-center gap-2.5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/Supabase.svg"
                    alt="Supabase"
                    className="h-4.5 w-4.5 shrink-0"
                  />
                  <h3 className="font-heading text-[16px] font-semibold text-foreground">
                    Quick Introduction
                  </h3>
                </div>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setFormSuccess(false);
                  }}
                  aria-label="Close form"
                  className="rounded-lg p-1.5 text-muted transition-colors hover:bg-background hover:text-foreground"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Form Body */}
              <div className="px-6 py-8">
                {formSuccess ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center py-4"
                  >
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent-green/10">
                      <svg
                        className="h-7 w-7 text-accent-green"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <p className="text-[15px] font-medium text-foreground">
                      Thank you! Downloading now...
                    </p>
                  </motion.div>
                ) : (
                  <>
                    <p className="mb-2 text-center text-[15px] font-medium text-foreground">
                      Please enter your details to download
                    </p>
                    <p className="mb-6 text-center text-[12px] leading-relaxed text-muted">
                      This is solely for Siddh&apos;s knowledge that you
                      visited his portfolio. Your information will not be
                      misused in any way — rest assured. Please provide your
                      genuine name and email. Stay true to yourself.
                    </p>
                    <form
                      onSubmit={validateAndSubmitLead}
                      className="flex flex-col gap-3"
                    >
                      <div>
                        <input
                          value={leadName}
                          onChange={(e) => {
                            setLeadName(e.target.value);
                            setNameError("");
                          }}
                          placeholder="Your full name"
                          className={`w-full rounded-lg border bg-background px-4 py-2.5 text-[16px] sm:text-[14px] text-foreground placeholder:text-muted/60 focus:outline-none ${
                            nameError
                              ? "border-accent-red"
                              : "border-card-border focus:border-accent-red/50"
                          }`}
                        />
                        {nameError && (
                          <p className="mt-1 text-[11px] text-accent-red">
                            {nameError}
                          </p>
                        )}
                      </div>
                      <div>
                        <input
                          value={leadEmail}
                          onChange={(e) => {
                            setLeadEmail(e.target.value);
                            setEmailError("");
                          }}
                          placeholder="Your email address"
                          className={`w-full rounded-lg border bg-background px-4 py-2.5 text-[16px] sm:text-[14px] text-foreground placeholder:text-muted/60 focus:outline-none ${
                            emailError
                              ? "border-accent-red"
                              : "border-card-border focus:border-accent-red/50"
                          }`}
                        />
                        {emailError && (
                          <p className="mt-1 text-[11px] text-accent-red">
                            {emailError}
                          </p>
                        )}
                      </div>
                      <button
                        type="submit"
                        disabled={leadSubmitting}
                        className="mt-1 rounded-lg bg-accent-red px-4 py-2.5 text-[14px] font-medium text-white transition-colors hover:bg-red-600 disabled:opacity-50"
                      >
                        {leadSubmitting
                          ? "Submitting..."
                          : "Submit & Download"}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ChatBot */}
      <ChatBot />
    </div>
  );
}
