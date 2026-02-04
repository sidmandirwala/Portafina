"use client";

import { motion, useAnimation } from "framer-motion";
import { ReactNode, useEffect, useRef } from "react";

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export default function AnimatedSection({
  children,
  className = "",
  delay = 0,
}: AnimatedSectionProps) {
  const controls = useAnimation();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Check if element is in viewport on mount — show instantly if so
    const rect = el.getBoundingClientRect();
    const inViewport =
      rect.top < window.innerHeight && rect.bottom > 0;

    if (inViewport) {
      controls.set({ opacity: 1, y: 0 });
    }

    let isVisible = inViewport;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.2) {
            if (!isVisible) {
              isVisible = true;
              controls.start({ opacity: 1, y: 0 });
            }
          } else if (!entry.isIntersecting && entry.intersectionRatio === 0) {
            if (isVisible) {
              isVisible = false;
              controls.set({ opacity: 0, y: 40 });
            }
          }
        }
      },
      { threshold: [0, 0.2] }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, [controls]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={controls}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
