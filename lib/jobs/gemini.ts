import type { JobTrack, NormalizedJob, QaPair } from "./types";

// The free tier's real, hard limit turned out to be much lower than the
// earlier 503-retry fix accounted for: confirmed live, gemini-3.6-flash's
// free tier allows only 20 requests per DAY, total
// ("GenerateRequestsPerDayPerProjectPerModel-FreeTier", quotaValue 20) - not
// a per-minute rate limit a short retry can wait out. A single busy day of
// "Prepare application" taps exhausts it outright, and once exhausted every
// request that day 429s with RESOURCE_EXHAUSTED regardless of how long the
// retry delay is. The fix isn't a longer retry - it's that each Gemini
// model has its OWN separate daily quota bucket (confirmed live: with
// gemini-3.6-flash's quota already exhausted, gemini-flash-latest,
// gemini-3.5-flash-lite, gemini-flash-lite-latest, and gemini-3.7-flash all
// still returned 200), so MODEL_FALLBACK_CHAIN tries the next model
// entirely rather than retrying the same exhausted one. This multiplies the
// effective daily capacity by the number of models tried, not just the
// number of attempts on one model.
const MODEL_FALLBACK_CHAIN = [
  "gemini-3.6-flash",
  "gemini-flash-latest",
  "gemini-3.5-flash-lite",
  "gemini-flash-lite-latest",
  "gemini-3.7-flash",
] as const;

function endpointFor(model: string): string {
  return `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
}

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
// this model with a 400 - thinkingLevel is the 3.x replacement). Sent to
// every model in the fallback chain, not just gemini-3.6-flash - harmless
// on models that ignore it.
const THINKING_CONFIG = { thinkingLevel: "low" as const };

// A 503 ("currently experiencing high demand") is a genuine transient blip,
// confirmed live, worth a short retry on the SAME model. A 429 is not worth
// retrying on the same model - see MODEL_FALLBACK_CHAIN above, a 429 moves
// to the next model immediately instead.
const RETRYABLE_STATUS = new Set([503]);
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

  for (const model of MODEL_FALLBACK_CHAIN) {
    const endpoint = endpointFor(model);

    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
      try {
        const res = await fetch(`${endpoint}?key=${apiKey}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
          signal: AbortSignal.timeout(30000),
        });

        if (!res.ok) {
          const errorText = await res.text();
          if (RETRYABLE_STATUS.has(res.status) && attempt < MAX_ATTEMPTS) {
            console.error(`Gemini ${model} failed (attempt ${attempt}): ${res.status} ${errorText}, retrying...`);
            await wait(RETRY_DELAY_MS * attempt);
            continue;
          }
          console.error(`Gemini ${model} failed: ${res.status} ${errorText}`);
          break; // try the next model in the chain
        }

        const data = await res.json();
        const text: string | undefined = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text) {
          console.error(`Gemini ${model} response had no text part:`, JSON.stringify(data).slice(0, 500));
          break; // try the next model in the chain
        }

        const parsed = JSON.parse(text) as { cover_letter?: string; qa_answers?: QaPair[] };
        if (!parsed.cover_letter || typeof parsed.cover_letter !== "string") {
          console.error(`Gemini ${model} response missing cover_letter.`);
          break; // try the next model in the chain
        }

        return {
          coverLetter: parsed.cover_letter.trim(),
          qaPairs: Array.isArray(parsed.qa_answers) ? parsed.qa_answers : [],
        };
      } catch (error) {
        if (attempt < MAX_ATTEMPTS) {
          console.error(`Gemini ${model} errored (attempt ${attempt}), retrying:`, error);
          await wait(RETRY_DELAY_MS * attempt);
          continue;
        }
        console.error(`Gemini ${model} failed after retries:`, error);
        break; // try the next model in the chain
      }
    }
  }

  console.error("Gemini draft failed: every model in the fallback chain was exhausted or errored.");
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
