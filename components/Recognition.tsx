import { Award } from "lucide-react";
import { recognition } from "@/lib/content";
import { Reveal } from "./Reveal";

export function Recognition() {
  return (
    <section id="recognition" className="bg-navy py-24 text-white md:py-32">
      <div className="container-x">
        <Reveal>
          <p className="eyebrow text-gold">Recognition</p>
          <h2 className="mt-4 max-w-2xl text-3xl font-semibold leading-tight md:text-4xl">
            Backed and recognised by people who bet on founders.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {recognition.map((item, i) => (
            <Reveal key={item.title} delay={(i % 4) * 0.05}>
              <div className="flex h-full flex-col bg-navy p-7">
                <Award className="h-7 w-7 text-gold" aria-hidden="true" />
                <h3 className="mt-5 text-lg font-semibold leading-snug">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/60">
                  {item.detail}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
