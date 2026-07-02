import { Hero } from "@/components/Hero";
import { ToolsMarquee } from "@/components/ToolsMarquee";
import { Services } from "@/components/Services";
import { WorkTeaser } from "@/components/WorkTeaser";
import { Recognition } from "@/components/Recognition";
import { HomeCta } from "@/components/HomeCta";

export default function Home() {
  return (
    <main>
      <Hero />
      <ToolsMarquee />
      <WorkTeaser />
      <Services />
      <Recognition />
      <HomeCta />
    </main>
  );
}
