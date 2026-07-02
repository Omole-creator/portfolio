import { CalendarCheck, ArrowRight } from "lucide-react";
import { site, proof } from "@/lib/content";
import { ShaderBackground } from "./ui/shader-background";
import { GlowButton } from "./ui/glow-button";
import { Reveal } from "./Reveal";

export function Hero() {
  const [main, accent] = site.headline.split("Using AI");

  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] items-center overflow-hidden bg-navy-deep text-white"
    >
      {/* Animated shader, tinted to navy so it stays on brand */}
      <div className="absolute inset-0">
        <ShaderBackground />
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-navy-deep/70 via-navy/70 to-navy-deep/90"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-10 h-[32rem] w-[32rem] rounded-full bg-gold/10 blur-3xl"
      />

      <div className="container-x relative z-10 py-32">
        <div className="max-w-4xl">
          <Reveal>
            <h1 className="text-4xl font-semibold leading-[1.06] tracking-tight sm:text-5xl md:text-6xl lg:text-[4.25rem]">
              {main}
              <span className="text-gold">Using AI</span>
              {accent}
            </h1>
          </Reveal>

          <Reveal delay={0.08}>
            <p className="mt-7 max-w-2xl text-lg leading-relaxed text-white/75">
              {site.subhead}
            </p>
          </Reveal>

          <Reveal delay={0.14}>
            <div className="mt-9 flex flex-nowrap items-center gap-3 sm:gap-4">
              <GlowButton href={site.contact.calendly} external variant="primary">
                <CalendarCheck className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
                Book a call
              </GlowButton>
              <GlowButton href="/work" variant="ghost">
                See my work
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </GlowButton>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.2}>
          <dl className="mt-16 grid max-w-3xl grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-5">
            {proof.map((item) => (
              <div key={item.label} className="border-l border-white/15 pl-4">
                <dt className="font-display text-2xl font-semibold tabular-nums text-gold md:text-3xl">
                  {item.value}
                </dt>
                <dd className="mt-1 text-sm leading-snug text-white/60">
                  {item.label}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
