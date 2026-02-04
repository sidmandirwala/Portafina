"use client";

import AnimatedSection from "./AnimatedSection";

const hobbies = [
  {
    emoji: "\u{1F3CF}",
    title: "Cricket",
    description: "Passionate cricket enthusiast who believes in staying active. Whether playing on weekends or following international matches, cricket keeps me energized and reminds me that physical activity is essential for a balanced lifestyle.",
  },
  {
    emoji: "\u{1F3CE}\u{FE0F}",
    title: "Automotive",
    description: "Deep fascination with automotive engineering and design. From classic cars to cutting-edge electric vehicles, I love understanding the mechanics, innovation, and craftsmanship that goes into every automobile.",
  },
  {
    emoji: "\u{1F4F1}",
    title: "Electronics & Gadgets",
    description: "Always exploring the latest in consumer electronics and emerging tech. From smartphones to smart home devices, I enjoy diving into new gadgets, understanding their technology, and staying ahead of innovation trends.",
  },
];

export default function Hobby() {
  return (
    <section id="hobby" className="px-6 py-24">
      <div className="mx-auto max-w-4xl">
        <AnimatedSection>
          <h2 className="mb-2 text-center text-3xl font-bold md:text-4xl lg:text-5xl">
            Hobbies & Interests
          </h2>
          <p className="mb-16 text-center text-muted md:text-lg lg:text-xl">
            What I enjoy outside of code
          </p>
        </AnimatedSection>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {hobbies.map((hobby, index) => (
            <AnimatedSection key={hobby.title} delay={index * 0.1}>
              <div className="group flex flex-col items-center rounded-xl border border-card-border bg-card p-6 text-center transition-all duration-300 hover:border-muted/40 hover:-translate-y-1">
                <span className="mb-3 text-4xl md:text-5xl">{hobby.emoji}</span>
                <h3 className="mb-1 text-base font-semibold text-foreground md:text-lg">
                  {hobby.title}
                </h3>
                <p className="text-sm text-muted md:text-base">{hobby.description}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
