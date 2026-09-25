"use client";

import { motion } from "framer-motion";
import { site } from "@/data/profile";

export function Contact() {
  return (
    <section id="contact" className="relative border-t border-border py-24 lg:py-32">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-border-strong bg-gradient-to-br from-ink-elevated via-ink-muted to-ink-elevated p-10 sm:p-14 lg:p-16">
          <div
            className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-accent/10 blur-[80px]"
            aria-hidden
          />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative grid gap-12 lg:grid-cols-2 lg:items-center"
          >
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.25em] text-accent">
                Contact
              </p>
              <h2 className="mt-4 font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight sm:text-4xl">
                Let&apos;s build something durable
              </h2>
              <p className="mt-4 max-w-md text-text-muted">
                Open to conversations on technical leadership, platform engineering,
                and AI-enabled enterprise products.
              </p>
            </div>
            <ul className="space-y-4">
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="group flex items-center justify-between rounded-xl border border-border bg-frost px-6 py-4 transition-colors hover:border-accent/40"
                >
                  <span className="text-sm text-text-muted">Email</span>
                  <span className="text-sm font-medium text-text group-hover:text-accent">
                    {site.email}
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={`tel:${site.phone.replace(/\s/g, "")}`}
                  className="group flex items-center justify-between rounded-xl border border-border bg-frost px-6 py-4 transition-colors hover:border-accent/40"
                >
                  <span className="text-sm text-text-muted">Phone</span>
                  <span className="text-sm font-medium text-text group-hover:text-accent">
                    {site.phone}
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={site.linkedIn}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between rounded-xl border border-accent/20 bg-accent/5 px-6 py-4 transition-colors hover:border-accent/50 hover:bg-accent/10"
                >
                  <span className="text-sm text-text-muted">LinkedIn</span>
                  <span className="text-sm font-medium text-accent">
                    Connect ↗
                  </span>
                </a>
              </li>
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 text-center sm:flex-row sm:text-left lg:px-8">
        <p className="text-sm text-text-muted">
          © {year} {site.name}. Crafted with Next.js.
        </p>
        <p className="text-xs uppercase tracking-[0.2em] text-text-muted/70">
          Enterprise meets edgy
        </p>
      </div>
    </footer>
  );
}
