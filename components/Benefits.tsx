import { Check } from "lucide-react";
import { benefits } from "@/lib/content";
import { Reveal } from "./Reveal";

export function Benefits() {
  return (
    <section className="bg-paper py-24 md:py-32">
      <div className="container-x">
        <Reveal>
          <p className="eyebrow text-gold-hover">What you get</p>
          <h2 className="mt-4 max-w-2xl text-3xl font-semibold leading-tight md:text-4xl">
            Six things that come with it.
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {benefits.map((point, i) => (
            <Reveal key={point} delay={(i % 2) * 0.05}>
              <div className="flex h-full items-start gap-3 rounded-2xl border border-line bg-white p-6">
                <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-navy text-gold">
                  <Check className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
                <p className="leading-relaxed text-ink/80">{point}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
