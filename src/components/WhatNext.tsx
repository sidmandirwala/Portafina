"use client";

import AnimatedSection from "./AnimatedSection";

export default function WhatNext() {
  return (
    <section id="whatnext" className="px-6 py-24">
      <div className="mx-auto max-w-3xl">
        <AnimatedSection>
          <div className="rounded-2xl border border-card-border bg-card p-8 text-center md:p-12">
            <span className="mb-4 inline-block rounded-full bg-accent-green/10 px-4 py-1.5 text-sm font-medium text-accent-green md:text-base md:px-5 md:py-2">
              What&apos;s Next
            </span>
            <h2 className="mb-4 text-3xl font-bold md:text-4xl lg:text-5xl">
              Looking For New Opportunities
            </h2>
            <p className="mb-6 text-base leading-relaxed text-muted md:text-lg lg:text-xl">
              I&apos;m currently seeking{" "}
              <span className="font-semibold text-foreground">
                Software Engineer / Software Development Engineer
              </span>{" "}
              roles starting{" "}
              <span className="font-semibold text-foreground">
                May 2026
              </span>
              . I&apos;m passionate about building scalable applications and
              working with modern technologies in collaborative, fast-paced
              environments.
            </p>
            <p className="mb-8 text-sm text-muted md:text-base lg:text-lg">
              Open to roles in full-stack Web development, AI/ML development, and
              data science. Excited about opportunities at startups and
              innovative tech companies where I can make an impact.
            </p>
            <a
              href="#connect"
              className="inline-block rounded-full bg-accent-red px-8 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-red-600 hover:shadow-lg hover:shadow-accent-red/20 md:text-base md:px-10 md:py-3.5"
            >
              Let&apos;s Talk
            </a>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
