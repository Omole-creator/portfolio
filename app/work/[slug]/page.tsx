import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HomeCta } from "@/components/HomeCta";
import { CaseStudyDetail } from "@/components/work/CaseStudyDetail";
import { caseStudies, site } from "@/lib/content";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return caseStudies.map((study) => ({ slug: study.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const study = caseStudies.find((s) => s.slug === slug);

  if (!study) return { title: `Not found — ${site.name}` };

  return {
    title: `${study.name} — ${site.name}`,
    description: study.blurb,
    alternates: { canonical: `/work/${study.slug}` },
    openGraph: {
      type: "article",
      title: study.name,
      description: study.blurb,
      url: `${site.url}/work/${study.slug}`,
      images: study.images?.[0] ? [{ url: study.images[0].src }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: study.name,
      description: study.blurb,
      images: study.images?.[0] ? [study.images[0].src] : undefined,
    },
  };
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const index = caseStudies.findIndex((s) => s.slug === slug);

  if (index === -1) notFound();

  const study = caseStudies[index];
  const next = caseStudies[(index + 1) % caseStudies.length];

  return (
    <main>
      <CaseStudyDetail study={study} next={next} />
      <HomeCta />
    </main>
  );
}
