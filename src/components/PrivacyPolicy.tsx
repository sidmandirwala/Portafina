"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function PrivacyPolicy({ className }: { className?: string }) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className={className ?? "text-sm text-muted/50 transition-colors duration-200 hover:text-accent-green"}
            >
                Privacy Policy
            </button>

            {typeof document !== "undefined" &&
                createPortal(
                    <AnimatePresence>
                        {open && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
                                onClick={(e) => {
                                    if (e.target === e.currentTarget) setOpen(false);
                                }}
                            >
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                                    className="w-full max-w-lg overflow-hidden rounded-2xl border border-card-border bg-card"
                                    style={{ boxShadow: "0 0 80px 25px var(--chat-shadow)" }}
                                >
                                    <div className="flex items-center justify-between border-b border-card-border px-6 py-4">
                                        <div className="flex items-center gap-2.5">
                                            <svg
                                                className="h-5 w-5 text-accent-green"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                strokeWidth={1.5}
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                                                />
                                            </svg>
                                            <h3 className="font-heading text-[16px] font-semibold text-foreground">
                                                Privacy Policy
                                            </h3>
                                        </div>
                                        <button
                                            onClick={() => setOpen(false)}
                                            aria-label="Close privacy policy"
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

                                    <PolicyBody />
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>,
                    document.body
                )}
        </>
    );
}

function PolicyBody() {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [thumbVisible, setThumbVisible] = useState(false);
    const [thumbTop, setThumbTop] = useState(0);
    const [atEnd, setAtEnd] = useState(false);
    const [needsScroll, setNeedsScroll] = useState(false);
    const hideTimer = useRef<NodeJS.Timeout | null>(null);

    const updateThumb = useCallback(() => {
        const el = scrollRef.current;
        if (!el) return;
        const scrollable = el.scrollHeight - el.clientHeight;
        if (scrollable <= 0) {
            setNeedsScroll(false);
            return;
        }
        setNeedsScroll(true);
        const progress = el.scrollTop / scrollable;
        setThumbTop(progress * 80); // thumb travels 0–80% of track
        setAtEnd(progress >= 0.98);
    }, []);

    const showThenHide = useCallback(() => {
        setThumbVisible(true);
        if (hideTimer.current) clearTimeout(hideTimer.current);
        hideTimer.current = setTimeout(() => setThumbVisible(false), 1500);
    }, []);

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;

        updateThumb();
        if (el.scrollHeight > el.clientHeight) {
            setNeedsScroll(true);
            showThenHide();
        }

        const handleScroll = () => {
            updateThumb();
            showThenHide();
        };

        el.addEventListener("scroll", handleScroll, { passive: true });
        return () => {
            el.removeEventListener("scroll", handleScroll);
            if (hideTimer.current) clearTimeout(hideTimer.current);
        };
    }, [updateThumb, showThenHide]);

    return (
        <div className="relative">
            <div
                ref={scrollRef}
                className="max-h-[70vh] overflow-y-auto px-6 py-6"
            >
                <div className="space-y-5 text-[13px] leading-relaxed text-muted sm:text-[14px]">
                    <div>
                        <h4 className="mb-1.5 text-[14px] font-semibold text-foreground sm:text-[15px]">
                            What I Collect
                        </h4>
                        <p>
                            When you fill out a form on this website, I collect only your{" "}
                            <span className="text-foreground">name</span> and{" "}
                            <span className="text-foreground">email address</span>. No
                            other personal information is collected or stored.
                        </p>
                    </div>

                    <div>
                        <h4 className="mb-1.5 text-[14px] font-semibold text-foreground sm:text-[15px]">
                            How I Use It
                        </h4>
                        <p>
                            Your information is used solely to know that you visited my
                            portfolio and to respond to your resume request, if
                            applicable. That&apos;s it.
                        </p>
                    </div>

                    <div>
                        <h4 className="mb-1.5 text-[14px] font-semibold text-foreground sm:text-[15px]">
                            No Sharing
                        </h4>
                        <p>
                            I do not sell, share, or distribute your personal information
                            to any third party, under any circumstances.
                        </p>
                    </div>

                    <div>
                        <h4 className="mb-1.5 text-[14px] font-semibold text-foreground sm:text-[15px]">
                            Cookies &amp; Tracking
                        </h4>
                        <p>
                            This website does not use cookies, analytics trackers, or any
                            third-party tracking scripts. Your browsing is completely
                            private.
                        </p>
                    </div>

                    <div>
                        <h4 className="mb-1.5 text-[14px] font-semibold text-foreground sm:text-[15px]">
                            Questions?
                        </h4>
                        <p>
                            If you have any questions or concerns about your data, feel
                            free to reach out at{" "}
                            <a
                                href="mailto:sidmandirwala9@gmail.com"
                                className="font-medium text-accent-red transition-colors hover:text-red-400"
                            >
                                sidmandirwala9@gmail.com
                            </a>
                        </p>
                    </div>

                    <p className="pt-2 text-[11px] text-muted/50 sm:text-[12px]">
                        Last updated: February 2026
                    </p>
                </div>
            </div>

            {needsScroll && (
                <motion.div
                    animate={{ opacity: thumbVisible ? 1 : 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="pointer-events-none absolute right-1.5 top-0 bottom-0 flex items-center"
                >
                    <div className="relative h-24 w-[5px] rounded-full bg-card-border/30 md:h-32">
                        <div
                            className={`absolute left-0 w-full rounded-full transition-colors duration-300 ${atEnd ? "bg-accent-green/80" : "bg-accent-red/70"}`}
                            style={{
                                top: `${thumbTop}%`,
                                height: "20%",
                            }}
                        />
                    </div>
                </motion.div>
            )}
        </div>
    );
}
