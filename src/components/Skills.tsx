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
    skills: ["Python", "JavaScript", "TypeScript", "Java", "C/C++"],
  },
  {
    name: "Frontend",
    color: "text-accent-green",
    skills: [
      "Next.js",
      "React.js",
      "Vue.js",
      "TailwindCSS",
      "Vuetify",
      "HTML5",
      "CSS3",
    ],
  },
  {
    name: "Backend",
    color: "text-accent-red",
    skills: [
      "Node.js",
      "Express.js",
      "Django",
      "Strapi CMS",
      "RESTful APIs",
      "GraphQL",
      "Supabase"
    ],
  },
  {
    name: "Databases",
    color: "text-accent-green",
    skills: ["PostgreSQL", "MongoDB", "MySQL", "Redis"],
  },
  {
    name: "DevOps & Cloud",
    color: "text-accent-red",
    skills: [
      "Git",
      "GitHub",
      "Docker",
      "Kubernetes",
      "Vercel",
      "AWS",
      "Firebase",
      "CI/CD",
    ],
  },
  {
    name: "AI / ML",
    color: "text-accent-green",
    skills: [
      "NLP",
      "RAG",
      "Bayesian Inference",
      "scikit-learn",
      "PyTorch",
      "Qdrant",
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

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {skillCategories.map((category, index) => (
            <AnimatedSection key={category.name} delay={index * 0.08}>
              <div className="group rounded-xl border border-card-border bg-card p-6 transition-all duration-300 hover:border-muted/40 hover:shadow-lg hover:shadow-black/20">
                <h3
                  className={`mb-4 text-sm font-semibold uppercase tracking-wider md:text-base ${category.color}`}
                >
                  {category.name}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full border border-card-border bg-background px-3 py-1.5 text-sm text-foreground transition-colors duration-200 group-hover:border-muted/30 md:text-base md:px-4 md:py-2"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection delay={0.3} className="mt-12">
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
