import { createHash } from "node:crypto";
import type { SupabaseClient } from "@supabase/supabase-js";
import { extractPageText } from "@/lib/jobs/fetchers/shared";
import { sendSelfNotification } from "@/lib/jobs/gmail";
import { allWindowStatuses, DEADLINE_WARNING_DAYS, formatDate, todayInLagos } from "./status";
import type { ScholarshipProgram } from "./types";

const PAGE_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36",
  Accept: "text/html",
};

// Wording that says applications are open right now. Deliberately not a
// bare "Apply now", which sits on most program pages all year round.
const OPEN_SIGNAL =
  /(?:applications?|application (?:portal|system|period|round|phase))\s+(?:is|are)\s+(?:now\s+)?open\b|now accepting applications|(?:is|are) (?:now )?accepting applications|application (?:campaign|call)[^.!?]{0,80}\b(?:is|are) (?:now )?open\b|application[^.!?]{0,80}\bhas (?:started|opened)\b|applications? (?:can|may) (?:now )?be submitted/gi;

// Sentences that carry admission information. The page fingerprint is
// built from these only, so a changed news ticker or cookie banner doesn't
// count as "the page changed".
const ADMISSION_SENTENCE = /apply|application|deadline|admission|intake|enrol|semester|call for/i;

type PageSignal = { key: string; text: string; stale: boolean };
type PageReading = { hash: string; signals: PageSignal[] } | null;

function shortHash(text: string): string {
  return createHash("sha256").update(text).digest("hex").slice(0, 16);
}

export async function readPage(url: string): Promise<PageReading> {
  try {
    const res = await fetch(url, { headers: PAGE_HEADERS, signal: AbortSignal.timeout(20000) });
    if (!res.ok) return null;
    const text = extractPageText(await res.text(), 400000);
    if (text.length < 200) return null; // a client-rendered shell; nothing to read

    const admission = text
      .split(/(?<=[.!?])\s+/)
      .filter((sentence) => ADMISSION_SENTENCE.test(sentence))
      .join(" ");

    // Keyed on the matched wording plus what follows it (where a news item
    // carries its date), not on the text before it, so an older item doesn't
    // look new just because a newer one was added above it. A signal whose
    // trailing text only names earlier years (e.g. "is open! 17 Nov 2025")
    // is last cycle's news, kept as stale so it never alerts.
    const thisYear = new Date().getUTCFullYear();
    const signals = new Map<string, PageSignal>();
    for (const match of text.matchAll(OPEN_SIGNAL)) {
      const at = match.index ?? 0;
      const tail = text.slice(at, at + match[0].length + 60);
      const years = [...tail.matchAll(/\b(20\d\d)\b/g)].map((m) => Number(m[1]));
      const key = shortHash(tail.toLowerCase());
      if (signals.has(key)) continue;
      signals.set(key, {
        key,
        text: text.slice(Math.max(0, at - 100), at + match[0].length + 120).trim(),
        stale: years.length > 0 && years.every((year) => year < thisYear),
      });
    }
    return { hash: shortHash(admission), signals: [...signals.values()] };
  } catch {
    return null;
  }
}

type FeedItem = { title: string; link: string };

/**
 * Items of an RSS feed (title + link). Used for feed_url: a second thing to
 * watch alongside the program page, e.g. the Federal Ministry of Education's
 * WordPress search feed for "hungary", which is where Nigeria's Stipendium
 * Hungaricum nomination notice appears. Returns null on any failure.
 */
