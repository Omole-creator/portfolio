import Link from "next/link";
import { Check, ExternalLink, GraduationCap } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { formatDate, programStatus, todayInLagos, windowDates, type ProgramStatus } from "@/lib/scholarships/status";
import { windowsToText } from "@/lib/scholarships/windows";
import type { ScholarshipProgram } from "@/lib/scholarships/types";
import { AddProgramForm, AppliedProgramRow, CheckNowButton, EditProgramForm, RemoveProgramButton } from "./Forms";
import { markProgramApplied } from "./actions";

type Row = { program: ScholarshipProgram; status: ProgramStatus };

// What counts as "you can apply right now": a window that's open (or should
// be, going by last cycle), rolling admission, or a near deadline at a
// university that doesn't publish when its portal opens.
const APPLY_NOW_STATES: ProgramStatus["state"][] = ["open", "expected_open", "deadline_soon", "rolling"];

function statusBadge(status: ProgramStatus): { text: string; className: string } {
  switch (status.state) {
    case "open":
      return { text: `Open now · closes ${formatDate(status.closesOn)}`, className: "bg-green-600 text-white" };
    case "expected_open":
      return {
        text: `Should be open by now · confirm on the page · closes around ${formatDate(status.closesOn)}`,
        className: "bg-amber-50 text-amber-800",
      };
    case "deadline_soon":
      return {
        text: `Probably open · deadline ${formatDate(status.closesOn)} (${status.daysLeft} days) · check the portal`,
        className: "bg-amber-50 text-amber-800",
      };
    case "rolling":
      return { text: "Rolling admission, no fixed deadline", className: "bg-green-50 text-green-800" };
    case "upcoming":
      return status.opensOn
        ? { text: `Opens ${formatDate(status.opensOn)}`, className: "bg-navy/10 text-navy" }
        : { text: `Deadline ${formatDate(status.closesOn)}`, className: "bg-navy/10 text-navy" };
    default:
      return { text: "Dates not known yet", className: "bg-paper text-muted" };
  }
}

function ieltsBadge(ielts: ScholarshipProgram["ielts_required"]) {
  if (ielts === "no") return { text: "No IELTS needed", className: "bg-green-50 text-green-800" };
  if (ielts === "yes") return { text: "IELTS required", className: "bg-red-50 text-red-700" };
  return { text: "Check English proof", className: "bg-amber-50 text-amber-800" };
}

function backgroundBadge(fit: ScholarshipProgram["background_fit"]) {
  if (fit === "yes") return { text: "Your PharmD qualifies", className: "bg-green-50 text-green-800" };
  if (fit === "no") return { text: "Your PharmD doesn't qualify", className: "bg-red-50 text-red-700" };
  return { text: "Check your PharmD fits", className: "bg-amber-50 text-amber-800" };
}

function sortKey(row: Row, today: string): string {
  const s = row.status;
  if (s.opensOn && s.opensOn > today) return s.opensOn;
  return s.closesOn ?? "9999-12-31";
}

