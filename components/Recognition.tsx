import Image from "next/image";
import { recognition } from "@/lib/content";
import { Reveal } from "./Reveal";

export function Recognition() {
  return (
    <section id="recognition" className="bg-paper py-24 md:py-28">
      <div className="container-x">
        <Reveal>
          <p className="eyebrow text-gold-hover">Backed and recognised</p>
          <h2 className="mt-4 max-w-2xl text-3xl font-semibold leading-tight md:text-4xl">
            People have bet on me.
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {recognition.map((item, i) => (
            <Reveal key={item.title} delay={(i % 4) * 0.05}>
              <div className="flex h-full flex-col rounded-2xl border border-line bg-white p-6">
                <div className="flex h-20 items-center">
                  <Image
                    src={item.logo}
                    alt={`${item.title} logo`}
                    width={180}
                    height={80}
                    className="h-14 w-auto object-contain"
                  />
                </div>
                <p className="mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-gold-hover">
                  {item.kind}
                </p>
                <h3 className="mt-2 text-base font-semibold text-ink">
                  {item.title}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-muted">
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
