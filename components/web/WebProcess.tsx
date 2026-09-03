import { webProcess } from "@/lib/web-content";
import { Reveal } from "@/components/Reveal";

export function WebProcess() {
  return (
    <section className="border-t border-line bg-white py-24 md:py-32">
      <div className="container-x">
        <Reveal>
          <p className="eyebrow text-gold-hover">How it works</p>
          <h2 className="mt-4 max-w-2xl text-3xl font-semibold leading-tight md:text-4xl">
            From a bad site to a working one.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-10 sm:grid-cols-3">
          {webProcess.map((step, i) => (
            <Reveal key={step.title} delay={i * 0.08}>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-navy text-sm font-semibold text-gold">
                {i + 1}
              </div>
              <h3 className="mt-5 text-xl font-semibold text-ink">{step.title}</h3>
              <p className="mt-3 leading-relaxed text-muted">{step.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
