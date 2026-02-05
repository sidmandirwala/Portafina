"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "./ThemeProvider";

const navLinks = [
  { label: "Experience", href: "#experience" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Connect", href: "#connect" },
];

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative flex h-9 w-9 items-center justify-center rounded-full border border-card-border bg-card transition-colors duration-300 hover:border-muted/60"
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      <AnimatePresence mode="wait" initial={false}>
        {theme === "dark" ? (
          <motion.svg
            key="sun"
            initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.25 }}
            className="h-4 w-4 text-amber-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2}
          >
            <circle cx="12" cy="12" r="5" />
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
          </motion.svg>
        ) : (
          <motion.svg
            key="moon"
            initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.25 }}
            className="h-4 w-4 text-slate-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2}
          >
            <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
          </motion.svg>
        )}
      </AnimatePresence>
    </button>
  );
}

export default function Navbar() {
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    window.history.scrollRestoration = "auto";
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < 100) {
        setVisible(true);
      } else if (currentScrollY > lastScrollY) {
        setVisible(false);
        setMobileOpen(false);
      } else {
        setVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const href = e.currentTarget.getAttribute("href");
    if (href) {
      const target = document.querySelector(href);
      target?.scrollIntoView({ behavior: "smooth" });
    }
    setMobileOpen(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="fixed top-0 left-0 right-0 z-50 border-b border-card-border bg-background/80 backdrop-blur-md"
        >
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <a
              href="#home"
              onClick={handleNavClick}
              className="font-heading text-lg font-bold tracking-tight text-foreground lg:text-xl"
            >
              SM<span className="text-accent-red">.</span>
            </a>

            <div className="hidden items-center gap-8 md:flex">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm text-muted transition-colors duration-200 hover:text-foreground lg:text-base"
                >
                  {link.label}
                </a>
              ))}
              <ThemeToggle />
            </div>

            <div className="flex items-center gap-3 md:hidden">
              <ThemeToggle />
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="flex flex-col gap-1.5"
                aria-label="Toggle menu"
              >
                <span
                  className={`block h-0.5 w-6 bg-foreground transition-all duration-300 ${mobileOpen ? "translate-y-2 rotate-45" : ""}`}
                />
                <span
                  className={`block h-0.5 w-6 bg-foreground transition-all duration-300 ${mobileOpen ? "opacity-0" : ""}`}
                />
                <span
                  className={`block h-0.5 w-6 bg-foreground transition-all duration-300 ${mobileOpen ? "-translate-y-2 -rotate-45" : ""}`}
                />
              </button>
            </div>
          </div>

          <AnimatePresence>
            {mobileOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden border-t border-card-border md:hidden"
              >
                <div className="flex flex-col gap-4 px-6 py-4">
                  <a
                    href="#home"
                    onClick={handleNavClick}
                    className="text-sm text-muted transition-colors hover:text-foreground"
                  >
                    Home
                  </a>
                  {navLinks.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={handleNavClick}
                      className="text-sm text-muted transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
