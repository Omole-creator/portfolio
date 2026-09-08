import Link from "next/link";
import { Briefcase } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { JobMatch, JobSource } from "@/lib/jobs/types";
import { JobRow } from "./JobRow";
import { AddSourceForm } from "./AddSourceForm";
import { toggleJobSource, deleteJobSource } from "./actions";

type Props = {
  searchParams: Promise<{ all?: string }>;
};

export default async function JobsPage({ searchParams }: Props) {
  const params = await searchParams;
  const showAll = params.all === "1";

  const supabase = await createClient();

  const matchesQuery = supabase
    .from("job_matches")
    .select("*")
    .order("first_seen_at", { ascending: false });

  const { data: matchesData, error: matchesError } = showAll
    ? await matchesQuery
    : await matchesQuery.in("status", ["new", "prepared"]);

  const { data: sourcesData, error: sourcesError } = await supabase
    .from("job_sources")
    .select("*")
    .order("company_name", { ascending: true });

  const matches = (matchesData ?? []) as JobMatch[];
  const sources = (sourcesData ?? []) as JobSource[];

  return (
    <div className="container-x">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow text-gold-hover">Job desk</p>
          <h1 className="mt-3 text-3xl font-semibold text-ink md:text-4xl">
            Job applications
          </h1>
          <p className="mt-2 text-sm text-muted">
            Pulled daily from the companies below. Nothing here is ever submitted for
            you, it only drafts the cover letter, CV, and application answers for you
            to review.
          </p>
        </div>
        <Link
          href={showAll ? "/admin/jobs" : "/admin/jobs?all=1"}
          className="text-sm font-semibold text-muted underline-offset-4 hover:text-ink hover:underline"
        >
          {showAll ? "Hide applied and dismissed" : "Show applied and dismissed"}
        </Link>
      </div>

      {matchesError ? (
        <p role="alert" className="mt-8 text-sm text-red-600">
          Could not load job matches: {matchesError.message}
        </p>
      ) : null}

      {matches.length ? (
        <ul className="mt-8 space-y-4">
          {matches.map((job) => (
            <JobRow key={job.id} job={job} />
          ))}
        </ul>
      ) : (
        <div className="mt-8 rounded-3xl border border-dashed border-line bg-white p-10 text-center">
          <Briefcase className="mx-auto h-8 w-8 text-gold" aria-hidden="true" />
          <p className="mt-4 text-lg font-semibold text-ink">
            No matches yet.
          </p>
          <p className="mt-2 leading-relaxed text-muted">
            Add a company below and the next daily sync will start checking it.
          </p>
        </div>
      )}

      <details className="mt-12 rounded-3xl border border-line bg-white p-6 md:p-8">
        <summary className="cursor-pointer text-sm font-semibold text-ink">
          Manage sources
        </summary>

        {sourcesError ? (
          <p role="alert" className="mt-4 text-sm text-red-600">
            Could not load job sources: {sourcesError.message}
          </p>
        ) : null}

        {sources.length ? (
          <ul className="mt-6 space-y-2">
            {sources.map((source) => (
              <li
                key={source.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line px-4 py-3 text-sm"
              >
                <div>
                  <p className="font-semibold text-ink">{source.company_name}</p>
                  <p className="text-xs text-muted">
                    {source.ats} · {source.board_token} · {source.region_hint} · {source.track}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <form action={toggleJobSource}>
                    <input type="hidden" name="id" value={source.id} />
                    <input type="hidden" name="active" value={String(source.active)} />
                    <button
                      type="submit"
                      className="text-xs font-semibold text-muted underline-offset-4 hover:text-ink hover:underline"
                    >
                      {source.active ? "Deactivate" : "Activate"}
                    </button>
                  </form>
                  <form action={deleteJobSource}>
                    <input type="hidden" name="id" value={source.id} />
                    <button
                      type="submit"
                      className="text-xs font-semibold text-red-600 underline-offset-4 hover:underline"
                    >
                      Delete
                    </button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-6 text-sm text-muted">
            No sources yet. Add a company&apos;s Greenhouse, Lever, or Ashby board
            token below (verify it with a live request first, e.g.
            boards-api.greenhouse.io/v1/boards/&lt;token&gt;/jobs).
          </p>
        )}

        <AddSourceForm />
      </details>
    </div>
  );
}
