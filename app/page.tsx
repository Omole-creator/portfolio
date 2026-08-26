import { Hero } from "@/components/Hero";
import { ToolsMarquee } from "@/components/ToolsMarquee";
import { Problem } from "@/components/Problem";
import { Services } from "@/components/Services";
import { WorkTeaser } from "@/components/WorkTeaser";
import { Recognition } from "@/components/Recognition";
import { Process } from "@/components/Process";
import { HomeCta } from "@/components/HomeCta";

export default function Home() {
  return (
    <main>
      <Hero />
      <ToolsMarquee />
      <WorkTeaser />
      <Problem />
      <Services />
      <Recognition />
      <Process />
      <HomeCta />
    </main>
  );
}
