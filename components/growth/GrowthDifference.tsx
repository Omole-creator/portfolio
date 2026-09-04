import { X, Check } from "lucide-react";
import { growthDifference } from "@/lib/growth-content";
import { Reveal } from "@/components/Reveal";

export function GrowthDifference() {
  return (
    <section className="border-t border-line bg-paper py-24 md:py-32">
      <div className="container-x">
        <Reveal>
          <p className="eyebrow text-gold-hover">The difference</p>
          <h2 className="mt-4 max-w-2xl text-3xl font-semibold leading-tight md:text-4xl">
            Most growth marketers do one. I do both.
          </h2>
        </Reveal>

        <div className="mt-12 space-y-4">
          {growthDifference.map((pair, i) => (
            <Reveal key={pair.mine} delay={i * 0.04}>
              <div className="grid gap-4 rounded-2xl border border-line bg-white p-6 sm:grid-cols-2 sm:gap-8">
                <div className="flex gap-3">
                  <X
                    className="mt-1 h-4 w-4 shrink-0 text-muted"
                    aria-hidden="true"
                  />
                  <p className="leading-relaxed text-muted">{pair.theirs}</p>
                </div>
                <div className="flex gap-3">
                  <Check
                    className="mt-1 h-4 w-4 shrink-0 text-gold-hover"
                    aria-hidden="true"
                  />
                  <p className="leading-relaxed text-ink">{pair.mine}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