function ProgramCard({ program, status, today }: Row & { today: string }) {
  const badge = statusBadge(status);
  const ielts = ieltsBadge(program.ielts_required);
  const background = backgroundBadge(program.background_fit);
  const isOpen = status.state === "open" || status.state === "expected_open" || status.state === "rolling";
  const applyHref = program.apply_url || program.info_url;

  return (
    <li className="rounded-2xl border border-line bg-white p-6">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted">
        {program.country}
        {program.city ? ` · ${program.city}` : ""}
      </p>
      <p className="mt-1 font-semibold text-ink">{program.program}</p>
      <p className="text-sm text-muted">{program.university}</p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${badge.className}`}>{badge.text}</span>
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${ielts.className}`}>{ielts.text}</span>
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${background.className}`}>
          {background.text}
        </span>
        {program.fit === "closest" ? (
          <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
            Closest match, not health informatics
          </span>
        ) : null}
      </div>

      <dl className="mt-4 grid gap-2 text-sm">
        {program.fit_note ? <p className="text-muted">{program.fit_note}</p> : null}
        {program.background_note ? (
          <div>
            <dt className="inline font-semibold text-ink">Entry: </dt>
            <dd className="inline text-muted">{program.background_note}</dd>
          </div>
        ) : null}
        {program.tuition_note ? (
          <div>
            <dt className="inline font-semibold text-ink">Tuition: </dt>
            <dd className="inline text-muted">{program.tuition_note}</dd>
          </div>
        ) : null}
        {program.funding_note ? (
          <div>
            <dt className="inline font-semibold text-ink">Funding: </dt>
            <dd className="inline text-muted">{program.funding_note}</dd>
          </div>
        ) : null}
        {program.english_note ? (
          <div>
            <dt className="inline font-semibold text-ink">English: </dt>
            <dd className="inline text-muted">{program.english_note}</dd>
          </div>
        ) : null}
        {program.windows.length > 0 ? (
          <div>
            <dt className="font-semibold text-ink">Application windows</dt>
            <dd>
              <ul className="mt-1 space-y-0.5 text-muted">
                {program.windows.map((w) => {
                  const dates = windowDates(w, today);
                  return (
                    <li key={w.label}>
                      {w.label}:{" "}
                      {dates.opensOn ? `${formatDate(dates.opensOn)} to ` : "deadline "}
                      {formatDate(dates.closesOn)}
                      {w.confirmed ? "" : " (from an earlier cycle, not confirmed)"}
                    </li>
                  );
                })}
              </ul>
            </dd>
          </div>
        ) : null}
        {program.windows_note ? <p className="text-muted">{program.windows_note}</p> : null}
        {program.feed_url ? (
          <p className="text-xs text-muted">
            Also watching {program.feed_label || "a news feed"} for new notices.
          </p>
        ) : null}
        {program.page_signal ? (
          <p className="rounded-xl bg-paper px-3 py-2 text-muted">
            <span className="font-semibold text-ink">The page says: </span>
            &ldquo;{program.page_signal}&rdquo;
          </p>
        ) : null}
        {program.page_changed_at ? (
          <p className="text-xs text-muted">
            Admission info on the page last changed on {formatDate(program.page_changed_at.slice(0, 10))}.
          </p>
        ) : null}
      </dl>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <a
          href={applyHref}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex h-10 items-center gap-1.5 rounded-full px-5 text-sm font-semibold text-white transition ${
            isOpen ? "bg-green-600 hover:bg-green-700" : "bg-navy hover:bg-navy-soft"
          }`}
        >
          {program.apply_url ? "Go to the application" : "Open the program page"}
          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
        </a>
        <form action={markProgramApplied}>
          <input type="hidden" name="id" value={program.id} />
          <button
            type="submit"
            className="inline-flex h-10 items-center gap-1.5 rounded-full border border-line px-5 text-sm font-semibold text-ink transition hover:border-gold"
          >
            <Check className="h-3.5 w-3.5" aria-hidden="true" />
            Mark applied
          </button>
        </form>
        {program.apply_url ? (
          <a
            href={program.info_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-muted underline-offset-4 hover:text-ink hover:underline"
          >
            Program page
          </a>
        ) : null}
      </div>

      <details className="mt-4">
        <summary className="cursor-pointer text-sm font-semibold text-muted hover:text-ink">
          Edit dates and links
        </summary>
        <EditProgramForm
          id={program.id}
          infoUrl={program.info_url}
          applyUrl={program.apply_url}
          watchUrl={program.watch_url}
          ielts={program.ielts_required}
          windowsText={windowsToText(program.windows)}
          windowsNote={program.windows_note}
        />
        <div className="mt-4">
          <RemoveProgramButton id={program.id} name={program.program} />
        </div>
      </details>

      {program.last_checked_at ? (
        <p className="mt-3 text-xs text-muted">Last checked {formatDate(program.last_checked_at.slice(0, 10))}.</p>
      ) : null}
    </li>
  );
}

type Props = { searchParams: Promise<{ all?: string }> };

function byFitThenDate(today: string) {
  return (a: Row, b: Row) =>
    Number(a.program.background_fit === "no") - Number(b.program.background_fit === "no") ||
    sortKey(a, today).localeCompare(sortKey(b, today));
}

