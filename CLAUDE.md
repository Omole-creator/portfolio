# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A personal portfolio for Omole Usuangbon (founder and growth operator), built with
Next.js App Router, TypeScript, Tailwind, and Framer Motion. It is a multi-page site:
the home route (`app/page.tsx`) stacks section components, and there are dedicated
`/work`, `/about`, and `/contact` routes that reuse those same section components.
There is also a blog at `/blog` whose posts live in Supabase rather than in the repo,
plus the `/admin` writing desk that manages them. `/growth` and `/web` are two
separate, self-contained portfolios built for specific pitches rather than the
general "work with me" story the rest of the site tells — see **Audience-specific
portfolios** below before touching either.

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
- **`site.role` ("Founder & Growth Operator") no longer renders anywhere visible.**
  It used to sit under the name in `Nav.tsx`, `Footer.tsx`, and the blog post
  footer in `PostArticle.tsx`; all three were changed to show just `site.name`.
  The field itself is untouched and still feeds the `<title>`/`og:title`/
  `twitter:title` tags in `app/layout.tsx`, since removing it there is a
  separate SEO/browser-tab decision nobody has made yet, not an oversight.
- **Analytics** is Google Tag Manager, container `GTM-MCXFF99P`, wired in
  `app/layout.tsx` through the official `GoogleTagManager` component from
  `@next/third-parties/google`. That component only emits the loader script, so the
  `<noscript>` iframe from Google's install snippet is written by hand as the first
  child of `<body>`. Keep `@next/third-parties` on the same major version as `next`.
  Everything else (the GA4 tag and its measurement ID, triggers, custom events) is
  configured in the GTM web UI, not in this repo. Because client-side navigation
  between `/`, `/work`, `/about`, and `/contact` never reloads the page, the page-view
  trigger in GTM has to be **History Change** or only the first load gets counted.

## Positioning: case studies, services, and who this site is for

The site is deliberately built to read as "work with me," not "hire me." A
few structural decisions carry that intent, so don't undo them without
knowing why they're there:

- **Every case study in `caseStudies` (`lib/content.ts`) has the same shape.**
  There used to be a `featured` flag that gave JobMingle a distinct hero
  treatment; it's gone. All eight entries (JobMingle, GluFloat, JobMingle
  Powerhouse, JobMingle CRM, WaterBrooks Technologies, Sales Objections
  Toolkit, CV Reviewer, and Designs & Konstruct) carry the same required
  fields (`why`, `approach`, `highlights`), so JobMingle and GluFloat read as
  projects like the rest, not as a founder's special story next to a list of
  side work. CV Reviewer and Designs & Konstruct were added later, both
  tagged `"Built with Claude Code"` even though their write-ups don't say so
  explicitly, for consistency with the rest of the list. Designs & Konstruct
  went without an `images` field for a while since no screenshots were
  supplied for it; `designs-konstruct-hero` and `designs-konstruct-traction`
  (raw files `GL.png`, `GL1.png`, following the same pattern as the GluFloat
  and CV Reviewer shots) filled that gap later.
  The old JobMingle Leads product is `name: "JobMingle CRM"` now (slug stays
  `jobmingle-leads`, that's just the URL, it doesn't need to match the
  display name) — "Leads" alone read as an unfinished placeholder name, and
  a middle name of "Pulse" was tried and rejected too, "CRM" is what it
  actually is. Its content is deliberately long and fully unpacked (lead
  capture, round-robin distribution, per-closer dashboards, admin
  monitoring, marketing emails all get their own line) rather than merged
  into fewer, shorter bullets, because condensing it previously read as
  leaving things out. Be precise about what it does: not every lead closes
  ("through to an outcome, won or lost," never "to a closed sale"), and
  attendance is tutors recording which *students* attended a class, visible
  from admin, not attendance of the tutors themselves. Neither JobMingle nor
  GluFloat carries a `"Founder"` tag, on purpose, same reasoning as dropping
  the `featured` flag: they read as projects, not as the one thing Omole
  owns sitting apart from the rest.
- **WaterBrooks had no previous website at all**, don't reintroduce language
  implying there was an old confusing one. What actually happened: two
  different developers were already paid to build the site and never
  delivered, and Omole built the entire thing himself in 24 hours. The
  traction numbers in `results` (200+ farmers, 18 land plots, the accelerator
  backing) all predate the site, they're the founder's achievements that the
  site finally communicates, not outcomes the site produced, so `results`
  is framed around delivery and accurate showcasing, not around the
  farm-level numbers as if the build caused them.