export async function readFeed(url: string): Promise<FeedItem[] | null> {
  try {
    const res = await fetch(url, { headers: PAGE_HEADERS, signal: AbortSignal.timeout(20000) });
    if (!res.ok) return null;
    const xml = await res.text();
    const items: FeedItem[] = [];
    for (const match of xml.matchAll(/<item>([\s\S]*?)<\/item>/g)) {
      const raw = (tag: string) =>
        match[1].match(new RegExp(`<${tag}>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?</${tag}>`))?.[1]?.trim() ?? "";
      const link = raw("link");
      const title = raw("title")
        .replace(/&#8211;/g, "-")
        .replace(/&#8217;/g, "'")
        .replace(/&#8220;|&#8221;/g, '"')
        .replace(/&amp;/g, "&");
      if (link) items.push({ title, link });
    }
    return items;
  } catch {
    return null;
  }
}

type Alert = { program: ScholarshipProgram; lines: string[] };
type PendingUpdate = { id: string; name: string; update: Record<string, unknown>; known: Set<string>; alertKeys: string[] };

export type CheckResult = { checked: number; alerts: number; emailed: boolean; emailError?: string };

/**
 * The daily scholarship check. For each active program it works out which
 * application windows are open and re-reads the program's page. It emails
 * once per event:
 * - a window opening (key "open:<label>:<date>"),
 * - a deadline within DEADLINE_WARNING_DAYS when no opening date is
 *   published (key "due:<label>:<date>"),
 * - new "applications are open" wording on the page (key "page:<hash>").
 * Wording already on the page the first time a program is checked is
 * recorded without an email, and wording dated in an earlier year is
 * ignored, since both are usually last cycle's news.
 * All alerts from one run go out as a single email.
 *
 * Works with either Supabase client: the anon one from the cron route (RLS
 * lets it update only the check columns) or the signed-in admin's.
 */
export async function checkScholarships(supabase: SupabaseClient, now = new Date()): Promise<CheckResult> {
  const { data, error } = await supabase
    .from("scholarship_programs")
    .select("*")
    .eq("active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("scholarship check: could not load programs:", error.message);
    return { checked: 0, alerts: 0, emailed: false, emailError: error.message };
  }

  const programs = (data ?? []) as ScholarshipProgram[];
  const today = todayInLagos(now);
  const alerts: Alert[] = [];
  const pending: PendingUpdate[] = [];

  const readings = await Promise.all(programs.map((p) => readPage(p.watch_url || p.info_url)));
  const feeds = await Promise.all(programs.map((p) => (p.feed_url ? readFeed(p.feed_url) : Promise.resolve(null))));

  for (const [i, program] of programs.entries()) {
    const reading = readings[i];
    const known = new Set(program.notified_keys ?? []);
    const lines: string[] = [];
    const alertKeys: string[] = [];
    const firstCheck = !program.last_checked_at;

    for (const status of allWindowStatuses(program, today)) {
      const label = status.window?.label ?? "Application";
      if ((status.state === "open" || status.state === "expected_open") && status.opensOn) {
        const key = `open:${label}:${status.opensOn}`;
        if (!known.has(key)) {
          known.add(key);
          alertKeys.push(key);
          lines.push(
            status.state === "open"
              ? `${label}: open now, closes ${formatDate(status.closesOn)}.`
              : `${label}: should be open by now going by last cycle's dates (closes around ${formatDate(status.closesOn)}). Confirm on the page.`,
          );
        }
      }
      if (status.state === "deadline_soon" && status.closesOn) {
        const key = `due:${label}:${status.closesOn}`;
        if (!known.has(key)) {
          known.add(key);
          alertKeys.push(key);
          lines.push(
            `${label}: deadline ${formatDate(status.closesOn)} (${status.daysLeft} days). The university doesn't publish an opening date, so check whether the portal is accepting applications.`,
          );
        }
      }
    }

    let pageSignal = program.page_signal;
    for (const signal of reading?.signals ?? []) {
      const key = `page:${signal.key}`;
      if (known.has(key) || signal.stale) continue;
      known.add(key);
      pageSignal = signal.text;
      if (!firstCheck) {
        alertKeys.push(key);
        lines.push(`The page now says: "${signal.text}"`);
      }
    }

    // Feed items already there the first time the feed is read are
    // recorded silently ("feed:baseline" marks that first read), so only
    // notices posted after that alert.
    const feedItems = feeds[i];
    if (feedItems) {
      const baselined = known.has("feed:baseline");
      known.add("feed:baseline");
      for (const item of feedItems) {
        const key = `feed:${shortHash(item.link)}`;
        if (known.has(key)) continue;
        known.add(key);
        if (baselined) {
          alertKeys.push(key);
          lines.push(`New notice on ${program.feed_label || "the watched feed"}: "${item.title}" ${item.link}`);
        }
      }
    }

    const pageChanged = Boolean(reading && program.page_hash && reading.hash !== program.page_hash);

    pending.push({
      id: program.id,
      name: program.university,
      known,
      alertKeys,
      update: {
        last_checked_at: now.toISOString(),
        page_signal: pageSignal,
        ...(reading ? { page_hash: reading.hash } : {}),
        ...(pageChanged ? { page_changed_at: now.toISOString() } : {}),
      },
    });

    if (lines.length > 0) alerts.push({ program, lines });
  }

  const sent = alerts.length > 0 ? await sendAlertEmail(alerts) : { ok: true as const };

  // An alert only counts as sent once the email went out; if it failed,
  // its keys are left off so tomorrow's run tries again.
  await Promise.all(
    pending.map(async ({ id, name, update, known, alertKeys }) => {
      if (!sent.ok) for (const key of alertKeys) known.delete(key);
      const { error: updateError } = await supabase
        .from("scholarship_programs")
        .update({ ...update, notified_keys: [...known] })
        .eq("id", id);
      if (updateError) {
        console.error(`scholarship check: update failed for ${name}:`, updateError.message);
      }
    }),
  );

  return {
    checked: programs.length,
    alerts: alerts.length,
    emailed: alerts.length > 0 && sent.ok,
    ...(sent.ok ? {} : { emailError: sent.error }),
  };
}

async function sendAlertEmail(alerts: Alert[]) {
  const body = [
    `Your scholarship tracker found ${alerts.length === 1 ? "an update" : `${alerts.length} updates`} today.`,
    "",
    ...alerts.flatMap(({ program, lines }) => [
      `${program.program}, ${program.university} (${program.country})`,
      ...lines.map((line) => `  - ${line}`),
      `  Apply: ${program.apply_url || program.info_url}`,
      program.apply_url ? `  Program page: ${program.info_url}` : "",
      "",
    ]),
    "Everything is on https://omole.vercel.app/admin/scholarship",
    `(Deadline reminders go out ${DEADLINE_WARNING_DAYS} days ahead when a university doesn't publish an opening date.)`,
  ]
    .filter((line, idx, arr) => !(line === "" && arr[idx - 1] === ""))
    .join("\n");

  return sendSelfNotification({
    subject:
      alerts.length === 1
        ? `Scholarship tracker: ${alerts[0].program.university} update`
        : `Scholarship tracker: ${alerts.length} program updates`,
    bodyText: body,
  });
}
