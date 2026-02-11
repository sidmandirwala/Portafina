"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface PdfViewerProps {
  src: string;
}

export default function PdfViewer({ src }: PdfViewerProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pdfPageRef = useRef<any>(null);
  const renderTaskRef = useRef<{ cancel: () => void } | null>(null);

  const renderPage = useCallback(() => {
    const page = pdfPageRef.current;
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    if (!page || !canvas || !wrapper) return;

    // Cancel any in-flight render
    if (renderTaskRef.current) {
      renderTaskRef.current.cancel();
      renderTaskRef.current = null;
    }

    // Fit to wrapper width minus padding (p-3 = 12px*2, sm:p-5 = 20px*2, md:p-8 = 32px*2)
    const style = getComputedStyle(wrapper);
    const paddingX = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
    const availableW = wrapper.clientWidth - paddingX;

    const unscaled = page.getViewport({ scale: 1 });
    const fitScale = availableW / unscaled.width;
    const viewport = page.getViewport({ scale: fitScale });

    const dpr = window.devicePixelRatio || 1;
    canvas.width = viewport.width * dpr;
    canvas.height = viewport.height * dpr;
    canvas.style.width = `${viewport.width}px`;
    canvas.style.height = `${viewport.height}px`;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const task = page.render({ canvasContext: ctx, viewport });
    renderTaskRef.current = task;
    task.promise
      .then(() => { renderTaskRef.current = null; })
      .catch(() => { renderTaskRef.current = null; });
  }, []);

  // Load the PDF page once
  useEffect(() => {
    let cancelled = false;

    async function load() {
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
        "pdfjs-dist/build/pdf.worker.mjs",
        import.meta.url
      ).toString();

      const pdf = await pdfjsLib.getDocument(src).promise;
      if (cancelled) return;

      const page = await pdf.getPage(1);
      if (cancelled) return;

      pdfPageRef.current = page;
      setReady(true); // This triggers re-render so canvas mounts
    }

    load();
    return () => {
      cancelled = true;
      if (renderTaskRef.current) renderTaskRef.current.cancel();
    };
  }, [src]);

  // Render once canvas is mounted (ready flipped to true)
  useEffect(() => {
    if (!ready) return;
    // Wait one frame for the canvas ref to be available after mount
    requestAnimationFrame(() => renderPage());
  }, [ready, renderPage]);

  // Re-render on container resize
  useEffect(() => {
    if (!ready) return;
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const observer = new ResizeObserver(() => renderPage());
    observer.observe(wrapper);
    return () => observer.disconnect();
  }, [ready, renderPage]);

  return (
    <div
      ref={wrapperRef}
      className="overflow-hidden rounded-lg border border-card-border bg-card p-3 sm:rounded-xl sm:p-5 md:rounded-2xl md:p-8"
      onContextMenu={(e) => e.preventDefault()}
    >
      {!ready ? (
        <div className="flex items-center justify-center py-40">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-card-border border-t-accent-red" />
            <span className="text-sm text-muted">Loading resume...</span>
          </div>
        </div>
      ) : (
        <canvas
          ref={canvasRef}
          className="block rounded-sm shadow-lg"
          style={{ userSelect: "none" }}
        />
      )}
    </div>
  );
}
