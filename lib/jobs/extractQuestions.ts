import * as cheerio from "cheerio";

// Best-effort only. Many ATS application forms (most Ashby boards, many
// Lever boards) render entirely client-side via JS, so a plain fetch sees
// an empty shell and this returns []. That is expected, not a bug - callers
// must treat an empty result as "no custom questions found," not an error,
// and fall back to cover letter + CV + portfolio only.

const STRUCTURAL_FIELD_PATTERNS = [
  /^first name$/i,
  /^last name$/i,
  /^full name$/i,
  /^email/i,
  /^phone/i,
  /^resume/i,
  /^cv$/i,
  /^cover letter/i,
  /^linkedin/i,
  /^website/i,
  /^location/i,
  /^current company/i,
  /^current title/i,
];

function isStructuralField(label: string): boolean {
  return STRUCTURAL_FIELD_PATTERNS.some((pattern) => pattern.test(label.trim()));
}

const EMAIL_PATTERN = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

// Addresses that are almost never the right place to send an application,
// even when they show up near application-sounding language.
const NON_APPLICATION_LOCAL_PARTS = [
  "privacy",
  "legal",
  "support",
  "press",
  "media",
  "unsubscribe",
  "billing",
  "sales",
  "security",
  "abuse",
  "noreply",
  "no-reply",
];

// Phrases that, appearing near an email address, mean "send your
// application here" rather than "here's our general contact address."
const APPLICATION_CONTEXT_PATTERNS = [
  /email your (resume|cv|application|portfolio)/i,
  /send (your )?(resume|cv|application|portfolio)/i,
  /apply (by|via) email/i,
  /application(s)? (should|can) be (sent|emailed)/i,
  /send.{0,20}(to|us at)/i,
  /interested candidates? (should|can)/i,
  /to apply,? (please )?(email|send)/i,
];

function isGenericAddress(email: string): boolean {
  const localPart = email.split("@")[0]?.toLowerCase() ?? "";
  return NON_APPLICATION_LOCAL_PARTS.some((generic) => localPart.includes(generic));
}

function findApplyEmail(text: string): string | null {
  const matches = [...text.matchAll(EMAIL_PATTERN)];
  if (!matches.length) return null;

  // Prefer an address with clear "send your application here" language
  // nearby over a bare address with no context at all.
  const withContext = matches.find((match) => {
    const start = Math.max(0, (match.index ?? 0) - 80);
    const end = Math.min(text.length, (match.index ?? 0) + (match[0]?.length ?? 0) + 80);
    const window = text.slice(start, end);
    return APPLICATION_CONTEXT_PATTERNS.some((pattern) => pattern.test(window));
  });

  const candidate = withContext?.[0] ?? matches.find((m) => !isGenericAddress(m[0]))?.[0] ?? null;
  return candidate && !isGenericAddress(candidate) ? candidate : null;
}

export type ApplicationDetails = {
  questions: string[];
  applyEmail: string | null;
};

/**
 * Fetches a job's real application page once and pulls out both custom
 * question labels (if the form is server-rendered) and a direct
 * application email address, if one exists (a mailto: link on the page
 * takes priority; otherwise the page text and the job description are
 * scanned for an address near application-sounding language). Never
 * throws; degrades to empty questions and a null email.
 */
export async function extractApplicationDetails(
  applyUrl: string,
  descriptionText: string | null,
): Promise<ApplicationDetails> {
  let html = "";
  let pageText = "";

  if (applyUrl) {
    try {
      const res = await fetch(applyUrl, { signal: AbortSignal.timeout(8000) });
      if (res.ok) html = await res.text();
    } catch (error) {
      console.error(`Application page fetch failed for ${applyUrl}:`, error);
    }
  }

  const $ = html ? cheerio.load(html) : null;

  const questions: string[] = [];
  if ($) {
    const seen = new Set<string>();
    $("label").each((_, el) => {
      const text = $(el).text().replace(/\s+/g, " ").replace(/\*$/, "").trim();
      if (!text || text.length < 4 || text.length > 200) return;
      if (isStructuralField(text)) return;
      if (seen.has(text)) return;
      seen.add(text);
      questions.push(text);
    });
    pageText = $("body").text().replace(/\s+/g, " ");
  }

  const mailtoHref = $?.("a[href^='mailto:']")?.first()?.attr("href");
  const mailtoEmail = mailtoHref?.replace(/^mailto:/i, "").split("?")[0]?.trim() || null;

  const applyEmail =
    (mailtoEmail && !isGenericAddress(mailtoEmail) ? mailtoEmail : null) ??
    findApplyEmail(`${descriptionText ?? ""} ${pageText}`);

  return { questions, applyEmail };
}
