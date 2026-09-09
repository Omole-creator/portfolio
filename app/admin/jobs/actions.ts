"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prepareJobApplication } from "@/lib/jobs/prepare";
import { sendApplicationEmail as sendViaGmail } from "@/lib/jobs/gmail";
import { detectAts, type AtsProbeResult } from "@/lib/jobs/detect";
import type { JobAts, JobMatch, JobSourceTrack } from "@/lib/jobs/types";

export type ActionState = { error?: string; message?: string };
export type DetectState = { error?: string; matches?: AtsProbeResult[] };

// Includes the aggregator types even though the primary "paste a URL" flow
// never produces one - the manual-override panel in AddSourceForm.tsx lets
// the admin pick one directly, and this validation was rejecting that
// choice before this fix (every aggregator source so far was added by
// direct database insert instead, never through this form).
const ATS_VALUES: JobAts[] = [
  "greenhouse",
  "lever",
  "ashby",
  "workable",
  "smartrecruiters",
  "recruitee",
  "breezy",
  "custom",
  "remoteok",
  "remotive",
  "jobicy",
  "arbeitnow",
  "himalayas",
  "workingnomads",
];
const SOURCE_TRACK_VALUES: JobSourceTrack[] = ["growth", "marketing", "web", "both"];

export async function prepareApplication(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const id = String(formData.get("id") ?? "");
  if (!id) return { error: "Missing job id." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: job, error: fetchError } = await supabase
    .from("job_matches")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (fetchError) return { error: friendly(fetchError.message) };
  if (!job) return { error: "That job could not be found." };

  const result = await prepareJobApplication(job as JobMatch);
  if ("error" in result) return { error: result.error };

  const { error: updateError } = await supabase
    .from("job_matches")
    .update({
      status: "prepared",
      cover_letter: result.cover_letter,
      qa_pairs: result.qa_pairs,
      extraction_ok: result.extraction_ok,
      cv_path: result.cv_path,
      portfolio_url: result.portfolio_url,
      apply_email: result.apply_email,
      prepared_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (updateError) return { error: friendly(updateError.message) };

  return { message: "Draft ready. Review it below before you apply." };
}

export async function sendApplicationEmail(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const id = String(formData.get("id") ?? "");
  if (!id) return { error: "Missing job id." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: job, error: fetchError } = await supabase
    .from("job_matches")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (fetchError) return { error: friendly(fetchError.message) };
  if (!job) return { error: "That job could not be found." };
  const typedJob = job as JobMatch;

  if (!typedJob.apply_email) return { error: "No application email found for this job." };
  if (!typedJob.cover_letter) return { error: "Prepare the application first." };
  if (typedJob.email_sent_at) return { error: "This application was already emailed." };
  if (!typedJob.cv_path) return { error: "No CV chosen for this job." };

  const result = await sendViaGmail({
    to: typedJob.apply_email,
    subject: `Application - ${typedJob.title} - Omole Usuangbon`,
    bodyText: `${typedJob.cover_letter}\n\nPortfolio: ${typedJob.portfolio_url ?? ""}`,
    cvPath: typedJob.cv_path,
  });

  if (!result.ok) return { error: result.error };

  const { error: updateError } = await supabase
    .from("job_matches")
    .update({
      status: "applied",
      email_sent_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (updateError) return { error: friendly(updateError.message) };

  return { message: "Sent. The application email is on its way." };
}

export async function markApplied(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const supabase = await createClient();
  await supabase
    .from("job_matches")
    .update({ status: "applied", updated_at: new Date().toISOString() })
    .eq("id", id);

  redirect("/admin/jobs");
}

export async function dismissMatch(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const supabase = await createClient();
  await supabase
    .from("job_matches")
    .update({ status: "dismissed", updated_at: new Date().toISOString() })
    .eq("id", id);

  redirect("/admin/jobs");
}

export async function addJobSource(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const companyName = String(formData.get("company_name") ?? "").trim();
  const ats = String(formData.get("ats") ?? "") as JobAts;
  const boardToken = String(formData.get("board_token") ?? "").trim();
  const hiresGlobally = formData.get("hires_globally") === "on";
  const track = String(formData.get("track") ?? "") as JobSourceTrack;

  if (!companyName) return { error: "Give the company a name." };
  if (!ATS_VALUES.includes(ats)) return { error: "Choose which ATS this company uses." };
  if (!boardToken) {
    return {
      error:
        ats === "custom"
          ? "Enter the full URL of the company's careers page."
          : "Enter the board token from the company's careers URL.",
    };
  }
  if (!SOURCE_TRACK_VALUES.includes(track)) return { error: "Choose a track." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { error } = await supabase.from("job_sources").insert({
    company_name: companyName,
    ats,
    board_token: boardToken,
    hires_globally: hiresGlobally,
    track,
  });

  if (error) return { error: friendly(error.message) };

  redirect("/admin/jobs");
}

/**
 * Probes every real ATS platform with the given token in parallel, so the
 * admin doesn't have to already know which one a company uses. "custom" is
 * never returned here - it takes a full URL, not a token, and can't be
 * probed the same way.
 */
export async function detectJobSourceAts(
  _prev: DetectState,
  formData: FormData,
): Promise<DetectState> {
  const boardToken = String(formData.get("board_token") ?? "").trim();
  if (!boardToken) return { error: "Enter a board token to check first." };

  const matches = await detectAts(boardToken);
  if (!matches.length) {
    return { error: "Not found on any recognized ATS. Double-check the token, or use \"Custom careers page\" with the full URL instead." };
  }

  return { matches };
}

export async function toggleJobSource(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const active = formData.get("active") === "true";
  if (!id) return;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  await supabase.from("job_sources").update({ active: !active }).eq("id", id);
  redirect("/admin/jobs");
}

export async function deleteJobSource(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const supabase = await createClient();
  await supabase.from("job_sources").delete().eq("id", id);
  redirect("/admin/jobs");
}

function friendly(message: string) {
  if (message.includes("job_sources_unique_board")) {
    return "That company and ATS combination is already in the list.";
  }
  if (message.includes("job_matches_unique_posting")) {
    return "That job posting is already tracked.";
  }
  return message;
}
