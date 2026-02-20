"use client";

import dynamic from "next/dynamic";

// Load ResumeCallout only on client side to avoid SSR issues with react-pdf
const ResumeCallout = dynamic(() => import("./ResumeCallout"), {
  ssr: false,
  loading: () => (
    <section className="px-6 py-16">
      <div className="mx-auto max-w-4xl">
        <div className="relative overflow-hidden rounded-2xl border border-card-border bg-card p-8 md:p-12">
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
                Loading...
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  ),
});

export default ResumeCallout;
