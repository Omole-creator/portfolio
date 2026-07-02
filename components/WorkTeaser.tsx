import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { caseStudies } from "@/lib/content";
import { Reveal } from "./Reveal";

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
            <Reveal key={study.name} delay={(i % 2) * 0.05}>
              <Link
                href="/work"
                className="group flex h-full flex-col rounded-2xl border border-line bg-white p-8 transition-colors hover:border-gold/50"
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
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
