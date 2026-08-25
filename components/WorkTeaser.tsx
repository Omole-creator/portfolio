import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { caseStudies } from "@/lib/content";
import { Reveal } from "./Reveal";
import { ScrollCard } from "./ScrollCard";
import { ViewTracker } from "./analytics/ViewTracker";

export function WorkTeaser() {
  return (
    <section className="border-t border-line bg-paper py-24 md:py-32">
      <div className="container-x">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow text-gold-hover">Selected work</p>
              <h2 className="mt-4 max-w-2xl text-3xl font-semibold leading-tight md:text-4xl">
                A company I built, and the products I shipped to run it.
              </h2>
            </div>
            <Link
              href="/work"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy underline-offset-4 transition-colors hover:text-gold-hover hover:underline"
            >
              See the full work
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {caseStudies.map((study, i) => (
            <ScrollCard key={study.slug} direction={i % 2 === 0 ? -1 : 1}>
              <ViewTracker eventType="project_view" resourceId={study.slug}>
                <Link
                  href="/work"
                  className="group flex h-full flex-col rounded-2xl border border-line bg-white p-8 shadow-[0_10px_30px_-20px_rgba(11,30,57,0.25)] transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1.5 hover:border-gold/60 hover:shadow-[0_28px_55px_-28px_rgba(11,30,57,0.45)]"
                >
                  <p className="eyebrow text-gold-hover">{study.kind}</p>
                  <h3 className="mt-3 text-2xl font-semibold text-ink">
                    {study.name}
                  </h3>
                  <p className="mt-3 leading-relaxed text-muted">{study.blurb}</p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-navy transition-colors group-hover:text-gold-hover">
                    Read more
                    <ArrowRight
                      className="h-4 w-4 transition-transform group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </span>
                </Link>
              </ViewTracker>
            </ScrollCard>
          ))}
        </div>
      </div>
    </section>
  );
}
