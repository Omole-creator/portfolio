import { Plus } from "lucide-react";
import { faq } from "@/lib/content";
import { Reveal } from "./Reveal";

export function Faq() {
  return (
    <section id="faq" className="border-t border-line bg-white py-24 md:py-28">
      <div className="container-x max-w-3xl">
        <Reveal>
          <p className="eyebrow text-gold-hover">Questions</p>
          <h2 className="mt-4 text-3xl font-semibold leading-tight md:text-4xl">
            The things people usually ask.
          </h2>
        </Reveal>

        <div className="mt-10 divide-y divide-line border-y border-line">
          {faq.map((item, i) => (
            <Reveal key={item.q} delay={(i % 6) * 0.03}>
              <details className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-medium text-ink">
                  {item.q}
                  <Plus
                    className="h-5 w-5 shrink-0 text-gold-hover transition-transform duration-300 group-open:rotate-45"
                    aria-hidden="true"
                  />
                </summary>
                <p className="mt-3 max-w-2xl leading-relaxed text-muted">
                  {item.a}
                </p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
