"use client";

import { useState, useTransition } from "react";
import { AlertCircle, Check, ExternalLink } from "lucide-react";
import { toggleMilestone } from "./actions";
import type { JobMatch, JobMilestone } from "@/lib/jobs/types";

const MILESTONE_BUTTONS: { key: JobMilestone; label: string; on: string }[] = [
  { key: "feedback_at", label: "Heard back", on: "border-navy bg-navy text-white" },
  { key: "interview_at", label: "Interviewed", on: "border-navy bg-navy text-white" },
  { key: "offer_at", label: "Got the job", on: "border-green-700 bg-green-700 text-white" },
  { key: "rejected_at", label: "Rejected", on: "border-red-700 bg-red-700 text-white" },
];

function shortDate(value: string) {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    timeZone: "Africa/Lagos",
  });
}

// A compact row for a job that's already been applied to. Each milestone is
// its own toggle, so they can be ticked in whatever order the company's
// process actually runs, and tapping one again unticks it.
export function AppliedRow({ job }: { job: JobMatch }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const appliedOn = job.applied_at ?? job.email_sent_at ?? job.updated_at;

  function toggle(key: JobMilestone, isSet: boolean) {
    const formData = new FormData();
    formData.set("id", job.id);
    formData.set("milestone", key);
    formData.set("set", String(isSet));
    setError(null);
    startTransition(async () => {
      const result = await toggleMilestone(formData);
      if (result.error) setError(result.error);
    });
  }

  return (
    <li className="rounded-2xl border border-line bg-white p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-semibold text-ink">{job.title}</p>
          <p className="mt-1 text-sm text-muted">
            {job.company_name}
            <span aria-hidden="true"> · </span>
            Applied {shortDate(appliedOn)}
            {job.email_sent_at ? " by email" : null}
          </p>
        </div>
        <a
          href={job.apply_url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy underline-offset-4 hover:text-gold-hover hover:underline"
        >
          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          Posting
        </a>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {MILESTONE_BUTTONS.map(({ key, label, on }) => {
          const value = job[key];
          const isSet = Boolean(value);
          return (
            <button
              key={key}
              type="button"
              disabled={pending}
              aria-pressed={isSet}
              onClick={() => toggle(key, isSet)}
              className={`inline-flex h-9 items-center gap-1.5 rounded-full border px-4 text-xs font-semibold transition disabled:opacity-60 ${
                isSet ? on : "border-line text-muted hover:border-gold hover:text-ink"
              }`}
            >
              {isSet ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : null}
              {label}
              {value ? <span className="font-normal opacity-80">{shortDate(value)}</span> : null}
            </button>
          );
        })}
      </div>

      {error ? (
        <p role="alert" className="mt-3 flex items-start gap-2 text-sm font-medium text-red-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          {error}
        </p>
      ) : null}
    </li>
  );
}
