"use client";

import { motion } from "framer-motion";
import { portfolioLinks } from "@/data/profile";

export function Portfolio() {
  return (
    <section id="portfolio" className="relative border-t border-border py-24 lg:py-32">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between"
        >
          <div className="max-w-xl">
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-accent">
              Portfolio
            </p>
            <h2 className="mt-4 font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight sm:text-4xl">
              Work samples, reserved for what&apos;s next
            </h2>
            <p className="mt-4 text-text-muted">
              Placeholders for case studies, code, and writing—ready to link when
              you publish.
            </p>
          </div>
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-warm/30 bg-warm/10 px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-warm">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-warm" />
            In preparation
          </span>
        </motion.div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {portfolioLinks.map((link, index) => (
            <motion.article
              key={link.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-ink-muted/50 p-8 transition-all hover:border-accent/30"
            >
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <p className="text-xs font-medium uppercase tracking-wider text-text-muted">
                {link.status === "coming-soon" ? "Coming soon" : "Live"}
              </p>
              <h3 className="relative mt-3 font-[family-name:var(--font-display)] text-xl font-semibold text-text">
                {link.title}
              </h3>
              <p className="relative mt-3 flex-1 text-sm leading-relaxed text-text-muted">
                {link.description}
              </p>
              <span
                className="relative mt-8 inline-flex items-center gap-2 text-sm font-medium text-text-muted"
                aria-disabled
              >
                Link pending
                <span className="opacity-40">↗</span>
              </span>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
