# Code review — SITE portfolio and Digital Twin

**Scope:** Full source review of the Next.js app (pages, components, Digital Twin API, styling, config).  
**Method:** Static reading of application code. No code was changed for this review.  
**Date:** 25 September 2026

---

## Summary

The project is a coherent single-page portfolio: content lives in one data module, the UI is split into readable sections, and the OpenAI key stays on the server. That structure is the right foundation.

It is **not ready to publish as a public site with the chat endpoint left open**. The Digital Twin route has no authentication or rate limiting, so anyone who can reach the server can spend the OpenAI account’s credits and steer the model with a forged conversation. A few accessibility and content-fidelity gaps should be fixed before treating the site as production-quality.

| Severity | Count | Meaning |
|----------|------:|---------|
| High | 2 | Fix before exposing the site on the internet |
| Medium | 5 | Fix soon; they affect cost, UX, or correctness |
| Low | 6 | Worth doing; not blockers for local use |

---

## What is in good shape

- **Secrets stay server-side.** `OPENAI_API_KEY` is read only in `src/app/api/chat/route.ts`. `.env` is listed in `.gitignore`. The browser talks to `/api/chat`, not to OpenAI directly.
- **Input checks on the API.** Messages are limited (last 20, 4,000 characters each), roles are restricted to `user` and `assistant`, and the last turn must be from the user. A missing key, bad JSON, and empty replies return explicit HTTP errors.
- **Single source of career facts.** `src/data/profile.ts` feeds both the page and `buildDigitalTwinSystemPrompt()`, so the site and the model are less likely to drift apart.
- **React text rendering.** Chat bubbles render `m.content` as text, not HTML, so model output is not injected as markup.
- **Clear UI split.** `page.tsx` only composes sections. Client components are marked `"use client"` where animation or state is required.
- **Reduced-motion handling** in `globals.css` respects `prefers-reduced-motion`.
- **External links** to LinkedIn use `rel="noopener noreferrer"`.

---

## Findings

### High

#### 1. Public chat endpoint can drain the OpenAI account

**Where:** `src/app/api/chat/route.ts`

`POST /api/chat` accepts any caller. There is no API key for visitors, no session, no CAPTCHA, and no per-IP rate limit. Each call uses model `gpt-5.2` and resends the full system prompt plus history (`max_completion_tokens: 1024`).

**Impact:** A script can loop requests and exhaust credits or hit billing limits. This was already visible in local testing (HTTP 429, “no credits remaining”). On a deployed URL the same endpoint is reachable from the internet.

**Remedial actions:**

1. Add rate limiting (for example per IP, a small daily cap) before calling OpenAI.
2. Keep the route off the public internet until that exists, or put it behind a login / shared secret if the chat is only for you.
3. Set a hard monthly budget and usage alerts in the OpenAI dashboard.
4. Optionally use a cheaper model for short questions and reserve `gpt-5.2` for longer ones.

#### 2. Clients can forge assistant history (prompt injection and extra cost)

**Where:** `src/app/api/chat/route.ts` (the handler trusts `body.messages`)

The browser sends the whole transcript, including prior `assistant` turns. The server does not store the conversation, so it cannot tell a real reply from one the caller invented. An attacker can POST a long fake dialogue that overrides the system prompt’s rules (“ignore ground truth…”) and then ask for something the Digital Twin should refuse.

**Impact:** Answers can leave the career facts you supplied. Forged long histories also increase token cost on every request.

**Remedial actions:**

1. Prefer a server-side session: the client sends only the new user message; the server appends it to a conversation it owns.
2. If you keep a stateless API, accept **only** `role: "user"` from the client and ignore client-supplied `assistant` messages.
3. Keep the existing system prompt rules, and add a short refusal path when the question is clearly off-topic — but do not rely on the prompt alone.

---

### Medium

#### 3. OpenAI error text can be returned to the browser

**Where:** `src/app/api/chat/route.ts` (non-401 / non-429 `OpenAI.APIError` branch)

401 and 429 responses are rewritten into safe messages. Other API errors return `err.message` in JSON. Provider messages sometimes include request IDs, model names, or account hints.

**Remedial action:** Log the full error on the server (`console.error` is already there). Return a generic message to the client for every unexpected OpenAI failure. Keep specific copy only for the cases you have already mapped (missing key, billing, invalid key).

#### 4. Chat UI does not trap focus or close on Escape

**Where:** `src/components/DigitalTwinChat.tsx`

The modal sets `role="dialog"` and `aria-modal="true"`, but:

