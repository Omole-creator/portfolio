"use client";

import { useRef, type RefObject } from "react";
import {
  Bold,
  Heading2,
  Heading3,
  ImagePlus,
  Italic,
  Link2,
  List,
  ListOrdered,
  Minus,
  Quote,
} from "lucide-react";
import { uploadImage } from "@/lib/uploadImage";

type Edit = {
  /** Text placed before the selection. */
  before: string;
  /** Text placed after the selection. */
  after?: string;
  /** Used when nothing is selected, and left selected so typing replaces it. */
  placeholder: string;
  /** Applies to whole lines rather than wrapping a selection. */
  linePrefix?: boolean;
};

const ACTIONS: { key: string; label: string; icon: typeof Bold; edit: Edit }[] = [
  {
    key: "bold",
    label: "Bold",
    icon: Bold,
    edit: { before: "**", after: "**", placeholder: "bold text" },
  },
  {
    key: "italic",
    label: "Italic",
    icon: Italic,
    edit: { before: "*", after: "*", placeholder: "italic text" },
  },
  {
    key: "h2",
    label: "Heading",
    icon: Heading2,
    edit: { before: "## ", placeholder: "Heading", linePrefix: true },
  },
  {
    key: "h3",
    label: "Subheading",
    icon: Heading3,
    edit: { before: "### ", placeholder: "Subheading", linePrefix: true },
  },
  {
    key: "quote",
    label: "Quote",
    icon: Quote,
    edit: { before: "> ", placeholder: "Quoted line", linePrefix: true },
  },
  {
    key: "list",
    label: "List",
    icon: List,
    edit: { before: "- ", placeholder: "First point", linePrefix: true },
  },
  {
    key: "numbers",
    label: "Numbers",
    icon: ListOrdered,
    edit: { before: "1. ", placeholder: "First point", linePrefix: true },
  },
  {
    key: "link",
    label: "Link",
    icon: Link2,
    edit: { before: "[", after: "](https://)", placeholder: "link text" },
  },
  {
    key: "divider",
    label: "Divider",
    icon: Minus,
    edit: { before: "\n---\n", placeholder: "", linePrefix: true },
  },
];

export function MarkdownToolbar({
  textareaRef,
  value,
  onChange,
  onBusyChange,
  onError,
}: {
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  value: string;
  onChange: (next: string) => void;
  onBusyChange: (busy: boolean) => void;
  onError: (message: string) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);

  /** Rewrites the textarea around the caret, then restores focus and selection. */
  function apply(edit: Edit) {
    const el = textareaRef.current;
    if (!el) return;

    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = value.slice(start, end);

    if (edit.linePrefix) {
      const lineStart = value.lastIndexOf("\n", start - 1) + 1;
      const text = selected || edit.placeholder;
      const next =
        value.slice(0, lineStart) +
        edit.before +
        text +
        value.slice(selected ? end : start);

      onChange(next);
      const from = lineStart + edit.before.length;
      queueMicrotask(() => {
        el.focus();
        el.setSelectionRange(from, from + text.length);
      });
      return;
    }

    const text = selected || edit.placeholder;
    const after = edit.after ?? "";
    const next =
      value.slice(0, start) + edit.before + text + after + value.slice(end);

    onChange(next);
    const from = start + edit.before.length;
    queueMicrotask(() => {
      el.focus();
      el.setSelectionRange(from, from + text.length);
    });
  }

  /** Uploads an image and drops it into the post at the caret. */
  async function insertImage(file: File) {
    onBusyChange(true);
    onError("");

    const result = await uploadImage(file);
    onBusyChange(false);

    if (!result.ok) {
      onError(result.error);
      return;
    }

    const el = textareaRef.current;
    const at = el ? el.selectionStart : value.length;
    const alt = "Describe this image";
    const snippet = `\n\n![${alt}](${result.url})\n\n`;
    const next = value.slice(0, at) + snippet + value.slice(at);

    onChange(next);

    // Leave the alt text selected so the next keystroke replaces it.
    const from = at + 4;
    queueMicrotask(() => {
      el?.focus();
      el?.setSelectionRange(from, from + alt.length);
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {ACTIONS.map(({ key, label, icon: Icon, edit }) => (
        <button
          key={key}
          type="button"
          onClick={() => apply(edit)}
          title={label}
          className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-line bg-white px-3 text-sm font-medium text-ink transition hover:border-gold hover:bg-paper"
        >
          <Icon className="h-4 w-4" aria-hidden="true" />
          <span className="hidden sm:inline">{label}</span>
        </button>
      ))}

      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        title="Add an image inside the post"
        className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-gold bg-gold/10 px-3 text-sm font-semibold text-ink transition hover:bg-gold/20"
      >
        <ImagePlus className="h-4 w-4" aria-hidden="true" />
        <span className="hidden sm:inline">Image</span>
      </button>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void insertImage(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}
