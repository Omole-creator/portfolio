import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { CaseStudies } from "@/components/CaseStudies";
import { HomeCta } from "@/components/HomeCta";

export const metadata: Metadata = {
  title: "Work — Omole Usuangbon",
  description:
    "The company Omole built and grew, and the products he shipped with AI to run it: a financial dashboard, a sales CRM, and a monetised sales toolkit.",
};

export default function WorkPage() {
  return (
    <main>
      <PageHeader
        eyebrow="Selected work"
        title="A company I built, and the products I shipped to run it."
        intro="Real growth, and real software behind it. Here is the company, and the tools I built with AI to keep it running. The figures in the dashboards are blurred on purpose."
      />
      <CaseStudies showHeading={false} />
      <HomeCta />
    </main>
  );
}
