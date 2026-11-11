"use client";

import { useActionState } from "react";
import { AlertCircle, Check, RefreshCw } from "lucide-react";
import { addProgram, checkNow, removeProgram, updateProgram, type ActionState } from "./actions";
import type { IeltsRequired } from "@/lib/scholarships/types";

const initial: ActionState = {};

const field =
  "mt-1 w-full rounded-xl border border-line bg-white px-3 py-2 text-sm text-ink outline-none transition focus:border-gold";
const label = "text-xs font-semibold text-ink";
const primaryButton =
  "inline-flex h-10 items-center gap-2 rounded-full bg-navy px-5 text-sm font-semibold text-white transition hover:bg-navy-soft disabled:opacity-60";

const WINDOWS_HELP =
  "One window per line: name | opens (MM-DD) | closes (MM-DD) | confirmed. Leave the opening date empty if only a deadline is published.";

function Feedback({ state }: { state: ActionState }) {
  if (state.error) {
    return (
      <p role="alert" className="mt-3 inline-flex items-start gap-1.5 text-sm text-red-600">
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        {state.error}
      </p>
    );
  }
  if (state.message) {
    return (
      <p className="mt-3 inline-flex items-start gap-1.5 text-sm text-green-700">
        <Check className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        {state.message}
      </p>
    );
  }
  return null;
}

function IeltsSelect({ defaultValue }: { defaultValue: IeltsRequired }) {
  return (
    <select name="ielts_required" defaultValue={defaultValue} className={field}>
      <option value="no">Not needed (an English-taught degree counts)</option>
      <option value="unclear">Not clear yet</option>
      <option value="yes">Required</option>
    </select>
  );
}

export function CheckNowButton() {
  const [state, action, pending] = useActionState(checkNow, initial);
  return (
    <form action={action}>
      <button type="submit" disabled={pending} className={primaryButton}>
        <RefreshCw className={`h-4 w-4 ${pending ? "animate-spin" : ""}`} aria-hidden="true" />
        {pending ? "Checking pages..." : "Check now"}
      </button>
      <Feedback state={state} />
    </form>
  );
}

export function EditProgramForm(props: {
  id: string;
  infoUrl: string;
  applyUrl: string | null;
  watchUrl: string | null;
  ielts: IeltsRequired;
  windowsText: string;
  windowsNote: string | null;
}) {
  const [state, action, pending] = useActionState(updateProgram, initial);
  return (
    <form action={action} className="mt-4 grid gap-3">
      <input type="hidden" name="id" value={props.id} />
      <label className={label}>
        Direct application link
        <input name="apply_url" type="url" defaultValue={props.applyUrl ?? ""} className={field} />
      </label>
      <label className={label}>
        Program page
        <input name="info_url" type="url" required defaultValue={props.infoUrl} className={field} />
      </label>
      <label className={label}>
        Page the daily check reads (leave empty to use the program page)
        <input name="watch_url" type="url" defaultValue={props.watchUrl ?? ""} className={field} />
      </label>
      <label className={label}>
        IELTS
        <IeltsSelect defaultValue={props.ielts} />
      </label>
      <label className={label}>
        Application windows
        <textarea name="windows" rows={3} defaultValue={props.windowsText} className={`${field} font-mono`} />
        <span className="mt-1 block font-normal text-muted">{WINDOWS_HELP}</span>
      </label>
      <label className={label}>
        Note about the dates
        <input name="windows_note" defaultValue={props.windowsNote ?? ""} className={field} />
      </label>
      <div>
        <button type="submit" disabled={pending} className={primaryButton}>
          {pending ? "Saving..." : "Save changes"}
        </button>
        <Feedback state={state} />
      </div>
    </form>
  );
}

export function RemoveProgramButton({ id, name }: { id: string; name: string }) {
  return (
    <form
      action={removeProgram}
      onSubmit={(event) => {
        if (!window.confirm(`Remove ${name} from the tracker?`)) event.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button type="submit" className="text-sm font-semibold text-red-600 hover:underline">
        Remove from tracker
      </button>
    </form>
  );
}

export function AddProgramForm() {
  const [state, action, pending] = useActionState(addProgram, initial);
  return (
    <form action={action} className="grid gap-3 sm:grid-cols-2">
      <label className={label}>
        University
        <input name="university" required className={field} />
      </label>
      <label className={label}>
        Program
        <input name="program" required placeholder="MSc Health Informatics" className={field} />
      </label>
      <label className={label}>
        Country
        <input name="country" required className={field} />
      </label>
      <label className={label}>
        City
        <input name="city" className={field} />
      </label>
      <label className={label}>
        Program page
        <input name="info_url" type="url" required className={field} />
      </label>
      <label className={label}>
        Direct application link
        <input name="apply_url" type="url" className={field} />
      </label>
      <label className={label}>
        Tuition
        <input name="tuition_note" placeholder="No tuition fees, only a semester fee." className={field} />
      </label>
      <label className={label}>
        Scholarship or funding
        <input name="funding_note" className={field} />
      </label>
      <label className={label}>
        English requirement
        <input name="english_note" className={field} />
      </label>
      <label className={label}>
        IELTS
        <IeltsSelect defaultValue="unclear" />
      </label>
      <label className={`${label} sm:col-span-2`}>
        Application windows
        <textarea
          name="windows"
          rows={2}
          placeholder="Winter semester | 05-02 | 07-15 | confirmed"
          className={`${field} font-mono`}
        />
        <span className="mt-1 block font-normal text-muted">{WINDOWS_HELP}</span>
      </label>
      <div className="sm:col-span-2">
        <button type="submit" disabled={pending} className={primaryButton}>
          {pending ? "Adding..." : "Add program"}
        </button>
        <Feedback state={state} />
      </div>
    </form>
  );
}
