import { Check, ArrowUpRight } from "lucide-react";
import { caseStudies, type CaseStudy } from "@/lib/content";
import { BrowserFrame } from "./BrowserFrame";
import { Reveal } from "./Reveal";
import { ViewTracker } from "./analytics/ViewTracker";

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

// Every case study renders through this one path, JobMingle included. Some
// studies don't have a screenshot yet (JobMingle's is pending), so the text
// column stands alone instead of leaving an empty half of the grid.
function CaseStudyRow({ study, flip }: { study: CaseStudy; flip: boolean }) {
  const hasImages = Boolean(study.images && study.images.length > 0);

  return (
    <ViewTracker eventType="project_view" resourceId={study.slug}>
      <article
        className={
          hasImages
            ? "grid items-center gap-10 lg:grid-cols-2 lg:gap-16"
            : "mx-auto max-w-2xl"
        }
      >
        {hasImages ? (
          <Reveal className={flip ? "lg:order-2" : "lg:order-1"}>
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
        ) : null}

        <Reveal
          delay={0.05}
          className={hasImages ? (flip ? "lg:order-1" : "lg:order-2") : undefined}
        >
          <div>
            <p className="eyebrow text-gold-hover">{study.kind}</p>
            <h3 className="mt-3 text-3xl font-semibold text-ink md:text-4xl">
              {study.name}
            </h3>
            <p className="mt-4 text-lg leading-relaxed text-muted">{study.blurb}</p>
            <p className="mt-4 border-l-2 border-gold/50 pl-4 leading-relaxed text-ink/70">
              {study.why}
            </p>
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
    </ViewTracker>
  );
}

export function CaseStudies({ showHeading = true }: { showHeading?: boolean }) {
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
          {caseStudies.map((study, i) => (
            <CaseStudyRow key={study.slug} study={study} flip={i % 2 === 1} />
          ))}
        </div>
      </div>
    </section>
  );
}
