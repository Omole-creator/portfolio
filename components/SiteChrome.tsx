"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Nav } from "./Nav";
import { Footer } from "./Footer";
import { GrowthNav } from "./growth/GrowthNav";
import { GrowthFooter } from "./growth/GrowthFooter";

// /growth is a separate portfolio built for growth marketing applications.
// It gets its own nav and footer, scoped to itself with anchor links, so a
// recruiter following that link never lands back on the founder-framed nav.
export function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isGrowth = pathname?.startsWith("/growth") ?? false;

  if (isGrowth) {
    return (
      <>
        <GrowthNav />
        {children}
        <GrowthFooter />
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
