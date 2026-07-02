import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { Contact } from "@/components/Contact";
import { Faq } from "@/components/Faq";

export const metadata: Metadata = {
  title: "Contact — Omole Usuangbon",
  description:
    "Work with Omole on growth for your startup or business, or partner with JobMingle. Reach out by email, book a call, or message on LinkedIn or WhatsApp.",
};

export default function ContactPage() {
  return (
    <main>
      <PageHeader
        eyebrow="Contact"
        title="Let us talk about growth."
        intro="Whether you want to work together or partner with JobMingle, here is the fastest way to reach me."
      />
      <Contact />
      <Faq />
    </main>
  );
}
