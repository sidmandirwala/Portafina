"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedSection from "./AnimatedSection";

const NAME_REGEX = /^[a-zA-ZÀ-ÖØ-öø-ÿ' \-.]{2,100}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;

export default function ResumeCallout() {
  const [showForm, setShowForm] = useState(false);
  const [leadName, setLeadName] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [leadSubmitting, setLeadSubmitting] = useState(false);
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const loadedAtRef = useRef(0);

  useEffect(() => {
    loadedAtRef.current = Date.now();
  }, []);

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
        setFormSuccess(true);
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
      <section className="px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <AnimatedSection>
            <div className="relative overflow-hidden rounded-2xl border border-card-border bg-card p-8 md:p-12">
              {/* Subtle gradient accent */}
              <div className="absolute top-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-accent-red/40 to-transparent" />

              <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-card-border bg-background">
                  <svg
                    className="h-7 w-7 text-accent-red"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                    />
                  </svg>
                </div>

                <div className="flex-1">
                  <h3 className="mb-1 text-lg font-bold md:text-xl">
                    Interested in my resume?
                  </h3>
                  <p className="text-sm text-muted md:text-base">
                    Request a copy of my resume and I&apos;ll send it directly to
                    your inbox.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setShowForm(true);
                    setFormSuccess(false);
                    setFormError("");
                    setNameError("");
                    setEmailError("");
                  }}
                  className="group flex shrink-0 items-center gap-2 rounded-full bg-accent-red px-6 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-red-600 hover:shadow-lg hover:shadow-accent-red/20 md:px-8 md:py-3 md:text-base"
                >
                  Request Resume
                  <svg
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Lead Form Modal */}
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
                    Request Resume
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
                      Thank you for your request!
                    </p>
                    <p className="mt-2 text-center text-[13px] leading-relaxed text-muted">
                      For security purposes, the resume is not kept public. Siddh
                      has received your request and will send the resume to your
                      email as soon as possible.
                    </p>
                  </motion.div>
                ) : (
                  <>
                    <p className="mb-2 text-center text-[15px] font-medium text-foreground">
                      Enter your details to request the resume
                    </p>
                    <p className="mb-6 text-center text-[12px] leading-relaxed text-muted">
                      This is solely for Siddh&apos;s knowledge that you visited
                      his portfolio. Your information will not be misused in any
                      way — rest assured. Please provide your genuine name and
                      email. Stay true to yourself.
                    </p>
                    <form
                      onSubmit={validateAndSubmitLead}
                      className="relative flex flex-col gap-3"
                    >
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
                        {leadSubmitting ? "Submitting..." : "Request Resume"}
                      </button>
                      {formError && (
                        <p className="mt-2 text-center text-[12px] text-accent-red">
                          {formError}
                        </p>
                      )}
                    </form>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
