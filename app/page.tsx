import { Hero } from "@/components/Hero";
import { ToolsMarquee } from "@/components/ToolsMarquee";
import { WorkTeaser } from "@/components/WorkTeaser";
import { Services } from "@/components/Services";
import { Benefits } from "@/components/Benefits";
import { Recognition } from "@/components/Recognition";
import { Contrast } from "@/components/Contrast";
import { WhoThisIsFor } from "@/components/WhoThisIsFor";
import { Process } from "@/components/Process";
import { HomeCta } from "@/components/HomeCta";

export default function Home() {
  return (
    <main>
      <Hero />
      <ToolsMarquee />
      <WorkTeaser />
      <Services />
      <Benefits />
      <Recognition />
      <Contrast />
      <WhoThisIsFor />
      <Process />
      <HomeCta />
    </main>
  );
}
