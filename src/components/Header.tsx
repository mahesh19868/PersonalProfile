"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { navItems, site } from "@/data/profile";

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-border bg-ink/80 backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 lg:px-8">
        <a
          href="#"
          className="group flex items-center gap-2 font-[family-name:var(--font-display)] text-sm font-semibold tracking-tight text-text"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-md border border-border-strong bg-frost text-xs text-accent transition-colors group-hover:border-accent/40">
            SA
          </span>
          <span className="hidden sm:inline">{site.shortName}</span>
        </a>
        <div className="flex items-center gap-3 sm:gap-6">
          <nav className="flex items-center gap-4 md:gap-8" aria-label="Primary">
          <div className="hidden items-center gap-8 md:flex">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm text-text-muted transition-colors hover:text-accent"
              >
                {item.label}
              </a>
            ))}
          </div>
          <details className="relative md:hidden">
            <summary className="cursor-pointer list-none rounded-md border border-border px-3 py-2 text-xs font-medium uppercase tracking-wider text-text-muted marker:content-none">
              Menu
            </summary>
            <div className="absolute right-0 top-full z-50 mt-2 min-w-[10rem] rounded-xl border border-border bg-ink-elevated p-2 shadow-xl">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="block rounded-lg px-3 py-2 text-sm text-text-muted hover:bg-frost hover:text-accent"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </details>
          </nav>
          <motion.a
          href={site.linkedIn}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="rounded-full border border-accent/30 bg-accent/10 px-4 py-2 text-xs font-medium uppercase tracking-wider text-accent transition-colors hover:bg-accent/20"
        >
          LinkedIn
          </motion.a>
        </div>
      </div>
    </header>
  );
}
