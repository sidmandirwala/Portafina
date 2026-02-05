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

    let done = false;

    const show = () => {
      if (done) return;
      done = true;
      controls.start({ opacity: 1, y: 0 });
    };

    // Observe for scroll-triggered entry (works on all screen sizes)
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            show();
            observer.unobserve(el);
          }
        }
      },
      { threshold: 0.1 }
    );

    // Wait one frame for layout to settle (handles reload + mobile address bar)
    requestAnimationFrame(() => {
      if (done) return;
      const viewportH = window.innerHeight || document.documentElement.clientHeight;
      const rect = el.getBoundingClientRect();
      if (rect.top < viewportH && rect.bottom > 0) {
        show();
      } else {
        observer.observe(el);
      }
    });

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
