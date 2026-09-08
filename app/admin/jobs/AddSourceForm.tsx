"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { AlertCircle, Check, Search } from "lucide-react";
import {
  addJobSource,
  detectJobSourceAts,
  type ActionState,
  type DetectState,
} from "./actions";
import { parseCareersUrl } from "@/lib/jobs/detect";
import type { JobAts } from "@/lib/jobs/types";

const initial: ActionState = {};
const initialDetect: DetectState = {};

const field =
  "mt-1 w-full rounded-xl border border-line bg-white px-3 py-2 text-sm text-ink outline-none transition focus:border-gold";
const label = "text-xs font-semibold text-ink";

const ATS_LABELS: Record<JobAts, string> = {
  greenhouse: "Greenhouse",
  lever: "Lever",
  ashby: "Ashby",
  workable: "Workable",
  smartrecruiters: "SmartRecruiters",
  recruitee: "Recruitee",
  breezy: "Breezy HR",
  custom: "Custom (no recognized ATS)",
  remoteok: "RemoteOK (aggregator, all companies)",
  remotive: "Remotive (aggregator, all companies)",
  jobicy: "Jobicy (aggregator, all companies)",
  arbeitnow: "Arbeitnow (aggregator, all companies)",
  himalayas: "Himalayas (aggregator, keyword search)",
};

// The four aggregators aren't a single company, so the "token" field means
// something different for them: a category/tag filter, not an identifier.
const AGGREGATOR_ATS: JobAts[] = ["remoteok", "remotive", "jobicy", "arbeitnow", "himalayas"];

export function AddSourceForm() {
  const [state, action, pending] = useActionState(addJobSource, initial);
  const [detectState, detectAction, detectPending] = useActionState(
    detectJobSourceAts,
    initialDetect,
  );

  const [url, setUrl] = useState("");
  const [manualOverride, setManualOverride] = useState(false);
  const [manualAts, setManualAts] = useState<JobAts>("greenhouse");
  const [manualToken, setManualToken] = useState("");

  const parsed = useMemo(() => (url.trim() ? parseCareersUrl(url.trim()) : null), [url]);

  // Once the manual-override panel finds a match, drop straight back into
  // the auto-detected state instead of leaving the admin stuck in manual mode.
  useEffect(() => {
    if (detectState.matches?.length === 1) {
      setManualAts(detectState.matches[0].ats);
    }
  }, [detectState.matches]);

  const finalAts: JobAts = manualOverride ? manualAts : (parsed?.ats ?? "custom");
  const finalToken: string = manualOverride ? manualToken : (parsed?.token ?? url.trim());

  return (
    <form action={action} className="mt-6 grid gap-4 border-t border-line pt-6 sm:grid-cols-2">
      <input type="hidden" name="ats" value={finalAts} />
      <input type="hidden" name="board_token" value={finalToken} />

      <div>
        <label htmlFor="company_name" className={label}>
          Company name
        </label>
        <input id="company_name" name="company_name" required className={field} />
        <p className="mt-1 text-xs text-muted">Just a label for you, doesn't affect anything.</p>
      </div>

      <div>
        <label htmlFor="careers_url" className={label}>
          Careers page URL
        </label>
        <input
          id="careers_url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Paste the URL you see when you're on their jobs page"
          className={field}
        />
        {!manualOverride ? (
          url.trim() ? (
            parsed ? (
              <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-green-800">
                <Check className="h-3.5 w-3.5" aria-hidden="true" />
                Detected: {ATS_LABELS[parsed.ats]}
              </p>
            ) : (
              <p className="mt-1.5 text-xs text-amber-800">
                No recognized platform found in that URL — this will be added as a
                "Custom" source and best-effort scraped directly. Still works, just
                noisier than a recognized platform.
              </p>
            )
          ) : (
            <p className="mt-1 text-xs text-muted">
              Click any single job posting on their page and paste the address bar's
              URL, not just the main careers page link.
            </p>
          )
        ) : null}

        <button
          type="button"
          onClick={() => setManualOverride((v) => !v)}
          className="mt-2 text-xs font-semibold text-muted underline-offset-4 hover:text-ink hover:underline"
        >
          {manualOverride ? "Use the URL above instead" : "Not detected right? Fix it manually"}
        </button>
      </div>

      {manualOverride ? (
        <div className="sm:col-span-2 grid gap-4 rounded-xl border border-line bg-paper p-4 sm:grid-cols-2">
          <div>
            <label htmlFor="manual_token" className={label}>
              {AGGREGATOR_ATS.includes(manualAts)
                ? "Category/tag or search query (e.g. \"marketing\" or \"growth marketing\")"
                : "Board token (or full URL, if using Custom)"}
            </label>
            <div className="flex gap-2">
              <input
                id="manual_token"
                name="manual_token"
                value={manualToken}
                onChange={(e) => setManualToken(e.target.value)}
                className={field}
              />
              {!AGGREGATOR_ATS.includes(manualAts) ? (
                <button
                  type="submit"
                  formAction={detectAction}
                  formNoValidate
                  disabled={detectPending || !manualToken}
                  className="mt-1 inline-flex h-10 shrink-0 items-center gap-1.5 rounded-xl border border-line px-3 text-xs font-semibold text-ink transition hover:border-gold disabled:opacity-60"
                >
                  <Search className="h-3.5 w-3.5" aria-hidden="true" />
                  {detectPending ? "Checking..." : "Check token"}
                </button>
              ) : null}
            </div>
            {detectState.error ? (
              <p className="mt-2 text-xs font-medium text-red-700">{detectState.error}</p>
            ) : null}
            {detectState.matches?.length ? (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {detectState.matches.map((match) => (
                  <button
                    key={match.ats}
                    type="button"
                    onClick={() => setManualAts(match.ats)}
                    className={`rounded-full border px-2.5 py-1 text-xs font-semibold transition ${
                      manualAts === match.ats
                        ? "border-navy bg-navy text-white"
                        : "border-line text-ink hover:border-gold"
                    }`}
                  >
                    {ATS_LABELS[match.ats]} ({match.jobCount} open)
                  </button>
                ))}
              </div>
            ) : null}
          </div>
          <div>
            <label htmlFor="manual_ats" className={label}>
              ATS
            </label>
            <select
              id="manual_ats"
              value={manualAts}
              onChange={(e) => setManualAts(e.target.value as JobAts)}
              className={field}
            >
              {(Object.keys(ATS_LABELS) as JobAts[]).map((value) => (
                <option key={value} value={value}>
                  {ATS_LABELS[value]}
                </option>
              ))}
            </select>
          </div>
        </div>
      ) : null}

      <div className="flex items-end">
        <label className="inline-flex items-center gap-2 text-sm text-ink">
          <input type="checkbox" name="hires_globally" className="h-4 w-4 rounded border-line" />
          Known to hire remote workers from anywhere, including Africa
        </label>
      </div>
      <div>
        <label htmlFor="track" className={label}>
          Track
        </label>
        <select id="track" name="track" required className={field} defaultValue="both">
          <option value="growth">Growth marketing</option>
          <option value="marketing">Creative marketing</option>
          <option value="both">Both</option>
        </select>
      </div>

      {state.error ? (
        <p role="alert" className="sm:col-span-2 flex items-start gap-2 text-sm font-medium text-red-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          {state.error}
        </p>
      ) : null}

      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={pending || !finalToken}
          className="inline-flex h-10 items-center rounded-full bg-navy px-5 text-sm font-semibold text-white transition hover:bg-navy-soft disabled:opacity-60"
        >
          {pending ? "Adding..." : "Add source"}
        </button>
      </div>
    </form>
  );
}
