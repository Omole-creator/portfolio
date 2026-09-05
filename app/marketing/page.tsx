import type { Metadata } from "next";
import { MarketingHero } from "@/components/marketing/MarketingHero";
import { MarketingAbout } from "@/components/marketing/MarketingAbout";
import { MarketingServices } from "@/components/marketing/MarketingServices";
import { MarketingWork } from "@/components/marketing/MarketingWork";
import { MarketingCredentials } from "@/components/marketing/MarketingCredentials";
import { MarketingDifference } from "@/components/marketing/MarketingDifference";
import { MarketingProcess } from "@/components/marketing/MarketingProcess";
import { MarketingContact } from "@/components/marketing/MarketingContact";
import { ToolsMarquee } from "@/components/ToolsMarquee";
import { marketingSite } from "@/lib/marketing-content";
import { site } from "@/lib/content";

const title = `${marketingSite.name} — ${marketingSite.role}`;

export const metadata: Metadata = {
  title,
  description: marketingSite.metaDescription,
  alternates: { canonical: marketingSite.path },
  openGraph: {
    title,
    description: marketingSite.metaDescription,
    url: `${site.url}${marketingSite.path}`,
    siteName: marketingSite.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: marketingSite.metaDescription,
  },
};

export default function MarketingPage() {
  return (
    <main>
      <MarketingHero />
      <ToolsMarquee />
      <MarketingAbout />
      <MarketingServices />
      <MarketingWork />
      <MarketingCredentials />
      <MarketingDifference />
      <MarketingProcess />
      <MarketingContact />
    </main>
  );
}
