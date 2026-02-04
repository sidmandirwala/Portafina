"use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-6"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(239,68,68,0.1)_0%,transparent_50%)]" />

      <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 pt-20 md:flex-row md:gap-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <div className="pointer-events-none absolute -inset-8 rounded-full bg-[radial-gradient(circle,rgba(34,197,94,0.35)_0%,transparent_75%)] blur-xl" />

          <div className="relative h-48 w-48 overflow-hidden rounded-full border-2 border-card-border md:h-64 md:w-64 lg:h-72 lg:w-72">
            <img
              src="/Siddh Photo.jpg"
              alt="SM."
              className="h-full w-full object-cover"
            />
          </div>
          <div className="absolute -inset-2 rounded-full border border-accent-red/20" />
        </motion.div>

        <div className="text-center md:text-left">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-2 text-sm font-medium tracking-widest text-accent-green uppercase md:text-base lg:text-lg"
          >
            Software Engineer
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-4 text-4xl font-bold leading-tight tracking-tight md:text-6xl lg:text-7xl"
          >
            Siddh{" "}
            <span className="text-accent-red">Mandirwala</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mb-6 max-w-xl text-base leading-relaxed text-muted md:text-lg lg:text-xl"
          >
            MS Computer Science student at NYU with hands-on experience
            building full-stack web applications, healthcare platforms, and
            AI-powered systems. Passionate about crafting performant,
            user-centric digital experiences.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex flex-wrap justify-center gap-4 md:justify-start"
          >
            <a
              href="#connect"
              className="rounded-full bg-accent-red px-6 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-red-600 hover:shadow-lg hover:shadow-accent-red/20 md:px-8 md:py-3 md:text-base"
            >
              Get in Touch
            </a>
            <a
              href="#projects"
              className="rounded-full border border-card-border px-6 py-2.5 text-sm font-semibold text-foreground transition-all duration-300 hover:border-foreground md:px-8 md:py-3 md:text-base"
            >
              View Projects
            </a>
          </motion.div>
        </div>
      </div>

    </section>
  );
}
