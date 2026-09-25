import {
  growthAbout,
  growthWork,
  growthTechnicalSkills,
  growthSoftSkills,
} from "@/lib/growth-content";
import {
  marketingAbout,
  marketingWork,
  marketingTechnicalSkills,
  marketingSoftSkills,
} from "@/lib/marketing-content";
import { webAbout, webWork } from "@/lib/web-content";
import type { JobTrack } from "./types";

/** Grounding text for the Gemini prompt - the only facts it's allowed to draw on. */
export function buildCandidateContext(track: JobTrack): string {
  if (track === "growth") {
    return [
      growthAbout.join("\n\n"),
      "\nProjects:\n" + summarize(growthWork),
      "\nTechnical skills: " + growthTechnicalSkills.join(", "),
      "Soft skills: " + growthSoftSkills.join(", "),
    ].join("\n");
  }

  if (track === "web") {
    return [
      webAbout.join("\n\n"),
      "\nProjects:\n" + summarizeWebWork(webWork),
      "\nTechnical skills: AI-assisted web design and development (Claude Code), website and web app design (UI/UX), landing page development, WordPress, conversion copywriting, SEO fundamentals, checkout and payments integration (Selar), deployment (Vercel).",
      // Omole doesn't write code by hand: every /web project was built by
      // directing Claude Code. That's the edge to lead with (it's why a full
      // site went live in 24 hours), and it also means a draft must never
      // claim hand-coding or fluency in a programming language or framework.
      "\nHow I build: every project above was built with Claude Code. I do not write code by hand. I design the site, write the copy, and direct Claude Code to build it, which is why I can ship a full site in 24 hours. Present this as a strength, and never claim hand-coding skills or fluency in any programming language or framework.",
    ].join("\n");
  }

  return [
    marketingAbout.join("\n\n"),
    "\nProjects:\n" + summarize(marketingWork),
    "\nTechnical skills: " + marketingTechnicalSkills.join(", "),
    "Soft skills: " + marketingSoftSkills.join(", "),
  ].join("\n");
}

function summarizeWebWork(projects: { name: string; kind: string; blurb: string; highlights: string[] }[]) {
  return projects
    .map((p) => `- ${p.name} (${p.kind}): ${p.blurb} ${p.highlights.join("; ")}.`)
    .join("\n");
}

function summarize(projects: { name: string; kind: string; results: string[]; insight: string }[]) {
  return projects
    .map((p) => `- ${p.name} (${p.kind}): ${p.results.join("; ")}. ${p.insight}`)
    .join("\n");
}
