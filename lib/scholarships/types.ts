// One recurring yearly application window. Dates are "MM-DD" so a window
// rolls over to next year by itself once it closes. opens is null when a
// university only publishes its deadline. confirmed means the dates were
// read off the program's own page for the current cycle, not carried over
// from an older cycle or a third-party listing.
export type ApplicationWindow = {
  label: string;
  opens: string | null;
  closes: string | null;
  confirmed: boolean;
};

export type IeltsRequired = "no" | "yes" | "unclear";
// Whether Omole's degree (a Doctor of Pharmacy) meets the program's entry
// requirements.
export type BackgroundFit = "yes" | "maybe" | "no";

export type ScholarshipProgram = {
  id: string;
  university: string;
  program: string;
  country: string;
  city: string | null;
  fit: "direct" | "closest";
  fit_note: string | null;
  tuition_note: string | null;
  funding_note: string | null;
  english_note: string | null;
  ielts_required: IeltsRequired;
  background_fit: BackgroundFit;
  background_note: string | null;
  windows: ApplicationWindow[];
  windows_note: string | null;
  apply_url: string | null;
  info_url: string;
  watch_url: string | null;
  page_hash: string | null;
  page_signal: string | null;
  page_changed_at: string | null;
  last_checked_at: string | null;
  notified_keys: string[];
  active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};
