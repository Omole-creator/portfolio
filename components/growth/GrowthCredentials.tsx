import { Check, Download, GraduationCap } from "lucide-react";
import {
  growthTechnicalSkills,
  growthSoftSkills,
  growthCertifications,
  growthResume,
} from "@/lib/growth-content";
import { Reveal } from "@/components/Reveal";
import { TrackedLink } from "@/components/analytics/TrackedLink";

function SkillList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 className="text-sm font-semibold uppercase tracking-wide text-ink">{title}</h3>
      <ul className="mt-4 space-y-2.5">
        {items.map((item) => (
          <li
            key={item}
            className="flex items-start gap-2.5 text-sm leading-relaxed text-muted"
          >
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold-hover" aria-hidden="true" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function GrowthCredentials() {
  return (
    <section className="border-t border-line bg-white py-24 md:py-32">
      <div className="container-x">
        <Reveal>
          <p className="eyebrow text-gold-hover">Background</p>
          <h2 className="mt-4 max-w-2xl text-3xl font-semibold leading-tight md:text-4xl">
            The skills and credentials behind the work.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-10 lg:grid-cols-2">
          <Reveal>
            <SkillList title="Technical skills" items={growthTechnicalSkills} />
          </Reveal>
          <Reveal delay={0.05}>
            <SkillList title="Soft skills" items={growthSoftSkills} />
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <div className="mt-12">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-ink">
              Certifications
            </h3>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {growthCertifications.map((cert) => (
                <li
                  key={cert.name}
                  className="flex items-start gap-3 rounded-xl border border-line bg-paper p-4"
                >
                  <GraduationCap
                    className="mt-0.5 h-4 w-4 shrink-0 text-gold-hover"
                    aria-hidden="true"
                  />
                  <span className="text-sm leading-relaxed text-muted">
                    <span className="font-medium text-ink">{cert.name}</span>
                    <br />
                    {cert.issuer}, {cert.year}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mt-12 flex flex-col items-start justify-between gap-6 rounded-2xl bg-navy p-8 text-white sm:flex-row sm:items-center">
            <div>
              <p className="eyebrow text-gold">{growthResume.eyebrow}</p>
              <h3 className="mt-2 text-2xl font-semibold">{growthResume.title}</h3>
            </div>
            <TrackedLink
              href={growthResume.href}
              cta="download-cv"
              download="Omole-Usuangbon-Growth-Marketing-CV.pdf"
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-ink transition-colors hover:bg-gold-hover"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              {growthResume.buttonLabel}
            </TrackedLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