- **Every paragraph field (`why`, `beforeAfter`, `insight`) is a complete
  sentence, never a noun-phrase fragment**, and no single rhetorical shape
  repeats across every case study. An early pass had five of six `insight`
  fields using the identical "X is not really about Y, it's about Z"
  construction and several `beforeAfter.after` fields with no main verb
  ("A dashboard that shows...", not "There is now a dashboard that
  shows...") — both read as machine-generated once you saw the pattern
  across all six back to back. Read new case-study copy against the other
  five before shipping it, not just on its own.
- **Body text inside a case study is all one size** (`components/work/CaseStudyDetail.tsx`
  has no `text-xl` anywhere in the prose sections) — the problem section
  used to render larger than everything else and that inconsistency was
  called out explicitly. Keep every prose section (problem, before/after,
  thinking) at the same base size.
- **`why` is `string[]`, 2-3 real paragraphs, not one line.** Short, flat
  problem statements were tried and rejected as underwhelming, and so was a
  "Picture this..." narrative opener, both read as amateurish. Each one now
  reads as a standard portfolio problem statement: state the problem,
  agitate it (what it actually costs, why it matters, who it affects), then
  bridge into the fix. `components/work/CaseStudyDetail.tsx` renders each
  array entry as its own `<p>`, so there's real white space between them,
  never one dense block.
- **The full detail-page section order is:** hero → first screenshot (if
  any) → The problem (`why`) → How I built it (`approach`) → What changed
  (`beforeAfter`, two flowing paragraphs labeled Before/After inline, not
  boxed side by side the way the reference site does it) → What it does
  (`highlights`) → second screenshot (if any) → The result (`results`,
  quantified outcomes, reusing numbers already established elsewhere on the
  site rather than inventing new ones) → The thinking (`insight`) → Built
  with (`builtWith`, actual tools, distinct from the categorization `tags`
  shown further down). **Screenshots never sit at the bottom** — the first
  one runs right under the hero, the second (when a case study has two)
  runs mid-page after "What it does," so the write-up isn't all text
  followed by images at the end.
- **Each project has its own page at `/work/[slug]`.** This exists because
  clicking a specific project card used to land on the full `/work` list
  regardless of which one was clicked (`WorkTeaser.tsx` linked every card to
  the same `/work` href), which is confusing when you expect to land on the
  one you picked. Now: `components/WorkTeaser.tsx` (homepage teaser) and
  `components/CaseStudies.tsx` (the `/work` index) both link to
  `/work/${study.slug}`, and `app/work/[slug]/page.tsx` +
  `components/work/CaseStudyDetail.tsx` render one project in full: the
  problem (`why`), how it was built (`approach`, numbered), what it does
  (`highlights`), images, and a link to the next project. `CaseStudies.tsx`
  itself only renders lightweight index cards now (thumbnail, kind, blurb,
  tags, a link out), it no longer duplicates the full write-up that now
  lives on the detail page. `ViewTracker` with the same `resourceId` runs on
  the index card, the teaser card, and the detail page, so all three count
  as the same "viewed this project" signal, not three separate ones.
- **`services` (`lib/content.ts`) is named by what a business needs, not by
  what Omole is good at.** Each of the five entries is phrased outcome-first
  ("Getting customers to show up without a big ad budget first") rather than
  skill-first ("Growth and paid acquisition"), while keeping the exact same
  evidence in the body copy.
- **`workTracks` (`lib/content.ts`), shown on `/contact` and on the homepage
  via `WhoThisIsFor`, defines who this site is actually for.** By design it
  favors startups, agencies, SaaS, and ecommerce businesses that already
  have funding, not any startup at any stage, but that filter is
  intentionally never stated outright ("ready to scale" does the work
  instead of "you must have raised"). Don't list specific industries here
  (edtech, healthtech, agritech, etc.), even though Omole has built in all
  three. They fall under "startups" and naming them reads as narrowing the
  pitch rather than broadening it. The first track also says Omole is open
  to advisor and founding-team roles for startups, not just project or
  growth-role work. The third track is a deliberate catch-all for anything
  else, including consulting and speaking engagements, so the page never
  implies a closed list of services.
- **`scripts/process-screenshots.py`** now also produces `jobmingle-hero`
  from a JobMingle marketing screenshot, following the same pattern as the
  GluFloat and WaterBrooks shots: no number-redaction regions (it's a public
  marketing page), just the standard browser-chrome crop and watermark
  cover. The same pattern applies to the GluFloat shots (raw files `glu1.png`,
  `glu2.png`, replacing an earlier pair), the CV Reviewer shots (raw files
  `cv1.png`, `cv2.png`), and the Designs & Konstruct shots (raw files `GL.png`,
  `GL1.png`). `cv.png` (a second CV Reviewer shot, see below) also follows this
  pattern; `fb.png` does not, since it isn't a desktop screenshot to crop — see
  the **Audience-specific portfolios** section above. The raw screenshots this
  script reads from live loose in the repo root by convention (gitignored via
  `/Screenshot*.png`, and via `/cv1.png`, `/cv2.png`, `/glu1.png`, `/glu2.png`,
  `/GL.png`, `/GL1.png`, `/fb.png`, `/cv.png` for the newer ones since they
  don't match that glob), not inside `source-materials/`, even though the
  redacted output goes to `source-materials/redacted/` before being copied
  into `public/images/`.
- **There is no problem-first section.** A `Problem`/"Before we start" section
  (pain points before the fix) was tried and explicitly removed as the most
  useless section on the site. Don't re-add one without being asked.
- **`components/WhoThisIsFor.tsx`, `components/Benefits.tsx`, and
  `components/Contrast.tsx`** are the three homepage sections that replaced
  it. `Benefits` and `Contrast` are also reused on `/services`; `WhoThisIsFor`
  is homepage-only. On `app/page.tsx`, `WhoThisIsFor` sits right before
  `Process`, near the bottom of the page — it ran directly after `WorkTeaser`
  originally and that was too early, deciding who the site is for before the
  reader had seen any proof. `WhoThisIsFor` reuses `workTracks` (the same
  data `/contact` uses) so who the site is for isn't defined twice. `Benefits` (data: `benefits`) is six
  short, evidenced reasons to work with Omole — kept away from anything that
  reads as "I'm cheap/available/understanding of tight budgets," since the
  positioning here is startups with good cash flow, not struggling ones, and
  away from generic-sounding claims like "every decision comes from numbers"
  or a "rotating account manager" line that didn't land. Two rounds of these
  got swapped out; if a benefit line ever feels like it's padding the count
  rather than saying something specific, it's a candidate to replace, not to
  keep for the sake of hitting six. `Contrast` (data: `contrast`, `{ theirs,
  mine }` pairs) is a "most people do X, I do Y" section, kept honest by never
  inventing before/after numbers, only qualitative claims already evidenced
  elsewhere on the site. None of these three use a literal stock heading
  ("Who This Is For", "Benefits", etc.) on purpose, each has its own short,
  human phrase instead ("Good fit", "What you get", "The difference").
- **`components/Process.tsx`** (data: `process`) is still the step-by-step
  "how this works" section, sitting right before `HomeCta`. It's the one
  place on the site that uses numbered markers, because it's an actual
  sequence, not decoration.
- **Section subheads (the `h2` under each eyebrow) are kept short on
  purpose**, a handful of words, not a full sentence. They used to run
  longer ("A company I built, and the products I shipped to run it.") and
  were trimmed ("What I've built.") after explicit feedback that long
  subheads read badly. Keep new ones brief.
- **`services` entries do NOT carry images.** This was tried (reusing
  case-study screenshots like the Sales Objections Toolkit shot) and
  explicitly reverted: case-study screenshots belong to their case study,
  not to an abstract service card. `components/Services.tsx` takes a
  `showHeading` prop (same pattern as `CaseStudies.tsx`) so `/services` can
  supply its own `PageHeader` instead of a duplicate in-section heading.
- **`nav` (`lib/content.ts`) includes a "Services" link to `/services`.**
  `app/services/page.tsx` reuses `Services`, `Benefits`, and `Contrast`.
- **`components/Nav.tsx` is a hamburger menu at every breakpoint, not just
  mobile.** The nav links used to always be visible inline; now they're
  behind a toggle button (top right) that opens a small dropdown. This was a
  deliberate simplification, not a responsive-design default, so don't
  reintroduce an always-visible link list without checking first.
- This positioning work followed a full audit (published as an Artifact
  during the session that did this work, not stored in the repo) that
  compared the site against portfolio.tomidewilliams.com and against the
  "key person of influence" framework (Pitch, Publish, Product, Profile,
  Partnership). Testimonials, partner logos (EvolvateHR, Ternkonnect, Your
  Study Path, Cudose), and press mentions were identified as the remaining
  gaps and are intentionally still not on the site, no source confirmed for
  any of them yet.

## Audience-specific portfolios (`/growth` and `/web`)

Two standalone landing pages, each built for one specific pitch rather than the
general "work with me" story the rest of the site tells. `/growth` targets growth
marketing job applications and gigs. `/web` targets US business owners with an
outdated or missing website, selling web design and development. Both are complete
in themselves: someone can land on either one from a job application or a cold
outreach message and never need to see the rest of the site.

- **Each has its own content file** (`lib/growth-content.ts`, `lib/web-content.ts`),
  separate from `lib/content.ts`, and its own component tree
  (`components/growth/*`, `components/web/*`) that mirrors the shape of the main
  site's components (Hero, About, Services, Work, Contact, Nav, Footer) but never
  imports from `lib/content.ts`. This is deliberate duplication, not an oversight:
  the two pitches need different case studies, different proof, and different
  framing, and keeping them in separate files means editing one can never
  accidentally change the others.
- **Neither page frames Omole as a founder, anywhere.** No "founder," no "my
  company," no "the business I built," no JobMingle ownership language. This
  matters because both pages exist to be sent to people evaluating him for
  someone else's role or project (a growth marketing job, a client's website) —
  founder framing reads as "busy running his own thing," which undercuts the
  pitch. Where a case study is his own venture (JobMingle, GluFloat), the copy
  describes what he *did* ("I ran growth for JobMingle, an edtech platform...",
  "I designed and built GluFloat...") without claiming ownership of the company.
- **`components/SiteChrome.tsx`** (mounted in `app/layout.tsx` in place of a
  plain `<Nav /> {children} <Footer />`) branches by `pathname`: `/growth` gets
  `GrowthNav`/`GrowthFooter`, `/web` gets `WebNav`/`WebFooter`, everything else
  gets the normal `Nav`/`Footer`. This exists so a visitor following a `/growth`
  or `/web` link never lands back on the founder-framed main nav or a case study
  aimed at the other audience — each variant's nav only links to anchors within
  itself (`#work`, `#services`, `#about`, `#contact`), not to `/work`, `/about`,
  etc.
- **`/growth`** covers only the four projects that are actually growth marketing:
  JobMingle (community, content, paid ads, framed as growth work rather than
  founding), JobMingle CRM (marketing ops / lead capture), the Sales Objections
  Toolkit (conversion copywriting), and CV Reviewer (a self-serve lead magnet).
  GluFloat, Powerhouse, WaterBrooks, and Designs & Konstruct are left out on
  purpose — they're product or web-design work, not growth marketing.
- **`GrowthWork.tsx` renders each project as a real case study, not a blurb and
  three bullets.** `GrowthProject` (`lib/growth-content.ts`) carries `why`
  (the problem, 1-2 paragraphs), `approach` (2-3 numbered steps), `results`
  (evidenced outcomes), `insight` (the closing thought), and an `images` array
  (1-2 screenshots) — the same shape as `CaseStudy` in `lib/content.ts`, just
  condensed since four of these live on one scrolling page instead of each
  getting its own route. Section order inside each card mirrors
  `CaseStudyDetail.tsx`: kind + name, first screenshot, "The problem," "How I
  approached it," second screenshot (when there is one), "The result," "The
  thinking," then a link out to the live site. A shorter version (blurb +
  highlights, no proof screenshots) was tried first and reads thin next to the
  main site's actual case studies — don't revert to that shape.
