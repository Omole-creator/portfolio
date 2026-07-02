import type { Metadata } from "next";
import { About } from "@/components/About";
import { Recognition } from "@/components/Recognition";
import { HomeCta } from "@/components/HomeCta";

export const metadata: Metadata = {
  title: "About — Omole Usuangbon",
  description:
    "Omole Usuangbon is a founder and growth operator who grows businesses through community and paid ads, and builds the systems they run on using AI.",
};

export default function AboutPage() {
  return (
    <main className="pt-16">
      <About />
      <Recognition />
      <HomeCta />
    </main>
  );
}
