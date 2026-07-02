import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { ProofBar } from "@/components/ProofBar";
import { About } from "@/components/About";
import { Services } from "@/components/Services";
import { CaseStudies } from "@/components/CaseStudies";
import { Recognition } from "@/components/Recognition";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <ProofBar />
        <About />
        <Services />
        <CaseStudies />
        <Recognition />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
