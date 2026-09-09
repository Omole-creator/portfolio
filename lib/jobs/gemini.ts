import type { JobTrack, NormalizedJob, QaPair } from "./types";

// gemini-2.0-flash was retired (confirmed live: the API now 404s and names
// gemini-3.6-flash as the replacement) - if this 404s again in the future,
// check https://generativelanguage.googleapis.com/v1beta/models?key=$GEMINI_API_KEY
// for the current free-tier flash model name rather than guessing.
const GEMINI_ENDPOINT =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent";

type DraftInput = {
  job: NormalizedJob;
  track: JobTrack;
  candidateContext: string;
  questions: string[];
};

type DraftResult = { coverLetter: string; qaPairs: QaPair[] };

// gemini-3.6-flash "thinks" by default, which burns a large, variable
// number of hidden thinking tokens per call (confirmed live: ~1,100 tokens
// of thinking for a single cover letter, on top of the actual output) for
// no benefit on a templated drafting task like this one. That eats into the
// free tier's daily quota far faster than the visible output would suggest,
// and "thinkingLevel: low" was confirmed live to drop thoughtsTokenCount to
// zero while still returning a valid draft (thinkingBudget: 0, the
// documented way to disable thinking on 2.5-series models, is rejected by
// this model with a 400 - thinkingLevel is the 3.x replacement).
const THINKING_CONFIG = { thinkingLevel: "low" as const };

// The single most common cause of "Could not generate a draft right now" in
// practice, confirmed live: gemini-3.6-flash intermittently returns a 503
// "currently experiencing high demand" even on a totally ordinary request,
// with no retry built in previously - one transient blip failed the whole
// "Prepare application" tap. A 429 (quota/rate limit) is the other
// retryable case. Both clear up within a few seconds, so a short retry loop
// fixes the vast majority of these without the admin ever seeing an error.
const RETRYABLE_STATUS = new Set([429, 503]);
const MAX_ATTEMPTS = 3;
const RETRY_DELAY_MS = 1500;

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Calls Gemini Flash (free tier) to draft a tailored cover letter and, where questions were extracted, an answer for each. Returns null on any failure - caller must degrade gracefully, never surface this as a hard error to the whole prepare flow beyond "try again." */
export async function draftApplication(input: DraftInput): Promise<DraftResult | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("GEMINI_API_KEY is not set.");
    return null;
  }

  const body = {
    contents: [{ parts: [{ text: buildPrompt(input) }] }],
    generationConfig: {
      temperature: 0.4,
      responseMimeType: "application/json",
      thinkingConfig: THINKING_CONFIG,
      responseSchema: {
        type: "object",
        properties: {
          cover_letter: { type: "string" },
          qa_answers: {
            type: "array",
            items: {
              type: "object",
              properties: {
                question: { type: "string" },
                answer: { type: "string" },
              },
              required: ["question", "answer"],
            },
          },
        },
        required: ["cover_letter", "qa_answers"],
      },
    },
  };

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    try {
      const res = await fetch(`${GEMINI_ENDPOINT}?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(30000),
      });

      if (!res.ok) {
        const errorText = await res.text();
        if (RETRYABLE_STATUS.has(res.status) && attempt < MAX_ATTEMPTS) {
          console.error(`Gemini request failed (attempt ${attempt}): ${res.status} ${errorText}, retrying...`);
          await wait(RETRY_DELAY_MS * attempt);
          continue;
        }
        console.error(`Gemini request failed: ${res.status} ${errorText}`);
        return null;
      }

      const data = await res.json();
      const text: string | undefined = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) {
        console.error("Gemini response had no text part:", JSON.stringify(data).slice(0, 500));
        return null;
      }

      const parsed = JSON.parse(text) as { cover_letter?: string; qa_answers?: QaPair[] };
      if (!parsed.cover_letter || typeof parsed.cover_letter !== "string") {
        console.error("Gemini response missing cover_letter.");
        return null;
      }

      return {
        coverLetter: parsed.cover_letter.trim(),
        qaPairs: Array.isArray(parsed.qa_answers) ? parsed.qa_answers : [],
      };
    } catch (error) {
      if (attempt < MAX_ATTEMPTS) {
        console.error(`Gemini draft errored (attempt ${attempt}), retrying:`, error);
        await wait(RETRY_DELAY_MS * attempt);
        continue;
      }
      console.error("Gemini draft failed:", error);
      return null;
    }
  }

  return null;
}

function buildPrompt({ job, track, candidateContext, questions }: DraftInput): string {
  const trackLabel =
    track === "growth" ? "growth marketing" : track === "web" ? "AI-assisted web design and development" : "creative marketing";

  const questionsBlock = questions.length
    ? `The application form for this specific job also asks these questions. Draft a genuine, specific answer for each one, grounded only in the background below:\n${questions.map((q, i) => `${i + 1}. ${q}`).join("\n")}`
    : "No custom application questions were found for this posting, so return an empty qa_answers array.";

  return `You are drafting a job application for Omole Usuangbon, a ${trackLabel} professional, applying to a real ${trackLabel} role.

Job details:
Company: ${job.company_name}
Title: ${job.title}
Location: ${job.location_text ?? "not specified"}
Description: ${(job.description_text ?? "").slice(0, 4000)}

Candidate background (the only source of facts you may use - do not invent metrics, employers, or achievements not listed here):
${candidateContext}

Write a cover letter, under 350 words, in first person as Omole Usuangbon. Ground every claim in the background above. Address why this specific role and company fit, using details from the job description. Do not use a generic opening like "I am writing to express my interest." Write the way a direct, plainspoken person actually talks: no filler, no em dashes, no "I am confident that..." hedging.

${questionsBlock}

Return only the JSON object matching the schema.`;
}
