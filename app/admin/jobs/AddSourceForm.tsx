"use client";

import { useActionState, useState } from "react";
import { AlertCircle } from "lucide-react";
import { addJobSource, type ActionState } from "./actions";
import type { JobAts } from "@/lib/jobs/types";

const initial: ActionState = {};

const field =
  "mt-1 w-full rounded-xl border border-line bg-white px-3 py-2 text-sm text-ink outline-none transition focus:border-gold";
const label = "text-xs font-semibold text-ink";

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
  const [ats, setAts] = useState<JobAts>("greenhouse");

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
        <input id="board_token" name="board_token" required className={field} />
        <p className="mt-1 text-xs text-muted">{ATS_HELP[ats]}</p>
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
      <div>
        <label htmlFor="region_hint" className={label}>
          Region
        </label>
        <select id="region_hint" name="region_hint" required className={field} defaultValue="us">
          <option value="us">US</option>
          <option value="australia">Australia</option>
          <option value="us_or_australia">US or Australia</option>
          <option value="remote_global">Remote, open globally</option>
        </select>
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
