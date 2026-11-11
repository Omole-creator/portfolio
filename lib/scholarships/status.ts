import type { ApplicationWindow, ScholarshipProgram } from "./types";

// How close a deadline has to be before a program with no published
// opening date is flagged "deadline coming up", and emailed about.
export const DEADLINE_WARNING_DAYS = 45;

export type ProgramState =
  | "open" // inside a confirmed window
  | "expected_open" // inside a window whose dates come from an older cycle
  | "deadline_soon" // no opening date published, deadline within DEADLINE_WARNING_DAYS
  | "upcoming"
  | "rolling" // no windows at all: rolling admission
  | "unknown";

export type ProgramStatus = {
  state: ProgramState;
  window: ApplicationWindow | null;
  opensOn: string | null; // YYYY-MM-DD of this cycle
  closesOn: string | null;
  daysLeft: number | null; // until closesOn
  daysUntilOpen: number | null;
};

const DAY_MS = 86400000;

/** Today's date in West Africa Time (fixed UTC+1), as YYYY-MM-DD. */
export function todayInLagos(now = new Date()): string {
  return new Date(now.getTime() + 60 * 60 * 1000).toISOString().slice(0, 10);
}

function daysBetween(from: string, to: string): number {
  return Math.round((Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / DAY_MS);
}

function dateIn(year: number, monthDay: string): string {
  return `${year}-${monthDay}`;
}

/**
 * Places a recurring MM-DD window on the calendar: the current cycle is the
 * one whose closing date hasn't passed yet. A window that wraps the new
 * year (opens 11-15, closes 01-15) opens in the year before it closes.
 */
export function windowDates(
  window: ApplicationWindow,
  today: string,
): { opensOn: string | null; closesOn: string | null } {
  const year = Number(today.slice(0, 4));

  if (!window.closes) {
    if (!window.opens) return { opensOn: null, closesOn: null };
    let opensOn = dateIn(year, window.opens);
    if (opensOn < today && daysBetween(opensOn, today) > 180) opensOn = dateIn(year + 1, window.opens);
    return { opensOn, closesOn: null };
  }

  let closesOn = dateIn(year, window.closes);
  if (closesOn < today) closesOn = dateIn(year + 1, window.closes);
  const closeYear = Number(closesOn.slice(0, 4));

  let opensOn: string | null = null;
  if (window.opens) {
    opensOn = dateIn(closeYear, window.opens);
    if (opensOn > closesOn) opensOn = dateIn(closeYear - 1, window.opens);
  }
  return { opensOn, closesOn };
}

function statusFor(window: ApplicationWindow, today: string): ProgramStatus {
  const { opensOn, closesOn } = windowDates(window, today);
  const daysLeft = closesOn ? daysBetween(today, closesOn) : null;
  const daysUntilOpen = opensOn ? daysBetween(today, opensOn) : null;

  let state: ProgramState = "upcoming";
  if (opensOn && opensOn <= today) {
    state = window.confirmed ? "open" : "expected_open";
  } else if (!opensOn && daysLeft !== null && daysLeft <= DEADLINE_WARNING_DAYS) {
    state = "deadline_soon";
  } else if (!opensOn && !closesOn) {
    state = "unknown";
  }

  return { state, window, opensOn, closesOn, daysLeft, daysUntilOpen };
}

const STATE_RANK: Record<ProgramState, number> = {
  open: 0,
  expected_open: 1,
  deadline_soon: 2,
  upcoming: 3,
  rolling: 4,
  unknown: 5,
};

/** The window that matters most right now: an open one first, then a near deadline, then the next to open. */
export function programStatus(program: Pick<ScholarshipProgram, "windows">, today: string): ProgramStatus {
  if (!program.windows || program.windows.length === 0) {
    return { state: "rolling", window: null, opensOn: null, closesOn: null, daysLeft: null, daysUntilOpen: null };
  }

  const statuses = program.windows.map((w) => statusFor(w, today));
  statuses.sort((a, b) => {
    const rank = STATE_RANK[a.state] - STATE_RANK[b.state];
    if (rank !== 0) return rank;
    const aDate = a.opensOn && a.opensOn > today ? a.opensOn : a.closesOn ?? "9999";
    const bDate = b.opensOn && b.opensOn > today ? b.opensOn : b.closesOn ?? "9999";
    return aDate.localeCompare(bDate);
  });
  return statuses[0];
}

/** Every window's status, for the alert check (more than one can be open at once). */
export function allWindowStatuses(program: Pick<ScholarshipProgram, "windows">, today: string): ProgramStatus[] {
  return (program.windows ?? []).map((w) => statusFor(w, today));
}

export function formatDate(date: string | null): string {
  if (!date) return "";
  return new Date(`${date}T12:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