- There is no listener for the Escape key.
- Focus is not trapped inside the dialog, so Tab can move to the page behind the overlay.
- Focus is not returned to the button that opened the chat.
- The loading indicator’s `aria-live` sits on a span that is not an assertive/polite live region on the message list itself, so screen readers may miss new replies.

**Remedial actions:**

1. On `keydown` Escape, call `setOpen(false)`.
2. Trap Tab within the dialog while it is open, and restore focus on close.
3. Mark the message list with `aria-live="polite"` so new assistant text is announced.
4. Associate the textarea with a visible or `aria-label` (“Message”).

#### 5. Fixed header covers in-page targets

**Where:** `src/components/Header.tsx` (fixed `h-16`); section ids in About, Journey, Portfolio, Contact

Only the Digital Twin section sets `scroll-mt-24`. Links such as `#about` and `#journey` scroll the heading under the fixed header, so the title is partly or fully hidden.

**Remedial action:** Add `scroll-mt-24` (or equivalent padding) to every section that has an `id` used in `navItems` and the hero buttons (`about`, `journey`, `portfolio`, `contact`, `twin`).

#### 6. Portfolio data is not wired to the UI

**Where:** `src/data/profile.ts` (`href` on each item); `src/components/Portfolio.tsx`

Each portfolio entry has an `href`, but the component always renders a non-interactive “Link pending” span and never reads `href`. Setting a real URL later will not change the page. `aria-disabled` on a `span` also does not communicate a disabled control to assistive tech.

**Remedial action:** If `status` is live and `href` is a real URL, render an `<a>`. If it is coming soon, render plain text without `aria-disabled`, or use a `<button disabled>` with an explanation.

#### 7. Career list keys can collide

**Where:** `src/components/Journey.tsx`

Highlight keys are `highlight.slice(0, 48)`. Two bullets that share the same first 48 characters will produce duplicate React keys and can mis-update the list.

**Remedial action:** Key with the role id plus the highlight index, for example `` `${role.period}-${index}` ``, or store a stable `id` on each highlight in `profile.ts`.

---

### Low

#### 8. Overlapping sends are only partly guarded

**Where:** `src/components/DigitalTwinChat.tsx` (`sendMessage`)

`if (!trimmed || loading) return` uses React state. Two clicks in the same tick (or Enter plus a starter chip) can both pass the check before `setLoading(true)` is applied. The later `setMessages` can also drop a reply if responses return out of order, because each success appends to `prev` without tying the reply to the request that started it.

**Remedial action:** Guard with a `useRef` inflight flag, and ignore or abort the previous `fetch` (`AbortController`) when a new send starts.

#### 9. Mobile menu stays open after navigation

**Where:** `src/components/Header.tsx` (`<details>`)

Choosing a section does not close the menu. The logo uses `href="#"`, which adds a hash and does not reliably scroll to the top of a long page.

**Remedial action:** Close the `<details>` on link click (controlled state, or `details` ref `.open = false`). Point the logo at `#` only after `scrollTo`, or use `href="/"` / a button that scrolls to `0`.

#### 10. Footer year is computed in a client component

**Where:** `src/components/Contact.tsx` (`Footer`)

`new Date().getFullYear()` runs during server render and again in the browser. Around New Year, or if server and browser time zones disagree on the date, React can warn about a hydration mismatch.

**Remedial action:** Move `Footer` to a Server Component, or pass the year in from the server page.

#### 11. Hero hides part of the skill list without saying so

**Where:** `src/components/Hero.tsx` (`skills.slice(0, 8)`)

About shows every skill. The hero shows eight. That is a design choice, but “OpenAI & LangChain” and “GST & E-Invoicing” are easy to miss on the first screen even though they are in the data file.

**Remedial action:** Show all skills, or add a “+2” chip that jumps to `#about`.

#### 12. LinkedIn career was shortened in data

**Where:** `src/data/profile.ts` compared with `LinkedInProfile.pdf`

The PDF also lists **Venus Electronics and Services** (junior developer, 2009) and a duplicate education line that was correctly collapsed. The short Venus Labs role is present; Venus Electronics is not. The Digital Twin will say it does not know that role.

**Remedial action:** Add the missing role if you want the twin and timeline to match the PDF, or note in the prompt that pre-2010 contract work may be omitted.

#### 13. Naming and package metadata

**Where:** `package.json` (`"name": "mahesh-portfolio"`)

The public name on the site is Subramaniam Ananthakrishnan. The npm package name does not match. Harmless locally; confusing if the repo is shared.

**Remedial action:** Rename the package to something like `subramaniam-portfolio` when you next touch `package.json`. Do not commit `.env`.

