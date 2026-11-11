import type { ApplicationWindow } from "./types";

// Windows are edited in the admin as plain text, one per line:
//   Winter semester | 05-02 | 07-15 | confirmed
// Leave the opening date empty when only a deadline is published:
//   Winter semester (non-EU) |  | 07-15
// The last part is optional; anything other than "confirmed" means the
// dates come from an older cycle.
const MONTH_DAY = /^(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

export function windowsToText(windows: ApplicationWindow[]): string {
  return windows
    .map((w) =>
      [w.label, w.opens ?? "", w.closes ?? "", w.confirmed ? "confirmed" : "unconfirmed"].join(" | "),
    )
    .join("\n");
}

export function parseWindows(text: string): { windows: ApplicationWindow[] } | { error: string } {
  const windows: ApplicationWindow[] = [];
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  for (const [i, line] of lines.entries()) {
    const [label, opens = "", closes = "", flag = ""] = line.split("|").map((part) => part.trim());
    if (!label) return { error: `Line ${i + 1}: give the window a name.` };
    for (const value of [opens, closes]) {
      if (value && !MONTH_DAY.test(value)) {
        return { error: `Line ${i + 1}: write dates as MM-DD, like 07-15 for 15 July.` };
      }
    }
    if (!opens && !closes) return { error: `Line ${i + 1}: add an opening date, a deadline, or both.` };
    windows.push({
      label,
      opens: opens || null,
      closes: closes || null,
      confirmed: flag.toLowerCase() === "confirmed",
    });
  }
  return { windows };
}
