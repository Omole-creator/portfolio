import {
  Mail,
  CalendarCheck,
  Linkedin,
  MessageCircle,
  type LucideIcon,
} from "lucide-react";
import { site, workTracks } from "@/lib/content";
import { Reveal } from "./Reveal";
import { TrackedLink } from "./analytics/TrackedLink";

const links: {
  label: string;
  href: string;
  icon: LucideIcon;
  external: boolean;
  cta: string;
}[] = [
  {
    label: "Email me",
    href: `mailto:${site.contact.email}`,
    icon: Mail,
    external: false,
    cta: "email",
  },
  {
    label: "Book a call",
    href: site.contact.calendly,
    icon: CalendarCheck,
    external: true,
    cta: "calendly",
  },
  {
    label: "LinkedIn",
    href: site.contact.linkedin,
    icon: Linkedin,
    external: true,
    cta: "linkedin",
  },
  {
    label: "WhatsApp",
    href: site.contact.whatsapp,
    icon: MessageCircle,
    external: true,
    cta: "whatsapp",
  },
];

export function Contact() {
  return (
    <section id="contact" className="border-t border-line bg-white py-24 md:py-32">
      <div className="container-x">
        <Reveal>
          <p className="eyebrow text-gold-hover">Work with me</p>
          <h2 className="mt-4 max-w-2xl text-3xl font-semibold leading-tight md:text-4xl">
            Two good reasons to reach out.
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {workTracks.map((track, i) => (
            <Reveal key={track.title} delay={i * 0.05}>
              <div className="h-full rounded-2xl border border-line bg-paper p-8">
                <h3 className="text-xl font-semibold text-ink">{track.title}</h3>
                <p className="mt-3 leading-relaxed text-muted">{track.body}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <div className="mt-12 rounded-2xl bg-navy p-8 text-white md:flex md:items-center md:justify-between md:p-10">
            <div>
              <h3 className="text-2xl font-semibold">Send me a message.</h3>
              <p className="mt-2 text-white/70">
                Pick whichever way is easiest. I reply quickly.
              </p>
            </div>
            <div className="mt-6 flex flex-wrap gap-3 md:mt-0">
              {links.map((link, i) => {
                const Icon = link.icon;
                const primary = i === 0;
                return (
                  <TrackedLink
                    key={link.label}
                    href={link.href}
                    cta={link.cta}
                    external={link.external}
                    className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-colors ${
                      primary
                        ? "bg-gold text-ink hover:bg-gold-hover"
                        : "border border-white/25 text-white hover:border-white/60 hover:bg-white/5"
                    }`}
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                    {link.label}
                  </TrackedLink>
                );
              })}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
