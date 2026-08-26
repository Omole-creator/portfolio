import { problems } from "@/lib/content";
import { Reveal } from "./Reveal";
import { ScrollCard } from "./ScrollCard";

const dir = [-1, 1, -1, 1];

export function Problem() {
  return (
    <section className="border-t border-line bg-white py-24 md:py-32">
      <div className="container-x">
        <Reveal>
          <p className="eyebrow text-gold-hover">Before we start</p>
          <h2 className="mt-4 max-w-2xl text-3xl font-semibold leading-tight md:text-4xl">
            A few things I hear a lot right before someone reaches out.
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {problems.map((point, i) => (
            <ScrollCard key={point} direction={dir[i % dir.length]}>
              <div className="flex h-full items-center rounded-2xl border border-line bg-paper p-8">
                <p className="text-lg leading-relaxed text-ink/80">{point}</p>
              </div>
            </ScrollCard>
          ))}
        </div>
      </div>
    </section>
  );
}
