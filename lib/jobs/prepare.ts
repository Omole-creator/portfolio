import { extractApplicationDetails } from "./extractQuestions";
import { draftApplication } from "./gemini";
import { buildCandidateContext } from "./candidateContext";
import type { JobMatch, JobTrack, NormalizedJob, QaPair } from "./types";

const CV_AND_PORTFOLIO: Record<JobTrack, { cv_path: string; portfolio_url: string }> = {
  growth: {
    cv_path: "/omole-usuangbon-growth-marketing-cv.pdf",
    portfolio_url: "https://omoleportfolio.vercel.app/growth",
  },
  marketing: {
    cv_path: "/omole-usuangbon-creative-marketing-cv.pdf",
    portfolio_url: "https://omoleportfolio.vercel.app/marketing",
  },
};

type PrepareResult =
  | {
      cover_letter: string;
      qa_pairs: QaPair[] | null;
      extraction_ok: boolean;
      cv_path: string;
      portfolio_url: string;
      apply_email: string | null;
    }
  | { error: string };

/**
 * Orchestrates one "Prepare application" tap: picks the right CV/portfolio,
 * best-effort extracts this specific job's application questions and a
 * direct application email (if the company takes applications that way),
 * and asks Gemini to draft a cover letter (and per-question answers, when
 * any were found). Never submits or sends anything itself - the caller
 * stores the result for the admin to review, then either paste in by hand
 * or (when apply_email is set) confirm an actual send.
 */
export async function prepareJobApplication(job: JobMatch): Promise<PrepareResult> {
  const { cv_path, portfolio_url } = CV_AND_PORTFOLIO[job.track];

  const { questions, applyEmail } = await extractApplicationDetails(
    job.apply_url,
    job.description_text,
  );
  const candidateContext = buildCandidateContext(job.track);

  const normalized: NormalizedJob = {
    ats: job.ats,
    external_id: job.external_id,
    company_name: job.company_name,
    title: job.title,
    location_text: job.location_text,
    apply_url: job.apply_url,
    description_text: job.description_text,
    is_remote: true, // already passed the remote gate in classify.ts to be stored at all
    posted_at: job.posted_at,
  };

  const draft = await draftApplication({
    job: normalized,
    track: job.track,
    candidateContext,
    questions,
  });

  if (!draft) {
    return { error: "Could not generate a draft right now. Try again in a moment." };
  }

  return {
    cover_letter: draft.coverLetter,
    qa_pairs: draft.qaPairs.length ? draft.qaPairs : null,
    extraction_ok: questions.length > 0,
    cv_path,
    portfolio_url,
    apply_email: applyEmail,
  };
}
