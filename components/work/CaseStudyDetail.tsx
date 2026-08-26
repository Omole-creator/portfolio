import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  TrendingUp,
  CalendarCheck,
} from "lucide-react";
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

// One project, full detail: hero, a screenshot near the top, the problem,
// how it was built, what changed, what it does, a second screenshot mid
// -page if there is one, the result, the thinking behind the approach,
// built with, and a link to the next project. Screenshots never sit at the
// bottom, they break up the writing instead. Never wrapped in Reveal, same
// reasoning as PostArticle.tsx: this is long-form content meant to be
// fully present for crawlers and screenshots.
export function CaseStudyDetail({
  study,
  next,
}: {
  study: CaseStudy;
  next: CaseStudy;
}) {
  const [firstImage, secondImage] = study.images ?? [];

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
          {firstImage ? (
            <div className="mb-14">
              <BrowserFrame
                url={study.liveUrl ?? ""}
                src={firstImage.src}
                alt={firstImage.alt}
              />
            </div>
          ) : null}

          <section>
            <p className="eyebrow text-gold-hover">The problem</p>
            <div className="mt-4 space-y-4">
              {study.why.map((paragraph, i) => (
                <p key={i} className="leading-relaxed text-ink/80">
                  {paragraph}
                </p>
              ))}
            </div>
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
            <p className="eyebrow text-gold-hover">What changed</p>
            <div className="mt-4 space-y-4">
              <p className="leading-relaxed text-ink/80">
                <span className="font-semibold text-ink">Before: </span>
                {study.beforeAfter.before}
              </p>
              <p className="leading-relaxed text-ink/80">
                <span className="font-semibold text-gold-hover">After: </span>
                {study.beforeAfter.after}
              </p>
            </div>
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

          {secondImage ? (
            <div className="mt-14">
              <BrowserFrame
                url={study.liveUrl ?? ""}
                src={secondImage.src}
                alt={secondImage.alt}
              />
            </div>
          ) : null}

          <section className="mt-14">
            <p className="eyebrow text-gold-hover">The result</p>
            <ul className="mt-6 space-y-3">
              {study.results.map((point) => (
                <li key={point} className="flex gap-3 text-ink/80">
                  <TrendingUp
                    className="mt-1 h-4 w-4 shrink-0 text-gold-hover"
                    aria-hidden="true"
                  />
                  <span className="leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-14">
            <p className="eyebrow text-gold-hover">The thinking</p>
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
