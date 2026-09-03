import { ArrowRight, Check } from "lucide-react";
import { webWork } from "@/lib/web-content";
import { Reveal } from "@/components/Reveal";
import { ScrollCard } from "@/components/ScrollCard";
import { BrowserFrame } from "@/components/BrowserFrame";
import { TrackedLink } from "@/components/analytics/TrackedLink";
import { ViewTracker } from "@/components/analytics/ViewTracker";

export function WebWork() {
  return (
    <section id="work" className="border-t border-line bg-paper py-24 md:py-32">
      <div className="container-x">
        <Reveal>
          <p className="eyebrow text-gold-hover">Selected work</p>
          <h2 className="mt-4 max-w-2xl text-3xl font-semibold leading-tight md:text-4xl">
            Sites and web apps I&apos;ve built.
          </h2>
        </Reveal>

        <div className="mt-14 space-y-16">
          {webWork.map((project, i) => {
            const textBlock = (
              <div>
                <p className="eyebrow text-gold-hover">{project.kind}</p>
                <h3 className="mt-3 text-2xl font-semibold text-ink">
                  {project.name}
                </h3>
                <p className="mt-3 leading-relaxed text-muted">{project.blurb}</p>
                <ul className="mt-5 space-y-2.5">
                  {project.highlights.map((point) => (
                    <li key={point} className="flex items-start gap-2.5 text-sm leading-relaxed text-muted">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold-hover" aria-hidden="true" />
                      {point}
                    </li>
                  ))}
                </ul>
                <TrackedLink
                  href={project.liveUrl}
                  cta={`web-${project.slug}-visit`}
                  external
                  className="group mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-navy underline-offset-4 transition-colors hover:text-gold-hover hover:underline"
                >
                  Visit the site
                  <ArrowRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </TrackedLink>
              </div>
            );

            return (
              <ScrollCard key={project.slug} direction={i % 2 === 0 ? -1 : 1}>
                <ViewTracker eventType="project_view" resourceId={`web-${project.slug}`}>
                  {project.image ? (
                    <div className="grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-12">
                      <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                        <BrowserFrame
                          url={project.liveUrl}
                          src={project.image.src}
                          alt={project.image.alt}
                        />
                      </div>
                      <div className={i % 2 === 1 ? "lg:order-1" : ""}>{textBlock}</div>
                    </div>
                  ) : (
                    <div className="max-w-2xl rounded-2xl border border-line bg-white p-8 shadow-[0_10px_30px_-20px_rgba(11,30,57,0.25)]">
                      {textBlock}
                    </div>
                  )}
                </ViewTracker>
              </ScrollCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
