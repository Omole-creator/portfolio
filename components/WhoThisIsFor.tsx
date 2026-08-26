import { workTracks } from "@/lib/content";
import { Reveal } from "./Reveal";

export function WhoThisIsFor() {
  return (
    <section className="border-t border-line bg-white py-24 md:py-32">
      <div className="container-x">
        <Reveal>
          <p className="eyebrow text-gold-hover">Good fit</p>
          <h2 className="mt-4 max-w-2xl text-3xl font-semibold leading-tight md:text-4xl">
            The three places I fit best.
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {workTracks.map((track, i) => (
            <Reveal key={track.title} delay={i * 0.05}>
              <div className="h-full rounded-2xl border border-line bg-paper p-7">
                <h3 className="text-lg font-semibold text-ink">
                  {track.title}
                </h3>
                <p className="mt-3 leading-relaxed text-muted">{track.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
