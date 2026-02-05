"use client";

import AnimatedSection from "./AnimatedSection";

interface SkillCategory {
  name: string;
  color: string;
  skills: string[];
}

const skillCategories: SkillCategory[] = [
  {
  name: "Programming Languages",
  color: "text-accent-red",
  skills: ["Python", "JavaScript", "TypeScript", "Java", "C/C++"]
},
{
  name: "Frontend Development",
  color: "text-accent-green",
  skills: [
    "Next.js",
    "React.js",
    "Vue.js",
    "Tailwind CSS",
    "Vuetify",
    "HTML5",
    "CSS3",
    "D3"
  ],
},
{
  name: "Backend & APIs",
  color: "text-accent-red",
  skills: [
    "Node.js",
    "Express.js",
    "Django",
    "RESTful APIs",
    "GraphQL",
    "Supabase"
  ],
},
{
  name: "Databases & Storage",
  color: "text-accent-green",
  skills: [
    "PostgreSQL",
    "MongoDB",
    "MySQL",
    "Redis",
    "Qdrant"
  ],
},
{
  name: "DevOps, Infrastructure & Cloud",
  color: "text-accent-red",
  skills: [
    "Git",
    "GitHub",
    "Docker",
    "Kubernetes",
    "Vercel",
    "AWS",
    "Firebase",
    "CI/CD"
  ],
},
{
  name: "Artificial Intelligence & Machine Learning",
  color: "text-accent-green",
  skills: [
    "Machine Learning",
    "NLP",
    "RAG",
    "Bayesian Inference",
    "scikit-learn",
    "PyTorch",
    "XGBoost",
    "PyMC",
    "SHAP",
    "LLM Systems"
  ],
},
{
  name: "Data Engineering & Analytics",
  color: "text-accent-red",
  skills: [
    "Apache Spark",
    "PySpark",
    "Pandas",
    "Big Data Analytics",
    "Urban Analytics",
    "Data Visualization"
  ],
},
];

export default function Skills() {
  return (
    <section id="skills" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <AnimatedSection>
          <h2 className="mb-2 text-center text-3xl font-bold md:text-4xl lg:text-5xl">
            Skills & Technical Expertise
          </h2>
          <p className="mb-16 text-center text-muted md:text-lg lg:text-xl">
            Technologies and tools I work with
          </p>
        </AnimatedSection>

        <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {skillCategories.map((category, index) => (
            <AnimatedSection key={category.name} delay={index * 0.08}>
              <div className="group">
                <h3
                  className={`mb-3 text-xs font-semibold uppercase tracking-widest md:text-sm ${category.color}`}
                >
                  {category.name}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-md border border-card-border bg-card px-3 py-1.5 text-sm text-foreground transition-all duration-200 hover:border-muted/50 hover:bg-card-border/30"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection delay={0.3} className="mt-20">
          <h3 className="mb-6 text-center text-xl font-semibold md:text-2xl lg:text-3xl">
            Certifications
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              {
                name: "Python & Data Analytics",
                org: "Google Developers Group",
              },
              {
                name: "JavaScript and React.js",
                org: "Google Developers Group",
              },
              {
                name: "Sustainability Educator",
                org: "Surat Municipal Corporation",
              },
            ].map((cert) => (
              <div
                key={cert.name}
                className="rounded-lg border border-card-border bg-card px-5 py-3 text-center"
              >
                <p className="text-sm font-medium text-foreground md:text-base">
                  {cert.name}
                </p>
                <p className="text-xs text-muted md:text-sm">{cert.org}</p>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
