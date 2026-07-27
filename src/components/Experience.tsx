"use client";

import AnimatedSection from "./AnimatedSection";

interface TimelineItem {
  type: "work" | "education";
  title: string;
  organization: string;
  location: string;
  period: string;
  description: string[];
  tags?: string[];
}

const timelineData: TimelineItem[] = [
  {
    type: "education",
    title: "Master of Science, Computer Science",
    organization: "New York University",
    location: "New York, USA",
    period: "Sep 2024 — May 2026",
    description: [
      "GPA: 3.815/4.0 — graduated May 2026",
      "Coursework: Algorithms, AI, ML, Data Science, Big Data, Software Engineering, Information Security & Privacy, Data Visualization",
      "Student Engagement Ambassador — helped raise $12,000+ in support of student scholarships",
    ],
  },
  {
    type: "work",
    title: "Software Engineer Intern",
    organization: "AI4Purpose Inc.",
    location: "New York, USA",
    period: "Feb 2026 — May 2026",
    description: [
      "Built production features across a multi-tenant alcohol-retail SaaS — a DTC storefront and B2B marketplace — on a shared Next.js 16 / React 19 / TypeScript frontend with a Strapi v5 + PostgreSQL backend on Vercel and Railway",
      "Integrated Stripe subscriptions and Stripe Connect marketplace payouts, securing checkout with server-side price calculation and atomic stock decrements via raw-SQL transactions",
      "Shipped AI features on production paths: a Gemini 2.5 Flash (Vertex AI) shopping assistant with rate limiting and graceful degradation, and a RAG inventory assistant built with LangGraph, LangChain, and Groq over OCR-extracted invoice data",
      "Designed a four-portal authentication system (NextAuth/Auth.js, per-portal JWT secrets, server-only Strapi tokens) with SHA-256-hashed append-only audit logs aligned to SOC 2 and GDPR",
    ],
    tags: ["Next.js", "React", "TypeScript", "Strapi", "PostgreSQL", "Stripe", "LangChain", "RAG"],
  },
  {
    type: "work",
    title: "Software Development Engineer Intern",
    organization: "KeyToZ",
    location: "Surat, India",
    period: "Jul 2023 — Jul 2024",
    description: [
      "Built features for a healthcare web platform using Vue.js and React.js on a Node.js/Strapi backend with PostgreSQL and GraphQL APIs",
      "Diagnosed and resolved production bugs across frontend and backend, improving mobile responsiveness and reliability, and optimized database queries and API endpoints to reduce response latency",
      "Built PostMinder, a social-media post-scheduling platform, with a Vue.js + Vite frontend and an Express.js REST API backed by PostgreSQL, using a BullMQ + Redis job queue for precisely timed automated publishing",
      "Containerized services with Docker Compose and added consistent error handling to improve stability",
    ],
    tags: ["Vue.js", "React.js", "Node.js", "PostgreSQL", "GraphQL", "Redis", "Docker"],
  },
  {
    type: "education",
    title: "Bachelor of Engineering, Computer Engineering",
    organization: "Gujarat Technological University",
    location: "Surat, India",
    period: "Sep 2020 — Jun 2024",
    description: [
      "Grade: 9.20/10.0 (≈ 3.68/4.0)",
      "Coursework: Data Structures & Algorithms, OOP, Theory of Computation, Computer Networks, Cloud Computing, Web Development",
    ],
  },
];

export default function Experience() {
  return (
    <section id="experience" className="overflow-x-hidden px-6 py-24">
      <div className="mx-auto max-w-4xl">
        <AnimatedSection>
          <h2 className="mb-2 text-center text-3xl font-bold md:text-4xl lg:text-5xl">
            Experience & Education
          </h2>
          <p className="mb-16 text-center text-muted md:text-lg lg:text-xl">
            My professional journey and academic background
          </p>
        </AnimatedSection>

        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-px bg-card-border md:left-1/2 md:-translate-x-px" />

          {timelineData.map((item, index) => (
            <AnimatedSection
              key={index}
              delay={index * 0.1}
              className={`relative mb-12 flex flex-col md:flex-row ${
                index % 2 === 0 ? "md:flex-row-reverse" : ""
              }`}
            >
              <div className="absolute left-2.5 top-1 md:left-1/2 md:-translate-x-1/2">
                <div
                  className={`h-3 w-3 rounded-full border-2 ${
                    item.type === "work"
                      ? "border-accent-red bg-accent-red/30"
                      : "border-accent-green bg-accent-green/30"
                  }`}
                />
              </div>

              <div
                className={`ml-12 rounded-xl border border-card-border bg-card p-4 transition-colors duration-300 hover:border-muted/40 sm:p-6 md:ml-0 md:w-[calc(50%-2rem)] ${
                  index % 2 === 0 ? "md:mr-auto md:ml-8" : "md:ml-auto md:mr-8"
                }`}
              >
                <div className="mb-1 flex items-center gap-2">
                  <span
                    className={`text-xs font-medium uppercase tracking-wider md:text-sm ${
                      item.type === "work"
                        ? "text-accent-red"
                        : "text-accent-green"
                    }`}
                  >
                    {item.type === "work" ? "Work" : "Education"}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-foreground md:text-xl">
                  {item.title}
                </h3>
                <p className="mb-1 text-sm font-medium text-muted md:text-base">
                  {item.organization} · {item.location}
                </p>
                <p className="mb-3 text-xs text-muted/70 md:text-sm">{item.period}</p>
                <ul className="mb-3 space-y-1.5">
                  {item.description.map((desc, i) => (
                    <li
                      key={i}
                      className="text-sm leading-relaxed text-muted md:text-base"
                    >
                      {desc}
                    </li>
                  ))}
                </ul>
                {item.tags && (
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-background px-2.5 py-0.5 text-xs text-muted md:text-sm md:px-3 md:py-1"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
