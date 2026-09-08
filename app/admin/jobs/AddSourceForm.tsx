"use client";

import { useActionState, useEffect, useState } from "react";
import { AlertCircle, Search } from "lucide-react";
import {
  addJobSource,
  detectJobSourceAts,
  type ActionState,
  type DetectState,
} from "./actions";
import type { JobAts } from "@/lib/jobs/types";

const initial: ActionState = {};
const initialDetect: DetectState = {};

const field =
  "mt-1 w-full rounded-xl border border-line bg-white px-3 py-2 text-sm text-ink outline-none transition focus:border-gold";
const label = "text-xs font-semibold text-ink";

const ATS_LABELS: Record<Exclude<JobAts, "custom">, string> = {
  greenhouse: "Greenhouse",
  lever: "Lever",
  ashby: "Ashby",
  workable: "Workable",
  smartrecruiters: "SmartRecruiters",
  recruitee: "Recruitee",
  breezy: "Breezy HR",
};

const ATS_HELP: Record<JobAts, string> = {
  greenhouse: "The slug from boards.greenhouse.io/<token>",
  lever: "The slug from jobs.lever.co/<token>",
  ashby: "The slug from jobs.ashbyhq.com/<token>",
  workable: "The subdomain from <token>.workable.com",
  smartrecruiters: "The company id from jobs.smartrecruiters.com/<token>",
  recruitee: "The subdomain from <token>.recruitee.com",
  breezy: "The subdomain from <token>.breezy.hr",
  custom: "The full URL of the company's careers/jobs page",
};

export function AddSourceForm() {
  const [state, action, pending] = useActionState(addJobSource, initial);
  const [detectState, detectAction, detectPending] = useActionState(
    detectJobSourceAts,
    initialDetect,
  );
  const [ats, setAts] = useState<JobAts>("greenhouse");
  const [boardToken, setBoardToken] = useState("");

  // Auto-select the platform when the token only matched exactly one.
  useEffect(() => {
    if (detectState.matches?.length === 1) {
      setAts(detectState.matches[0].ats);
    }
  }, [detectState.matches]);

  return (
    <form action={action} className="mt-6 grid gap-4 border-t border-line pt-6 sm:grid-cols-2">
      <div>
        <label htmlFor="company_name" className={label}>
          Company name
        </label>
        <input id="company_name" name="company_name" required className={field} />
      </div>
      <div>
        <label htmlFor="board_token" className={label}>
          {ats === "custom" ? "Careers page URL" : "Board token"}
        </label>
        <div className="flex gap-2">
          <input
            id="board_token"
            name="board_token"
            required
            value={boardToken}
            onChange={(e) => setBoardToken(e.target.value)}
            className={field}
          />
          {ats !== "custom" ? (
            <button
              type="submit"
              formAction={detectAction}
              formNoValidate
              disabled={detectPending || !boardToken}
              className="mt-1 inline-flex h-10 shrink-0 items-center gap-1.5 rounded-xl border border-line px-3 text-xs font-semibold text-ink transition hover:border-gold disabled:opacity-60"
            >
              <Search className="h-3.5 w-3.5" aria-hidden="true" />
              {detectPending ? "Checking..." : "Detect ATS"}
            </button>
          ) : null}
        </div>
        <p className="mt-1 text-xs text-muted">{ATS_HELP[ats]}</p>

        {detectState.error ? (
          <p className="mt-2 text-xs font-medium text-red-700">{detectState.error}</p>
        ) : null}
        {detectState.matches?.length ? (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {detectState.matches.map((match) => (
              <button
                key={match.ats}
                type="button"
                onClick={() => setAts(match.ats)}
                className={`rounded-full border px-2.5 py-1 text-xs font-semibold transition ${
                  ats === match.ats
                    ? "border-navy bg-navy text-white"
                    : "border-line text-ink hover:border-gold"
                }`}
              >
                Found on {ATS_LABELS[match.ats]} ({match.jobCount} open)
              </button>
            ))}
          </div>
        ) : null}
      </div>
      <div>
        <label htmlFor="ats" className={label}>
          ATS
        </label>
        <select
          id="ats"
          name="ats"
          required
          className={field}
          value={ats}
          onChange={(e) => setAts(e.target.value as JobAts)}
        >
          <option value="greenhouse">Greenhouse</option>
          <option value="lever">Lever</option>
          <option value="ashby">Ashby</option>
          <option value="workable">Workable</option>
          <option value="smartrecruiters">SmartRecruiters</option>
          <option value="recruitee">Recruitee</option>
          <option value="breezy">Breezy HR</option>
          <option value="custom">Custom careers page (no ATS)</option>
        </select>
      </div>
      <div className="flex items-end">
        <label className="inline-flex items-center gap-2 text-sm text-ink">
          <input type="checkbox" name="hires_globally" className="h-4 w-4 rounded border-line" />
          This company is known to hire remote workers from anywhere, including Africa
        </label>
      </div>
      <div className="sm:col-span-2">
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
          disabled={pending}
          className="inline-flex h-10 items-center rounded-full bg-navy px-5 text-sm font-semibold text-white transition hover:bg-navy-soft disabled:opacity-60"
        >
          {pending ? "Adding..." : "Add source"}
        </button>
      </div>
    </form>
  );
}
