"use client";

import AnimatedSection from "./AnimatedSection";

interface Project {
  title: string;
  period: string;
  description: string[];
  tags: string[];
  link?: string;
}

const projects: Project[] = [
  {
    title: "Predicting 30-Day Patient Readmission",
    period: "May 2025",
    description: [
      "Built predictive analytics system using Python, scikit-learn, and Pandas to forecast hospital readmission risks from MIMIC-III dataset with 10,000+ patient records.",
      "Achieved 78% accuracy with Logistic Regression, Random Forest, and XGBoost using stratified k-fold cross-validation.",
    ],
    tags: ["Python", "scikit-learn", "Pandas", "XGBoost", "ML"],
  },
  {
    title: "RAG-Based Intelligent Q&A System",
    period: "Nov 2024 — Dec 2024",
    description: [
      "Built domain-specific RAG system using Python, LangChain, and Qdrant vector database for semantic document retrieval and NL answer generation.",
      "Optimized query pipeline with caching and async processing, reducing response time by 40% while improving relevance by 25%.",
    ],
    tags: ["Python", "LangChain", "Qdrant", "RAG", "NLP"],
  },
  {
    title: "Financial Literacy & Saving Behavior: A Bayesian Approach",
    period: "Nov 2024",
    description: [
      "Constructed Bayesian regression model using PyMC3 analyzing 1,000-student dataset to quantify financial literacy and saving behavior relationships.",
      "Validated model through posterior predictive checks, showing higher literacy correlates with 2.5-unit savings increase.",
    ],
    tags: ["Python", "PyMC3", "NumPy", "Bayesian", "Statistics"],
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
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted transition-colors hover:text-foreground"
                      aria-label={`View ${project.title}`}
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

                <h3 className="mb-1 text-lg font-semibold text-foreground group-hover:text-accent-red transition-colors duration-200 md:text-xl">
                  {project.title}
                </h3>
                <p className="mb-3 text-xs text-muted/70 md:text-sm">{project.period}</p>

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
