"use client";

import AnimatedSection from "./AnimatedSection";

interface TimelineItem {
  type: "work" | "education";
  title: string;
  organization: string;
  period: string;
  description: string[];
  tags?: string[];
}

const timelineData: TimelineItem[] = [
  {
    type: "education",
    title: "Master of Science, Computer Science",
    organization: "New York University",
    period: "Sep 2024 — May 2026",
    description: [
      "GPA: 3.815/4.0",
      "Coursework: Algorithms, AI, ML, Software Engineering, Information Security & Privacy, Visualization, Data Science, Big Data",
    ],
  },
  {
    type: "work",
    title: "Software Engineer Intern",
    organization: "AI4Purpose",
    period: "Feb 10 — Present",
    description: [
      "Migrated website from WordPress to Next.js with TailwindCSS, reducing page load times by 60%",
      "Architected responsive, mobile-first frontend components using Next.js App Router",
      "Implemented features using Agile methodology with Git/GitHub version control",
    ],
    tags: ["Next.js", "TailwindCSS", "React"],
  },
  {
    type: "work",
    title: "Software Development Engineer Intern",
    organization: "KeyToZ",
    period: "Jan 2024 — Jul 2024",
    description: [
      "Built healthcare platform features using Vue.js, React.js, Node.js/Strapi with PostgreSQL and GraphQL",
      "Resolved 12+ critical production issues, improving mobile responsiveness by 40%",
      "Optimized database queries, reducing API response times by 25%",
    ],
    tags: ["Vue.js", "React.js", "Node.js", "PostgreSQL", "GraphQL"],
  },
  {
    type: "work",
    title: "Full Stack Developer Intern",
    organization: "Bharat Tech Labs",
    period: "Jul 2023 — Aug 2023",
    description: [
      "Built Postminder social media scheduling platform with Vue.js, Node.js, Redis, and PostgreSQL",
      "Architected Redis-based job queue handling 500+ scheduled posts daily with 99.5% uptime",
      "Implemented error handling and logging that reduced production incidents by 30%",
    ],
    tags: ["Vue.js", "Node.js", "Redis", "PostgreSQL"],
  },
  {
    type: "education",
    title: "Bachelor of Engineering, Computer Engineering",
    organization: "Gujarat Technological University",
    period: "Sep 2020 — Jun 2024",
    description: [
      "GPA: 9.20/10.0 (3.68/4.0)",
      "Coursework: OOP, Theory of Computation, Computer Networks, Web Development, Cloud Computing",
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
                  {item.organization}
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
