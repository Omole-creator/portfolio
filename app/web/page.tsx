import type { Metadata } from "next";
import { WebHero } from "@/components/web/WebHero";
import { WebAbout } from "@/components/web/WebAbout";
import { WebServices } from "@/components/web/WebServices";
import { WebWork } from "@/components/web/WebWork";
import { WebDifference } from "@/components/web/WebDifference";
import { WebProcess } from "@/components/web/WebProcess";
import { WebContact } from "@/components/web/WebContact";
import { ToolsMarquee } from "@/components/ToolsMarquee";
import { webSite } from "@/lib/web-content";
import { site } from "@/lib/content";

const title = `${webSite.name} — ${webSite.role}`;

export const metadata: Metadata = {
  title,
  description: webSite.metaDescription,
  alternates: { canonical: webSite.path },
  openGraph: {
    title,
    description: webSite.metaDescription,
    url: `${site.url}${webSite.path}`,
    siteName: webSite.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: webSite.metaDescription,
  },
};

export default function WebPage() {
  return (
    <main>
      <WebHero />
      <ToolsMarquee />
      <WebAbout />
      <WebServices />
      <WebWork />
      <WebDifference />
      <WebProcess />
      <WebContact />
    </main>
  );
}
