"use client";

import AnimatedSection from "./AnimatedSection";

export default function Footer() {
  return (
    <footer className="border-t border-card-border px-6 py-16">
      <div className="mx-auto max-w-4xl">
        <AnimatedSection>
          <div className="mb-8 text-center">
            <h3 className="mb-3 text-2xl font-bold md:text-3xl lg:text-4xl">
              Start a Conversation
            </h3>
            <p className="mb-6 text-muted md:text-lg lg:text-xl">
              Interested in working together or just want to say hello?
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="mailto:sidmandirwala9@gmail.com"
                className="rounded-full bg-accent-red px-6 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-red-600 hover:shadow-lg hover:shadow-accent-red/20 md:text-base md:px-8 md:py-3"
              >
                Send an Email
              </a>
              <a
                href="https://www.linkedin.com/in/siddh-mandirwala"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-card-border px-6 py-2.5 text-sm font-semibold text-foreground transition-all duration-300 hover:border-foreground md:text-base md:px-8 md:py-3"
              >
                Connect on LinkedIn
              </a>
            </div>
          </div>
        </AnimatedSection>

        <div className="mt-12 flex flex-col items-center gap-4 border-t border-card-border pt-8 text-center sm:flex-row sm:justify-between">
          <p className="text-sm text-muted md:text-base">
            &copy; {new Date().getFullYear()} Siddh Mandirwala. All rights
            reserved.
          </p>
          <p className="text-xs text-muted/50 md:text-sm">
            Built with Next.js & TailwindCSS
          </p>
        </div>
      </div>
    </footer>
  );
}
