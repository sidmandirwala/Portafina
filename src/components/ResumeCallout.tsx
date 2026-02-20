"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import AnimatedSection from "./AnimatedSection";

// Import react-pdf CSS - must be at top level (industry standard)
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Dynamic import for react-pdf to avoid SSR issues
let Document: any = null;
let Page: any = null;
let pdfjs: any = null;

export default function ResumeCallout() {
  const [showResume, setShowResume] = useState(false);
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [pdfLoaded, setPdfLoaded] = useState(false);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Load react-pdf only on client side
    if (typeof window !== "undefined" && !pdfLoaded) {
      import("react-pdf").then((module) => {
        Document = module.Document;
        Page = module.Page;
        pdfjs = module.pdfjs;
        // Use local worker file instead of CDN
        pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
        setPdfLoaded(true);
      }).catch((error) => {
        console.error("Failed to load react-pdf:", error);
      });
    }
  }, [pdfLoaded]);

  // Measure container width for responsive scaling
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        setContainerWidth(width);

        // Auto-adjust scale for mobile devices
        if (width < 640) {
          setScale(0.8); // 80% on small mobile
        } else if (width < 768) {
          setScale(0.9); // 90% on larger mobile
        } else {
          setScale(1.0); // 100% on desktop
        }
      }
    };

    if (showResume) {
      // Delay measurement to ensure modal is rendered
      setTimeout(updateWidth, 100);
    }

    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, [showResume]);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
    setPageNumber(1);
  }

  // Lock body scroll when modal is open
  useEffect(() => {
    if (showResume) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showResume]);

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
                    View my resume directly in your browser.
                  </p>
                </div>

                <button
                  onClick={() => setShowResume(true)}
                  className="group flex shrink-0 items-center gap-2 rounded-full bg-accent-red px-6 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-red-600 hover:shadow-lg hover:shadow-accent-red/20 md:px-8 md:py-3 md:text-base"
                >
                  View Resume
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

      {/* Resume Modal */}
      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {showResume && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
                onClick={(e) => {
                  if (e.target === e.currentTarget) setShowResume(false);
                }}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="w-full max-w-4xl overflow-hidden rounded-2xl border border-card-border bg-card"
                  style={{ boxShadow: "0 0 80px 25px var(--chat-shadow)" }}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between border-b border-card-border px-6 py-4">
                    <div className="flex items-center gap-2.5">
                      <svg
                        className="h-5 w-5 text-accent-red"
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
                      <h3 className="font-heading text-[16px] font-semibold text-foreground">
                        Resume
                      </h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <a
                        href="/Siddh_Mandirwala_Resume.pdf"
                        download="Siddh_Mandirwala_Resume.pdf"
                        className="rounded-lg p-1.5 text-muted transition-colors hover:bg-background hover:text-accent-green"
                        aria-label="Download resume"
                      >
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                          />
                        </svg>
                      </a>
                      <button
                        onClick={() => setShowResume(false)}
                        aria-label="Close resume"
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
                  </div>

                  <PDFViewer
                    pdfLoaded={pdfLoaded}
                    pageNumber={pageNumber}
                    setPageNumber={setPageNumber}
                    numPages={numPages}
                    scale={scale}
                    setScale={setScale}
                    onDocumentLoadSuccess={onDocumentLoadSuccess}
                    containerRef={containerRef}
                    containerWidth={containerWidth}
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}