export default async function ScholarshipPage({ searchParams }: Props) {
  const showAll = (await searchParams).all === "1";
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("scholarship_programs")
    .select("*")
    .order("sort_order", { ascending: true });

  const today = todayInLagos();
  const rows: Row[] = ((data ?? []) as ScholarshipProgram[])
    .filter((program) => program.active)
    .map((program) => ({ program, status: programStatus(program, today) }));

  const applied = rows
    .filter((row) => row.program.applied_at)
    .sort((a, b) => (b.program.applied_at ?? "").localeCompare(a.program.applied_at ?? ""));
  const notApplied = rows.filter((row) => !row.program.applied_at);
  const openNow = notApplied
    .filter((row) => APPLY_NOW_STATES.includes(row.status.state))
    .sort(byFitThenDate(today));
  const notOpen = notApplied
    .filter((row) => !APPLY_NOW_STATES.includes(row.status.state))
    .sort(byFitThenDate(today));

  return (
    <div className="container-x">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-2xl">
          <p className="eyebrow text-gold-hover">Study abroad</p>
          <h1 className="mt-3 text-3xl font-semibold text-ink md:text-4xl">Scholarships</h1>
          <p className="mt-2 text-sm text-muted">
            Only programs you can apply to right now are shown. Every morning each program&apos;s page is
            checked, and the day a window opens it appears here and you get an email with the link to apply.
            Mark a program applied to move it into Applied.
          </p>
        </div>
        <CheckNowButton />
      </div>

      {error ? (
        <p role="alert" className="mt-8 text-sm text-red-600">
          Could not load programs: {error.message}
        </p>
      ) : null}

      <section className="mt-10">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-ink">
          <GraduationCap className="h-5 w-5 text-gold-hover" aria-hidden="true" />
          Open now
          <span className="text-sm font-normal text-muted">({openNow.length})</span>
        </h2>
        {openNow.length ? (
          <ul className="mt-4 grid gap-4 lg:grid-cols-2">
            {openNow.map((row) => (
              <ProgramCard key={row.program.id} {...row} today={today} />
            ))}
          </ul>
        ) : (
          <div className="mt-4 rounded-3xl border border-dashed border-line bg-white p-10 text-center">
            <GraduationCap className="mx-auto h-8 w-8 text-gold" aria-hidden="true" />
            <p className="mt-4 text-lg font-semibold text-ink">Nothing is open right now.</p>
            <p className="mt-2 leading-relaxed text-muted">
              The day a program opens, it shows up here and you get an email.
            </p>
          </div>
        )}
      </section>

      <details open className="mt-12 rounded-3xl border border-line bg-white p-6 md:p-8">
        <summary className="cursor-pointer text-sm font-semibold text-ink">
          Applied
          <span className="ml-2 font-normal text-muted">({applied.length})</span>
        </summary>
        {applied.length ? (
          <ul className="mt-6 space-y-3">
            {applied.map((row) => (
              <AppliedProgramRow key={row.program.id} program={row.program} />
            ))}
          </ul>
        ) : (
          <p className="mt-6 text-sm text-muted">
            Nothing applied to yet. Programs you mark applied land here.
          </p>
        )}
      </details>

      <div className="mt-6">
        <Link
          href={showAll ? "/admin/scholarship" : "/admin/scholarship?all=1"}
          className="text-sm font-semibold text-muted underline-offset-4 hover:text-ink hover:underline"
        >
          {showAll ? "Hide programs not open yet" : `Show programs not open yet (${notOpen.length})`}
        </Link>
      </div>

      {showAll ? (
        <section className="mt-6">
          <h2 className="text-lg font-semibold text-ink">
            Not open yet <span className="text-sm font-normal text-muted">({notOpen.length})</span>
          </h2>
          <ul className="mt-4 grid gap-4 lg:grid-cols-2">
            {notOpen.map((row) => (
              <ProgramCard key={row.program.id} {...row} today={today} />
            ))}
          </ul>
        </section>
      ) : null}

      <details className="mt-10 rounded-2xl border border-line bg-white p-6">
        <summary className="cursor-pointer text-sm font-semibold text-ink">Add a program</summary>
        <p className="mt-3 text-sm text-muted">
          Found another one? Add it here and it joins the daily check.
        </p>
        <div className="mt-5">
          <AddProgramForm />
        </div>
      </details>
    </div>
  );
}
