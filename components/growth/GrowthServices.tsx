import { TrendingUp, PenLine, Users, Settings2, type LucideIcon } from "lucide-react";
import { growthServices } from "@/lib/growth-content";
import { Reveal } from "@/components/Reveal";
import { ScrollCard } from "@/components/ScrollCard";

const icons: LucideIcon[] = [TrendingUp, PenLine, Users, Settings2];
const dir = [-1, 0, 1, 0];

export function GrowthServices() {
  return (
    <section id="services" className="border-t border-line bg-white py-24 md:py-32">
      <div className="container-x">
        <Reveal>
          <p className="eyebrow text-gold-hover">What I do</p>
          <h2 className="mt-4 max-w-2xl text-3xl font-semibold leading-tight md:text-4xl">
            What this looks like.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-2">
          {growthServices.map((service, i) => {
            const Icon = icons[i];
            return (
              <ScrollCard key={service.title} direction={dir[i % dir.length]}>
                <article className="flex h-full flex-col rounded-2xl border border-line bg-white p-8 shadow-[0_10px_30px_-20px_rgba(11,30,57,0.25)]">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-navy text-gold">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <h3 className="mt-6 text-xl font-semibold text-ink">
                    {service.title}
                  </h3>
                  <p className="mt-3 leading-relaxed text-muted">{service.body}</p>
                </article>
              </ScrollCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
