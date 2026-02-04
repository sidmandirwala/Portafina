"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";

export default function ScrollProgress() {
  const [visible, setVisible] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const hideTimer = useRef<NodeJS.Timeout | null>(null);
  const { scrollYProgress } = useScroll();

  const thumbTop = useTransform(scrollYProgress, [0, 1], ["0%", "80%"]);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setAtEnd(v >= 0.98);
  });

  useEffect(() => {
    hideTimer.current = setTimeout(() => setVisible(false), 2000);

    const handleScroll = () => {
      setVisible(true);
      if (hideTimer.current) clearTimeout(hideTimer.current);
      hideTimer.current = setTimeout(() => setVisible(false), 1500);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <motion.div
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="pointer-events-none fixed inset-y-0 left-0 right-0 z-[55] mx-auto flex max-w-7xl items-center justify-end pr-2.5 xl:pr-4.5"
    >
      <div className="pointer-events-auto -mr-1.5 xl:mr-3">
        <div className="relative h-24 w-[5px] rounded-full bg-card-border/30 md:h-32">
          <motion.div
            className={`absolute left-0 w-full rounded-full transition-colors duration-300 ${atEnd ? "bg-accent-green/80" : "bg-accent-red/70"}`}
            style={{
              top: thumbTop,
              height: "20%",
            }}
          />
        </div>
      </div>
    </motion.div>
  );
}
