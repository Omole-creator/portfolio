# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A personal portfolio for Omole Usuangbon (founder and growth operator), built with
Next.js App Router, TypeScript, Tailwind, and Framer Motion. It is a multi-page site:
the home route (`app/page.tsx`) stacks section components, and there are dedicated
`/work`, `/about`, and `/contact` routes that reuse those same section components.
There is also a blog at `/blog` whose posts live in Supabase rather than in the repo,
plus the `/admin` writing desk that manages them, and `/admin/jobs`, a daily
job-application machine that matches remote growth/marketing roles Omole (in Nigeria)
is actually eligible for and drafts the application — see **Job application machine**
below. `/growth`, `/web`, and `/marketing` are three separate, self-contained
portfolios built for specific pitches rather than the general "work with me" story the
rest of the site tells — see **Audience-specific portfolios** below before touching
any of them.

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
- **GluFloat's `liveUrl` is `https://glufloat.com`** (its own domain, in both
  `lib/content.ts` and `lib/web-content.ts`), not the `glufloat.vercel.app`
  deployment URL used before the custom domain was set up.
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
  `/GL.png`, `/GL1.png`, `/fb.png`, `/cv.png`, `/crm.png`, `/crm1.png`,
  `/pef1.png`, `/pef2.png` for the newer ones since they don't match that
  glob), not inside `source-materials/`, even though the
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

## Audience-specific portfolios (`/growth`, `/web`, and `/marketing`)

Three standalone landing pages, each built for one specific pitch rather than the
general "work with me" story the rest of the site tells. `/growth` targets growth
marketing job applications and gigs. `/web` targets US business owners with an
outdated or missing website, selling web design and development. `/marketing`
targets creative marketing manager job applications, especially AI-first roles
that want video, social content, and landing pages, not just growth ops. All
three are complete in themselves: someone can land on any one of them from a job
application or a cold outreach message and never need to see the rest of the site.

- **Each has its own content file** (`lib/growth-content.ts`, `lib/web-content.ts`,
  `lib/marketing-content.ts`), separate from `lib/content.ts`, and its own component
  tree (`components/growth/*`, `components/web/*`, `components/marketing/*`) that
  mirrors the shape of the main site's components (Hero, About, Services, Work,
  Contact, Nav, Footer) but never imports from `lib/content.ts`. This is
  deliberate duplication, not an oversight: each pitch needs different case
  studies, different proof, and different framing, and keeping them in separate
  files means editing one can never accidentally change the others.
