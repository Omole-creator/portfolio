# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A personal portfolio for Omole Usuangbon (founder and growth operator), built with
Next.js App Router, TypeScript, Tailwind, and Framer Motion. It is a multi-page site:
the home route (`app/page.tsx`) stacks section components, and there are dedicated
`/work`, `/about`, and `/contact` routes that reuse those same section components.

## Commands

```bash
npm run dev          # dev server on http://localhost:3000
npm run build        # production build (also type-checks)
npm run start        # serve the production build
npm run test:e2e     # Playwright checks (auto-starts dev server via webServer config)

npx playwright install chromium          # one-time, before first test run
npx playwright test tests/e2e.spec.ts:11 # run a single test by file:line
npx playwright test -g "no horizontal"   # run tests matching a title
```

Do NOT run `npm run build` while `npm run dev` is running. The build overwrites
`.next` and corrupts the live dev server's manifest (it starts returning 500s). If
that happens: stop the dev process, `rm -rf .next`, and restart `npm run dev`.

## Architecture

- **`lib/content.ts` is the single source of truth for all copy and data.** Every
  headline, paragraph, metric, case study, tag, link, and contact detail lives here.
  Components are presentational and read from it. To change wording or links, edit
  this file, not the components.
- **`app/page.tsx`** composes the sections in order: Hero, ProofBar, About, Services,
  CaseStudies, Recognition, Contact, Footer. Section `id`s (`#about`, `#services`,
  `#work`, `#recognition`, `#contact`) back the nav anchors.
- **`components/Reveal.tsx`** wraps content in a Framer Motion `whileInView` fade-up
  and is used throughout. Consequence: content starts at opacity 0 and only appears
  once scrolled into view. It calls `useReducedMotion` and renders a plain `div` (no
  animation) when reduced motion is requested. Note for screenshotting: a full-page
  capture that does not actually scroll will show below-the-fold sections as blank,
  because the reveal never triggers. Scroll through the page first (see
  `scripts/shots.mjs`).
- **`components/BrowserFrame.tsx`** is the signature element: it renders a product
  screenshot inside a fake browser chrome with the live URL and a green "live" dot.
  The case-study images are passed through it.
- **Design tokens** live in `tailwind.config.ts` (`navy`, `gold`, `ink`, `paper`,
  `muted`, `line`) and are the only approved colors. Fonts are Space Grotesk
  (display) and Inter (body), loaded via `next/font` in `app/layout.tsx` and exposed
  as `font-display` / `font-body`. Page metadata is derived from `site` in `content.ts`.
- **Analytics** is Google Tag Manager, container `GTM-MCXFF99P`, wired in
  `app/layout.tsx` through the official `GoogleTagManager` component from
  `@next/third-parties/google`. That component only emits the loader script, so the
  `<noscript>` iframe from Google's install snippet is written by hand as the first
  child of `<body>`. Keep `@next/third-parties` on the same major version as `next`.
  Everything else (the GA4 tag and its measurement ID, triggers, custom events) is
  configured in the GTM web UI, not in this repo. Because client-side navigation
  between `/`, `/work`, `/about`, and `/contact` never reloads the page, the page-view
  trigger in GTM has to be **History Change** or only the first load gets counted.

## Screenshots and sensitive data

- Product screenshots contain real, sensitive figures (revenue, profit, lead counts).
  **`scripts/process-screenshots.py`** (Pillow) blurs every number, crops the browser
  chrome / taskbar / watermark, and exports web WebP into `public/images/`. Region
  coordinates in that script are in a displayed 2000px space and scaled to the real
  2560px image via `SCALE`; when adjusting, re-run and visually verify no number is
  legible. The public sales page (`sales-toolkit`) intentionally keeps its public
  marketing headline. The GluFloat shots (`glufloat-check`, `glufloat-joy`) and the
  WaterBrooks shots (`waterbrooks-hero`, `waterbrooks-traction`) are public marketing
  sites too, so they carry no number-redaction regions: the script only crops the
  browser chrome / taskbar and covers the "Activate Windows" watermark. WaterBrooks
  keeps its public traction figures on purpose.
- **`source-materials/` is gitignored and must stay out of git.** It holds the raw
  unblurred screenshots, the CV, and the original photo. The GitHub repo is public,
  so leaking these would expose the numbers the site redacts. Only the redacted
  `public/images/*.webp` belong in version control.

## Copy style (enforced)

Write the way people talk: simple, warm, full sentences with natural rhythm. No
abrupt clipped fragments that read as AI, and no em dashes anywhere in copy.
