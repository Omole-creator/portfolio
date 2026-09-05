import Image from "next/image";
import { marketingAbout } from "@/lib/marketing-content";
import { Reveal } from "@/components/Reveal";

export function MarketingAbout() {
  return (
    <section id="about" className="bg-paper py-24 md:py-32">
      <div className="container-x grid gap-14 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-center">
        <Reveal className="order-2 lg:order-1">
          <div className="relative mx-auto max-w-md">
            <div
              aria-hidden="true"
              className="absolute -left-4 -top-4 h-full w-full rounded-2xl border border-gold/40"
            />
            <div className="relative overflow-hidden rounded-2xl bg-navy shadow-xl">
              <Image
                src="/images/omole.webp"
                alt="Portrait of Omole Usuangbon"
                width={1080}
                height={1070}
                className="h-auto w-full object-cover"
                priority
              />
            </div>
          </div>
        </Reveal>

        <div className="order-1 lg:order-2">
          <Reveal>
            <p className="eyebrow text-gold-hover">About</p>
            <h2 className="mt-4 text-3xl font-semibold leading-tight md:text-4xl">
              I bring the creative, and the AI-first process to ship it fast.
            </h2>
          </Reveal>
          <div className="mt-6 space-y-5 text-lg leading-relaxed text-muted">
            {marketingAbout.map((para, i) => (
              <Reveal key={i} delay={0.05 + i * 0.05}>
                <p>{para}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
