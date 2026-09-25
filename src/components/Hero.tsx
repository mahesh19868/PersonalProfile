"use client";

import { motion } from "framer-motion";
import { site, skills } from "@/data/profile";

const stagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.15 },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function Hero() {
  return (
    <section className="relative min-h-[92vh] overflow-hidden pt-24">
      <div className="pointer-events-none absolute inset-0 grid-lines opacity-60" />
      <div className="pointer-events-none absolute -right-32 top-32 h-96 w-96 rounded-full bg-accent/10 blur-[120px] animate-pulse-glow" />
      <div className="pointer-events-none absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-warm/10 blur-[100px]" />

      <div className="relative mx-auto max-w-6xl px-6 pb-20 lg:px-8 lg:pb-28">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="max-w-4xl"
        >
          <motion.p
            variants={item}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-frost px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-text-muted"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_12px_var(--color-accent-glow)]" />
            Enterprise engineering · AI-ready
          </motion.p>

          <motion.h1
            variants={item}
            className="font-[family-name:var(--font-display)] text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-7xl"
          >
            <span className="block text-text">{site.name.split(" ")[0]}</span>
            <span className="mt-1 block text-gradient">
              {site.name.split(" ").slice(1).join(" ")}
            </span>
          </motion.h1>

          <motion.p variants={item} className="mt-8 max-w-2xl text-lg leading-relaxed text-text-muted sm:text-xl">
            {site.title} at{" "}
            <span className="text-text">{site.company}</span>
            —{site.yearsExperience} years building resilient platforms for ecommerce,
            insurance, and supply chain at global scale.
          </motion.p>

          <motion.div variants={item} className="mt-10 flex flex-wrap gap-4">
            <a
              href="#journey"
              className="group inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3.5 text-sm font-semibold text-ink transition-all hover:shadow-[0_0_40px_var(--color-accent-glow)]"
            >
              View career journey
              <span className="transition-transform group-hover:translate-x-0.5">→</span>
            </a>
            <a
              href="#portfolio"
              className="inline-flex items-center gap-2 rounded-lg border border-border-strong px-6 py-3.5 text-sm font-medium text-text transition-colors hover:border-accent/40 hover:text-accent"
            >
              Portfolio
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="mt-16 border-t border-border pt-10"
        >
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.25em] text-text-muted">
            Core capabilities
          </p>
          <ul className="flex flex-wrap gap-2">
            {skills.slice(0, 8).map((skill) => (
              <li
                key={skill}
                className="rounded-md border border-border bg-ink-elevated/80 px-3 py-1.5 text-xs text-text-muted transition-colors hover:border-accent/30 hover:text-text"
              >
                {skill}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