- **None of the three pages frame Omole as a founder, anywhere.** No "founder," no
  "my company," no "the business I built," no JobMingle ownership language. This
  matters because all three exist to be sent to people evaluating him for
  someone else's role or project (a growth marketing job, a client's website, a
  creative marketing manager role) — founder framing reads as "busy running his
  own thing," which undercuts the pitch. Where a case study is his own venture
  (JobMingle, GluFloat), the copy describes what he *did* ("I ran growth for
  JobMingle, an edtech platform...", "I designed and built GluFloat...") without
  claiming ownership of the company.
- **`components/SiteChrome.tsx`** (mounted in `app/layout.tsx` in place of a
  plain `<Nav /> {children} <Footer />`) branches by `pathname`: `/growth` gets
  `GrowthNav`/`GrowthFooter`, `/web` gets `WebNav`/`WebFooter`, `/marketing` gets
  `MarketingNav`/`MarketingFooter`, everything else gets the normal `Nav`/`Footer`.
  This exists so a visitor following a `/growth`, `/web`, or `/marketing` link
  never lands back on the founder-framed main nav or a case study aimed at a
  different audience — each variant's nav only links to anchors within itself
  (`#work`, `#services`, `#about`, `#contact`), not to `/work`, `/about`, etc.
- **`/growth`** covers only the projects that are actually growth marketing:
  JobMingle (community, content, paid ads, framed as growth work rather than
  founding), JobMingle CRM (marketing ops / lead capture), the Sales Objections
  Toolkit (conversion copywriting), CV Reviewer (a self-serve lead magnet),
  Belly Fat Product (self-funded D2C performance marketing, from the CV's
  "Performance Marketer (Self-Employed) | Direct-to-Consumer Health Products"
  role), and Rectixam (conversion copywriting for a herbal ulcer supplement,
  from the CV's Rectixam Herbal Company role). GluFloat, Powerhouse,
  WaterBrooks, and Designs & Konstruct are left out on purpose — they're
  product or web-design work, not growth marketing.
- **Belly Fat Product** and **Rectixam** are the two newest `growthWork`
  entries and both deliberately omit `liveUrl` (now optional on
  `GrowthProject`) rather than link to a guessed or unconfirmed URL:
  Belly Fat Product was a self-funded ad campaign with no public site to
  send visitors to, and no Rectixam sales-page URL was ever confirmed either.
  `BrowserFrame`'s `url` prop and `GrowthWork.tsx`'s "Visit the site" link are
  both conditional on `project.liveUrl` being present, so a project can skip
  the URL pill and the outbound link entirely instead of showing something
  invented. Belly Fat Product's two images (`belly-fat-orders.webp`,
  `belly-fat-orders-2.webp`, raw files `pef1.png`, `pef2.png`) are Gmail
  screenshots of real order-confirmation emails ("Meltdown - <customer
  name> - ... out of my location..."), used as proof of the pay-on-delivery
  order operations the CV bullet describes. Unlike every other screenshot on
  the site, what needed redacting here was customer **names**, not business
  numbers: `process-screenshots.py`'s `REGIONS["pef1.png"]` /
  `REGIONS["pef2.png"]` blur only each customer's name span (measured by
  profiling actual glyph pixel darkness per row and per word, not eyeballed —
  eyeballed boxes landed on the bottom half of the text and left it fully
  readable), leaving "Meltdown -", the "Inbox" label, and the rest of the
  snippet ("out of my location in the next 24-48 hours...") legible. Both
  files are real desktop screenshots with full browser chrome and the
  Windows taskbar, so they go through the standard `CROP`/`WATERMARK` step
  like any other screenshot; only their region coordinates are in
  `RAW_COORDS` (measured directly in real 2560x1440 pixels via a grid
  overlay, unlike the shared displayed-2000px convention everything else in
  `REGIONS` uses). Rectixam has no screenshots (`images: []`) since none were
  supplied — `GrowthWork.tsx` already renders fine with an empty array, no
  fallback card needed the way `WebWork.tsx` has one.
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
  numbers already public elsewhere on the site (16x ROAS, leads under $1
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
- **`/marketing`** was built by duplicating `/growth` and re-tailoring the
  content to `Omole Usuangbon - Creative Marketing Manager CV.pdf` (raw file at
  repo root, gitignored, same treatment as the growth CV), then further
  calibrated against a specific job posting Omole was applying to: a fully
  remote "Creative Marketing Manager (AI-First)" role asking for Reels/Shorts
  and social video, social graphics and campaigns, landing page and UX work,
  storytelling, AI-powered creative workflows as a must-have, and content
  repurposing. That posting shaped emphasis and word choice (leading with
  "AI-first," foregrounding video/social/landing-page services ahead of pure
  growth-ops language) but the page was not written as a cover letter for that
  one listing — it stays a general "work with me" creative portfolio, per the
  same principle `/growth` and `/web` already follow.
  - `lib/marketing-content.ts` mirrors `growth-content.ts`'s shape
    (`marketingSite`, `marketingProof`, `marketingAbout`, `marketingServices`,
    `marketingWork`, `marketingDifference`, `marketingProcess`,
    `marketingTechnicalSkills`/`marketingSoftSkills`/`marketingCertifications`,
    `marketingResume`, `marketingTracks`) and `components/marketing/*` mirrors
    `components/growth/*` component for component, including the hero's
    gold-highlight-via-`.split()` pattern (`MarketingHero.tsx` splits on
    "AI-First" the way `GrowthHero.tsx` splits on "Paying Customers").
  - **`marketingWork` covers five projects, matched one-to-one to the CV's
    Work Experience and Projects sections**, recast around the creative half
    of each rather than the growth-ops half: JobMingle (creative agency
    coordination on UGC/influencer content, conversion copy, community and
    event promotion — not the paid-ads-mechanics framing `/growth` already
    owns), Self-Initiated AI Content (the CV's "Personal eBook Promotions"
    project, expanded — see below), Rectixam (sales copy plus the Facebook ad
    creative design work, reused from `/growth` with the emphasis shifted
    toward the creative rather than the copy testing), Belly Fat Product
    (reused from `/growth` near-verbatim, since it was already framed as ad
    creative and sales pages), and a new fifth project, Content Repurposing
    for a Real Estate Client, built from the CopyMachines row of the CV (10
    videos a month turned into SEO blog posts, weekly webinar/social content
    that grew a client's following 50%, an affiliate client ranked first on
    Google for four keywords) — this project doesn't exist on `/growth` or
    the main site, since content repurposing is a creative-manager-specific
    story the other pages had no reason to tell.
  - **JobMingle's images on `/marketing` are deliberately different from every
    other page that features JobMingle.** The main site and `/growth` both
    use `jobmingle-hero.webp` (and `/growth` adds the Meta Ads Manager
    screenshot); `/marketing` instead uses two new images,
    `jobmingle-instagram-followers.webp` and `jobmingle-linkedin-page.webp`
    (raw files `soc1.jpg`, `soc2.jpg`, gitignored, converted to webp with
    `sharp` since they're plain profile screenshots with no browser chrome to
    crop and nothing sensitive to redact — public follower counts, not
    revenue), showing JobMingle's Instagram (6,877 followers) and LinkedIn
    page. This was a deliberate choice, not a placeholder: it evidences the
    "9,000+ combined social media following... through consistent organic
    posting" claim, and keeps `/marketing`'s JobMingle card visually distinct
    from `/growth`'s paid-ads framing rather than reusing the same
    screenshot a third time.
  - **The CV's "Personal eBook Promotions" project became `marketingWork`'s
    `ai-content-projects` entry**, and is the one project on the site with a
    `media`/`extraMedia` shape richer than the usual one-or-two-screenshot
    case study, because the raw source material for it was three videos and
    four external design links, not screenshots. `MarketingProject.media` (0-2
    items) still works exactly like `GrowthProject.images` — first item
    renders large under the title, second large after "How I approached it" —
    but each item is now a tagged union (`type: "image" | "video" | "link"`)
    instead of always being an image, dispatched in `MarketingWork.tsx`'s
    `MediaSlot` to `BrowserFrame`, the new `VideoFrame`, or the new
    `MediaLinkCard` respectively. `MarketingProject.extraMedia` is an optional
    array of labeled groups (`{ label, items }`) rendered as a grid after the
    second media slot, before "The result" — used only by this one project,
    for a "Video production" group (two self-hosted videos, `eve1.mp4` and
    `eve2.mp4` from the CV's ElevenLabs-plus-stock-footage video, copied to
    `public/videos/ebook-promo-1.mp4` and `-2.mp4`, with `ffmpeg`-extracted
    poster frames at `public/images/ebook-promo-1-poster.webp` and `-2`) and a
    "Design and carousels" group (four external links: the HeyGen avatar
    video from the CV's other ebook promo, two AI-generated Instagram
    carousels, and two Canva designs, all rendered as `MediaLinkCard`s since
    none of them can be embedded — HeyGen's dashboard link and Instagram
    posts both require the visitor to leave the site either way, the same
    reasoning `Rectixam`'s Google Doc link already uses on `/growth`).
    `components/VideoFrame.tsx` and `components/MediaLinkCard.tsx` are new
    shared components (not under `components/marketing/`) since a self-hosted
    video player and an external-link card are generic enough to reuse
    elsewhere later, unlike the rest of `/marketing`'s components.
  - **`marketingTechnicalSkills`, `marketingSoftSkills`, and
    `marketingCertifications`** are pulled from
    `Omole Usuangbon - Creative Marketing Manager CV.pdf`'s TECHNICAL SKILLS,
    SOFT SKILLS, and CERTIFICATIONS sections directly (the soft skills and
    certifications lists are identical to `/growth`'s, since that CV repeats
    them verbatim; technical skills differ, leading with "Creative Campaign
    Development" and "AI-Assisted Creative Workflows (Claude Code,
    ElevenLabs, HeyGen)" rather than `/growth`'s paid-acquisition-first
    ordering). `marketingResume` links to
    `public/omole-usuangbon-creative-marketing-cv.pdf`, a clean copy of the
    CV committed to `public/` the same way the growth CV is, downloadable
    only from `/marketing`'s `MarketingCredentials.tsx`, on purpose, matching
    the growth page's "CV download exists on `/growth` only" rule — don't add
    it elsewhere without being asked.
- **`COPYWRITING-PLAYBOOK.md`** (repo root) is a direct-response copywriting
  reference. It's written for long-form sales letters, not hero copy, but its
  house-style rules (Section 0.1: no em dashes, plain spoken language, push every
  line to the truth, cut anything that doesn't answer "so what?") and its
  specificity rule (Section 8: replace vague claims with concrete, oddly specific
  numbers, since round numbers read as made up) are exactly what `/growth`,
  `/web`, and `/marketing`'s hero and proof-bar copy should be checked against.
  It's why `/growth` and `/web`'s proof bars use "462" (leads from one Meta Ads
  campaign) rather than something vaguer, and why `/marketing`'s uses "10"
  (videos repurposed into content every month) and "50%" (follower growth
  driven for a client) instead of a rounder, vaguer claim.
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
- **JobMingle's ad spend is written as a core channel, not an afterthought —
  but community and paid ads are two genuinely separate channels, not one
  feeding the other.** Earlier drafts had lines like "ran ads only once there
  was a live cohort to fill" (undersold paid acquisition — most growth
  marketing employers weigh Meta/Google ads competency heavily) and then,
  after a first fix, "community and Meta ads working as one engine" /
  "ads had a warm audience to land on" (wrong in the other direction: it
  implied the community feeds the ad campaigns, which is not how it works).
  What actually happens: each cohort gets promoted directly to the community
  as its own effort, and a separate Meta ad campaign runs in parallel to
  reach people the community doesn't, both aimed at filling the same cohort.
  `why` / `approach` / `insight` for the JobMingle project in
  `growth-content.ts`, and `growthAbout`, describe two channels run side by
  side toward the same goal, never merged into one "engine" or one warming up
  the other. The specific, odd number **462 leads from a single Meta Ads
  campaign** (from the CV) was added to `growthProof`, the JobMingle
  project's `results`, and `growthAbout` as concrete evidence of
  paid-acquisition competence, replacing the retired 9x claim in the proof
  bar.
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
  elsewhere without being asked. Both skill lists render as a plain vertical
  checklist (`Check` icon + one item per line, matching the "What it does" /
  "The result" list style used throughout the site) — a wrapped pill/chip
  layout was tried first and read as jampacked, so don't revert to chips.
  The CV banner itself is deliberately bare: eyebrow, "Download my CV," and
  the button, nothing else — an explanatory sentence ("Everything above,
  plus the full work history...") was cut as unnecessary. It's a card that
  tells a business owner to download the CV, not a pitch for why they should.
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
- **"Which portfolio gets viewed" (`portfolioBreakdown` in `getAnalyticsDashboardData`)**
  buckets every `page_view` by path into "Growth portfolio," "Web portfolio,"
  "Marketing portfolio," or "Main site" (everything else — `/work`, `/about`, `/blog`,
  etc., the general "work with me" site) and ranks by unique visitor. `PageViewTracker`
  is mounted globally in `app/layout.tsx`, so this was already being logged for
  `/growth`, `/web`, and `/marketing` before this section existed — it just wasn't
  surfaced as its own breakdown anywhere in the dashboard.
- **Known gaps, by design, not bugs**: country/region reads "Unknown" on `localhost`
  (Vercel-only headers); ad blockers that blocklist `/track`-like paths will
  undercount; the two tracking cookies are long-lived and server-set, which plausibly
  needs a consent flow for EU/UK visitors that this feature does not include; "new vs
  returning" means "a known visitor found a new resource," not "came back to browse
  again," since a genuine repeat view of an already-seen page produces no new row.

## Job application machine (`/admin/jobs`)

A daily-refreshed feed of remote growth-marketing and creative-marketing roles Omole
can actually apply to from Nigeria, with a one-tap "Prepare application" per job that
drafts a tailored cover letter, picks the right CV and portfolio link, and (best-effort)
drafts answers to that job's own custom application questions. **It never submits or
sends anything without an explicit confirming tap** — full browser automation of ATS
forms was deliberately ruled out (ATS bot-detection can get an automated submission
silently flagged and rejected, worse than not automating at all, and Vercel functions
can't run a real browser anyway). The one thing it can send on your behalf is a direct
application **email**, and only after you've reviewed the draft and confirmed.

- **Sourcing is companies' own hiring systems, never a job board.** `lib/jobs/fetchers/`
  has one fetcher per platform: Greenhouse, Lever, Ashby, Workable, SmartRecruiters,
  Recruitee, and Breezy HR each have a free, public, unauthenticated JSON API for a
  company's own postings — every fetcher was verified against a real live company
  before being trusted, not written from documentation alone (e.g. Greenhouse's
  `content` field turned out to be HTML-entity-double-encoded, `&lt;div&gt;` rather
  than a literal `<div>`, only caught by fetching GitLab's real board).
  **BambooHR was deliberately not built** — confirmed via research to have no public
  API, only an undocumented internal widget endpoint, not something to depend on.
  `lib/jobs/fetchers/custom.ts` is the fallback for a company with no recognized ATS:
  a best-effort scraper that guesses at job links on a given careers page by text
  heuristics, then fetches each candidate's own page for a plain-text description
  (needed since a generic page has no structured location/remote field). It is
  meaningfully noisier than the structured fetchers, and `JobRow.tsx` shows a distinct
  "Scraped, not an ATS - double-check details" badge on its matches so that noise is
  visible, not hidden. `lib/jobs/fetchers/index.ts` is a one-line-per-platform registry
  (`FETCHERS: Record<JobAts, ...>`) so adding another platform later is one new file
  plus one new line, not a growing if/else chain. **`lib/jobs/detect.ts`** exists so
  the admin never has to know what a "board token" is or which ATS a company uses —
  the primary flow in `AddSourceForm.tsx` is now "paste the URL you're looking at on
  the company's jobs page." `parseCareersUrl(url)` is pure regex, no network call: it
  reads the token straight out of the URL for whichever known platform's domain
  pattern matches (`boards.greenhouse.io/<token>`, `jobs.lever.co/<token>`, etc.), and
  falls back to `ats: "custom"` with the URL used as-is when nothing matches (a
  company's own custom domain). A collapsed "Not detected right? Fix it manually"
  panel exposes the older flow for edge cases: a manual ATS select plus
  `detectAts(token)`, which instead makes a live network probe against all seven
  platforms in parallel with a typed-in token and reports back whichever ones actually
  matched (checked by response shape, e.g. Greenhouse/Ashby need a `jobs` array,
  SmartRecruiters a `content` array — not just an HTTP 200, since some of these
  platforms return `ok` responses for both a real board and a "not found" case). Both
  the token-check button and the outer "Add source" submit are bound to the same
  `<form>` via the `formAction`-per-button pattern `Editor.tsx`'s delete button
  already uses, each with its own `useActionState`. `custom` is never probed over the
  network — it takes a full URL, not a token, so there's nothing to try it against.
- **Coverage across many companies at once comes from four remote-job aggregator
  APIs, not from individually adding companies — that per-company approach was
  called out as a poor answer to "there are 100,000+ companies in these countries,"
  and it's correct: there is no free API to search every company on Greenhouse or
  Lever, those platforms don't publish a directory, so one-at-a-time additions never
  scale.** `lib/jobs/fetchers/remoteok.ts`, `remotive.ts`, `jobicy.ts`, `arbeitnow.ts`,
  and `himalayas.ts` hit RemoteOK, Remotive, Jobicy, Arbeitnow, and Himalayas' free,
  public, no-auth APIs, each already covering thousands of companies' remote postings
  (RemoteOK needs a real `User-Agent` header or it 403s; the rest need nothing). These
  were a deliberate exception to "must not come from a job board" from the very first
  request in this feature's history — they're aggregators, not individual companies'
  own systems, which is exactly the category that instruction ruled out, so this
  tradeoff was surfaced explicitly and confirmed before building it, not assumed.
  Every job from these five still passes through the exact same `classify.ts`
  pipeline as everything else — no separate, looser filter. **Only Himalayas'
  keyword search (`q` param) was confirmed live to actually narrow results —
  Remotive's `category` and Jobicy's `tag` params were tested with wildly different
  values (`marketing` vs. a nonsense string, `marketing` vs. `engineering`) and
  returned the identical unfiltered set every time, so those two just fetch their
  general feed and lean entirely on `classify.ts`'s own keyword matching.** For all
  five, `job_sources.board_token` holds a category/tag/search-query value (e.g.
  `"marketing"` or, for Himalayas, `"growth marketing"`) instead of a per-company
  identifier, since there's no single company to scope to; `ats: "remoteok" |
  "remotive" | "jobicy" | "arbeitnow" | "himalayas"` are excluded from `detect.ts`'s
  `RealAts` type (token-probing and URL-parsing don't apply to them) and from the
  primary "paste a URL" flow in `AddSourceForm.tsx` — they're added through the
  manual-override panel, where the token field's label switches to "Category/tag or
  search query" for these five. Fixed one real bug found while building this: the old
  `remoteNamesOtherCountry` only excluded a scoped location when the literal word
  "remote" appeared in `location_text` (true for Greenhouse-style `"Remote, Italy"`),
  which missed cases where remoteness comes from a separate structured flag and the
  location text is just a plain place name with no "remote" wording at all — e.g. an
  Ashby posting with `isRemote: true` but `location: "New York, NY (HQ)"`
  (confirmed live on a real Ramp posting), or an aggregator's bare
  `candidate_required_location: "USA"`. It now strips the word "remote" if present and
  treats whatever's left as a scope either way, once `isRemoteJob` has already
  established the posting is remote by some means. `WORLDWIDE_LOCATION_VALUES` (a
  bare `worldwide`/`anywhere`/`global` value) is a separate, earlier check in
  `checkEligibility` for aggregator fields that put that verdict directly in the
  location field rather than in prose.
- **`app/api/jobs/sync/route.ts` inserts one row at a time with a plain `.insert()`,
  never `.upsert(rows, { ignoreDuplicates: true })` — that was a real, previously
  undetected bug, not a style choice.** `ignoreDuplicates: true` makes
  `@supabase/postgrest-js` send `Prefer: resolution=ignore-duplicates` (`INSERT ...
  ON CONFLICT DO NOTHING`), and Postgres's conflict-checking machinery for that needs
  to read the potentially-conflicting existing row — which under RLS means evaluating
  a SELECT policy, and `anon` deliberately has no SELECT policy on `job_matches` (it
  holds cover letters and application emails, never meant to be publicly readable via
  the anon key). The result was every insert attempt failing with `"new row violates
  row-level security policy"` — including for genuinely new rows with no real
  conflict at all — silently zeroing out every sync until aggregator sources finally
  produced enough real matches to expose it (every company-specific source added
  before that point happened to have zero matching postings, so the insert path had
  never actually been exercised). Confirmed live with the anon key directly against
  PostgREST: identical `Prefer: resolution=ignore-duplicates` reproduces the RLS
  error every time, a plain `insert()` of a genuine duplicate instead returns a
  normal, catchable `23505` unique-violation, and a plain `insert()` of a new row
  succeeds outright. The fix keeps the RLS design intact (still no anon SELECT
  policy) — it inserts each classified row individually and treats a `23505` error
  as "already tracked, skip," logging anything else.
- **`/admin/jobs`'s match list is grouped into a `<details>` per day** (`groupByDay`
  in `page.tsx`), only the most recent day open by default, so the page stays a
  bounded height as matches accumulate over weeks instead of growing without limit —
  added once daily volume moved from a handful of matches to several dozen once the
  aggregator sources were producing real results.
- **Eligibility from Nigeria/Africa is a hard gate, not a nice-to-have — this was a
  correction, not the original design.** The first version of `classify.ts` only
  checked whether a job's location text mentioned "US" or "Australia," which had a
  real bug (city names like "New York" matched even for fully on-site roles) and a
  bigger conceptual gap: most "Remote" listings from Greenhouse/Lever/Ashby-hosted
  companies are scoped to hire someone already based in one specific country for
  payroll/legal reasons (confirmed live: GitLab's own postings said "Remote, Italy,"
  Ramp's said "Remote (US)" / "Remote (Canada)," neither open to Nigeria), not open
  worldwide the way "remote" sounds like it should mean. `classify.ts` now requires a
  job to be remote at all (`is_remote` from the ATS when it exposes one — Ashby does,
  Greenhouse/Lever/Recruitee/Workable/Breezy don't, so it falls back to scanning
  `location_text`, and for the custom scraper's null `location_text`, `description_text`
  too), then excludes it if the description contains a citizenship/work-authorization/
  residency requirement, or if "Remote" names a specific non-Africa country. It's only
  accepted if there's an explicit worldwide/anywhere/employer-of-record signal
  (`WORLDWIDE_PATTERNS`), or — for an ambiguous bare "Remote" with no other
  signal — only when its `job_sources.hires_globally` is `true`. There is no
  "excluded" status stored on `job_matches`; a rejected posting is just never
  inserted. The stored `eligibility` column (`'worldwide' | 'unconfirmed'`) records
  *why* a match was let through, and `JobRow.tsx` shows it as a badge ("Worldwide" vs.
  "Unconfirmed scope, check before applying") so an "unconfirmed" one gets a second
  look before applying, since no automated filter can be fully certain here.
  `job_sources.hires_globally` (a plain boolean, `supabase/migrations/0004_simplify_region_hint.sql`)
  used to be a four-option `region_hint` field (`'us' | 'australia' | 'us_or_australia' | 'remote_global'`)
  — dropped because three of those four options were functionally identical to each
  other (`checkEligibility` only ever branched on `'remote_global'` vs. everything
  else) and, worse, easy to misread as "this job is located in the US/Australia, which
  Nigerians can apply for," which is backwards: it was a tiebreaker for one narrow
  ambiguous case, never a positive eligibility signal on its own. If you see
  `region_hint`/`JobRegionHint`/`region_match` anywhere, it's stale.
- **`EXCLUSION_PATTERNS` also covers Singapore-specific citizenship/work-authorization/
  work-pass language**, not just US/Australia — Omole's targeting is specifically
  jobs from US, Australia, and Singapore companies that Nigerians/Africans can apply
  to, per his own instruction, not "any remote job from anywhere." There is
  deliberately **no stored field for "which country is this company based in"** —
  `job_sources` is entirely admin-curated already (Omole chooses which companies to
  add), so that targeting is achieved by which companies get added as sources, not by
  a database column. Adding one anyway was considered and rejected: it would either do
  nothing (purely cosmetic, the same mistake `region_hint` already made once) or need
  real enforcement logic nobody asked for. `remoteNamesOtherCountry` in `classify.ts`
  was already generic before Singapore was named explicitly — it excludes "Remote,
  &lt;any country&gt;" for any named country, not just US/Australia, so a
  Singapore-scoped-only remote listing was already handled correctly without changes;
  only the prose `EXCLUSION_PATTERNS` needed Singapore added for postings that state
  the restriction in a sentence rather than in the location field.
- **`lib/jobs/extractQuestions.ts`'s `extractApplicationDetails` does two best-effort
  things off one fetch of the job's real apply page**: pulls out custom question
  labels (works only when the ATS server-renders its form — Ashby and many Lever
  boards render entirely client-side and this returns `[]`, which is expected, not a
  bug, and callers must degrade to "no custom questions, cover letter + CV + portfolio
  only" rather than treat it as an error), and looks for a direct application email —
  a `mailto:` link first, otherwise an email address found near application-sounding
  language ("email your resume," "send your CV," etc.) in the page text or the job
  description, filtered against a denylist of generic addresses (`privacy@`,
  `support@`, and similar) so a company's general contact address doesn't get treated
  as an application inbox.
- **`lib/jobs/gemini.ts`** drafts the cover letter and any per-question answers via
  Gemini Flash's free tier, plain REST fetch to `generativelanguage.googleapis.com`
  (no SDK, matching how this repo talks to every other external API), reading
  `GEMINI_API_KEY` (free from Google AI Studio, no billing required within its
  free-tier rate limits), using Gemini's
  `responseSchema` structured-output feature so the response is directly parseable
  JSON. `lib/jobs/candidateContext.ts` builds the grounding text fed into that prompt
  from `growthAbout`/`growthWork`/etc. (`lib/growth-content.ts`) or the marketing
  equivalents (`lib/marketing-content.ts`) depending on the job's track — the same
  real case-study data the public `/growth` and `/marketing` pages use, never invented.
- **`lib/jobs/prepare.ts`** is the orchestrator behind "Prepare application": picks
  the CV/portfolio pair for the job's track (growth →
  `/omole-usuangbon-growth-marketing-cv.pdf` + `https://omoleportfolio.vercel.app/growth`;
  marketing → the marketing equivalents), runs the best-effort extraction, builds the
  candidate context, calls Gemini, and returns a result the server action stores —
  never writes to the database itself.
- **`lib/jobs/gmail.ts`** is the only thing in this feature that actually sends
  anything, and only for jobs where `extractApplicationDetails` found a direct
  application email. Plain REST against the Gmail API (no SDK): exchanges a long-lived
  refresh token for an access token (`https://oauth2.googleapis.com/token`), builds a
  raw RFC 2822 MIME message (cover letter as the body, the matching CV read from
  `public/` and attached as base64), and posts it to
  `https://gmail.googleapis.com/gmail/v1/users/me/messages/send`. Needs
  `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, and `GOOGLE_REFRESH_TOKEN` — obtained via
  Google Cloud Console (OAuth consent screen, scope `gmail.send`, publishing status
  **"In production"** so the refresh token doesn't expire after 7 days the way
  "Testing" status tokens do) and Google's OAuth Playground (exchange an authorization
  code for a refresh token there, using your own Client ID/Secret via its "use your own
  OAuth credentials" setting). Still entirely free — Gmail API sending has no cost
  within normal personal-account limits. `JobRow.tsx`'s "Send application to
  `<email>`" button only appears once a job is `prepared` and has an `apply_email`,
  gates on `window.confirm()` first (same pattern `Editor.tsx`'s post-delete button
  uses), and on success sets `status: 'applied'` and `email_sent_at` directly — no
  separate "mark applied" tap needed for these.
- **`app/api/jobs/sync/route.ts`** is the daily cron entry point (`vercel.json`'s
  `crons` array, `0 6 * * *`, gated by comparing the request's `Authorization: Bearer`
  header against `CRON_SECRET` — Vercel auto-sends that header once the env var is set
  on the project). It reads active `job_sources` via the anon Supabase client (no user
  session exists for a cron-triggered request), fetches + classifies + upserts into
  `job_matches` with `onConflict: "ats,external_id", ignoreDuplicates: true`, so a
  posting already prepared or applied to is never clobbered by a re-sync.
- **RLS on `job_sources`/`job_matches`** (`supabase/migrations/0003_job_application_machine.sql`)
  follows `analytics_events`' pattern exactly: `anon` gets only the narrow grants the
  cron route needs (select active sources, insert/update matches), `authenticated`
  gets full access for the admin UI. No use of `SUPABASE_SERVICE_ROLE_KEY` — that key
  stays unused everywhere in this repo, per the blog section above.
- **`app/admin/jobs/`**: `page.tsx` (server component, lists matches + a collapsible
  "Manage sources" panel), `JobRow.tsx` (client component — needs its own
  `useActionState` per row since "Prepare application" and "Send application email"
  both take a few seconds), `AddSourceForm.tsx` (client component, its board-token
  field's label and help text change per selected ATS — for `ats = 'custom'` the
  "board token" is actually the full careers page URL), `actions.ts` (server actions,
  `ActionState` convention matching `app/admin/actions.ts`).
- **Explicit scope boundaries, don't re-litigate these without being asked**: no
  automation ever submits a web-form application; question extraction and the custom
  scraper are both best-effort and expected to come back empty/noisy often, never
  treated as errors; `job_sources` starts empty and should only ever be seeded with
  board tokens verified against a live request, never guessed ones.
- **Known unverified spot**: `lib/jobs/fetchers/breezy.ts`'s exact field names weren't
  confirmed against a populated real posting during development (every account tried
  had zero current openings, only the endpoint shape and empty-array response were
  confirmed live) — check its first real sync output against a Breezy-sourced company
  and correct the field names in that file if anything comes back empty that
  shouldn't.
- **"Must not require account sign-up to apply" is the actual bar, not "must be the
  company's own page" - a real distinction, corrected once already.** The first pass
  deactivated all five remote-job aggregator sources (RemoteOK, Remotive, Jobicy,
  Arbeitnow, Himalayas) on the reasoning that their `apply_url` points to their own
  hosted page instead of the employer's. Omole clarified that was the wrong bar:
  applying somewhere other than the company's own page is fine, only an actual account
  signup is the problem. Re-verified live, page by page, not by inference this time:
  Arbeitnow's own apply page is a plain one-time form (first name, last name, email;
  zero mentions of "password," "sign up," "register," or "login" anywhere on the
  page) that posts and shows "Your job application has been sent successfully" - not
  an account. RemoteOK's and Remotive's "Log in" / "sign-up" links are unrelated
  top-nav site chrome (join the aggregator's mailing list, an employer posting flow),
  nowhere near the actual "Apply for this job" action - re-activated, both. Himalayas
  is Cloudflare-protected against plain fetches (repeatedly confirmed 403, even with a
  realistic browser User-Agent), so its actual apply flow still can't be verified
  either way - **stays deactivated on "no evidence it's clean," not on "confirmed
  bad."** If Himalayas' apply flow is ever actually confirmed (a real browser session,
  not a plain fetch), revisit reactivating it with the same page-by-page evidence
  standard used for the other three, not a guess.
- **Jobicy was checked with the same standard and confirmed NOT clean - stays
  excluded, not just "never gotten to."** Its job pages have `apply_with_resume` and
  `resume_id` markup and heavy register/password/login language (confirmed live: 9
  "password", 27 "register", 11 "login" occurrences on one sample job page), meaning
  applying stores a resume against a Jobicy account rather than a one-time form -
  Omole confirmed explicitly not to add it.
- **Every job source must be a genuinely free API, forever - no source that gates
  behind a paid job-board tier for either the recruiter or the candidate.** All 100+
  sources already meet this by construction (each is a company's own free public ATS
  API, or a free aggregator API), so this hasn't required removing anything - it's
  recorded here as a hard constraint on anything added later, not a correction.
- **A live funnel simulation (rebuilt fresh against the then-current 84 sources)
  found the deepest bottleneck isn't any of the filters - it's that direct-company
  ATS boards almost never label a posting genuinely worldwide-open, even when every
  other filter (freshness, seniority, experience) is maxed out.** With freshness
  widened to 30 days and the seniority/experience filters disabled entirely (a
  deliberately extreme test, not the real running config), only 2 postings passed
  eligibility out of 105 keyword hits across all 84 sources that day - and **both
  came from Remotive, zero from any of the 79 direct-company sources.** Direct
  companies almost always scope "Remote" to a specific country for payroll/legal
  reasons; aggregators are structurally the only sources that consistently label a
  posting with an explicit worldwide/anywhere value. This reframes the whole sourcing
  strategy: aggregators aren't a stopgap for coverage, they're the primary lever for
  eligible volume specifically, and adding more individual companies one at a time -
  the approach used to build the first 100+ sources - has a low ceiling by
  comparison.
- **Working Nomads (`ats: workingnomads`) is a sixth aggregator, added 2026-09-09,
  structurally different from the other five: it's a genuine pass-through, not a
  page it hosts itself.** Its listing `url` is a `workingnomads.com/job/go/<id>/`
  redirect that resolves straight to the real employer's own application page
  (confirmed live across all 49 then-current postings: `apply.workable.com`,
  `career.proxify.io`, etc.) - the cleanest structural fit for "must not require
  account sign-up" of any aggregator here, since the destination is whatever ATS or
  system the employer already uses, the same standard already trusted for every
  direct-company source. Because the destination varies per posting, though, it isn't
  uniformly clean the way the other five's own fixed apply flow is: one real posting
  (out of 49) resolved straight to `markervideo.com/api/auth/signup` - the employer's
  own system requires an account. `lib/jobs/fetchers/workingnomads.ts` follows the
  redirect itself and checks the *resolved* URL against `SIGNUP_URL_PATTERN`
  (`/sign-up`, `/register`, `/create-account` in the path), dropping that one posting
  rather than trusting the aggregator's own apply flow the way the other five do -
  the only per-posting sign-up check anywhere in this codebase, everywhere else the
  check happens once per source, not once per job. A real bug was caught and fixed
  while building this: the first version discarded a job whenever the *resolved
  destination page itself* returned a non-2xx status, which turned out to silently
  drop 13 of 15 sample postings - `career.proxify.io`'s apply page 403s a plain
  server-side fetch (bot protection against the request itself, confirmed a real
  browser opening the identical resolved URL works fine), but `redirect: "follow"`
  had already completed and `res.url` already held the correct final destination
  regardless of that status code. Fixed by using `res.url` unconditionally once the
  fetch itself succeeds, only discarding a posting on an actual network failure.
  After the fix: 48 of 49 kept, exactly the one genuine signup case filtered, zero
  false drops. Like Remotive/Jobicy, Working Nomads' own `category` filter param was
  tested live and confirmed to not narrow results, so `board_token` is unused here,
  one "all jobs" source. **A second, separate, pre-existing bug was found and fixed
  while adding this: `ATS_VALUES` in `app/admin/jobs/actions.ts` never included any
  aggregator type at all**, even though `AddSourceForm.tsx`'s manual-override panel
  has always let the admin pick one - meaning every aggregator source before this fix
  could only ever be added by a direct database write, never through the actual
  admin UI form, which would have rejected the submission with "Choose which ATS this
  company uses."
- **`MARKETING_KEYWORDS` was broadened after a live diagnostic caught real, common
  title phrasings it was missing entirely** - a run that logged every remote/fresh/
  junior posting that matched zero keywords surfaced "Social Media Lead" and "Content
  Writer" as genuine, on-persona titles the list simply didn't cover (it only had
  "social media manager" and "content marketer"/"content creator"). Added those plus
  several other standard variants not seen that specific day but common enough to be
  worth covering (digital marketing, email marketing, marketing specialist/
  coordinator/associate, seo specialist/manager). Moved that day's keyword-match count
  from 8 to 12, eligible matches from 1 to 2 - a real but modest gain, confirming the
  keyword list was a minor leak, not the main bottleneck.
- **Definitive answer to "can 20 matches/day be reached with the current sources,
  by tuning filters" - no, confirmed by testing the absolute ceiling, not argued
  from principle.** With MAX_POSTING_AGE_DAYS pushed to 30, the seniority filter and
  the experience-years filter both disabled entirely (accepting Director-level titles
  and any stated years of experience - a deliberately extreme test, not a serious
  proposed config) and the broadened keyword list above, the maximum across all 85
  sources on the day tested was **5 matches, from only 3 sources** (Remotive: 3,
  Griffin: 1, Working Nomads: 1) - every other source, all 82 of them, contributed
  zero even at maximum looseness. Filter tuning has hit its ceiling; the only lever
  left with real headroom is more sources structured like the ones that actually
  produced matches (redirect-style aggregators, or individual companies confirmed
  - not assumed - to hire globally), not further filter adjustments on the existing
  85.
- **Superseded note, kept only so this doesn't get rediscovered as new information:**
  an earlier pass deactivated all five aggregators that existed at the time on the
  theory that none of them link to the real employer. That reasoning turned out to be
  half right - see "'Must not require account sign-up to apply' is the actual bar..."
  above for the corrected finding (RemoteOK, Remotive, and Arbeitnow are all
  reactivated; only Jobicy and Himalayas actually stay off, for different confirmed
  reasons each) and "Working Nomads..." for the sixth aggregator added since.
- **`classify.ts` also gates on seniority and posting age**, added for the same
  reason: Omole is only applying to roles reachable with at most 4 years of
  experience, posted within the last week. `SENIOR_TITLE_PATTERN` rejects a title
  containing Senior/Sr/Staff/Principal/Director/VP/Head of/Chief/Executive (deliberately
  not "Lead" — `GROWTH_KEYWORDS` targets "growth lead" directly, and that's often a
  2-4 year role at a small company, not a director-equivalent one).
  `requiresTooMuchExperience` is a plain regex scan for "N years" near the word
  "experience" (the smaller number in a range counts, e.g. "3-5 years" passes on the
  3); an unrelated number of years elsewhere in the text - company age, funding round
  - doesn't trigger it, since it only counts a match with "experience" in a short
  window after it. `isTooOld` rejects anything with a `posted_at` more than 7 days in
  the past; a `null` posted_at (a source with no date field at all) is let through
  rather than guessed at. **`posted_at` on `NormalizedJob`/`JobMatch`** carries the
  company's own posting date, confirmed live per platform: Greenhouse's
  `first_published`, Lever's `createdAt` (epoch ms), Ashby's `publishedAt`, RemoteOK's
  `date`, Remotive's `publication_date` (no timezone suffix in the API response but
  confirmed UTC, so fetched with a `Z` appended), Jobicy's `pubDate`, Arbeitnow's and
  Himalayas' `created_at`/`pubDate` (both unix seconds). Workable, SmartRecruiters,
  Recruitee, and Breezy's date fields are best-effort, unconfirmed the same way
  Breezy's other fields are (above) - every account probed during development had zero
  open postings to check against. `supabase/migrations/0007_job_matches_posted_at.sql`
  adds the column; nothing backfills old rows.
- **Two eligibility gaps in `classify.ts` were found and fixed by testing real live
  postings, not by inspection.** The "must be authorized to work in the United
  States" exclusion pattern missed the phrasing "must be authorized to work **for any
  employer** in the United States" (found on a real Himalayas-sourced posting - that
  one specific job still got excluded correctly via a different, unrelated "unable to
  sponsor" pattern also in its text, but the gap is real for a posting that doesn't
  also say that). And `remoteNamesOtherCountry` only ever treated the literal words
  "Africa"/"Nigeria" in a location string as in-scope - a role explicitly scoped
  "Home based - EMEA" (confirmed live on real, current Canonical postings) was being
  excluded even though EMEA, as a standard corporate region acronym, factually
  includes Nigeria. "EMEA" now gets the same treatment as a literal Africa/Nigeria
  mention; "APAC" and "Americas" deliberately don't, since neither includes Africa.
- **`draftApplication` (`lib/jobs/gemini.ts`) retries transient failures and disables
  Gemini's default "thinking."** The actual, confirmed-live cause of "draft not
  prepared" errors: `gemini-3.6-flash` intermittently returns a `503 "currently
  experiencing high demand"` on a completely ordinary request, and there was no retry
  - one transient blip failed the whole "Prepare application" tap. Fixed with a
  3-attempt retry (429 and 503 both retried) on a short backoff. Separately,
  `thinkingConfig: { thinkingLevel: "low" }` is now always sent -
  `gemini-3.6-flash` thinks by default even for a templated drafting task like this
  one (confirmed live: ~1,100 hidden thinking tokens for one cover letter, versus zero
  with `thinkingLevel: "low"`, both producing a valid draft), which burns the free
  tier's daily quota far faster than the visible output suggests. `thinkingBudget: 0`
  (the documented way to disable thinking on 2.5-series models) is rejected by this
  model with a 400 - `thinkingLevel` is the 3.x replacement, confirmed live.
- **Job sources are admin-curated data, not schema, so they're added/removed directly
  against Supabase rather than through a migration file** - unlike the versioned SQL
  in `supabase/migrations/`, which is schema only.
- **Company HQ country is a hard sourcing filter, decided by Omole directly, not
  inferred from job content.** He first asked for volume (6 sources felt too small),
  which led to a first pass adding Nigerian/pan-African companies (Moniepoint, Carbon,
  Kuda, FairMoney, Renmoney, Helium Health, Andela) on the reasoning that a
  Nigeria-HQ'd company's "Remote" posting is trivially eligible - he then explicitly
  rejected that direction ("no. only us, australia, canada jobs"), so all seven were
  deactivated, along with Ahrefs (Singapore) and Canonical (UK) for not fitting that
  narrower list. He then added Singapore and UK back to the allowed list and asked to
  keep researching until 30 sources. Germany was added to the allowed list
  2026-09-09. **The current standing rule: only add a job source for a company
  headquartered in the US, UK, Australia, Canada, Singapore, or Germany.** Don't add
  a company from any other country (Nigerian/African companies included) without
  asking first - that specific direction was tried and reversed once already. This is
  a sourcing filter, not a `classify.ts` change: `checkEligibility` still runs on
  every individual posting regardless of source, so a source being one of these six
  countries doesn't make its postings automatically eligible - a US/UK/AU/CA/SG/DE
  company can and does post plenty of country-scoped roles that still get excluded.
  **Germany specifically confirmed this pattern harder than any other country
  tried**: ~30 German companies were probed live (N26, GetYourGuide, Celonis,
  HelloFresh, Solarisbank, Raisin, DeepL, Enpal, commercetools, StepStone, Moss,
  Tacto, Isar Aerospace, Grover, Refurbed, Forto, Choco, Vay, Auto1, Delivery Hero,
  and others that came up empty or 404) and not a single genuinely remote-worldwide
  or remote-EMEA marketing/growth role was found anywhere - every hit was scoped to
  a specific office city (Berlin, Munich, London, Boston), hybrid at best. The 20
  German companies with real verified boards were still added (`hires_globally:
  false`, same low-risk broad-net logic as the US/UK batch), since a real board can
  always post something eligible later even if today's snapshot has nothing - but
  don't expect volume from them specifically; this is the same "direct companies
  rarely say Worldwide" finding from the ceiling-test section above, just confirmed
  country by country now rather than only in aggregate.
- **As of 2026-09-09 there are 105 active sources** (grown from an initial 6, to 30
  after "6 is too small," to 100 after "make it 100," to 105 after Germany was added
  to the allowed country list - each jump verified the same way: every board token
  confirmed live with a real, non-empty response before adding, none guessed). Full
  company list is in the database, not repeated here since it's
  long and will keep changing; the shape that matters:
  - Split roughly 42 US / 19 UK / 4 Australia / 4 Canada / 1 Singapore for the final
    70-source batch - a deliberate rebalance, not a byproduct of research luck. Sorting
    every verified candidate by current open-job count and taking the top 70 would have
    produced a near-all-US list (US companies dominate what these seven ATS platforms
    surface), so every non-US candidate found was kept regardless of its current job
    count, and only the remaining slots were filled with the highest-volume US boards.
  - All 100 use `hires_globally: false` except Canonical and Deel (`true`, both
    confirmed to have explicit worldwide/EMEA-scoped postings at add time). `false` is
    the deliberate default for the rest, including every company added in the 100-source
    push: it doesn't block anything real - an ambiguous bare "Remote" posting still
    gets excluded either way per `checkEligibility` in `lib/jobs/classify.ts`, only a
    posting that explicitly says worldwide/anywhere/EMEA/Africa/Nigeria ever surfaces a
    match - so these sources can only ever add real matches, never wrongly-eligible
    ones. Don't flip any of them to `true` without direct evidence for that specific
    company's actual hiring policy, not just company reputation or headline job count.
  - **Volume was optimized company-by-company, which has a real ceiling**: at 100
    sources, most still won't produce an eligible growth/marketing match on any given
    day, since the vast majority of their postings are scoped to a single office
    location. This was a deliberate tradeoff (see "no. only us, australia, canada
    jobs" above) - broader-net company sourcing over aggregators, in exchange for every
    match actually landing on the employer's own application, not a job board's.
    Getting materially past 100 with this same approach means diminishing returns per
    company added; the next lever, if more volume is needed, is more of the same
    research (this list is nowhere near exhaustive - GitLab, Twilio, Datadog etc.'s
    2000+ combined listings were barely scratched for country-scoped variety), not a
    different mechanism.
  - A parallel search tried guessing tokens for Remote.com (the EOR company) and came
    up empty on purpose: its own Greenhouse board (`remotecom`) is real, but nearly
    every posting's own boilerplate company description repeats "we hire
    internationally"-style language regardless of that specific role's actual
    single-country scope (confirmed live: identical "worldwide" signal fired on roles
    individually scoped to France, Portugal, Morocco, Canada, and more). Adding it
    would have produced systematically false "worldwide" eligibility labels under the
    current `WORLDWIDE_PATTERNS` check, which trusts that language wherever it appears
    in the combined location+description text - not added, and worth remembering if an
    EOR-style company (Remote, Oyster, Multiplier, Papaya, Deel-alikes) comes up again:
    check several individual postings' actual scope, not just the company's own
    about-us framing, before trusting a "we hire globally" phrase from a source like
    this.
  - Dozens of token guesses came up as 404s across every supported ATS during this
    research (Nigerian fintechs during the reverted first pass; several Singapore
    companies - Grab, Shopee, Carousell, Ninja Van, PropertyGuru, Aspire, Nium, Carro,
    and others - during the second) - not evidence these companies don't exist, just
    that they likely run on Workday, BambooHR (not supported, see below), or a
    proprietary system outside what `lib/jobs/fetchers/` covers.
  - **Float's existing source (`ats: workable`, token `floatjobs`) currently returns
    zero jobs, but Float also has an active Ashby board (`ats: ashby`, token `float`,
    ~20 open roles) - confirmed live, not yet acted on.** Those Ashby-side roles are all
    Toronto/Canada-scoped though, so switching wouldn't add eligible matches; flagged
    here rather than fixed, since it wasn't asked for.
- **2026-09-12: Omole reported zero new matches for two straight days. Diagnosis
  confirmed the pipeline itself is healthy, not broken** - Vercel's runtime logs showed
  the `0 6 * * *` cron hitting `/api/jobs/sync` and returning `200` that morning, and
  running the same route locally against the real database (same env vars, so no
  production secret needed) returned `{"sourcesChecked":105,"inserted":0}` - all 105
  sources were checked, none produced a new eligible posting that day. This is the
  expected common case per the ceiling-test finding above, not a regression. One
  incidental finding while diagnosing: `lib/jobs/prepare.ts`'s portfolio links point to
  `https://omoleportfolio.vercel.app/...`, but the project's actual current production
  domain is `https://omole.vercel.app` - worth checking whether the old domain still
  resolves as an alias; not fixed yet, flagged for a follow-up.
  - **Added one new source from this pass: Wishpond Technologies** (`ats: lever`,
    token `wishpond`, Vancouver/Canada-HQ'd, `track: "both"`, `hires_globally: true`).
    Confirmed live, not by reputation: its current postings explicitly say "100% Remote
    outside of Canada" and are individually located in Mexico, Colombia, and South
    Africa - a live posting already scoped to South Africa is about as strong a
    worldwide-hiring signal as Canonical/Deel's EMEA language, which is why
    `hires_globally` is `true` here despite no *currently open* role being an exact
    growth/marketing keyword match (the same "a real board can post something eligible
    later" reasoning already applied to the German batch).
  - **Rejected candidates from this pass, with the specific reason each failed the
    existing bar, so they aren't re-researched from scratch later:**
    - **Jobgether** (`jobs.lever.co/jobgether`) looked like a single company at a
      glance but its board has **4,128** postings spanning unrelated industries and
      locations - it's a recruiting/job-matching platform posting on behalf of many
      real employers through one Lever account, i.e. a job board wearing a company's
      face. Excluded on the same "must not come from a job board" rule that already
      rules out RemoteOK-style aggregators being added as if they were companies.
    - **We Work Remotely**'s public RSS feed (`weworkremotely.com/remote-jobs.rss`,
      no auth needed) tags nearly every listing's `<region>` as literally "Anywhere in
      the World," including a Celonis **"Account Executive - Federal"** posting - a
      role that is essentially certain to require US work authorization, which means
      the field can't be trusted as an accurate per-posting eligibility signal, only a
      site-wide default tag. Its actual job pages also 403'd on every fetch attempt
      (`WebFetch`, matching Himalayas' Cloudflare-style protection), so the apply flow
      (company site vs. WWR account) couldn't be verified either. Stays unadded on "no
      evidence it's clean," the same standard already applied to Himalayas - revisit
      only with a real browser session confirming both the region tag's accuracy and
      the apply flow, not a plain fetch.
    - **The Flex** (Ashby `The-Flex`, London-HQ'd, otherwise in the allowed country
      list) has exactly one remote-eligible role right now, "Growth Marketer," and its
      Ashby `location` field is the city "London," not a country or "Worldwide" value -
      too ambiguous to justify `hires_globally: true` on one data point.
    - **Reedsy** (Ashby `reedsy`, London-HQ'd) posts real growth/marketing roles
      ("Community Growth Manager," "Growth Marketing Intern") but every one of them is
      scoped "Remote Europe" / "United Kingdom" specifically, never worldwide.
    - **Jiga** is Israel-HQ'd, outside the allowed sourcing countries (US/UK/AU/CA/SG/
      DE), so its genuinely promising "Growth Marketing Lead - Remote/Anywhere" title
      was never eligible to add regardless of the posting's actual scope.
    - **Who Gives A Crap** (Greenhouse `whogivesacrap`, Australia-HQ'd) lists its
      "Dream Job - Marketing Department" role across five explicitly named countries
      (Australia, UK, US, Philippines, China) - genuinely multi-country, but Africa is
      not one of the five, so `remoteNamesOtherCountry` correctly excludes it.
    - **Zapier** (Ashby `zapier`) is independently confirmed to hire via
      employer-of-record outside the US/Canada/Australia, but its currently open roles
      are all tagged to a specific region (APAC, NAMER, South America, India) rather
      than worldwide, and none is a growth/marketing title today.
    - **Instrumentl, Decile Group, Right Side Up, Ladder, Tuff, Common Thread
      Collective** (growth/marketing agencies, checked because agencies skew more
      likely to hire remote-globally than product companies do) all came back
      US-city-scoped on every open role, with no "remote" wording at all in some cases
      - none added.
- **2026-09-12, same day: added 20 more sources at Omole's request** (106 -> 126
  active), this time by directly probing Greenhouse/Ashby/Lever/Workable/
  SmartRecruiters for well-known company slugs rather than searching job listings
  first - faster than the search-first method above once the "which companies" list
  is obvious (mainstream SaaS/dev-tool/fintech/crypto names), though it still leans on
  the same broad-net logic as the German batch: most of these 20 are `hires_globally:
  false` and were added for future coverage, not because today's snapshot already has
  an eligible match. Webflow, Airtable, Asana, ClickUp, Vercel, Klaviyo, Supabase,
  Figma, Coinbase, Gemini, GitLab, and Mercury (all US); Zopa, ASOS, and Gymshark (UK);
  Trade Republic and Contentful (Germany); Canva (Australia). All 20 verified live with
  a real, non-empty job list before adding, same as every prior batch.
  - **PlanetScale and ConsenSys both got `hires_globally: true`, on the same live
    evidence standard as Canonical's original EMEA-scoped postings** -
    PlanetScale has a live "Customer Support Engineer" role with the bare location
    value `EMEA` (not a country name, not prose - literally the location field
    content), and ConsenSys has several live roles (`Product Marketing Lead - Trade`,
    two security/design engineer roles) whose location field is a multi-value string
    including `EMEA - Remote` as one of the explicit options. `remoteNamesOtherCountry`
    already treats "EMEA" as Africa-inclusive, but that only stops it from being
    wrongly excluded - it doesn't grant "worldwide" on its own, so without
    `hires_globally: true` these specific roles would still fall through to the "bare
    remote, no other signal" default and get excluded anyway. Confirmed working:
    GitLab's very first sync after being added surfaced a "Business Development
    Representative, Turkish Speaking" role as genuinely `eligibility: worldwide` (not
    `unconfirmed`) even with `hires_globally: false`, so a language-skill-scoped-not
    -country-scoped role can pass on its own text without needing the source flag.
  - **One real near-miss caught before it was added: `neon` exists on both Ashby and
    Lever, but they are two unrelated companies.** Ashby's `neon` is neon.tech, the
    US-based Postgres/serverless-database company (job titles in English, "New York
    City"). Lever's `neon` is Neon (neon.com.br), a Brazilian digital bank - its
    postings are entirely in Portuguese ("Analista de Growth," "Remoto") and Brazil
    isn't on the allowed sourcing-country list regardless. Only `ashby:neon` was added;
    a token match alone was not treated as confirmation of which company it actually
    is - the job content was read too.
  - **Also verified live and rejected for a specific reason, not just skipped:**
    Oyster (Ashby `oyster`, ~25 open roles) was deliberately not added even though it
    passed every mechanical check, because `oyster` is itself one of the literal
    trigger words in `classify.ts`'s `WORLDWIDE_PATTERNS` (the EOR-name list also
    containing `deel`, `remote.com`, `papaya global`). Adding Oyster
    as a source would mean every one of its own postings' company-description
    boilerplate contains the word "Oyster," which would auto-pass every single one of
    its postings as `eligibility: worldwide` regardless of that specific role's actual
    scope - exactly the systematic false-positive already caught and avoided for
    Remote.com. This is a general rule going forward, not just an Oyster-specific one:
    never add Deel, Remote (remote.com), Oyster, or Papaya Global themselves as a
    `job_sources` row, since their own name appearing in their own job postings would
    trigger a guaranteed false "worldwide" read on every posting they have.
  - Other candidates verified live this same pass but left out only because 20 was the
    asked-for number, not because anything was wrong with them (kept here so they don't
    need re-verifying if more sources are wanted later): Netlify, Linear, Mixpanel,
    Airbyte, Docker, Render, Justworks, Anchorage, Sanity, WorkOS, Customer.io,
    Postscript, Recharge, Clerk - all real, live, correctly-countried boards with at
    least one open role at the time.
- **All 20 of the sources immediately above were the wrong call and got deactivated
  the same day, minutes after being added.** Omole's own words: "these are popular. im
  looking at companies that pays between $1000-5000 per month." This is the exact
  mistake this file already warned about, word for word - see "Sources should target
  companies paying roughly $1,000-5,000/month, not enterprise SaaS - and picking
  companies from memory was the wrong method for that" below - and it was made anyway,
  by picking mainstream names (Webflow, Asana, Figma, Coinbase, Canva, GitLab...)
  straight from memory instead of searching for them. Verifying a company's board is
  live is necessary but was never sufficient; it says nothing about whether the
  company is small enough to fit the budget this feature is actually sourcing for.
  Deactivated rather than deleted (`active: false`, same treatment as the Nigerian
  companies and FairMoney/Helium Health), so the record of what was tried stays
  intact instead of quietly disappearing.
  - **Re-done properly the same day: 10 sources added via live search for early
    -stage/small companies specifically, each with its funding and headcount checked
    before adding, not just its board.** This step is the one the original "picking
    from memory" fix (the Allium/GetPoppy AI/Checkly/Resend/turbopuffer batch,
    documented below) hadn't yet needed to add: search results alone can still surface
    a company that looks small by open-job-count but turns out to be a unicorn.
    **HappyRobot** (73 open Ashby postings, several genuinely remote across Argentina/
    Mexico/France) looked like exactly the right small, globally-hiring profile - a
    funding check found $210M raised across a Series C at a $1.2B valuation, so it was
    left out entirely despite being an otherwise ideal fit mechanically. **Found**
    (found.com, only 5 open roles, real "Growth Marketing Lead" and "Product Marketing
    Manager" titles) looked lean by job count alone but has raised $130M and has 115
    employees - also left out. **Prompt** (Prompt Therapy Solutions, EMR software,
    44 open roles) turned out to have 152 employees; **Employ** (parent of Lever,
    only 3 open roles on its own board) turned out to be an 850-employee, PE-owned
    roll-up - both left out for the same reason. The lesson going forward: job-board
    open-role count is a weak proxy for company size and must not substitute for an
    actual funding/headcount check before adding a source, not just for avoiding
    famous names.
    - **Added: Magentic** (Ashby `magentic`, London/UK, $5.5M seed), **Firecrawl**
      (Ashby `firecrawl`, US/SF, YC S22, 3 actual employees despite 25+ open roles),
      **Maximus Tribe** (Ashby `maximustribe`, US, 2 open roles), **Altimate.ai**
      (Ashby `altimate`, US, Series A, ~50 people), **Notabene** (Ashby `notabene`,
      US/NY, `hires_globally: true` - a live "Customer Success Manager, EMEA
      (Remote)" posting is the evidence, same bar as Canonical), **Anagram Security**
      (Lever `anagramsecurity`, US/NYC, 1 open role, "Founding Marketer - Remote"),
      **Sybill AI** (Ashby `sybill-ai`, US/Mountain View, ~$5M ARR), **Feathery**
      (Ashby `feathery`, US/SF - confirmed by search, not the Toronto office its job
      locations suggested), **PolicyMe** (Lever `policyme`, Toronto/Canada, 12 open
      roles), **Dosu** (Ashby `dosu`, US/SF, 3 open roles, explicitly described as
      "early-stage" - kept despite having no remote-tagged role yet, same "a real
      board can post something eligible later" logic as the German batch).
    - **Rejected in this pass for HQ or ambiguity reasons, not fit**: Easygenerator
      (Ashby `easygenerator`) had the single best eligibility signal found all
      session - live roles in Cape Town, Dubai, and Alexandria all tagged
      `isRemote: true` - but its HQ is Rotterdam, Netherlands, off the allowed
      sourcing-country list, so it was left out despite the temptation. Stacks (Ashby
      `stacks`, Amsterdam/London offices) had the same country ambiguity and weak
      remote signal besides. Watershed (Ashby `watershed`) and Directive Consulting
      (Ashby `directive`) were skipped as probably-too-established (climate SaaS
      unicorn-track and a 75-listing marketing agency, respectively) without a hard
      funding number confirming it either way - flagged as unconfirmed rather than
      cleared, unlike the four rejections above which had a specific number behind
      them.
- **Whether 100 sources can actually produce 20 matches a day was tested empirically,
  not guessed - the real answer at the time was close to zero, and the gap is why the
  "web" track (below) exists.** A one-off simulation script re-implemented
  `classify.ts`'s actual logic in a standalone Node script, fetched live data from all
  100 sources, and ran the full funnel: of 9,509 total postings, 4,186 were remote, 338
  posted in the last 7 days, 160 passed the seniority filter, 112 passed the
  experience-years filter, only 9 mentioned a growth/marketing keyword at all, and only
  2 of those passed eligibility - and even those 2 were false positives from the plain
  keyword scan (a "Business Development Representative" and a "Solutions Architect"),
  not real matches. Widening the freshness window to 30 days barely moved it (3 matches,
  same false-positive pattern) - freshness was never the bottleneck. The real
  bottleneck: growth/marketing roles are a small slice of any single company's postings,
  and 98 of the 100 sources are `hires_globally: false` by design (see above), so almost
  nothing survives the full intersection of remote + fresh + junior + track-keyword +
  eligible. More companies with the same profile (large SaaS, no confirmed global
  hiring) would not fix this - it is a multiplication problem, not an addition problem.
  This same simulation script is the fastest way to sanity-check any future claim about
  match volume against live data rather than guessing; it was not saved to the repo
  (built and run from the scratchpad, one-off), so re-build it from `lib/jobs/classify.ts`
  and `lib/jobs/fetchers/*.ts` if this needs re-checking later - it's a straight
  reimplementation of both, not new logic.
- **2026-09-14/15: "no big companies" cleanup and re-population, run entirely outside
  the app (direct SQL against Supabase, no code changes) after Omole zeroed in on the
  actual problem - not volume, but that the 116-source list built during the earlier
  "make it 100"/"make it 105" pushes was almost entirely enterprise/unicorn-scale
  companies (Snowflake, Notion, Robinhood, Datadog, Wise, N26, HelloFresh, Miro,
  Sentry, Ramp, Plaid, Okta...), added before the "$1,000-5,000/month, not enterprise
  SaaS" budget-fit rule (see above) existed and never revisited against it. Omole's own
  instruction was explicit: "no big companies," confirmed to also mean deactivating the
  existing ones, not just filtering new adds.
  - **~90 of the 116 active sources were deactivated** (`active = false`, not deleted,
    same pattern as every prior deactivation in this file), leaving only the 4
    aggregators (arbeitnow/remoteok/remotive/workingnomads) and the dozen-odd
    already-small companies from the original budget-fit-correction batch (Checkly,
    Dosu, Feathery, Firecrawl, GetPoppy AI, Magentic, Maximus Tribe, Notabene,
    Sybill AI, turbopuffer, Allium, Altimate.ai, Anagram Security, PolicyMe, Superside,
    Wishpond, Float) - 21 sources total. One deliberate casualty: **Canonical** (maker
    of Ubuntu) was cut too, despite being the strongest single `hires_globally`
    evidence source in the whole list, for consistency - a large, established company
    is still a large, established company regardless of how good its worldwide-hiring
    signal is.
  - **Re-populated from 21 back up to 78 active sources**, all live-verified the same
    day, via many research rounds (a single background research agent, continued
    across ~14 rounds, plus two more spawned in parallel partway through to speed
    throughput once the sequential pace became a problem). Every addition holds to:
    confirmed HQ in an allowed country, confirmed small size (roughly under 150
    employees / $50M total raised / unicorn-adjacent valuation - a role-count/breadth
    signal, e.g. 10+ simultaneously open roles across many departments, was used
    repeatedly as an additional size red flag even without a hard funding number),
    a live-verified board on one of the 7 supported ATS platforms, and no
    signup-required apply flow (a second explicit instruction this pass, on top of "no
    big companies"). "Recently raised a small round" was explicitly corrected to not
    count against a candidate - only absolute scale does; a seed/Series A startup is
    exactly the target profile, having raised money at all is not disqualifying.
  - **Allowed HQ countries expanded mid-pass**: the original US/UK/Australia/Canada/
    Singapore/Germany list (see above) now also includes **Switzerland, Ireland, New
    Zealand, UAE, Philippines, Malta**, per Omole's direct instruction. None of the
    prior wrong-country rejections (Estonia, Lithuania, France, Spain, Czech Republic,
    India, Netherlands, Ukraine) fell in one of these 6, so nothing needed revisiting
    retroactively - it only widened the ground for new candidates. A recurring nuance
    for Philippines specifically: a company actually HQ'd there is fine, but a
    US/UK/etc-HQ'd company's board that's really outsourced Philippines-based admin/VA/
    support roles is still the same staffing-platform red flag as before, unrelated to
    this change.
  - **WebSearch ran out mid-pass - a real, hard limit, not a judgment call.** The
    session's WebSearch quota (`CLAUDE_CODE_MAX_WEB_SEARCHES_PER_SESSION`, 200 calls)
    is shared across the whole session **including every subagent spawned from it** - a
    fresh subagent does not get a fresh quota, confirmed by testing a brand new agent
    (it hit the same exhausted budget on its very first call) and by Claude's own
    top-level WebSearch call failing identically. Omole chose to keep going without
    raising the limit rather than pause to restart a session, so the rest of this pass
    ran on WebFetch/curl only - no new-candidate discovery via search at all past that
    point.
  - **What worked without WebSearch, roughly in ascending order of yield**: mining the
    aggregator APIs already used as data sources (Remotive/Arbeitnow/Jobicy/RemoteOK)
    for company names as leads, then live-verifying each one's own ATS board - low
    yield, most hits were already-known-large companies or staffing/BPO operations
    riding along in the same feeds. HN's "Who is Hiring" monthly threads, fetched via
    Algolia's public API (`hn.algolia.com/api/v1/...`, no auth) - real people
    self-report company name, funding stage, location, and remote policy in one
    comment, which solves HQ/size verification in a single fetch; a combined query
    across all ~29 months of threads at once (one Algolia call per search term, OR-ed
    across every thread's story id) was much faster than paging thread by thread, but
    yield still saturated hard after enough months - by the end, most queries surfaced
    the same recurring ~15 companies already seen or already decided. **GitHub-hosted
    curated company/job lists were the highest-yield method found**, but only once
    each list's own scope was actually read first: `established-remote` and
    `awesome-jobs-in-australia` both explicitly curate 50+/enterprise-tier companies
    (confirmed via their own READMEs and re-confirmed by running their contents through
    the same probe anyway - zero viable hits, all Stripe/Figma/Xero/Notion-tier) and
    were correctly skipped once that was clear; `remoteintech/remote-jobs` (886
    structured entries with a `company_size` taxonomy) and especially
    `midori-profile/reliable-remote-jobs-daily` (a **pre-verified** `companies.yaml`,
    633 entries already carrying resolved `ats`/`token` fields from someone else's own
    ATS-verification pipeline) were far better - the latter eliminated the
    token-guessing step entirely and was still producing a backlog of 100+ unverified-
    but-promising candidates when this pass was stopped.
  - **What didn't work at all**: Product Hunt and Indie Hackers job pages (both
    client-rendered SPAs, WebFetch gets an empty shell); `workatastartup.com`
    (same - confirmed it returns an identical generic "Software Engineer" listing
    regardless of the URL path tried, meaning its client-side routing can't be reached
    via fetch at all); Remotive's own `category` query param, re-tested this pass and
    found **newly broken** - it now returns the identical 16-job feed regardless of
    category value (a real regression from what's documented earlier in this file,
    where `category` was merely "doesn't narrow results," not "doesn't work at all");
    Arbeitnow's pool is structurally the wrong ATS ecosystem for this project - its
    German-SME listings run on Personio or similar, not any of the 7 platforms this
    project supports (0 of 14 sample companies resolved to a supported ATS).
  - **Recurring gotcha, worth remembering for future research passes: the same
    company-name/domain can resolve to a completely different, unrelated company on a
    different ATS platform, or even the same platform with a shared common word as the
    token.** Confirmed multiple times this pass - `neon` (Ashby: the real neon.tech;
    Lever: an unrelated Brazilian bank, already known from an earlier pass), `dispatch`
    (Greenhouse and Ashby each resolve to a different company sharing that word),
    `palantir` (both Lever and SmartRecruiters resolve to Palantir Technologies, the
    large defense-tech company, not "Palantir.net" a small Drupal agency),
    `clutch`/`stemwave`/`marble` (each resolved to an unrelated company on the obvious
    token guess). The fix every time was the same: always read the live board's actual
    job titles, locations, and company description before trusting a name/token match,
    never assume a plausible-looking token is the right company.
  - **Final state: 78 active sources** (up from the 21 left after the big-company
    cleanup), all live-verified the same day against every rule above. The stated goal
    for this pass was 200 - it was stopped short of that by explicit instruction once
    Omole decided to wrap up, not because research had hit a hard ceiling the way the
    105-source pass's ceiling test did; there was a real backlog of unverified
    candidates (`companies.yaml` alone had 100+) still queued when it stopped. Treat 78
    as "where curation paused," not "the most this method can find."
- **2026-09-22: Omole reported no matches for a full week. Root cause, confirmed by
  running the sync live: the pipeline itself was healthy (78 sources checked, 0
  inserted, no errors), but the 9/14-15 "no big companies" cleanup above had
  deactivated every source that had ever actually produced a confirmed real match**
  (GitLab's Turkish-speaking BDR role, Canonical's/Deel's/PlanetScale's/ConsenSys's
  EMEA-scoped postings), leaving only 78 small, budget-fit companies, of which just 11
  were even flagged `hires_globally: true` - consistent with every earlier ceiling
  test in this file, just with the highest-signal sources now gone too. No config was
  reverted; instead, a fresh research pass (continuing the same `companies.yaml`
  backlog from the 9/14-15 pass) found **3 new small companies with a genuinely
  eligible live posting today** (Rwazi - ashby `rwazi`, 3 roles literally titled
  "...- Global (Remote)"; SearchApi - ashby `searchapi`, "Fully Remote. Work from
  anywhere."; Nibiru - lever `nibiru`, "Remote - Anywhere") plus **14 more small,
  correctly-HQ'd companies with a live board and an on-persona role today but no
  eligible match yet**, added for future coverage the same way the German batch was
  (ARQ, Avoca, Bitmovin, Cambly, Conveo, Exa, Finch, Gigs, Phoenix, Popl, saas.group,
  Snappr, Stepful, Tavus). **B12, Fieldguide, and Taktile were found with real live
  matches too but deliberately left out** - each has unconfirmed funding/headcount
  that may put it past the small-company bar (B12 is backed by General
  Catalyst/Breyer Capital), same "verify size before adding, don't guess" standard
  that excluded HappyRobot/Found/Prompt/Employ earlier. Active sources: 78 -> 98.
- **Same day: a new "relocation" eligibility path, for a second and separate request
  - Omole also wants onsite roles in Germany, the Netherlands, or Austria that
  explicitly sponsor a work visa or relocation, not just remote work reachable from
  Nigeria.** This is a real architectural change, not a filter tweak: every posting
  that failed `isRemoteJob` used to be rejected on the very first line of
  `classifyJob` - it now falls through to a second check instead of being rejected
  outright. `JobEligibility` (`lib/jobs/types.ts`) gained a third value, `"relocation"`,
  alongside `"worldwide"`/`"unconfirmed"`; `supabase/migrations/0010_relocation_eligibility.sql`
  updates `job_matches`'s eligibility check constraint to allow it (applied by hand in
  the Supabase SQL editor, same as every migration in this repo - nothing runs them
  automatically). `lib/jobs/classify.ts` adds `RELOCATION_COUNTRY_PATTERN` (Germany/
  Netherlands/Austria, by name and major city) and `VISA_SPONSORSHIP_PATTERN`
  (sponsorship/relocation-package language) - a posting only gets `eligibility:
  "relocation"` when BOTH patterns match its combined location+description text, and
  `EXCLUSION_PATTERNS` (the existing "unable to sponsor"/"no visa sponsorship" list)
  is checked first and still overrides it, so a posting that explicitly refuses
  sponsorship can never be misread as offering it. `hires_globally` plays no role in
  this path at all - it only ever mattered for the ambiguous-bare-remote case in the
  worldwide/unconfirmed path. `app/admin/jobs/JobRow.tsx` shows it as its own badge,
  "Onsite, sponsors relocation." A live research pass (guessed and live-probed ~70 DACH/
  Benelux company tokens, reading actual posting text rather than trusting company
  reputation) found **3 companies with a real, currently-open, marketing-adjacent
  role quoting real sponsorship language**: N26 (greenhouse `n26`, "A relocation
  package with visa support for those who need it." - confirmed on 44 of its 49
  Berlin/DE/NL/AT postings, i.e. a blanket company benefit rather than role-specific,
  so it's the most durable of the three going forward), HelloFresh (greenhouse
  `hellofresh`, "Berlin relocation support," on 26 of 111 postings), and SumUp
  (greenhouse `sumup`, "relocation assistance," on 6 of 47 postings). All three are
  large, well-known companies - a deliberate departure from the "no big companies"
  rule elsewhere in this file, since visa sponsorship is inherently something only
  well-resourced companies offer; this is specific to the relocation track, not a
  reversal of that rule for the growth/marketing/web remote tracks. N26 and HelloFresh
  had actually been added once already, during the original German-company batch
  earlier in this file, then deactivated in the 9/14-15 cleanup - re-adding them
  collided with `job_sources_unique_board`'s unique constraint on `(ats,
  board_token)`, fixed by reactivating (`update ... set active = true`) instead of
  re-inserting. Checked and ruled out with real evidence, not just skipped: GetYourGuide,
  Solarisbank, Wolt, Bitpanda, GoStudent, Raisin, and Grover all have zero sponsorship
  language anywhere on their boards; Celonis/Scout24/Isar Aerospace have sponsorship
  somewhere but only on unrelated technical roles, not marketing/growth/web.
- **2026-09-22, same day: Omole set an explicit target of 120 active sources (up from
  98). Reached exactly on the fourth research round**, each round handed a fresh,
  non-overlapping lead source since the earlier ones dry up fast (yield per round:
  9, 7, 6 - a clear diminishing-returns curve, consistent with every prior sourcing
  push in this file). All added via direct SQL against Supabase (admin-curated data,
  not schema, same as every prior source addition) rather than a migration.
  - **Round 2 (9, mixed lead sources):** Flagright (ashby `flagright.com`, Singapore
    -founded/multi-hub, $20.1M raised, 49 employees, live "Senior Field Marketing
    Manager - EMEA" role), Odin (ashby `odin`, London, $3M raised, 99 employees, live
    "Founding Growth Lead" role), Melotech (ashby `melotech`, Berlin, ~10 employees
    seed-stage, live "Founding Growth Manager"/"Founding Head of Brand" roles), Kit/
    formerly ConvertKit (ashby `kit`, bootstrapped, 149 employees - right at the size
    boundary, added for future coverage with no live opening today), Sora Union
    (greenhouse `soraunion`, `hires_globally: true` - 42 employees explicitly
    distributed across 20 countries, live "Global" location value, real Brand
    Strategist/Designer roles), Padlet (ashby `padlet`, bootstrapped, 63 employees),
    Langdock (ashby `langdock`, Berlin, YC S23, $3.5M raised, roles Germany-scoped not
    worldwide), Recast (greenhouse `recast`, Albany NY, $4.46M raised, 66 employees,
    role doesn't hit the current keyword list - future coverage), IntegraFEC
    (greenhouse `integra`, Austin, ~30 employees, no VC funding).
  - **Round 3 (7, YC directory + one lead-list hit):** Mira Mace (ashby `miramace`,
    Boston, 1-10 employees, Foundation Capital/DefineVC seed, live "Growth Marketing
    Manager, D2C" role), Tali AI (lever `tali-ai`, Toronto, seed, 55 employees),
    DeepJudge (ashby `deepjudge`, Zurich, $41.2M Series A, 80 employees, role scoped
    Remote-USA/Canada), Secfix (ashby `secfix`, Munich, $12M Series A, 37 employees,
    future coverage), jetfuel.agency (smartrecruiters `Jetfuelagency`, Vancouver, no
    VC funding, ~21-50 employees), Tiugo Technologies/CKSource-CKEditor (recruitee
    `tiugotech`, Boston, 71 employees), GetGround (ashby `getground`, London, $25.3M
    raised, 82-89 employees).
  - **Round 4 (6, direct niche-token guessing - not famous-name guessing, which this
    file already documents as the wrong method):** Trigger.dev (ashby `triggerdev`,
    London, $16-20M raised, ~18 employees), Chatbase (ashby `chatbase`, Toronto,
    bootstrapped, ~26-30 employees), Magic Patterns (ashby `magicpatterns`, SF, $7.2M
    raised, 11-50 employees, live "Head of Growth"/"Head of Community" roles), Nango
    (ashby `nango`, SF, $7.5-8M raised, ~18 employees), Plain (ashby `plain`, London,
    $21.3M raised, 44-50 employees, live "Product Marketing Lead" role), Knock (ashby
    `knock`, Brooklyn, $18M raised, 23 employees, future coverage). This round's fetch
    caught a real gotcha worth remembering: SmartRecruiters returns a false-positive
    HTTP 200 with an empty `content: []` for a token that doesn't exist at all - don't
    trust the status code alone, check the body has real entries.
  - **Only Sora Union got `hires_globally: true`** across all 22 - every other new
    source is the safe `false` default, added for future coverage the same way the
    German batch was.
  - **Left open, not decided:** Swoop (ashby `swoopapp`) surfaced in round-3 lead-list
    research with a live "Founding Marketing Designer" role literally based in
    Nigeria - but the company itself is Lagos-HQ'd, which fails the standing
    US/UK/Australia/Canada/Singapore/Germany/Switzerland/Ireland/New Zealand/UAE/
    Philippines/Malta-only sourcing rule (the same rule that excluded Nigerian
    fintechs in an earlier pass). Not added pending Omole's call - it's a genuinely
    different case from the earlier rejected batch (a real live Nigeria-based opening,
    not "trivially eligible by virtue of being Nigeria-HQ'd"), but the file's rule is
    about company HQ, not role location, so it still needs an explicit decision rather
    than a silent add.
  - **Wellfound (formerly AngelList Talent) confirmed not addable, and why it's a hard
    dead end, not just unresearched**: it's a client-rendered SPA - a plain fetch
    returns an ~11KB shell with no job data or ATS links anywhere in the raw HTML
    (the same failure mode already documented for workatastartup.com). It also has no
    public, unauthenticated API anymore (AngelList closed that off years ago), so it
    fits neither this project's "structured ATS API" fetchers nor the "scrape a plain
    HTML page" fallback `custom.ts` uses. Fixing this would need a real headless
    browser session, which this project's serverless-function architecture
    deliberately avoids (the same reasoning that ruled out browser-automated ATS
    submission in the first place) - same category as Himalayas (Cloudflare-blocked)
    and We Work Remotely's own apply pages (403/SPA-blocked on a plain fetch).
    **Superseded 2026-09-25, see the next bullet: both Wellfound and Work at a
    Startup turned out to be readable with a plain fetch after all.**
- **2026-09-25: Wellfound and Work at a Startup (YC) added as sources, the only two
  exceptions to the "no account sign-up to apply" rule, by Omole's explicit
  instruction.** Don't treat this as loosening the rule for anything else.
  - The note above was wrong about both being unreadable without a browser, which is
    worth knowing before calling any site a dead end: the pages that were checked
    before were the wrong ones. Wellfound's remote role pages
    (`wellfound.com/role/r/<slug>`) are server-rendered and carry every listing's full
    data in `__NEXT_DATA__` (title, full description, `liveStartAt`,
    `yearsExperienceMin`, and `acceptedRemoteLocationNames`). An empty
    `acceptedRemoteLocationNames` on a remote listing is what Wellfound's own job page
    renders as "Hires remotely in Everywhere" (confirmed on a live listing), so
    `lib/jobs/fetchers/wellfound.ts` maps it to `"Remote, Worldwide"`; a non-empty list
    becomes `"Remote (India; Philippines)"`-style text that the usual
    `remoteNamesOtherCountry` check excludes unless it names Africa/Nigeria. Guessed
    role slugs that don't exist 303-redirect to `/remote`. Work at a Startup's search
    box calls a public JSON endpoint (`/jobs/search?q=...`, 30 results per query), and
    each job's public page embeds its full data as the Inertia `data-page` attribute,
    including a `sponsorsVisa` field: `"US citizen/visa only"` is dropped in the
    fetcher, and a bare "Remote" with `"US citizenship/visa not required"` is labeled
    as open anywhere. WAAS exposes no posting date (`posted_at` stays null).
  - `board_token` for both is a comma-separated list (Wellfound role slugs, WAAS search
    terms) or `"default"` for each fetcher's built-in marketing/growth/web design set.
    `supabase/migrations/0011_add_wellfound_waas_ats.sql` widens both `ats` check
    constraints and inserts the two sources. `JobRow.tsx` shows a "Needs a Wellfound
    account" / "Needs a YC account" badge on their matches.
  - First live run: Wellfound returned 218 remote listings and 2 real matches (both
    worldwide), WAAS returned 13 relevant listings and 0 matches, since nearly every YC
    remote role is US-scoped. Wellfound skews heavily toward India-scoped and unpaid/
    equity-only listings.
- **2026-09-25: Hacker News "Ask HN: Who is hiring?" added as a source (`ats:
  hackernews`, `supabase/migrations/0012_add_hackernews_ats.sql`).** Omole asked
  whether startup job sites other than YC are all US-only. Mostly yes, since funded
  startups hire where they have payroll, and HN was picked as the best next source
  because founders post their own roles there and often state the remote scope
  outright ("REMOTE (Worldwide)" vs. "REMOTE (US only)"). Applying is by email or the
  company's site, so it meets the normal no-account rule.
  - `lib/jobs/fetchers/hackernews.ts` reads the latest thread (plus the previous one
    while the new one is under a week old) through Algolia's free HN API. Each
    top-level comment is one company. Its first line is conventionally a pipe header
    ("Company | Roles | Location | ..."), and one post usually lists several roles,
    mostly engineering. So each relevant-looking role phrase from the header, plus
    short body lines, becomes its own job (`external_id` = `<commentId>-<index>`),
    letting `classify.ts` judge "Founding Marketer" without rejecting it because the
    same post mentions "Senior Engineer". This produces noisy phrases ("Our website:",
    AI research lines) that the title keywords then reject. That's expected.
  - `posted_at` is null on purpose: the thread is posted once a month and roles stay
    open for weeks, so the comment date would trip the 7-day freshness check for
    almost everything after the month's first week.
  - First live run (September 2026 thread, 257 posts): 61 role entries, 0 matches.
    The closest was Railway's "Senior Growth Marketer" (REMOTE (Worldwide)), dropped by
    the seniority filter. The run also exposed a shared bug: `WORLDWIDE_LOCATION_VALUES`
    read "Remote (NYC / SEA / global overlap)" as worldwide. It now ignores "global"
    when followed by overlap/hours/time zone, and also accepts "everywhere".
- **Track keywords match the job title only, never the description (2026-09-25).**
  Omole was shown an SEO/GEO job and asked why. Keywords used to be matched against
  title plus description, and descriptions mention "content marketing" or "digital
  marketing" in passing all the time, so roles unrelated to his CVs got through. Now
  `classify.ts` matches keywords against the title only and rejects
  `OFF_PERSONA_TITLE_PATTERN` titles first: SEO/GEO/AEO/SEM, field/partner/channel
  marketing, analyst/data, sales as a role (sales development/rep/manager, BD, SDR,
  account executive; "Sales Copywriter" still passes), devrel, anything with
  "engineer" or "technical", PR and communications (except "marketing
  communications"), Amazon/marketplace, recruiting. It also rejects
  `UNPAID_TITLE_PATTERN` titles (unpaid, volunteer, equity-only, co-founder). A title
  that names SEO as one part of a broader role ("Growth Marketing Manager (SEO, Email,
  Social)") is rejected too. That's deliberate, since Omole said SEO roles don't fit.
- **The keyword lists are checked against the three portfolios, not guessed
  (2026-09-25).** Omole's corrections: product marketing is acceptable, and he uses
  Claude Code only for web design. So:
  - Product marketing, marketing communications, marketing ops (JobMingle CRM on
    /growth is marketing ops), lead generation (the 462-lead campaign), community
    manager/marketing, and short-form video/video content (/marketing) are all
    tracked keywords.
  - `WEB_KEYWORDS` is only what /web actually shows: web/website designer, web design,
    website developer, landing page designer/developer, and WordPress (the creative
    marketing CV lists it). Webflow, Framer, Shopify, Squarespace, no-code/low-code
    developer, founding designer, AI product builder, creative technologist, rapid
    prototyper, and vibe coder were removed, since none of those tools or roles appear
    in the portfolio. Engineering titles stay out, since Claude Code is for web design
    only. The Gemini grounding text for the web track (`candidateContext.ts`) dropped
    "rapid prototyping" for the same reason.
- **Omole doesn't write code by hand. Every /web project was built with Claude Code,
  and that's positioned as his edge, not hidden (2026-09-25).** His own words: "i do
  not code by hand. i only use claude code." (This clarified an earlier "only for web
  design," which meant his only coding is through Claude Code, not that Claude Code is
  off-limits elsewhere. The JobMingle CRM's `builtWith` already lists Claude Code, so
  /growth's "AI-Assisted Marketing Ops (Claude Code)" skill is accurate and stays.)
  - /web copy (`lib/web-content.ts`) now says it outright: `webAbout[0]` ("I build
    every one of them with Claude Code. I don't write code by hand..."), the meta
    description, the second `webDifference` pair (hand-written pages vs. Claude Code,
    tied to the 24-hour WaterBrooks build), `webProcess` step 2, and GluFloat's "Built
    entirely with Claude Code" highlight.
  - **Cover letters don't announce this.** Omole: "you dont have to state that i do
    not write code by hand or say everything i do is using claude code on the cover
    letter... only write it based on what the job ad says so it feels like i read the
    job ad." `candidateContext.ts`'s web branch passes the Claude Code fact as
    background only: mention Claude Code/AI tools only if the ad asks for them, and
    never claim hand-coding or fluency in a language or framework. The prompt in
    `gemini.ts` builds each letter around the ad's own named responsibilities and
    requirements, answering each with the closest proof and leaving out background
    the ad doesn't ask about.
  - `WEB_KEYWORDS` now includes AI-builder titles (vibe coder/coding, AI builder, AI
    product builder, AI web designer/developer, AI-native builder, "claude code"), and
    `MARKETING_KEYWORDS` includes AI-first marketing titles (AI marketing/marketer/
    content/creative). These roles are written for exactly this way of working.
    Anything titled "engineer" is still rejected, since those interviews expect
    hand-coding.
  - Not changed: `public/omole-usuangbon-web-developer-cv.pdf` mentions Claude Code in
    its summary and skills, but its GluFloat line still says "using AI tools
    throughout" and it never states "every project built with Claude Code." Its HTML
    source isn't in the repo, so updating it means rebuilding the PDF.

## The "web" track: AI-assisted rapid web/product builder

A third job track alongside growth and marketing, added 2026-09-09 after the volume
simulation above showed the first 100 sources (general SaaS companies) essentially
never produce a match, and Omole pointed out his `/web` portfolio - AI-assisted web
design and development, building fast (the WaterBrooks 24-hour build), not a
traditional CS-background software engineer - was an entirely untapped persona for
this feature.

- **`JobTrack` (`lib/jobs/types.ts`) is now `"growth" | "marketing" | "web"`.**
  `lib/jobs/classify.ts`'s track-resolution logic was generalized from a two-branch
  if/else into a `Record<JobTrack, string[]>` keyword-hit map plus a "pick whichever
  scored highest among the eligible tracks" loop, so adding a fourth track later is a
  data change (a new keyword list, one more `Record` entry) rather than another
  rewrite of the branching logic. A source's own `track` still narrows which tracks are
  even considered ("both" means "any of the three," not literally two) - a posting
  matching an untagged track's keywords is still kept, not dropped, same as before.
- **`WEB_KEYWORDS`** is deliberately narrow: "no-code developer," "webflow
  developer/designer," "framer developer/designer," "landing page designer/developer,"
  "website designer," "web designer," "founding designer," "ai product builder,"
  "creative technologist," "rapid prototyper," "vibe coder"/"vibe coding," "shopify
  developer," "wordpress developer," "squarespace designer." Deliberately excludes
  "web developer" and "software engineer" on their own - a plain match against those
  would flood the track with traditional engineering roles this CV doesn't compete
  for, the exact failure mode confirmed live while researching sources for it (a search
  across all 100+ existing sources for "AI-native"/"AI-first"/"founding engineer"
  style titles returned 24 hits, and every single one - "AI Native Web Platform
  Engineer" at Databricks, "Founding Engineering Lead" at Datadog, "AI Marketing
  Technologist Lead" at Plaid - was a traditional software engineering role at a large
  SaaS company, not this persona, confirming the existing 100 sources are the wrong
  company type for this track entirely).
- **`Omole Usuangbon - Web Developer CV.pdf`** did not exist before this - Omole asked
  for it to be generated from scratch, following `cvwriting.md`'s house template (name
  centered 21pt blue `#1F4E79`, role line, thick blue rule, section order, right
  -aligned dates via flex not a table, 2-page target) and populated only from facts
  already published and vetted elsewhere: the same five-role work history as the
  growth/creative CVs, bullets reframed toward building rather than campaigns, plus a
  new "Web Projects" section listing all five `webWork` entries (WaterBrooks, GluFloat,
  CV Reviewer, Sales Objections Toolkit, Designs & Konstruct) verbatim from their
  already-published site copy. **One inference, not a verbatim existing claim, flagged
  here per `cvwriting.md`'s own "tell Omole every assumption" rule**: the CV connects
  the CV Reviewer tool to the "career services line (CV writing...) that has served
  200+ paying clients" bullet already on the growth CV, since the tool is a plausible
  automation of that same manual CV-review work - true if that's what actually
  happened, but it was never stated as one fact anywhere, so treat it as unconfirmed
  until Omole says otherwise. Certifications were deliberately dropped from this CV
  (the existing four are all Growth Marketing-branded Udemy/LinkedIn Learning courses,
  which would read as mismatched on a web developer CV, not a matching credential) -
  the same "don't give the client skills they do not have" principle from
  `cvwriting.md`, applied to certifications rather than skills. Built as HTML with the
  same CSS-columns/flex approach used elsewhere in this codebase (no tables, per the
  ATS-parsing rule in `cvwriting.md`), rendered to PDF with headless Edge
  (`--headless=new --disable-gpu --no-pdf-header-footer --print-to-pdf`, the same tool
  and flags `cvwriting.md` specifies) rather than the Word-COM-automation docx path
  also described there, since only a PDF is actually needed here (there is no client
  -facing docx deliverable for this use case, unlike the CV-writing service business
  `cvwriting.md` was written for). Lives at
  `public/omole-usuangbon-web-developer-cv.pdf`, wired into
  `lib/jobs/prepare.ts`'s `CV_AND_PORTFOLIO` map alongside the growth and marketing
  entries, pointing at `https://omoleportfolio.vercel.app/web`.
- **`lib/jobs/candidateContext.ts`** gained a `web` branch building Gemini's grounding
  text from `lib/web-content.ts`'s `webAbout` and `webWork` (the same five projects the
  CV's new Projects section lists) - no separate technical-skills export exists for
  `/web` the way `growthTechnicalSkills`/`marketingTechnicalSkills` do, so that list is
  inlined directly in the branch instead, kept in sync with the CV's Technical Skills
  section by hand if either changes.
- **`supabase/migrations/0008_web_track.sql`** drops and re-adds both
  `job_sources_track_check` and `job_matches_track_check` to include `'web'` (the
  latter without `'both'`, matching the existing pattern - `job_matches.track` is
  always resolved to one specific track by `classifyJob`, never stored as `'both'`,
  same as `job_sources` before this change let the admin tag a source that way).
- **First verified source for this track: Superside** (`ats: lever`, token
  `superside`, `hires_globally: true`, track `web`) - a "design as a service" creative
  agency with several roles whose location is the literal bare value `Global`
  (`Creative Technologist`, `Conceptual Art Director`, others), the strongest possible
  eligibility signal short of naming Africa/Nigeria outright. Genuinely came from a
  different company category than the growth/marketing sources (a creative agency, not
  a SaaS product company) - that's expected to be the pattern for this track generally,
  not a one-off. A parallel search across other no-code/AI-builder-adjacent companies
  (Bubble, Glide, Contra, Durable, Instrument, MetaLab, Fantasy) came up empty or
  irrelevant: Bubble and Durable's own internal hiring is for traditional software
  engineers building their product, not this persona; Glide's Greenhouse/Lever/Ashby
  boards under that name turned out to belong to an unrelated San Francisco health and
  social-services nonprofit, not the no-code app builder; Contra's and Instrument's
  open roles are onsite NYC/SF; MetaLab's and Fantasy's are Director/Lead-tier and get
  filtered by the seniority gate. Finding more sources for this track will keep needing
  agency- and freelance-marketplace-shaped searches, not more general SaaS company
  lists - a structurally different research pass than the growth/marketing sourcing
  above.
- **Sources should target companies paying roughly $1,000-5,000/month, not enterprise
  SaaS - and picking companies from memory was the wrong method for that, corrected
  once already.** Omole pointed out that guessing famous company names (the method
  used to build the first 100+ sources) is inherently biased toward large,
  well-funded, expensive-market companies - the ones anyone would already know by
  name - and structurally can't surface the smaller, leaner companies actually in his
  target budget. **None of the seven ATS platforms' public list APIs expose a
  compensation field** (confirmed by inspecting Ashby's raw JSON response directly -
  no salary data anywhere in it, and this matches what's already known about
  Greenhouse/Lever from earlier fetcher work) - budget fit can't be filtered
  programmatically the way remote/eligibility/seniority can, only inferred from
  company stage and description text, or confirmed by hand when actually applying.
  **Live web search (`site:jobs.ashbyhq.com "growth marketer" remote seed startup`
  style queries), not memory, is now the sourcing method** - it surfaced real,
  currently-smaller companies memory-based guessing never would have (Allium,
  GetPoppy AI, Checkly, Resend, turbopuffer, all added as sources 2026-09-09, all
  `ats: ashby`), confirming Ashby also skews toward earlier-stage companies more than
  Greenhouse does in practice, on top of already being the platform Deel/Canonical/etc.
  came from. Two query patterns that looked promising turned out not to work and
  shouldn't be retried as-is: a direct salary-figure search
  (`"$2,000" OR "$3,000" per month`) returned zero real postings, only marketing
  -agency pricing blog content; an exact-phrase location search (`"remote worldwide"`,
  `"remote, anywhere"`) mostly returned SEO listicle pages, not real postings, since
  that phrasing is too rare in actual job copy to search for directly. **Even among
  these smaller companies, most currently-open matching roles are still country
  -scoped, not genuinely worldwide-open - the same scarcity the earlier 100-source
  simulation found, just starting from a better-fitting company pool.** Two promising
  leads for the `web` track specifically didn't pan out enough to add yet: Platform
  Venture Studio (a "No Code/Low Code Developer, Bubble/Webflow" role, exactly
  on-persona) had a Lever board that couldn't be found under any guessed token; Sommo
  (a no-code dev studio literally describing itself as hiring Bubble/Webflow
  developers "all over the world") has no ATS board at all, likely hires via LinkedIn
  or direct contact - neither is addable without either the real board token or
  falling back to the noisier `custom` scraper.

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
- `jobmingle-instagram-followers` and `jobmingle-linkedin-page` (raw files
  `soc1.jpg`, `soc2.jpg`, `/marketing` only) are plain public-profile
  screenshots, not `process-screenshots.py` output — there's no browser
  chrome or taskbar to crop and no sensitive figure to blur, just a public
  follower count, so they were converted straight to WebP with `sharp` and
  used as-is. `ebook-promo-1-poster`/`-2-poster` (video poster frames for
  `/marketing`'s self-initiated AI content project, extracted from `eve1.mp4`/
  `eve2.mp4` with `ffmpeg`) are the same case: personal, self-made promo
  content, nothing to redact.
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
