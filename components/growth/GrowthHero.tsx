"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { CalendarCheck, ArrowRight } from "lucide-react";
import { growthSite, growthProof } from "@/lib/growth-content";
import { ShaderBackground } from "@/components/ui/shader-background";
import { GlowButton } from "@/components/ui/glow-button";

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.13, delayChildren: 0.2 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

export function GrowthHero() {
  const [main, accent] = growthSite.headline.split("Paying Customers");
  const reduce = useReducedMotion();
  const start = reduce ? "visible" : "hidden";

  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] items-center overflow-hidden bg-navy-deep text-white"
    >
      <div className="absolute inset-0">
        <ShaderBackground />
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-navy-deep/70 via-navy/70 to-navy-deep/90"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-10 h-[32rem] w-[32rem] rounded-full bg-gold/10 blur-3xl"
      />

      <motion.div
        variants={container}
        initial={start}
        animate="visible"
        className="container-x relative z-10 py-32"
      >
        <div className="max-w-4xl">
          <motion.h1
            variants={item}
            className="text-[1.6rem] font-semibold leading-[1.15] tracking-tight sm:text-5xl sm:leading-[1.06] md:text-6xl lg:text-[4.25rem]"
          >
            {main}
            <span className="text-gold whitespace-nowrap">Paying Customers</span>
            {accent}
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-7 max-w-2xl text-lg leading-relaxed text-white/75"
          >
            {growthSite.subhead}
          </motion.p>

          <motion.div
            variants={item}
            className="mt-9 flex flex-nowrap items-center gap-3 sm:gap-4"
          >
            <GlowButton
              href={growthSite.contact.calendly}
              external
              variant="primary"
              cta="calendly"
            >
              <CalendarCheck className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
              Book a call
            </GlowButton>
            <GlowButton href="#work" variant="ghost">
              See the work
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </GlowButton>
          </motion.div>
        </div>

        <motion.dl
          variants={item}
          className="mt-16 grid max-w-3xl grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4"
        >
          {growthProof.map((metric) => (
            <div key={metric.label} className="border-l border-white/15 pl-4">
              <dt className="font-display text-2xl font-semibold tabular-nums text-gold md:text-3xl">
                {metric.value}
              </dt>
              <dd className="mt-1 text-sm leading-snug text-white/60">
                {metric.label}
              </dd>
            </div>
          ))}
        </motion.dl>
      </motion.div>
    </section>
  );
}
