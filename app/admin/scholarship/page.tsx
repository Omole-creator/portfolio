import { ExternalLink, GraduationCap } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { formatDate, programStatus, todayInLagos, windowDates, type ProgramStatus } from "@/lib/scholarships/status";
import { windowsToText } from "@/lib/scholarships/windows";
import type { ScholarshipProgram } from "@/lib/scholarships/types";
import { AddProgramForm, CheckNowButton, EditProgramForm, RemoveProgramButton } from "./Forms";

type Row = { program: ScholarshipProgram; status: ProgramStatus };

const GROUPS: { key: string; title: string; states: ProgramStatus["state"][]; empty: string }[] = [
  {
    key: "open",
    title: "Open now",
    states: ["open", "expected_open"],
    empty: "Nothing is open right now. You'll get an email the day something opens.",
  },
  { key: "soon", title: "Deadline coming up", states: ["deadline_soon"], empty: "" },
  { key: "rolling", title: "Apply any time", states: ["rolling"], empty: "" },
  { key: "later", title: "Opening later", states: ["upcoming", "unknown"], empty: "" },
];

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
        text: `Deadline ${formatDate(status.closesOn)} (${status.daysLeft} days) · opening date not published`,
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

function sortKey(row: Row, today: string): string {
  const s = row.status;
  if (s.opensOn && s.opensOn > today) return s.opensOn;
  return s.closesOn ?? "9999-12-31";
}

function ProgramCard({ program, status, today }: Row & { today: string }) {
  const badge = statusBadge(status);
  const ielts = ieltsBadge(program.ielts_required);
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
        {program.fit === "closest" ? (
          <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
            Closest match, not health informatics
          </span>
        ) : null}
      </div>

      <dl className="mt-4 grid gap-2 text-sm">
        {program.fit_note ? <p className="text-muted">{program.fit_note}</p> : null}
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

export default async function ScholarshipPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("scholarship_programs")
    .select("*")
    .order("sort_order", { ascending: true });

  const today = todayInLagos();
  const rows: Row[] = ((data ?? []) as ScholarshipProgram[])
    .filter((program) => program.active)
    .map((program) => ({ program, status: programStatus(program, today) }));

  return (
    <div className="container-x">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-2xl">
          <p className="eyebrow text-gold-hover">Study abroad</p>
          <h1 className="mt-3 text-3xl font-semibold text-ink md:text-4xl">Scholarships</h1>
          <p className="mt-2 text-sm text-muted">
            English-taught health informatics master&apos;s programs with low tuition or a scholarship route.
            Every morning each program&apos;s page is checked, and you get an email the day an application
            window opens, with the link to apply.
          </p>
        </div>
        <CheckNowButton />
      </div>

      {error ? (
        <p role="alert" className="mt-8 text-sm text-red-600">
          Could not load programs: {error.message}. If the table doesn&apos;t exist yet, run
          supabase/migrations/0015_german_job_boards_and_scholarships.sql in the Supabase SQL editor.
        </p>
      ) : null}

      {GROUPS.map((group) => {
        const groupRows = rows
          .filter((row) => group.states.includes(row.status.state))
          .sort((a, b) => sortKey(a, today).localeCompare(sortKey(b, today)));
        if (groupRows.length === 0 && !group.empty) return null;
        return (
          <section key={group.key} className="mt-10">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-ink">
              <GraduationCap className="h-5 w-5 text-gold-hover" aria-hidden="true" />
              {group.title}
              <span className="text-sm font-normal text-muted">({groupRows.length})</span>
            </h2>
            {groupRows.length === 0 ? (
              <p className="mt-3 text-sm text-muted">{group.empty}</p>
            ) : (
              <ul className="mt-4 grid gap-4 lg:grid-cols-2">
                {groupRows.map((row) => (
                  <ProgramCard key={row.program.id} {...row} today={today} />
                ))}
              </ul>
            )}
          </section>
        );
      })}

      <section className="mt-14 rounded-2xl border border-line bg-white p-6">
        <h2 className="text-lg font-semibold text-ink">Add a program</h2>
        <p className="mt-1 text-sm text-muted">
          Found another one? Add it here and it joins the daily check.
        </p>
        <div className="mt-5">
          <AddProgramForm />
        </div>
      </section>
    </div>
  );
}
