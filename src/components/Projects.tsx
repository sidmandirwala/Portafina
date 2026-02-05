"use client";

import AnimatedSection from "./AnimatedSection";

interface Project {
  title: string;
  period: string;
  description: string[];
  tags: string[];
  link?: string;
  demo?: string;
}

const projects: Project[] = [
  {
    title: "Portafina",
    period: "Jan 2026",
    description: [
      "Developed a modern, responsive portfolio website using Next.js, React, and Tailwind CSS with smooth animations and theme support.",
      "Integrated an AI-powered personal assistant trained to answer questions strictly about the developer's experience and projects.",
      "Implemented secure lead capture, real-time streaming responses, and a polished user experience across devices.",
    ],
    tags: ["Next.js", "React", "TypeScript", "Tailwind", "AI Integration"],
    link: "https://github.com/sidmandirwala/Portafina",
    demo: "https://siddhmandirwala.vercel.app",
  },
  {
    title: "MTAnalytics",
    period: "Nov 2025 - Dec 2025",
    description: [
      "Built a large-scale analytics and machine learning pipeline to analyze NYC MTA subway operations using 100GB+ of ridership, service, and accessibility data.",
      "Processed data for 472+ subway stations with Apache Spark and PySpark to uncover insights on ridership patterns, system reliability, accessibility gaps, and post-pandemic recovery.",
      "Developed a station-level ridership forecasting model using XGBoost with SHAP-based interpretability to support data-driven transit planning decisions.",
    ],
    tags: [
      "Apache Spark",
      "PySpark",
      "XGBoost",
      "SHAP",
      "Big Data Analytics",
      "Urban Mobility",
    ],
    link: "https://github.com/sidmandirwala/MTAnalytics",
  },
  {
    title: "Vizpromax",
    period: "Sep 2025 - Dec 2025",
    description: [
      "Created an interactive data visualization platform analyzing spatio-temporal crime patterns in New York City over the past decade.",
      "Designed narrative-driven visualizations to explore crime trends across time, geography, and offense types.",
      "Enabled multi-dimensional filtering and interactive dashboards to transform complex public safety data into actionable insights.",
    ],
    tags: [
      "Data Visualization",
      "D3",
      "Interactive Dashboards",
      "Urban Analytics",
    ],
    link: "https://github.com/sidmandirwala/Vizpromax",
    demo: "https://vizpromax.vercel.app",
  },
  {
    title: "ReadmitIQ",
    period: "May 2025",
    description: [
      "Built a machine learning system to predict 30-day hospital readmission risk using real-world clinical data from the MIMIC-III and UCI Diabetes datasets.",
      "Engineered demographic, clinical, and temporal features and evaluated Logistic Regression, Random Forest, and XGBoost models with metrics robust to class imbalance.",
      "Demonstrated how predictive analytics can support proactive care planning, optimized resource allocation, and improved patient outcomes.",
    ],
    tags: ["Python", "scikit-learn", "Pandas", "XGBoost", "Healthcare ML"],
    link: "https://github.com/sidmandirwala/ReadmitIQ",
  },
  {
    title: "RAGStack",
    period: "Nov 2024 — Dec 2024",
    description: [
      "Developed an end-to-end Retrieval-Augmented Generation (RAG) system that answers domain-specific questions using data aggregated from GitHub, Medium, and LinkedIn.",
      "Designed a modular pipeline for data crawling, cleaning, semantic embedding, and vector retrieval using Qdrant, with a fine-tuned GPT-2 model for answer generation.",
      "Exposed the system through a REST API and an interactive Gradio interface, emphasizing efficiency, modularity, and practical LLM deployment constraints.",
    ],
    tags: ["Python", "RAG", "NLP", "Qdrant", "LLM Systems"],
    link: "https://github.com/sidmandirwala/RAGStack",
  },
  {
    title: "BayesWealth",
    period: "Nov 2024",
    description: [
      "Analyzed the relationship between age, financial literacy, and saving behavior using a Bayesian causal modeling framework.",
      "Modeled financial literacy as a mediating variable with probabilistic regression in PyMC, supported by causal graphs and posterior inference.",
      "Applied posterior predictive checks and diagnostics to produce interpretable, uncertainty-aware insights into financial behavior.",
    ],
    tags: ["Python", "PyMC", "Bayesian Statistics", "Causal Inference"],
    link: "https://github.com/sidmandirwala/BayesWealth",
  },
  {
    title: "PostMinder",
    period: "Jul 2023 - Aug 2023",
    description: [
      "Built a full-stack Instagram post scheduling platform with support for automated publishing and background job processing.",
      "Implemented asynchronous task orchestration using BullMQ and Redis, backed by PostgreSQL for reliable data persistence and Docker-based deployment.",
      "Designed the system to be scalable, modular, and production-ready for real-world social media workflows.",
    ],
    tags: ["Vue", "Node.js", "PostgreSQL", "Redis", "Docker"],
    link: "https://github.com/sidmandirwala/PostMinder",
  },
];

export default function Projects() {
  return (
    <section id="projects" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <AnimatedSection>
          <h2 className="mb-2 text-center text-3xl font-bold md:text-4xl lg:text-5xl">
            Projects
          </h2>
          <p className="mb-16 text-center text-muted md:text-lg lg:text-xl">
            Notable work and research
          </p>
        </AnimatedSection>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
              <AnimatedSection key={project.title} delay={index * 0.1}>
                <div className="group flex h-full flex-col rounded-xl border border-card-border bg-card p-6 transition-all duration-300 hover:border-muted/40 hover:shadow-lg hover:shadow-black/20">
                  <div className="mb-3 flex items-start justify-between">
                    <div>
                      <svg
                        className="mb-3 h-8 w-8 text-accent-green"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                        />
                      </svg>
                    </div>
                    <div className="flex items-center gap-2">
                      {project.demo && (
                        <a
                          href={project.demo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-500 backdrop-blur-sm transition-all duration-200 hover:bg-blue-500/20"
                          aria-label={`Live demo of ${project.title}`}
                        >
                          <svg
                            className="h-3.5 w-3.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                            />
                          </svg>
                          Live
                        </a>
                      )}
                      {project.link && (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted transition-all duration-200 hover:text-foreground md:opacity-0 md:group-hover:opacity-100"
                          aria-label={`View ${project.title} on GitHub`}
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
                              strokeWidth={1.5}
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>

                  <h3 className="mb-1 text-lg font-semibold text-foreground group-hover:text-accent-red transition-colors duration-200 md:text-xl">
                    {project.title}
                  </h3>
                  <p className="mb-3 text-xs text-muted/70 md:text-sm">
                    {project.period}
                  </p>

                  <div className="mb-4 flex-1">
                    {project.description.map((desc, i) => (
                      <p
                        key={i}
                        className="mb-2 text-sm leading-relaxed text-muted md:text-base"
                      >
                        {desc}
                      </p>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-background px-2.5 py-0.5 text-xs text-muted md:text-sm md:px-3 md:py-1"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </AnimatedSection>
            ))}
        </div>
      </div>
    </section>
  );
}
