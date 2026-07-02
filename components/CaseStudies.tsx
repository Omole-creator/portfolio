import { Check, ArrowUpRight } from "lucide-react";
import { caseStudies, type CaseStudy } from "@/lib/content";
import { BrowserFrame } from "./BrowserFrame";
import { Reveal } from "./Reveal";

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

function Featured({ study }: { study: CaseStudy }) {
  return (
    <Reveal>
      <article className="relative overflow-hidden rounded-3xl bg-navy p-8 text-white md:p-12">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gold/10 blur-3xl"
        />
        <div className="relative grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          <div>
            <p className="eyebrow text-gold">{study.kind}</p>
            <h3 className="mt-3 font-display text-4xl font-semibold md:text-5xl">
              {study.name}
            </h3>
            <p className="mt-5 text-lg leading-relaxed text-white/75">
              {study.blurb}
            </p>
            <div className="mt-7">
              <Tags tags={study.tags} />
            </div>
            {study.liveUrl ? (
              <a
                href={study.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-7 inline-flex items-center gap-1.5 text-sm font-semibold text-gold underline-offset-4 transition-colors hover:underline"
              >
                Visit jobmingle.co
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </a>
            ) : null}
          </div>
          <ul className="space-y-4 lg:pt-2">
            {study.highlights.map((point) => (
              <li key={point} className="flex gap-3">
                <span className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold/20 text-gold">
                  <Check className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
                <span className="leading-relaxed text-white/85">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </article>
    </Reveal>
  );
}

function ProductRow({ study, flip }: { study: CaseStudy; flip: boolean }) {
  return (
    <article className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
      <Reveal
        className={flip ? "lg:order-2" : "lg:order-1"}
      >
        <div className="space-y-5">
          {study.images?.map((img) => (
            <BrowserFrame
              key={img.src}
              url={study.liveUrl ?? ""}
              src={img.src}
              alt={img.alt}
            />
          ))}
        </div>
      </Reveal>

      <Reveal
        delay={0.05}
        className={flip ? "lg:order-1" : "lg:order-2"}
      >
        <div>
          <p className="eyebrow text-gold-hover">{study.kind}</p>
          <h3 className="mt-3 text-3xl font-semibold text-ink md:text-4xl">
            {study.name}
          </h3>
          <p className="mt-4 text-lg leading-relaxed text-muted">{study.blurb}</p>
          {study.why ? (
            <p className="mt-4 border-l-2 border-gold/50 pl-4 leading-relaxed text-ink/70">
              {study.why}
            </p>
          ) : null}
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
          <div className="mt-7">
            <Tags tags={study.tags} />
          </div>
          {study.liveUrl ? (
            <a
              href={study.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-7 inline-flex items-center gap-1.5 text-sm font-semibold text-navy underline-offset-4 transition-colors hover:text-gold-hover hover:underline"
            >
              View it live
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>
          ) : null}
        </div>
      </Reveal>
    </article>
  );
}

export function CaseStudies({ showHeading = true }: { showHeading?: boolean }) {
  const featured = caseStudies.find((s) => s.featured);
  const products = caseStudies.filter((s) => !s.featured);

  return (
    <section id="work" className="bg-paper py-20 md:py-24">
      <div className="container-x">
        {showHeading ? (
          <Reveal>
            <p className="eyebrow text-gold-hover">Selected work</p>
            <h2 className="mt-4 max-w-3xl text-3xl font-semibold leading-tight md:text-4xl">
              The company I built, and the products I shipped to run it.
            </h2>
          </Reveal>
        ) : null}

        <div className="space-y-20 pt-2 md:space-y-28">
          {featured ? <Featured study={featured} /> : null}
          {products.map((study, i) => (
            <ProductRow key={study.name} study={study} flip={i % 2 === 1} />
          ))}
        </div>
      </div>
    </section>
  );
}