- **`jobmingle-fb-results.webp`** (raw file `fb.png`) is a Meta Ads Manager
  screenshot of JobMingle's campaigns, added as the second image on the
  JobMingle growth-work card. It's the one screenshot that isn't a 2560x1440
  desktop capture, so it doesn't fit `process-screenshots.py`'s shared
  `CROP`/`SCALE`/`WATERMARK` pipeline: `NO_CROP` and `RAW_COORDS` (both in that
  script) skip the crop/watermark step and the displayed-to-real coordinate
  scaling for it specifically, since it's already a tight app-viewport capture
  with real pixel coordinates, not a scaled desktop screenshot. Its Budget,
  Amount spent, and Impressions columns are blurred (real ad spend and reach);
  Results and Cost per result are left legible because they corroborate
  numbers already public elsewhere on the site (16x ROAS, leads under $0.50
  each) rather than reveal anything new.
- **`cv-reviewer-results.webp`** (raw file `cv.png`) is a second CV Reviewer
  screenshot, showing the tool scoring Omole's own resume (87/100), added as
  the second image on the CV Reviewer growth-work card. It's his own CV, not a
  real user's data, so — like `cv-reviewer-score` — it needed no redaction,
  just the standard crop and watermark cover.
- **`/web`** covers the five projects that are actual websites or web apps:
  WaterBrooks Technologies, Designs & Konstruct, the Sales Objections Toolkit,
  GluFloat, and CV Reviewer. JobMingle's own site is deliberately excluded here
  even though it's on the main site and on `/growth` — `lib/content.ts` is
  explicit that "my engineers built the website at jobmingle.co," so claiming it
  as a build credit on a page selling web development would be dishonest.
  WaterBrooks (a full site built in 24 hours after two paid developers never
  delivered) is the strongest proof point on this page and gets reused twice: once
  as a case study, once retold in the About copy ("One business had already paid
  two different developers... neither one delivered"), because it directly
  answers this audience's biggest fear — getting burned again by someone who
  doesn't deliver. A proof-bar metric built around that same "developers who
  failed before me" number was tried and reverted; the approved proof bar
  (`webProof` in `lib/web-content.ts`) is "24 hrs," "5" websites and web apps
  built end to end, and "462" leads generated from one ad campaign — that
  third figure used to be a "9x conversion lift" claim tied to the Sales
  Objections Toolkit, which was fabricated (see the correction below) and
  had to be replaced everywhere it appeared, not just here. `WebWork.tsx`
  renders a plain bordered text card
  instead of a `BrowserFrame` when a project's `image` is absent, rather than
  requiring every entry to have one — this was added for Designs & Konstruct
  before it had a screenshot, and stays as the fallback for any future project
  added without one.
- **`COPYWRITING-PLAYBOOK.md`** (repo root) is a direct-response copywriting
  reference. It's written for long-form sales letters, not hero copy, but its
  house-style rules (Section 0.1: no em dashes, plain spoken language, push every
  line to the truth, cut anything that doesn't answer "so what?") and its
  specificity rule (Section 8: replace vague claims with concrete, oddly specific
  numbers, since round numbers read as made up) are exactly what `/growth` and
  `/web`'s hero and proof-bar copy should be checked against. It's why `/web`'s
  proof bar uses "24 hrs" and "9x" rather than something vaguer.
- **`WebHero.tsx`'s single-word gold highlight ("Customers") carries
  `whitespace-nowrap`** so the browser can never split it mid-word across two
  lines; it just moves to the next line whole if it doesn't fit. `GrowthHero.tsx`
  deliberately does NOT do this for its two-word highlight ("Paying Customers")
  — a `whitespace-nowrap` phrase can only ever move as a rigid two-word block,
  which on phones pushed it onto its own 4th line. Letting it wrap normally
  (each word free to join whichever line it fits on) is what makes "Paying"
  land on the same line as "Strangers Into" instead.
- **`GrowthHero.tsx`'s headline is sized specifically below Tailwind's `sm`
  breakpoint** (`text-[1.62rem]` with `leading-[1.15]`, vs. `sm:text-5xl` and up
  unchanged) so that on phones it holds to exactly 3 lines with "Paying" on the
  same line as "Strangers Into" (not with "Customers"). This exact value was
  found by rendering the headline at many font sizes in a headless browser and
  recording which words landed on which line at each common phone width
  (320/360/375/390/412/428px). The mapping from font size to line breaks is
  not smooth: `1.62rem` is the top of a narrow safe band, and `1.63rem` already
  regresses to 4 lines at 320px. At 320px/360px specifically, even the safe
  band falls back to the old grouping ("Paying Customers" together on line 3
  instead of "Paying" joining line 2) rather than the ideal one — still 3
  lines, just not the exact word split — because no font size in the tested
  range achieves the ideal split at those narrow widths without breaking
  something else. If the headline copy changes, or that 320px/360px fallback
  needs to match too, re-run the same measurement rather than nudging the
  Tailwind class by feel — a "round" size like `text-3xl` or `text-2xl` will
  not reliably land in the safe band.
- **Two factual corrections Omole caught, both now fixed everywhere they
  appeared, not just in the one place they were flagged.** Read these before
  writing new copy about JobMingle CRM or the Sales Objections Toolkit, since
  the wrong version is an easy trap to fall back into by pattern-matching the
  surrounding case-study prose:
  1. **The Meta/Google lead forms were never connected directly to the CRM.**
     A new lead shows up as a notification email first; a Google Apps Script
     Omole wrote watches the inbox and enters that lead into the CRM. Copy
     that said "connected the ad lead forms directly to the CRM" (in
     `lib/content.ts`'s `jobmingle-leads` case study and `growth-content.ts`'s
     `jobmingle-crm` project) was wrong and has been corrected to describe
     the Apps Script / email-triggered mechanism instead.
  2. **No sales letter for the Sales Objections Toolkit was ever tested
     against a control, and none "beat a control by 9x."** That specific
     achievement is real (it happened at Rectixam Herbal Company, a past
     copywriting role — see the CV) but is not connected to any project shown
     on this site, so it was removed everywhere it had been attached to
     featured work: `growthWork`'s `sales-objections-toolkit` entry
     (`approach`/`results`) and `webWork`'s same-slug `blurb` in
     `lib/web-content.ts`, plus the `growthProof` and `webProof` hero-stat
     entries that used "9x" as a proof number. The `services`/`growthServices`
     line "One sales letter I wrote beat the control by nine times" was also
     reworded, since even unattributed to a specific product it read as
     evidence for the case studies sitting next to it — it now credits the
     16x JobMingle result instead, which is both true and actually shown on
     the site.
- **JobMingle's ad spend is written as a core channel, not an afterthought.**
  Earlier drafts had lines like "ran ads only once there was a live cohort to
  fill," which undersold paid acquisition — most growth marketing employers
  weigh Meta/Google ads competency heavily, and burying it behind "community
  first" reads as a weaker paid-ads background than the real one. `why` /
  `approach` / `insight` for the JobMingle project in `growth-content.ts`, and
  the matching `approach` bullet in `lib/content.ts`'s JobMingle case study,
  were reworded to present community and paid ads as one engine running
  together, with ads doing real, direct work — while staying truthful to what
  actually happened (community did come first chronologically). The specific,
  odd number **462 leads from a single Meta Ads campaign** (from the CV) was
  added to `growthProof`, the JobMingle project's `results`, and `growthAbout`
  as concrete evidence of paid-acquisition competence, replacing the retired
  9x claim in the proof bar.
- **`GrowthWork.tsx`'s JobMingle card carries a second image,
  `jobmingle-fb-results.webp`** (raw file `fb.png`, a Meta Ads Manager
  screenshot of JobMingle's campaigns) **and the JobMingle CRM card's images
  were replaced with `jobmingle-crm-overview.webp` / `jobmingle-crm-pipeline.webp`**
  (raw files `crm.png`, `crm1.png`, a fresh/empty cohort dashboard and its
  charts), swapped in for the old `leads-overview.webp` reference. All three
  are shown **fully unredacted, at Omole's explicit request** — this
  overrides the general "blur sensitive figures" rule elsewhere in this file
  for these three images specifically. `fb.png`'s Budget/Amount
  spent/Impressions columns were blurred in an earlier pass and then
  un-blurred again on request; `process-screenshots.py`'s `REGIONS["fb.png"]`
  is `[]`, and the `NO_CROP`/`RAW_COORDS` machinery (fb.png is a tight
  app-viewport capture, not a scaled 2560x1440 desktop screenshot) is kept in
  the script only in case redaction is asked for again later. The main site's
  `jobmingle-leads` case study (`lib/content.ts`) still uses the original,
  redacted `leads-overview.webp`/`leads-report.webp` — only the `/growth`
  JobMingle CRM card's images changed.
- **`GrowthCredentials.tsx`** (new, mounted on `/growth` only) renders
  `growthTechnicalSkills`, `growthSoftSkills`, and `growthCertifications`
  (all `lib/growth-content.ts`), pulled from
  `Omole Usuangbon - Growth Marketing CV.pdf` (raw file at repo root,
  gitignored — the CORE SKILLS list became technical skills, soft skills were
  inferred from the work-experience bullets since the CV has no separate soft
  -skills section, certifications are copied as-is), plus a "Download my CV"
  button (`growthResume`) linking to
  `public/omole-usuangbon-growth-marketing-cv.pdf` — a clean copy of the CV
  committed to `public/` specifically so it is downloadable, unlike the raw
  gitignored copy at the repo root. **The CV download exists on `/growth`
  only, on purpose — not on `/web` and not on the main site.** Don't add it
  elsewhere without being asked.
- **`GrowthDifference.tsx` and `WebDifference.tsx`** are `/growth`- and
  `/web`-specific versions of the main site's `Contrast.tsx` "most people do
  X, I do Y" pattern (data: `growthDifference` / `webDifference`), each with
  its own eyebrow "The difference" and a heading in that same voice ("Most
  growth marketers do one. I do both." / "Most web designers do one. I do
  both."). **`GrowthProcess.tsx`** is a `/growth`-specific version of the main
  site's `Process.tsx` "How this works" 4-step pattern (data: `growthProcess`),
  tailored to a growth-marketing engagement (cost per lead, campaigns,
  pipeline) rather than the main site's general "book a call, I find the
  fastest way in" language. `/web` already had its own process section
  (`WebProcess.tsx`, added earlier) — it didn't need a new one, only the
  Difference section was missing. `app/growth/page.tsx` order is: Hero,
  ToolsMarquee, About, Services, Work, Credentials, Difference, Process,
  Contact. `app/web/page.tsx` order is: Hero, ToolsMarquee, About, Services,
  Work, Difference, Process, Contact.

## The blog

The blog exists to close the "Publish" pillar of Key Person of Influence. Posts are
chapters of one running argument, "how do you grow a startup in Nigeria with no budget
and no engineers", and are meant to assemble into a short book.

- **Posts live in Supabase, not in the repo.** The requirement that drove this is that
  Omole publishes from his phone without a commit or a deploy. A `posts` table holds
  Markdown; `blog-images` is the public storage bucket for cover images.
- **`lib/posts.ts`** is the read layer for the public pages. It uses
  `lib/supabase/public.ts`, a deliberately **cookie-free** client. Reading cookies
  would opt `/blog` into dynamic rendering, and these pages are meant to be static.
  Every function degrades to empty when the Supabase env vars are missing, so the site
  still builds and runs without them.
- **`lib/supabase/server.ts`** is the cookie-aware client, and is only for `/admin`
  and the server actions. `lib/supabase/client.ts` is the browser client, used solely
  for cover image uploads.
- **Publishing is instant without a deploy.** `app/admin/actions.ts` calls
  `revalidatePath` on `/blog`, `/blog/[slug]`, the sitemap and the feed after every
  save, publish or delete. `revalidate = 60` on those routes is only a fallback.
- **Security is row level security, not secrecy.** The anon key is public by design.
  RLS lets anonymous readers see `status = 'published'` rows only, grants writes to
  authenticated users, and (since `supabase/migrations/0002_posts_authenticated_select.sql`)
  grants the authenticated admin session a `USING (true)` SELECT policy so `/admin`
  can see drafts and published posts together. Without that policy, published rows
  silently vanish from the `/admin` list the moment they publish, even though they
  still exist. The service role key is never used anywhere in this codebase. There is
  no signup flow: the single user is created by hand in the Supabase dashboard, so no
  one else can ever get an account.
- **`middleware.ts`** refreshes the session and bounces unauthenticated `/admin/*`
  traffic to `/admin/login`. When the env vars are absent it sends everything to the
  login page, which then explains what is missing instead of crashing.
- **Drafts** are invisible publicly through RLS. `/admin/preview/[slug]` renders them
  with the signed-in session. It is a separate route on purpose: putting preview behind
  a query string on `/blog/[slug]` would have made the public post page dynamic.
- **Never wrap the post body in `Reveal`.** Revealed content sits at opacity 0 until
  scrolled into view, which would hide most of an article from crawlers and from any
  screenshot that does not scroll. `components/blog/PostArticle.tsx` carries this note.
- `@tailwindcss/typography` is the one plugin in `tailwind.config.ts`, added for
  article prose. Its palette is overridden in the `typography` theme block to the
  existing tokens, so posts introduce no new colors.
- Copy for the blog index lives in `blogPage` in `lib/content.ts`, per the usual rule.
  Post content is the deliberate exception, since it lives in the database.

### Environment

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...    # present but unused, see below
```

In `.env.local` locally and in the Vercel project settings. `.gitignore` covers
`.env*`. Cover images are served from Supabase storage, which is why
`next.config.mjs` allows `*.supabase.co` in `images.remotePatterns`.

`SUPABASE_SERVICE_ROLE_KEY` is stored at Omole's request but **no code reads it, and
none should**. It bypasses row level security entirely. If you ever do need it, it must
stay server-side: anything prefixed `NEXT_PUBLIC_` is compiled into the client bundle
and served to every visitor, so that key must never carry the prefix.

The Supabase project is `adwbbllkbbyqcqjrhpsr`, the admin user is
`omoleusuangbon@gmail.com`, and it is the only account.

## Migrations

`supabase/migrations/*.sql` is a version-controlled record of SQL that has been (or
needs to be) applied by hand in the Supabase SQL editor. **Nothing in this repo runs
them automatically** — there is no Supabase CLI wired in. Apply them in order, and
check `supabase/migrations/README.md` for the one-line reminder of that.

## Admin metrics (`/admin/metrics`)

A first-party analytics dashboard, separate from GTM. GTM/GA4 answers marketing
questions in Google's UI; this answers "who looked at what on this site" inside
`/admin`, because that data has to be queryable for the per-project and per-post
breakdowns GA4 doesn't give for free.

- **`analytics_events`** (`supabase/migrations/0001_analytics_events.sql`) is a single
  append-only table: one row per unique `(visitor_id, event_type, resource_id)`. That
  uniqueness constraint is the entire dedup mechanism — a visitor is counted once per
  project, once per blog post, once per CTA, once per page path, for the life of their
  cookie, not once per page load. The day/week/month/quarter/year breakdowns on the
  dashboard are this same log grouped by date, in West Africa Time (`Africa/Lagos`,
  fixed UTC+1) — a visitor's one counted row naturally rolls up into whichever bucket
  it happened in.
- **`app/api/track/route.ts`** is the only writer. It mints a long-lived, `httpOnly`
  visitor cookie (`av_id`) and a first-seen cookie (`av_fs`) on first contact, reads
  Vercel's free edge geolocation headers (`x-vercel-ip-country` etc. — production
  only, absent on `localhost` and off Vercel), parses the user agent locally (no
  dependency), and upserts with `ignoreDuplicates: true` so the DB-level unique
  constraint is what actually enforces the dedup, not application logic.
- **`lib/analytics/track.ts`** is the client-side caller: `track({ event_type,
  resource_id, path })`, fire-and-forget, never throws. Four places call it:
  `components/analytics/PageViewTracker.tsx` (global, mounted in `app/layout.tsx`),
  `ViewTracker.tsx` (wraps case-study cards in `CaseStudies.tsx` and `WorkTeaser.tsx`
  — projects have no dedicated route, so "viewed" means "scrolled into view," the same
  signal `Reveal.tsx` already watches for, via framer-motion's `useInView`),
  `PostViewTracker.tsx` (mounted in `app/blog/[slug]/page.tsx`), and
  `TrackedLink.tsx` (a drop-in `<a>` replacement used everywhere a CTA — email,
  Calendly, LinkedIn, WhatsApp — is rendered: `Contact.tsx`, `Footer.tsx`,
  `PostArticle.tsx`, and `GlowButton.tsx`, which took its own `cta` prop instead since
  it isn't a plain anchor).
- **CTA-to-post attribution is first-touch, not per-page.** Because a CTA click dedupes
  once per visitor for life (not once per visitor per post), the blog performance
  table's "conversions" column means "whichever post this visitor was on the first
  time they ever clicked that CTA," using the click event's `path` column. A visitor
  who reads post A without clicking, then later clicks from post B, counts toward B.
- **`lib/analytics/queries.ts`** does the aggregation in TypeScript, not SQL. Supabase's
  PostgREST client has no way to run `date_trunc`/`AT TIME ZONE` — the alternative was
  Postgres RPC functions, which would mean yet more manual SQL to paste into the
  dashboard. Instead it fetches the event log (capped at 50,000 rows — fine for a
  personal portfolio for a long time) and buckets/ranks it in memory.
- **No charting library.** The dashboard's bars (`components/admin/charts/`) are hand
  -rolled inline SVG/CSS, matching how everything else visual in this repo
  (`BrowserFrame`, `GlowButton`, `ScrollCard`) is bespoke rather than pulled from a UI
  kit. Swap in a real charting library later only if richer interaction is needed.
- **Known gaps, by design, not bugs**: country/region reads "Unknown" on `localhost`
  (Vercel-only headers); ad blockers that blocklist `/track`-like paths will
  undercount; the two tracking cookies are long-lived and server-set, which plausibly
  needs a consent flow for EU/UK visitors that this feature does not include; "new vs
  returning" means "a known visitor found a new resource," not "came back to browse
  again," since a genuine repeat view of an already-seen page produces no new row.

## Screenshots and sensitive data

- Product screenshots contain real, sensitive figures (revenue, profit, lead counts).
  **`scripts/process-screenshots.py`** (Pillow) blurs every number, crops the browser
  chrome / taskbar / watermark, and exports web WebP into `public/images/`. Region
  coordinates in that script are in a displayed 2000px space and scaled to the real
  2560px image via `SCALE`; when adjusting, re-run and visually verify no number is
  legible. The public sales page (`sales-toolkit`) intentionally keeps its public
  marketing headline. The GluFloat shots (`glufloat-hero`, `glufloat-today`), the
  WaterBrooks shots (`waterbrooks-hero`, `waterbrooks-traction`), the CV Reviewer
  shots (`cv-reviewer-hero`, `cv-reviewer-score`), and the Designs & Konstruct shots
  (`designs-konstruct-hero`, `designs-konstruct-traction`, raw files `GL.png`,
  `GL1.png`) are public marketing/demo pages too, so they carry no number-redaction
  regions: the script only crops the browser chrome / taskbar and covers the
  "Activate Windows" watermark. CV Reviewer's score-card shot shows a sample audit
  result (85/100), not a real user's data, so it needed no redaction either.
  WaterBrooks and Designs & Konstruct keep their public traction figures on purpose.
  `cv-reviewer-results` (raw file `cv.png`, Omole's own CV run through the tool)
  is the same "not a real user's data" case. `jobmingle-fb-results` (raw file
  `fb.png`) and `jobmingle-crm-overview`/`jobmingle-crm-pipeline` (raw files
  `crm.png`, `crm1.png`) are the exception to the "blur sensitive figures"
  rule at the top of this section — all three carry real ad-spend and
  pipeline numbers and are shown unredacted anyway, at Omole's explicit
  request. See **Audience-specific portfolios** above for the full story on
  why and where each is used.
- **`source-materials/` is gitignored and must stay out of git.** It holds the raw
  unblurred screenshots, the CV, and the original photo. The GitHub repo is public,
  so leaking these would expose the numbers the site redacts. Only the redacted
  `public/images/*.webp` belong in version control.

## Copy style (enforced)

Write the way people talk: simple, warm, full sentences with natural rhythm. No
abrupt clipped fragments that read as AI, and no em dashes anywhere in copy. Avoid
the word "real" and other AI-sounding filler generally, and don't reach for a stock
heading label (like "Use Cases" or "What I Build") when a plainer phrase says the
same thing.
