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
    title: "Parachute",
    period: "YHack 2026",
    description: [
      "Built a browser-based IDE where a team and its AI coding agents share one workspace — Monaco editor, a real terminal (xterm.js + node-pty), and live cursors showing who is editing what; built by a team of three and deployed on Fly.io.",
      "Kept concurrent edits conflict-free with Yjs CRDTs over WebSockets, with a two-way sync between the shared document and the filesystem using chokidar watchers, a 300ms write debounce, and MD5 checks to break echo loops.",
      "Added an orchestration layer that registers every agent and hands out file-level locks, so two agents editing the same file get rerouted instead of causing a merge conflict — proven with a hosted LLM agent that streams generated code into the shared document live.",
    ],
    tags: ["Next.js", "React", "TypeScript", "Yjs", "CRDTs", "WebSockets", "Monaco", "Fly.io"],
    link: "https://github.com/prathamssaraf/Parachute",
    demo: "https://yourparachute.tech",
  },
  {
    title: "RAGStack",
    period: "Nov 2024 — Dec 2024",
    description: [
      "Built an end-to-end RAG system over self-authored web content without a single paid API call — three custom scrapers (GitHub, Medium, LinkedIn) writing to MongoDB with link-based dedupe so re-runs stay idempotent.",
      "Prepared the data end to end: sentence-aware chunking, 384-dimensional MiniLM embeddings indexed in Qdrant for top-5 cosine retrieval, and 3,200+ manually curated Q&A pairs; fine-tuned GPT-2 small with LoRA on an 8-bit-quantized base and published the weights to Hugging Face.",
      "Ran it as a five-part stack — MongoDB and Qdrant in Docker plus Flask, FastAPI, and Gradio services — with ClearML logging every question and answer.",
    ],
    tags: ["Python", "RAG", "NLP", "LoRA / PEFT", "Qdrant", "Hugging Face", "ClearML"],
    link: "https://github.com/sidmandirwala/RAGStack",
  },
  {
    title: "MTAnalytics",
    period: "Nov 2025 — Dec 2025",
    description: [
      "Built a Spark/PySpark pipeline that pulls 5 NYC Open Data feeds through the Socrata API with an adaptive sampler, processing 20M+ rows drawn from 100GB+ of source data covering 472+ stations from 2008 to 2025.",
      "Found the patterns behind the numbers: trips stay inside a borough 3–5× more often than they cross one, ridership has settled at 60–70% of pre-2019 levels, and several of the busiest stations still lack ADA access.",
      "Ended with prediction, working with a collaborator: an XGBoost demand model trained on 5 million rows, where SHAP showed that which station it is matters more than what hour it is.",
    ],
    tags: ["Apache Spark", "PySpark", "XGBoost", "SHAP", "Socrata APIs", "Big Data Analytics"],
    link: "https://github.com/sidmandirwala/MTAnalytics",
  },
  {
    title: "Vizpromax",
    period: "Sep 2025 — Dec 2025",
    description: [
      "Turned 7+ million NYPD complaint records (2015–2024, five boroughs, 77 precincts) into a guided visual story a non-expert can follow, built in a team of two for NYU's information-visualization course.",
      "Queried NYC Open Data live at runtime instead of bundling a static dataset: SoQL pushes the aggregation to the server, years are fetched in parallel, and a 20,000-record stratified sample keeps the dashboard responsive.",
      "Designed 8 interactive D3 visualizations — including a Sankey laid out by hand without the d3-sankey library and a precinct-level GeoJSON choropleth — inside an Observable notebook embedded in a Next.js app.",
    ],
    tags: ["D3.js", "Next.js", "TypeScript", "Observable", "Socrata APIs", "GeoJSON"],
    link: "https://github.com/sidmandirwala/Vizpromax",
    demo: "https://vizpromax.vercel.app",
  },
  {
    title: "ReadmitIQ",
    period: "May 2025",
    description: [
      "Framed 30-day hospital readmission as a prediction problem on two public datasets: a 10,000-patient MIMIC-III subset (7 tables merged, 6M+ lab events) and 101,766 patient encounters from the UCI Diabetes dataset.",
      "Spent most of the effort making the data answerable — deriving the readmission label from raw admission and discharge timestamps, then engineering length of stay, admission frequency, a composite risk score, and 23 per-drug medication-change encodings.",
      "Compared Logistic Regression, Random Forest, and XGBoost on each dataset, taking the class imbalance seriously with class weighting and stratified splits, and judging models on ROC AUC and F1 rather than raw accuracy.",
    ],
    tags: ["Python", "scikit-learn", "XGBoost", "Pandas", "Healthcare ML", "Feature Engineering"],
    link: "https://github.com/sidmandirwala/ReadmitIQ",
  },
  {
    title: "BayesWealth",
    period: "Nov 2024",
    description: [
      "Encoded the \"age drives saving\" hypothesis as a causal DAG and fit two linked Bayesian regressions in PyMC over 1,000 survey records, sampling with MCMC to clean convergence (r_hat 1.00 on every parameter).",
      "Reported what the posterior actually said: financial literacy predicted saving strongly while age's effect was indistinguishable from zero — a null result on the original hypothesis, stated as such rather than massaged.",
      "Checked the machinery, not just the answer: simulated 500 samples with known true coefficients, refit the model, and confirmed every true value landed inside its 89% credible interval.",
    ],
    tags: ["Python", "PyMC", "ArviZ", "Bayesian Statistics", "Causal Inference"],
    link: "https://github.com/sidmandirwala/BayesWealth",
  },
  {
    title: "PostMinder",
    period: "Jul 2023 — Aug 2023",
    description: [
      "Built an Instagram post-scheduling platform end to end: a Vue 3 + Vuetify frontend, two Express services exposing 15+ REST endpoints over HTTPS, PostgreSQL, and 5 Docker Compose services, secured with JWT auth and bcrypt.",
      "Treated on-time publishing as a queue problem: BullMQ jobs on Redis fire at the scheduled moment and walk the Facebook Graph API's 4-step publish flow, with images staged on Cloudinary and cleaned up after posting.",
      "Made the UI update without polling: PostgreSQL triggers emit LISTEN/NOTIFY events relayed over Socket.IO, so the scheduled-posts list changes the moment the data does, and reschedules swap the queued job atomically.",
    ],
    tags: ["Vue.js", "Express.js", "PostgreSQL", "Redis", "BullMQ", "Socket.IO", "Docker"],
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
