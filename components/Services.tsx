import Link from "next/link";
import {
  TrendingUp,
  PenLine,
  Users,
  Settings2,
  Bot,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import { services, servicesCta } from "@/lib/content";
import { Reveal } from "./Reveal";

const icons: LucideIcon[] = [TrendingUp, PenLine, Users, Settings2, Bot];

export function Services() {
  return (
    <section id="services" className="border-t border-line bg-white py-24 md:py-32">
      <div className="container-x">
        <Reveal>
          <p className="eyebrow text-gold-hover">What I do</p>
          <h2 className="mt-4 max-w-2xl text-3xl font-semibold leading-tight md:text-4xl">
            Five things I am genuinely good at, and use together.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => {
            const Icon = icons[i];
            return (
              <Reveal key={service.title} delay={(i % 3) * 0.05}>
                <article className="flex h-full flex-col bg-white p-8">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-navy text-gold">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <h3 className="mt-6 text-xl font-semibold text-ink">
                    {service.title}
                  </h3>
                  <p className="mt-3 leading-relaxed text-muted">{service.body}</p>
                </article>
              </Reveal>
            );
          })}

          <Reveal delay={0.1}>
            <Link
              href={servicesCta.href}
              className="group flex h-full flex-col justify-between bg-navy p-8 text-white transition-colors hover:bg-navy-soft"
            >
              <p className="text-lg font-semibold leading-snug">
                {servicesCta.text}
              </p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-gold">
                {servicesCta.linkText}
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </span>
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
