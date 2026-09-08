import type { JobAts, JobSource, NormalizedJob } from "../types";
import { fetchGreenhouseJobs } from "./greenhouse";
import { fetchLeverJobs } from "./lever";
import { fetchAshbyJobs } from "./ashby";
import { fetchWorkableJobs } from "./workable";
import { fetchSmartRecruitersJobs } from "./smartrecruiters";
import { fetchRecruiteeJobs } from "./recruitee";
import { fetchBreezyJobs } from "./breezy";
import { fetchCustomJobs } from "./custom";
import { fetchRemoteOkJobs } from "./remoteok";
import { fetchRemotiveJobs } from "./remotive";
import { fetchJobicyJobs } from "./jobicy";
import { fetchArbeitnowJobs } from "./arbeitnow";
import { fetchHimalayasJobs } from "./himalayas";

const FETCHERS: Record<JobAts, (source: JobSource) => Promise<NormalizedJob[]>> = {
  greenhouse: fetchGreenhouseJobs,
  lever: fetchLeverJobs,
  ashby: fetchAshbyJobs,
  workable: fetchWorkableJobs,
  smartrecruiters: fetchSmartRecruitersJobs,
  recruitee: fetchRecruiteeJobs,
  breezy: fetchBreezyJobs,
  custom: fetchCustomJobs,
  remoteok: fetchRemoteOkJobs,
  remotive: fetchRemotiveJobs,
  jobicy: fetchJobicyJobs,
  arbeitnow: fetchArbeitnowJobs,
  himalayas: fetchHimalayasJobs,
};

/** Dispatches to the right fetcher for a source's ats. Adding a new platform means one new file plus one new line here. */
export function fetchForSource(source: JobSource): Promise<NormalizedJob[]> {
  return FETCHERS[source.ats](source);
}