---

## Security and privacy notes

| Topic | Assessment |
|-------|------------|
| API key in the client bundle | Not present. Good. |
| Email and phone on the page | Intentional contact details. They are also copied into the system prompt, so every chat sends them to OpenAI. |
| Home address from the PDF | Not placed on the site. Good. |
| Chat storage | Only in browser memory. Refresh clears it. Still, message text is sent to OpenAI. |
| XSS via model output | Low risk while content is rendered as React text. Do not switch bubbles to `dangerouslySetInnerHTML`. |
| Dependency advisories | `npm install` previously reported two vulnerabilities (one moderate, one high). Re-run `npm audit` and upgrade within semver if the advisory applies to how you run the app. Do not use `npm audit fix --force` blindly. |

**Remedial action for privacy:** Add one sentence near the chat (“Questions are sent to OpenAI to generate a reply and are not stored on this site.”). Consider omitting phone number from the system prompt if the page already shows it.

---

## Accessibility

| Item | Status |
|------|--------|
| Skip link | Present (`Skip to content` → `#about`). |
| Landmark | `<main>` and `<footer>` exist. Header is a `<header>`. |
| Dialog | Incomplete (see finding 4). |
| Color | Cyan on near-black buttons is strong. Muted body text (`#9aa3b5` on `#0a0c10`) is likely acceptable but should be checked with a contrast tool on glass panels, where the background is lighter and blurrier. |
| Motion | Global reduced-motion override exists. Framer Motion `whileInView` still runs; under reduced motion the CSS override is very aggressive (`animation-duration: 0.01ms !important`), which is acceptable but can make transitions feel broken rather than simply still. |
| Keyboard | Chat send works with Enter. Shift+Enter inserts a newline. Good. |

---

## Maintainability

- **No automated tests.** There is no unit test for `buildDigitalTwinSystemPrompt()` and no browser test that the home page renders. A regression in the prompt or the route would only show up manually.
- **No CI.** `npm run build` is the only gate, and it is manual.
- **`next.config.ts` is empty.** Fine for now. Security headers (`Referrer-Policy`, `X-Content-Type-Options`, a tight `Content-Security-Policy`) are absent and matter once the site is hosted.
- **Almost every section is a client component** because of Framer Motion. That ships more JavaScript than a mostly static page needs. Acceptable at this size; if you add pages, keep static sections as Server Components and isolate motion.

**Remedial actions:**

1. Add a small test that the system prompt contains the current company and does not throw.
2. Add a Playwright (or similar) check: home page title, open chat, close chat.
3. Run `npm run build` in CI on each push.

---

## Digital Twin behavior

The prompt in `src/lib/digital-twin-context.ts` is specific: first person, ground truth only, no invented employers, redirect off-topic questions. That matches the product goal.

Residual risks that code cannot fully remove:

- The model can still hallucinate. The prompt reduces that; it does not eliminate it.
- Jailbreak text in the user message can still pull the model off the script (worse when combined with finding 2).
- `temperature: 0.4` is set. Some future model snapshots reject non-default `temperature`. If calls start failing with a parameter error, drop `temperature` or set only the fields that model documents.

There is no streaming. The UI waits for the full completion. That is correct, just slower than token streaming.

---

## Suggested fix order

1. Rate-limit and stop trusting client-supplied assistant messages (findings 1 and 2).
2. Stop returning raw provider errors (finding 3).
3. Dialog keyboard and focus behavior (finding 4).
4. `scroll-mt` on all anchored sections (finding 5).
5. Honor portfolio `href` when you have real links (finding 6).
6. Stable list keys, send-in-flight guard, mobile menu, footer year (findings 7–10).
7. Tests, audit, privacy line, optional missing 2009 role (findings 11–13 and the maintainability list).

Local use on your machine, with the dev server not exposed, is reasonable **after** you accept that a leaked or forwarded `localhost` URL is not the risk — a **deployed** `/api/chat` without the first two fixes is.

---

## Files reviewed

- `src/app/layout.tsx`, `page.tsx`, `globals.css`
- `src/app/api/chat/route.ts`
- `src/lib/digital-twin-context.ts`
- `src/data/profile.ts`
- `src/components/Header.tsx`, `Hero.tsx`, `About.tsx`, `Journey.tsx`, `Portfolio.tsx`, `Contact.tsx`, `DigitalTwinChat.tsx`, `ScrollProgress.tsx`
- `package.json`, `next.config.ts`, `tsconfig.json`, `.gitignore`

No application code was modified as part of this review.
