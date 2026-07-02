import { proof } from "@/lib/content";
import { Reveal } from "./Reveal";

export function ProofBar() {
  return (
    <section className="bg-navy-deep text-white" aria-label="Results at a glance">
      <div className="container-x py-10 md:py-12">
        <dl className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-5">
          {proof.map((item, i) => (
            <Reveal key={item.label} delay={i * 0.05}>
              <div className="border-l border-white/15 pl-4">
                <dt className="font-display text-3xl font-semibold tabular-nums text-gold md:text-4xl">
                  {item.value}
                </dt>
                <dd className="mt-1 text-sm leading-snug text-white/65">
                  {item.label}
                </dd>
              </div>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
