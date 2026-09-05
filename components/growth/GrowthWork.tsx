import { ArrowUpRight, TrendingUp } from "lucide-react";
import { growthWork } from "@/lib/growth-content";
import { Reveal } from "@/components/Reveal";
import { ScrollCard } from "@/components/ScrollCard";
import { BrowserFrame } from "@/components/BrowserFrame";
import { TrackedLink } from "@/components/analytics/TrackedLink";
import { ViewTracker } from "@/components/analytics/ViewTracker";

export function GrowthWork() {
  return (
    <section id="work" className="border-t border-line bg-paper py-24 md:py-32">
      <div className="container-x">
        <Reveal>
          <p className="eyebrow text-gold-hover">Selected work</p>
          <h2 className="mt-4 max-w-2xl text-3xl font-semibold leading-tight md:text-4xl">
            Growth work I&apos;ve done.
          </h2>
        </Reveal>

        <div className="mt-14 space-y-20">
          {growthWork.map((project, i) => {
            const [firstImage, secondImage] = project.images;
            return (
              <ScrollCard key={project.slug} direction={i % 2 === 0 ? -1 : 1}>
                <ViewTracker eventType="project_view" resourceId={`growth-${project.slug}`}>
                  <div className="rounded-2xl border border-line bg-white p-6 shadow-[0_10px_30px_-20px_rgba(11,30,57,0.25)] md:p-10">
                    <div className="max-w-2xl">
                      <p className="eyebrow text-gold-hover">{project.kind}</p>
                      <h3 className="mt-3 text-2xl font-semibold text-ink md:text-3xl">
                        {project.name}
                      </h3>
                    </div>

                    {firstImage ? (
                      <div className="mt-8">
                        <BrowserFrame
                          url={project.liveUrl}
                          src={firstImage.src}
                          alt={firstImage.alt}
                        />
                      </div>
                    ) : null}

                    <div className="mt-10 max-w-2xl">
                      <p className="eyebrow text-gold-hover">The problem</p>
                      <div className="mt-4 space-y-4">
                        {project.why.map((paragraph, j) => (
                          <p key={j} className="leading-relaxed text-muted">
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    </div>

                    <div className="mt-10 max-w-2xl">
                      <p className="eyebrow text-gold-hover">How I approached it</p>
                      <ol className="mt-5 space-y-4">
                        {project.approach.map((step, j) => (
                          <li key={step} className="flex gap-4">
                            <span className="font-display text-lg font-semibold text-gold">
                              {String(j + 1).padStart(2, "0")}
                            </span>
                            <span className="mt-0.5 leading-relaxed text-muted">
                              {step}
                            </span>
                          </li>
                        ))}
                      </ol>
                    </div>

                    {secondImage ? (
                      <div className="mt-10">
                        <BrowserFrame
                          url={project.liveUrl}
                          src={secondImage.src}
                          alt={secondImage.alt}
                        />
                      </div>
                    ) : null}

                    <div className="mt-10 max-w-2xl">
                      <p className="eyebrow text-gold-hover">The result</p>
                      <ul className="mt-5 space-y-3">
                        {project.results.map((point) => (
                          <li key={point} className="flex gap-3 text-muted">
                            <TrendingUp
                              className="mt-1 h-4 w-4 shrink-0 text-gold-hover"
                              aria-hidden="true"
                            />
                            <span className="leading-relaxed">{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-10 max-w-2xl">
                      <p className="eyebrow text-gold-hover">The thinking</p>
                      <p className="mt-3 leading-relaxed text-muted">
                        {project.insight}
                      </p>
                    </div>

                    {project.liveUrl ? (
                      <TrackedLink
                        href={project.liveUrl}
                        cta={`growth-${project.slug}-visit`}
                        external
                        className="group mt-10 inline-flex items-center gap-1.5 text-sm font-semibold text-navy underline-offset-4 transition-colors hover:text-gold-hover hover:underline"
                      >
                        Visit the site
                        <ArrowUpRight
                          className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                          aria-hidden="true"
                        />
                      </TrackedLink>
                    ) : null}
                  </div>
                </ViewTracker>
              </ScrollCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
