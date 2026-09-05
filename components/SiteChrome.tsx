"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Nav } from "./Nav";
import { Footer } from "./Footer";
import { GrowthNav } from "./growth/GrowthNav";
import { GrowthFooter } from "./growth/GrowthFooter";
import { WebNav } from "./web/WebNav";
import { WebFooter } from "./web/WebFooter";
import { MarketingNav } from "./marketing/MarketingNav";
import { MarketingFooter } from "./marketing/MarketingFooter";

// /growth, /web, and /marketing are separate portfolios built for specific
// pitches (growth marketing applications, web design/dev for US business
// owners, and creative marketing manager applications). Each gets its own
// nav and footer, scoped to itself with anchor links, so a visitor
// following that link never lands back on the founder-framed nav or a case
// study aimed at a different audience.
export function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  if (pathname?.startsWith("/growth")) {
    return (
      <>
        <GrowthNav />
        {children}
        <GrowthFooter />
      </>
    );
  }

  if (pathname?.startsWith("/web")) {
    return (
      <>
        <WebNav />
        {children}
        <WebFooter />
      </>
    );
  }

  if (pathname?.startsWith("/marketing")) {
    return (
      <>
        <MarketingNav />
        {children}
        <MarketingFooter />
      </>
    );
  }

  return (
    <>
      <Nav />
      {children}
      <Footer />
    </>
  );
}
