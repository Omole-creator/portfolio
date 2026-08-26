import { process } from "@/lib/content";
import { Reveal } from "./Reveal";

export function Process() {
  return (
    <section className="bg-paper py-24 md:py-32">
      <div className="container-x">
        <Reveal>
          <p className="eyebrow text-gold-hover">How this works</p>
          <h2 className="mt-4 max-w-2xl text-3xl font-semibold leading-tight md:text-4xl">
            How we&apos;d work together.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {process.map((step, i) => (
            <Reveal key={step.title} delay={i * 0.05}>
              <div className="h-full rounded-2xl border border-line bg-white p-7">
                <span className="font-display text-3xl font-semibold text-gold">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-4 text-lg font-semibold text-ink">
                  {step.title}
                </h3>
                <p className="mt-2 leading-relaxed text-muted">{step.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
