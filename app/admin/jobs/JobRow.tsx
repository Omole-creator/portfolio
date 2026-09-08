"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Check, Copy, ExternalLink, Mail } from "lucide-react";
import {
  prepareApplication,
  sendApplicationEmail,
  markApplied,
  dismissMatch,
  type ActionState,
} from "./actions";
import type { JobMatch } from "@/lib/jobs/types";

const initial: ActionState = {};
const initialEmailState: ActionState = {};

const primaryButton =
  "inline-flex h-10 items-center rounded-full bg-navy px-5 text-sm font-semibold text-white transition hover:bg-navy-soft disabled:opacity-60";
const secondaryButton =
  "inline-flex h-10 items-center rounded-full border border-line px-5 text-sm font-semibold text-ink transition hover:border-gold disabled:opacity-60";

function statusPill(status: JobMatch["status"]) {
  if (status === "prepared") return "bg-navy text-white";
  if (status === "applied") return "bg-green-100 text-green-800";
  return "border border-line text-muted";
}

function statusLabel(status: JobMatch["status"]) {
  if (status === "prepared") return "Prepared";
  if (status === "applied") return "Applied";
  if (status === "dismissed") return "Dismissed";
  return "New";
}

function eligibilityNote(eligibility: JobMatch["eligibility"]) {
  if (eligibility === "worldwide") {
    return { label: "Worldwide", className: "bg-green-50 text-green-800" };
  }
  return {
    label: "Unconfirmed scope, check before applying",
    className: "bg-amber-50 text-amber-800",
  };
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1 text-xs font-semibold text-ink transition hover:border-gold"
    >
      {copied ? (
        <Check className="h-3.5 w-3.5" aria-hidden="true" />
      ) : (
        <Copy className="h-3.5 w-3.5" aria-hidden="true" />
      )}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

export function JobRow({ job }: { job: JobMatch }) {
  const [state, formAction, pending] = useActionState(prepareApplication, initial);
  const [emailState, emailAction, emailPending] = useActionState(
    sendApplicationEmail,
    initialEmailState,
  );
  const router = useRouter();

  useEffect(() => {
    if (state.message) router.refresh();
  }, [state.message, router]);

  useEffect(() => {
    if (emailState.message) router.refresh();
  }, [emailState.message, router]);

  const isNew = job.status === "new";
  const isPrepared = job.status === "prepared" || job.status === "applied";

  return (
    <li className="rounded-2xl border border-line bg-white p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="font-semibold text-ink">{job.title}</p>
          <p className="mt-1 text-sm text-muted">
            {job.company_name}
            {job.location_text ? <span aria-hidden="true"> · </span> : null}
            {job.location_text}
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${eligibilityNote(job.eligibility).className}`}
            >
              {eligibilityNote(job.eligibility).label}
            </span>
            {job.ats === "custom" ? (
              <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
                Scraped, not an ATS - double-check details
              </span>
            ) : null}
            {job.apply_email ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-navy/10 px-2.5 py-0.5 text-xs font-semibold text-navy">
                <Mail className="h-3 w-3" aria-hidden="true" />
                Apply by email
              </span>
            ) : null}
            {job.keyword_hits.slice(0, 4).map((hit) => (
              <span
                key={hit}
                className="rounded-full bg-paper px-2.5 py-0.5 text-xs text-muted"
              >
                {hit}
              </span>
            ))}
          </div>
        </div>
        <span
          className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${statusPill(job.status)}`}
        >
          {statusLabel(job.status)}
        </span>
      </div>

      {isNew ? (
        <form action={formAction} className="mt-4">
          <input type="hidden" name="id" value={job.id} />
          <button type="submit" disabled={pending} className={primaryButton}>
            {pending ? "Preparing..." : "Prepare application"}
          </button>
          {state.error ? (
            <p role="alert" className="mt-3 flex items-start gap-2 text-sm font-medium text-red-700">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              {state.error}
            </p>
          ) : null}
        </form>
      ) : null}

      {isPrepared ? (
        <div className="mt-5 space-y-4 border-t border-line pt-5">
          {job.cover_letter ? (
            <div>
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-ink">Cover letter</p>
                <CopyButton text={job.cover_letter} />
              </div>
              <p className="mt-2 whitespace-pre-line rounded-xl bg-paper p-4 text-sm leading-relaxed text-ink">
                {job.cover_letter}
              </p>
            </div>
          ) : null}

          {job.extraction_ok && job.qa_pairs?.length ? (
            <div>
              <p className="text-sm font-semibold text-ink">Application questions</p>
              <div className="mt-2 space-y-3">
                {job.qa_pairs.map((qa) => (
                  <div key={qa.question} className="rounded-xl bg-paper p-4">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm font-semibold text-ink">{qa.question}</p>
                      <CopyButton text={qa.answer} />
                    </div>
                    <p className="mt-1 text-sm leading-relaxed text-muted">{qa.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted">
              No custom questions found on this form. Apply with the cover letter, CV, and
              portfolio link below.
            </p>
          )}

          <div className="flex flex-wrap items-center gap-3">
            {job.cv_path ? (
              <a
                href={job.cv_path}
                download
                className="text-sm font-semibold text-navy underline-offset-4 hover:text-gold-hover hover:underline"
              >
                Download CV
              </a>
            ) : null}
            {job.portfolio_url ? (
              <a
                href={job.portfolio_url}
                target="_blank"
                rel="noreferrer"
                className="text-sm font-semibold text-navy underline-offset-4 hover:text-gold-hover hover:underline"
              >
                Portfolio link
              </a>
            ) : null}
            <a
              href={job.apply_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy underline-offset-4 hover:text-gold-hover hover:underline"
            >
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              Open application
            </a>
          </div>

          {job.status === "prepared" && job.apply_email ? (
            <form action={emailAction}>
              <input type="hidden" name="id" value={job.id} />
              <button
                type="submit"
                disabled={emailPending}
                onClick={(e) => {
                  const sure = window.confirm(
                    `Send this application to ${job.apply_email}? This cannot be undone.`,
                  );
                  if (!sure) e.preventDefault();
                }}
                className={`${primaryButton} gap-2`}
              >
                <Mail className="h-4 w-4" aria-hidden="true" />
                {emailPending ? "Sending..." : `Send application to ${job.apply_email}`}
              </button>
              {emailState.error ? (
                <p role="alert" className="mt-3 flex items-start gap-2 text-sm font-medium text-red-700">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                  {emailState.error}
                </p>
              ) : null}
            </form>
          ) : null}

          {job.email_sent_at ? (
            <p className="text-sm font-medium text-green-800">
              Emailed on {new Date(job.email_sent_at).toLocaleDateString()}.
            </p>
          ) : null}

          {job.status === "prepared" ? (
            <div className="flex flex-wrap gap-2 pt-1">
              <form action={markApplied}>
                <input type="hidden" name="id" value={job.id} />
                <button type="submit" className={secondaryButton}>
                  Mark applied
                </button>
              </form>
              <form action={dismissMatch}>
                <input type="hidden" name="id" value={job.id} />
                <button type="submit" className={secondaryButton}>
                  Dismiss
                </button>
              </form>
            </div>
          ) : null}
        </div>
      ) : null}

      {isNew ? (
        <form action={dismissMatch} className="mt-3">
          <input type="hidden" name="id" value={job.id} />
          <button
            type="submit"
            className="text-sm font-semibold text-muted underline-offset-4 hover:text-ink hover:underline"
          >
            Dismiss
          </button>
        </form>
      ) : null}
    </li>
  );
}
