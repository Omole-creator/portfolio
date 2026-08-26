import { Hero } from "@/components/Hero";
import { ToolsMarquee } from "@/components/ToolsMarquee";
import { WorkTeaser } from "@/components/WorkTeaser";
import { WhoThisIsFor } from "@/components/WhoThisIsFor";
import { Services } from "@/components/Services";
import { Benefits } from "@/components/Benefits";
import { Recognition } from "@/components/Recognition";
import { Contrast } from "@/components/Contrast";
import { Process } from "@/components/Process";
import { HomeCta } from "@/components/HomeCta";

export default function Home() {
  return (
    <main>
      <Hero />
      <ToolsMarquee />
      <WorkTeaser />
      <WhoThisIsFor />
      <Services />
      <Benefits />
      <Recognition />
      <Contrast />
      <Process />
      <HomeCta />
    </main>
  );
}
