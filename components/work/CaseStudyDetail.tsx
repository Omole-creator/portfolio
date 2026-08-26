import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, CalendarCheck } from "lucide-react";
import { site, type CaseStudy } from "@/lib/content";
import { BrowserFrame } from "@/components/BrowserFrame";
import { ViewTracker } from "@/components/analytics/ViewTracker";
import { TrackedLink } from "@/components/analytics/TrackedLink";

function Tags({ tags }: { tags: string[] }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <li
          key={tag}
          className="rounded-full border border-line bg-white px-3 py-1 text-xs font-medium text-muted"
        >
          {tag}
        </li>
      ))}
    </ul>
  );
}

// One project, full detail, modeled on: hero, the problem, how it was
// built, what it does, images, and a link to the next project. Never
// wrapped in Reveal, same reasoning as PostArticle.tsx: this is long-form
// content meant to be fully present for crawlers and screenshots.
export function CaseStudyDetail({
  study,
  next,
}: {
  study: CaseStudy;
  next: CaseStudy;
}) {
  return (
    <article>
      <header className="relative overflow-hidden bg-navy-deep pt-36 pb-16 text-white md:pt-40 md:pb-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-32 -top-24 h-96 w-96 rounded-full bg-gold/10 blur-3xl"
        />
        <div className="container-x relative max-w-3xl">
          <Link
            href="/work"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-gold underline-offset-4 transition-colors hover:underline"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to work
          </Link>

          <ViewTracker eventType="project_view" resourceId={study.slug}>
            <div>
              <p className="eyebrow mt-6 text-gold">{study.kind}</p>
              <h1 className="mt-3 text-4xl font-semibold leading-[1.1] tracking-tight md:text-5xl">
                {study.name}
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-white/70">
                {study.blurb}
              </p>
            </div>
          </ViewTracker>
        </div>
      </header>

      <div className="bg-paper py-16 md:py-20">
        <div className="container-x max-w-3xl">
          <section>
            <p className="eyebrow text-gold-hover">The problem</p>
            <p className="mt-3 text-xl leading-relaxed text-ink/80">
              {study.why}
            </p>
          </section>

          <section className="mt-14">
            <p className="eyebrow text-gold-hover">How I built it</p>
            <ol className="mt-6 space-y-6">
              {study.approach.map((step, i) => (
                <li key={step} className="flex gap-4">
                  <span className="font-display text-2xl font-semibold text-gold">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="mt-1 leading-relaxed text-ink/80">
                    {step}
                  </span>
                </li>
              ))}
            </ol>
          </section>

          <section className="mt-14">
            <p className="eyebrow text-gold-hover">What it does</p>
            <ul className="mt-6 space-y-3">
              {study.highlights.map((point) => (
                <li key={point} className="flex gap-3 text-ink/80">
                  <Check
                    className="mt-1 h-4 w-4 shrink-0 text-gold-hover"
                    aria-hidden="true"
                  />
                  <span className="leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-14">
            <p className="eyebrow text-gold-hover">Before and after</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-line bg-white p-6">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                  Before
                </p>
                <p className="mt-2 leading-relaxed text-ink/80">
                  {study.beforeAfter.before}
                </p>
              </div>
              <div className="rounded-2xl border border-gold/40 bg-white p-6">
                <p className="text-xs font-semibold uppercase tracking-wide text-gold-hover">
                  After
                </p>
                <p className="mt-2 leading-relaxed text-ink/80">
                  {study.beforeAfter.after}
                </p>
              </div>
            </div>
          </section>

          <section className="mt-14">
            <p className="eyebrow text-gold-hover">Why this approach</p>
            <p className="mt-3 leading-relaxed text-ink/80">{study.insight}</p>
          </section>

          <section className="mt-14">
            <p className="eyebrow text-gold-hover">Built with</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {study.builtWith.map((item) => (
                <li
                  key={item}
                  className="rounded-full border border-line bg-white px-3 py-1 text-xs font-medium text-muted"
                >
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {study.images?.length ? (
            <section className="mt-14 space-y-5">
              {study.images.map((img) => (
                <BrowserFrame
                  key={img.src}
                  url={study.liveUrl ?? ""}
                  src={img.src}
                  alt={img.alt}
                />
              ))}
            </section>
          ) : null}

          <div className="mt-10">
            <Tags tags={study.tags} />
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-5 border-t border-line pt-8">
            {study.liveUrl ? (
              <a
                href={study.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy underline-offset-4 transition-colors hover:text-gold-hover hover:underline"
              >
                Visit it live
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </a>
            ) : null}
            <TrackedLink
              href={site.contact.calendly}
              cta="calendly"
              external
              className="inline-flex items-center gap-2 text-sm font-semibold text-navy underline-offset-4 transition-colors hover:text-gold-hover hover:underline"
            >
              <CalendarCheck className="h-4 w-4" aria-hidden="true" />
              Book a call
            </TrackedLink>
          </div>

          <div className="mt-14 border-t border-line pt-8">
            <p className="text-sm text-muted">Next project</p>
            <Link
              href={`/work/${next.slug}`}
              className="mt-2 inline-flex items-center gap-1.5 text-2xl font-semibold text-ink transition-colors hover:text-gold-hover"
            >
              {next.name}
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
