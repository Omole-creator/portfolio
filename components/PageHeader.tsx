import { Reveal } from "./Reveal";

export function PageHeader({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: string;
  title: string;
  intro: string;
}) {
  return (
    <section className="relative overflow-hidden bg-navy-deep pt-36 pb-16 text-white md:pt-40 md:pb-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 -top-24 h-96 w-96 rounded-full bg-gold/10 blur-3xl"
      />
      <div className="container-x relative">
        <Reveal>
          <p className="eyebrow text-gold">{eyebrow}</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-[1.08] tracking-tight md:text-5xl">
            {title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/70">
            {intro}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
