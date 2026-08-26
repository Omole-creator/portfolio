import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { Services } from "@/components/Services";
import { Benefits } from "@/components/Benefits";
import { Contrast } from "@/components/Contrast";
import { HomeCta } from "@/components/HomeCta";

export const metadata: Metadata = {
  title: "Services — Omole Usuangbon",
  description:
    "Growth, copywriting, community, operations, and the tools and dashboards built to run all of it, backed by what has actually shipped.",
};

export default function ServicesPage() {
  return (
    <main>
      <PageHeader
        eyebrow="Services"
        title="What I do."
        intro="Five things, backed by what I have actually built and shipped."
      />
      <Services showHeading={false} />
      <Benefits />
      <Contrast />
      <HomeCta />
    </main>
  );
}
