import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { caseStudies } from "@/lib/content";
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

        <div className="mt-2 grid gap-8 pt-10 sm:grid-cols-2">
          {caseStudies.map((study, i) => (
            <Reveal key={study.slug} delay={(i % 2) * 0.05}>
              <ViewTracker eventType="project_view" resourceId={study.slug}>
                <Link
                  href={`/work/${study.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1.5 hover:border-gold/60 hover:shadow-[0_28px_55px_-28px_rgba(11,30,57,0.45)]"
                >
                  {study.images?.[0] ? (
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-navy">
                      <Image
                        src={study.images[0].src}
                        alt={study.images[0].alt}
                        fill
                        sizes="(min-width: 640px) 50vw, 100vw"
                        className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  ) : null}
                  <div className="flex flex-1 flex-col p-8">
                    <p className="eyebrow text-gold-hover">{study.kind}</p>
                    <h3 className="mt-3 text-2xl font-semibold text-ink">
                      {study.name}
                    </h3>
                    <p className="mt-3 leading-relaxed text-muted">
                      {study.blurb}
                    </p>
                    <div className="mt-5">
                      <Tags tags={study.tags} />
                    </div>
                    <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-navy transition-colors group-hover:text-gold-hover">
                      Read the case study
                      <ArrowRight
                        className="h-4 w-4 transition-transform group-hover:translate-x-1"
                        aria-hidden="true"
                      />
                    </span>
                  </div>
                </Link>
              </ViewTracker>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
