"use client";

import { motion } from "framer-motion";
import { career } from "@/data/profile";

export function Journey() {
  return (
    <section id="journey" className="relative border-t border-border bg-ink-elevated/40 py-24 lg:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,229,199,0.04),transparent_70%)]" />
      <div className="relative mx-auto max-w-6xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl"
        >
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-accent">
            Career journey
          </p>
          <h2 className="mt-4 font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight sm:text-4xl">
            From supply chain roots to global ecommerce leadership
          </h2>
          <p className="mt-4 text-text-muted">
            A timeline of roles that shaped deep domain expertise and technical
            ownership—from junior web development to leading shipping, reporting,
            and compliance platforms.
          </p>
        </motion.div>

        <ol className="relative mt-16 space-y-8 border-l border-border pl-8 sm:pl-10">
          {career.map((role, index) => (
            <motion.li
              key={`${role.company}-${role.role}-${role.period}`}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: index * 0.04 }}
              className="relative"
            >
              <span
                className="absolute -left-[calc(2rem+1px)] top-8 flex h-3 w-3 -translate-x-1/2 rounded-full border-2 border-accent bg-ink shadow-[0_0_12px_var(--color-accent-glow)] sm:-left-[calc(2.5rem+1px)]"
                aria-hidden
              />

              <article className="glass-panel rounded-2xl p-6 transition-all hover:border-accent/25 hover:shadow-[0_0_60px_-20px_var(--color-accent-glow)] sm:p-8">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-accent">
                      {role.period} · {role.duration}
                    </p>
                    <h3 className="mt-2 font-[family-name:var(--font-display)] text-xl font-semibold text-text">
                      {role.role}
                    </h3>
                    <p className="mt-1 text-sm font-medium text-text-muted">
                      {role.company}
                      {role.location ? ` · ${role.location}` : ""}
                    </p>
                  </div>
                </div>
                <ul className="mt-6 space-y-2.5">
                  {role.highlights.map((highlight) => (
                    <li
                      key={highlight.slice(0, 48)}
                      className="flex gap-3 text-sm leading-relaxed text-text-muted"
                    >
                      <span className="mt-2 h-px w-3 shrink-0 bg-accent/60" />
                      {highlight}
                    </li>
                  ))}
                </ul>
              </article>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
