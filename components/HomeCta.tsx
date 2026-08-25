import Link from "next/link";
import { CalendarCheck, ArrowRight } from "lucide-react";
import { site } from "@/lib/content";
import { GlowButton } from "./ui/glow-button";
import { Reveal } from "./Reveal";

export function HomeCta() {
  return (
    <section className="bg-navy-deep py-20 text-white md:py-28">
      <div className="container-x">
        <Reveal>
          <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-semibold leading-tight md:text-4xl">
                Ready to bring growth into your business?
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-white/70">
                Tell me where you are and what you need. If I am the right fit,
                we will get moving.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <GlowButton
                href={site.contact.calendly}
                external
                variant="primary"
                cta="calendly"
              >
                <CalendarCheck className="h-5 w-5" aria-hidden="true" />
                Book a call
              </GlowButton>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 text-base font-semibold text-white underline-offset-4 transition-colors hover:text-gold hover:underline"
              >
                Or send a message
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
