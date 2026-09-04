import type { Metadata } from "next";
import { GrowthHero } from "@/components/growth/GrowthHero";
import { GrowthAbout } from "@/components/growth/GrowthAbout";
import { GrowthServices } from "@/components/growth/GrowthServices";
import { GrowthWork } from "@/components/growth/GrowthWork";
import { GrowthCredentials } from "@/components/growth/GrowthCredentials";
import { GrowthDifference } from "@/components/growth/GrowthDifference";
import { GrowthProcess } from "@/components/growth/GrowthProcess";
import { GrowthContact } from "@/components/growth/GrowthContact";
import { ToolsMarquee } from "@/components/ToolsMarquee";
import { growthSite } from "@/lib/growth-content";
import { site } from "@/lib/content";

const title = `${growthSite.name} — ${growthSite.role}`;

export const metadata: Metadata = {
  title,
  description: growthSite.metaDescription,
  alternates: { canonical: growthSite.path },
  openGraph: {
    title,
    description: growthSite.metaDescription,
    url: `${site.url}${growthSite.path}`,
    siteName: growthSite.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: growthSite.metaDescription,
  },
};

export default function GrowthPage() {
  return (
    <main>
      <GrowthHero />
      <ToolsMarquee />
      <GrowthAbout />
      <GrowthServices />
      <GrowthWork />
      <GrowthCredentials />
      <GrowthDifference />
      <GrowthProcess />
      <GrowthContact />
    </main>
  );
}