function PDFViewer({
  pdfLoaded,
  pageNumber,
  setPageNumber,
  numPages,
  scale,
  setScale,
  onDocumentLoadSuccess,
  containerRef,
  containerWidth,
}: {
  pdfLoaded: boolean;
  pageNumber: number;
  setPageNumber: (fn: (p: number) => number) => void;
  numPages: number;
  scale: number;
  setScale: (fn: (s: number) => number) => void;
  onDocumentLoadSuccess: ({ numPages }: { numPages: number }) => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
  containerWidth: number;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [thumbVisible, setThumbVisible] = useState(false);
  const [thumbTop, setThumbTop] = useState(0);
  const [thumbLeft, setThumbLeft] = useState(0);
  const [atEnd, setAtEnd] = useState(false);
  const [atRightEnd, setAtRightEnd] = useState(false);
  const [needsVerticalScroll, setNeedsVerticalScroll] = useState(false);
  const [needsHorizontalScroll, setNeedsHorizontalScroll] = useState(false);
  const hideTimer = useRef<NodeJS.Timeout | null>(null);
  const previousScale = useRef<number>(scale);
  const mousePosition = useRef<{ x: number; y: number } | null>(null);

  const updateThumb = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    // Vertical scroll
    const verticalScrollable = el.scrollHeight - el.clientHeight;
    if (verticalScrollable <= 0) {
      setNeedsVerticalScroll(false);
    } else {
      setNeedsVerticalScroll(true);
      const verticalProgress = el.scrollTop / verticalScrollable;
      setThumbTop(verticalProgress * 80); // thumb travels 0–80% of track
      setAtEnd(verticalProgress >= 0.98);
    }

    // Horizontal scroll
    const horizontalScrollable = el.scrollWidth - el.clientWidth;
    if (horizontalScrollable <= 0) {
      setNeedsHorizontalScroll(false);
    } else {
      setNeedsHorizontalScroll(true);
      const horizontalProgress = el.scrollLeft / horizontalScrollable;
      setThumbLeft(horizontalProgress * 80); // thumb travels 0–80% of track
      setAtRightEnd(horizontalProgress >= 0.98);
    }
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
    if (el.scrollHeight > el.clientHeight || el.scrollWidth > el.clientWidth) {
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

  // Track mouse position for zoom centering
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      mousePosition.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    el.addEventListener("mousemove", handleMouseMove);
    return () => el.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Maintain mouse position when zooming (industry standard)
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || previousScale.current === scale) return;

    // Calculate the zoom ratio
    const scaleRatio = scale / previousScale.current;

    // Use mouse position if available, otherwise use center of viewport
    const mouseX = mousePosition.current?.x ?? el.clientWidth / 2;
    const mouseY = mousePosition.current?.y ?? el.clientHeight / 2;

    // Calculate the point in the document that's under the mouse/center
    const pointX = el.scrollLeft + mouseX;
    const pointY = el.scrollTop + mouseY;

    // Calculate where that point will be after zoom
    const newPointX = pointX * scaleRatio;
    const newPointY = pointY * scaleRatio;

    // Adjust scroll to keep the same point under the mouse/center
    requestAnimationFrame(() => {
      el.scrollLeft = newPointX - mouseX;
      el.scrollTop = newPointY - mouseY;
    });

    previousScale.current = scale;
  }, [scale]);

  return (
    <div className="relative flex h-[80vh] flex-col bg-background">
      {/* Zoom Controls */}
      <div className="flex items-center justify-between border-b border-card-border px-4 py-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              // Set mouse position to center for zoom centering when using buttons
              if (scrollRef.current) {
                mousePosition.current = {
                  x: scrollRef.current.clientWidth / 2,
                  y: scrollRef.current.clientHeight / 2,
                };
              }
              setScale((s) => Math.max(0.5, s - 0.1));
            }}
            className="rounded p-1.5 text-muted transition-colors hover:bg-card hover:text-foreground"
            aria-label="Zoom out"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM13.5 10.5h-6"
              />
            </svg>
          </button>
          <span className="text-sm text-muted">
            {Math.round(scale * 100)}%
          </span>
          <button
            onClick={() => {
              // Set mouse position to center for zoom centering when using buttons
              if (scrollRef.current) {
                mousePosition.current = {
                  x: scrollRef.current.clientWidth / 2,
                  y: scrollRef.current.clientHeight / 2,
                };
              }
              setScale((s) => Math.min(2.0, s + 0.1));
            }}
            className="rounded p-1.5 text-muted transition-colors hover:bg-card hover:text-foreground"
            aria-label="Zoom in"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6"
              />
            </svg>
          </button>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted">
          <button
            onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
            disabled={pageNumber <= 1}
            className="rounded p-1.5 transition-colors hover:bg-card hover:text-foreground disabled:opacity-30"
            aria-label="Previous page"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
          </button>
          <span>
            Page {pageNumber} of {numPages}
          </span>
          <button
            onClick={() => setPageNumber((p) => Math.min(numPages, p + 1))}
            disabled={pageNumber >= numPages}
            className="rounded p-1.5 transition-colors hover:bg-card hover:text-foreground disabled:opacity-30"
            aria-label="Next page"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 4.5l7.5 7.5-7.5 7.5"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* PDF Document with Custom Scrollbar */}
      <div ref={containerRef} className="relative flex-1 overflow-hidden">
        <div
          ref={scrollRef}
          className="h-full overflow-auto"
        >
          {!pdfLoaded || !Document ? (
            <div className="flex flex-col items-center justify-center gap-3 py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-card-border border-t-accent-red" />
              <p className="text-sm text-muted">Loading viewer...</p>
            </div>
          ) : (
            <div className="inline-flex min-h-full min-w-full items-center justify-center p-4">
              <Document
                file="/Siddh_Mandirwala_Resume.pdf"
                onLoadSuccess={onDocumentLoadSuccess}
                loading={
                  <div className="flex flex-col items-center gap-3 py-8">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-card-border border-t-accent-red" />
                    <p className="text-sm text-muted">Loading PDF...</p>
                  </div>
                }
                error={
                  <div className="flex flex-col items-center gap-4 py-8">
                    <svg
                      className="h-12 w-12 text-accent-red"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                      />
                    </svg>
                    <p className="text-sm text-muted">
                      Failed to load PDF
                    </p>
                    <a
                      href="/Siddh_Mandirwala_Resume.pdf"
                      download="Siddh_Mandirwala_Resume.pdf"
                      className="rounded-lg bg-accent-red px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-600"
                    >
                      Download Instead
                    </a>
                  </div>
                }
              >
                <Page
                  pageNumber={pageNumber}
                  width={containerWidth > 0 ? Math.min(containerWidth - 32, 800) : undefined}
                  scale={scale}
                  renderTextLayer={true}
                  renderAnnotationLayer={true}
                />
              </Document>
            </div>
          )}
        </div>

        {/* Vertical Custom Scrollbar */}
        {needsVerticalScroll && (
          <motion.div
            animate={{ opacity: thumbVisible ? 1 : 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="pointer-events-none absolute right-1.5 top-0 bottom-0 flex items-center"
          >
            <div className="relative h-24 w-[5px] rounded-full bg-card-border/30 md:h-32">
              <div
                className={`absolute left-0 w-full rounded-full transition-colors duration-300 ${
                  atEnd ? "bg-accent-green/80" : "bg-accent-red/70"
                }`}
                style={{
                  top: `${thumbTop}%`,
                  height: "20%",
                }}
              />
            </div>
          </motion.div>
        )}

        {/* Horizontal Custom Scrollbar */}
        {needsHorizontalScroll && (
          <motion.div
            animate={{ opacity: thumbVisible ? 1 : 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="pointer-events-none absolute bottom-1.5 left-0 right-0 flex justify-center"
          >
            <div className="relative h-[5px] w-24 rounded-full bg-card-border/30 md:w-32">
              <div
                className={`absolute top-0 h-full rounded-full transition-colors duration-300 ${
                  atRightEnd ? "bg-accent-green/80" : "bg-accent-red/70"
                }`}
                style={{
                  left: `${thumbLeft}%`,
                  width: "20%",
                }}
              />
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
