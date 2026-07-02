import { CalendarCheck, Mail } from "lucide-react";
import { site } from "@/lib/content";
import { Reveal } from "./Reveal";

export function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden bg-navy text-white"
    >
      {/* soft gold glow, kept subtle */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 -top-40 h-[36rem] w-[36rem] rounded-full bg-gold/10 blur-3xl"
      />
      <div className="container-x relative flex min-h-[92vh] flex-col justify-center pb-20 pt-36">
        <Reveal>
          <p className="eyebrow flex items-center gap-2 text-gold">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold/70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-gold" />
            </span>
            Open to work and co-founder conversations
          </p>
        </Reveal>

        <Reveal delay={0.05}>
          <h1 className="mt-6 max-w-4xl text-balance text-4xl font-semibold leading-[1.05] sm:text-5xl md:text-6xl lg:text-7xl">
            I turn attention into customers, and build the{" "}
            <span className="text-gold">tools that run the business</span>.
          </h1>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-white/75">
            {site.heroPitch}
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href={site.contact.calendly}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3.5 text-base font-semibold text-ink transition-colors hover:bg-gold-hover"
            >
              <CalendarCheck className="h-5 w-5" aria-hidden="true" />
              Book a call
            </a>
            <a
              href={`mailto:${site.contact.email}`}
              className="inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-3.5 text-base font-semibold text-white transition-colors hover:border-white/60 hover:bg-white/5"
            >
              <Mail className="h-5 w-5" aria-hidden="true" />
              Email me
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <p className="mt-8 text-sm text-white/55">{site.openLine}</p>
        </Reveal>
      </div>
    </section>
  );
}
