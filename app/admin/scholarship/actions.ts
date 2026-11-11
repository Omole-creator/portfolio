"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { checkScholarships } from "@/lib/scholarships/check";
import { parseWindows } from "@/lib/scholarships/windows";
import type { IeltsRequired } from "@/lib/scholarships/types";

export type ActionState = { error?: string; message?: string };

const IELTS_VALUES: IeltsRequired[] = ["no", "yes", "unclear"];

async function signedInClient() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  return supabase;
}

function text(formData: FormData, name: string): string | null {
  const value = String(formData.get(name) ?? "").trim();
  return value || null;
}

function validUrl(value: string | null): boolean {
  if (!value) return true;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

/** Runs the same check the daily cron does, right now. Emails if something opened. */
export async function checkNow(_prev: ActionState, _formData: FormData): Promise<ActionState> {
  const supabase = await signedInClient();
  const result = await checkScholarships(supabase);
  revalidatePath("/admin/scholarship");

  if (result.emailError && result.alerts > 0) {
    return { error: `Checked ${result.checked} programs. ${result.alerts} had news, but the email failed: ${result.emailError}` };
  }
  if (result.alerts === 0) return { message: `Checked ${result.checked} programs. Nothing new since the last check.` };
  return { message: `Checked ${result.checked} programs. ${result.alerts} had news, and an email is on its way.` };
}

export async function addProgram(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const university = text(formData, "university");
  const program = text(formData, "program");
  const country = text(formData, "country");
  const infoUrl = text(formData, "info_url");
  const applyUrl = text(formData, "apply_url");
  const ielts = String(formData.get("ielts_required") ?? "unclear") as IeltsRequired;

  if (!university || !program || !country) return { error: "Fill in the university, program, and country." };
  if (!infoUrl) return { error: "Add the program's page, so the daily check has something to read." };
  if (!validUrl(infoUrl) || !validUrl(applyUrl)) return { error: "One of the links isn't a valid web address." };
  if (!IELTS_VALUES.includes(ielts)) return { error: "Choose whether IELTS is needed." };

  const parsed = parseWindows(String(formData.get("windows") ?? ""));
  if ("error" in parsed) return { error: parsed.error };

  const supabase = await signedInClient();
  const { error } = await supabase.from("scholarship_programs").insert({
    university,
    program,
    country,
    city: text(formData, "city"),
    tuition_note: text(formData, "tuition_note"),
    funding_note: text(formData, "funding_note"),
    english_note: text(formData, "english_note"),
    ielts_required: ielts,
    windows: parsed.windows,
    apply_url: applyUrl,
    info_url: infoUrl,
  });
  if (error) return { error: `Could not save: ${error.message}` };

  revalidatePath("/admin/scholarship");
  return { message: `Added ${program}.` };
}

export async function updateProgram(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const id = text(formData, "id");
  if (!id) return { error: "Missing program id." };

  const infoUrl = text(formData, "info_url");
  const applyUrl = text(formData, "apply_url");
  const watchUrl = text(formData, "watch_url");
  const ielts = String(formData.get("ielts_required") ?? "unclear") as IeltsRequired;

  if (!infoUrl) return { error: "The program page can't be empty." };
  if (!validUrl(infoUrl) || !validUrl(applyUrl) || !validUrl(watchUrl)) {
    return { error: "One of the links isn't a valid web address." };
  }
  if (!IELTS_VALUES.includes(ielts)) return { error: "Choose whether IELTS is needed." };

  const parsed = parseWindows(String(formData.get("windows") ?? ""));
  if ("error" in parsed) return { error: parsed.error };

  const supabase = await signedInClient();
  const { error } = await supabase
    .from("scholarship_programs")
    .update({
      info_url: infoUrl,
      apply_url: applyUrl,
      watch_url: watchUrl,
      ielts_required: ielts,
      windows: parsed.windows,
      windows_note: text(formData, "windows_note"),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);
  if (error) return { error: `Could not save: ${error.message}` };

  revalidatePath("/admin/scholarship");
  return { message: "Saved." };
}

export async function removeProgram(formData: FormData): Promise<void> {
  const id = text(formData, "id");
  if (!id) return;
  const supabase = await signedInClient();
  const { error } = await supabase.from("scholarship_programs").delete().eq("id", id);
  if (error) console.error("Could not remove scholarship program:", error.message);
  revalidatePath("/admin/scholarship");
}
