"use client";

import { motion } from "framer-motion";
import { education, site, skills } from "@/data/profile";

export function About() {
  return (
    <section id="about" className="relative border-t border-border py-24 lg:py-32">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-4"
          >
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-accent">
              About
            </p>
            <h2 className="mt-4 font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight sm:text-4xl">
              Builder at the intersection of scale and precision
            </h2>
            <div className="accent-line mt-8 w-24" />
            <p className="mt-6 text-sm text-text-muted">{site.location}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-8"
          >
            <p className="text-lg leading-relaxed text-text-muted">{site.summary}</p>

            <div className="mt-12 grid gap-6 sm:grid-cols-3">
              {[
                { label: "Experience", value: `${site.yearsExperience}+ yrs` },
                { label: "Focus", value: "Backend & APIs" },
                { label: "Domains", value: "Ecom · Insure · SCM" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="glass-panel rounded-xl p-6 transition-colors hover:border-accent/20"
                >
                  <p className="text-xs uppercase tracking-wider text-text-muted">
                    {stat.label}
                  </p>
                  <p className="mt-2 font-[family-name:var(--font-display)] text-2xl font-semibold text-text">
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-12">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-text">
                Technical stack & leadership
              </h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <li
                    key={skill}
                    className="rounded-full border border-border px-4 py-1.5 text-sm text-text-muted"
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-12 border-t border-border pt-10">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-text">
                Education
              </h3>
              <ul className="mt-6 space-y-4">
                {education.map((edu) => (
                  <li
                    key={edu.school + edu.period}
                    className="flex flex-col justify-between gap-1 sm:flex-row sm:items-baseline"
                  >
                    <div>
                      <p className="font-medium text-text">{edu.school}</p>
                      <p className="text-sm text-text-muted">{edu.degree}</p>
                    </div>
                    <p className="text-sm tabular-nums text-text-muted">{edu.period}</p>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
