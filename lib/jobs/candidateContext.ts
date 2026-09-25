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
      // Background fact for Gemini, not a talking point: Omole doesn't want
      // cover letters announcing how he builds. It's here so a draft never
      // claims hand-coding or fluency in a language or framework, and can
      // mention Claude Code only when the job ad itself asks about AI tools.
      "\nHow I build (background only, not something to state in the letter): every project above was built with Claude Code. Only mention Claude Code or AI tools if the job description asks for them. Never claim hand-coding skills or fluency in any programming language or framework.",
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
