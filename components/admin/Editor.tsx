"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  ImagePlus,
  Trash2,
} from "lucide-react";
import { savePost, deletePost, type ActionState } from "@/app/admin/actions";
import { uploadImage } from "@/lib/uploadImage";
import { slugify, type Post } from "@/lib/posts";
import { PostBody } from "@/components/blog/PostBody";
import { MarkdownToolbar } from "./MarkdownToolbar";

const initial: ActionState = {};

const field =
  "mt-2 w-full rounded-xl border border-line bg-white px-4 py-3 text-ink outline-none transition focus:border-gold";
const label = "text-sm font-semibold text-ink";

export function Editor({ post }: { post?: Post }) {
  const [state, action, pending] = useActionState(savePost, initial);
  const router = useRouter();

  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(post?.slug));
  const [body, setBody] = useState(post?.body ?? "");
  const [coverUrl, setCoverUrl] = useState(post?.cover_url ?? "");
  const [coverAlt, setCoverAlt] = useState(post?.cover_alt ?? "");
  const [tab, setTab] = useState<"write" | "preview">("write");
  const [busy, setBusy] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const bodyRef = useRef<HTMLTextAreaElement>(null);
  // What the submit buttons mean is carried by this hidden field rather than by
  // the buttons' own name and value. A submit button's value is only included
  // in the form data if the browser and React agree on which button submitted,
  // and that was silently dropping "publish" and falling back to "save".
  const intentRef = useRef<HTMLInputElement>(null);
  const published = post?.status === "published";

  function setIntent(next: "save" | "publish" | "unpublish") {
    if (intentRef.current) intentRef.current.value = next;
  }

  // The status pill and the publish button read from server data, so pull it
  // again once a save lands. Without this the page keeps saying "Draft".
  useEffect(() => {
    if (state.message) router.refresh();
  }, [state.message, router]);

  function onTitleChange(value: string) {
    setTitle(value);
    if (!slugTouched) setSlug(slugify(value));
  }

  async function onCoverUpload(file: File) {
    setBusy(true);
    setUploadError("");
    const result = await uploadImage(file);
    setBusy(false);

    if (!result.ok) {
      setUploadError(result.error);
      return;
    }
    setCoverUrl(result.url);
  }

  /** Ctrl or Cmd plus B and I, because muscle memory expects them. */
  function onBodyKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (!(e.ctrlKey || e.metaKey)) return;
    const key = e.key.toLowerCase();
    if (key !== "b" && key !== "i") return;

    e.preventDefault();
    const el = e.currentTarget;
    const mark = key === "b" ? "**" : "*";
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = body.slice(start, end) || (key === "b" ? "bold" : "italic");

    setBody(
      body.slice(0, start) + mark + selected + mark + body.slice(end),
    );
    const from = start + mark.length;
    queueMicrotask(() => {
      el.focus();
      el.setSelectionRange(from, from + selected.length);
    });
  }

  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="id" value={post?.id ?? ""} />
      <input type="hidden" name="status" value={post?.status ?? "draft"} />
      <input
        type="hidden"
        name="published_at"
        value={post?.published_at ?? ""}
      />
      <input type="hidden" name="cover_url" value={coverUrl} />
      <input type="hidden" name="body" value={body} />
      <input ref={intentRef} type="hidden" name="intent" defaultValue="save" />

      {/* Everything that acts on the post lives in one bar that follows you
          down the page, so Publish is never more than a glance away. */}
      <div className="sticky top-20 z-40 -mx-2 rounded-2xl border border-line bg-white/95 px-4 py-3 backdrop-blur">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              published ? "bg-navy text-white" : "border border-line text-muted"
            }`}
          >
            {published ? "Live on the site" : "Draft"}
          </span>

          <div className="flex flex-wrap items-center gap-2">
            {post ? (
              <Link
                href={
                  published ? `/blog/${post.slug}` : `/admin/preview/${post.slug}`
                }
                className="inline-flex h-11 items-center gap-1.5 rounded-full px-4 text-sm font-semibold text-navy underline-offset-4 hover:text-gold-hover hover:underline"
              >
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
                {published ? "View live" : "Preview"}
              </Link>
            ) : null}

            <button
              type="submit"
              onClick={() => setIntent("save")}
              disabled={pending || busy}
              className="inline-flex h-11 items-center rounded-full border border-line px-5 text-sm font-semibold text-ink transition hover:border-gold disabled:opacity-60"
            >
              {pending ? "Saving..." : "Save"}
            </button>

            <button
              type="submit"
              onClick={() => setIntent(published ? "unpublish" : "publish")}
              disabled={pending || busy}
              className="inline-flex h-11 items-center rounded-full bg-navy px-6 text-sm font-semibold text-white transition hover:bg-navy-soft disabled:opacity-60"
            >
              {published ? "Move to draft" : "Publish"}
            </button>
          </div>
        </div>

        {state.error || uploadError ? (
          <p
            role="alert"
            className="mt-3 flex items-start gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            {state.error || uploadError}
          </p>
        ) : null}

        {state.message ? (
          <p className="mt-3 flex items-start gap-2 rounded-xl bg-green-50 px-4 py-3 text-sm font-medium text-green-800">
            <CheckCircle2
              className="mt-0.5 h-4 w-4 shrink-0"
              aria-hidden="true"
            />
            {state.message}
          </p>
        ) : null}
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="space-y-6">
          <div className="rounded-3xl border border-line bg-white p-6 md:p-8">
            <label htmlFor="title" className={label}>
              Title
            </label>
            <input
              id="title"
              name="title"
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              required
              className={`${field} text-lg font-semibold`}
            />

            <div className="mt-5">
              <label htmlFor="excerpt" className={label}>
                Excerpt
              </label>
              <textarea
                id="excerpt"
                name="excerpt"
                defaultValue={post?.excerpt ?? ""}
                rows={2}
                className={field}
              />
              <p className="mt-2 text-xs text-muted">
                Shows on the blog index and in Google. Optional.
              </p>
            </div>

            <div className="mt-5 flex flex-wrap gap-4">
              <div className="min-w-[14rem] flex-1">
                <label htmlFor="slug" className={label}>
                  Web address
                </label>
                <input
                  id="slug"
                  name="slug"
                  value={slug}
                  onChange={(e) => {
                    setSlugTouched(true);
                    setSlug(e.target.value);
                  }}
                  className={field}
                />
                <p className="mt-2 text-xs text-muted">/blog/{slug || "..."}</p>
              </div>

              <div className="min-w-[14rem] flex-1">
                <label htmlFor="tags" className={label}>
                  Tags
                </label>
                <input
                  id="tags"
                  name="tags"
                  defaultValue={post?.tags?.join(", ") ?? ""}
                  className={field}
                />
                <p className="mt-2 text-xs text-muted">Separate with commas.</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-line bg-white p-6 md:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className={label}>Post</span>
              <div className="flex gap-1 rounded-full bg-paper p-1">
                {(["write", "preview"] as const).map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setTab(option)}
                    className={`h-9 rounded-full px-4 text-sm font-semibold capitalize transition ${
                      tab === option
                        ? "bg-navy text-white"
                        : "text-muted hover:text-ink"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {tab === "write" ? (
              <>
                <div className="mt-4">
                  <MarkdownToolbar
                    textareaRef={bodyRef}
                    value={body}
                    onChange={setBody}
                    onBusyChange={setBusy}
                    onError={setUploadError}
                  />
                </div>

                <textarea
                  ref={bodyRef}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  onKeyDown={onBodyKeyDown}
                  rows={24}
                  aria-label="Post body"
                  className={`${field} font-mono text-sm leading-relaxed`}
                />

                <p className="mt-2 text-xs text-muted">
                  {busy
                    ? "Uploading your image..."
                    : "Select text, then hit a button. The Image button drops a picture wherever your cursor is."}
                </p>
              </>
            ) : (
              <div className="mt-4 rounded-xl border border-line bg-paper p-6">
                {body.trim() ? (
                  <PostBody body={body} />
                ) : (
                  <p className="text-muted">Nothing to preview yet.</p>
                )}
              </div>
            )}
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-3xl border border-line bg-white p-6">
            <p className={label}>Cover image</p>
            <p className="mt-1 text-xs text-muted">
              Shows on the blog index and at the top of the post.
            </p>

            {coverUrl ? (
              // Plain img on purpose: the file was uploaded seconds ago, so
              // next/image optimisation buys nothing inside the editor.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={coverUrl}
                alt={coverAlt || "Cover image preview"}
                className="mt-3 aspect-[16/9] w-full rounded-xl border border-line object-cover"
              />
            ) : null}

            <label className="mt-3 inline-flex h-11 cursor-pointer items-center gap-2 rounded-full border border-line px-4 text-sm font-semibold text-ink transition hover:border-gold">
              <ImagePlus className="h-4 w-4" aria-hidden="true" />
              {busy ? "Uploading..." : coverUrl ? "Replace" : "Upload cover"}
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                disabled={busy}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void onCoverUpload(file);
                  e.target.value = "";
                }}
              />
            </label>

            {coverUrl ? (
              <div className="mt-4">
                <label htmlFor="cover_alt" className={label}>
                  Describe the image
                </label>
                <input
                  id="cover_alt"
                  name="cover_alt"
                  value={coverAlt}
                  onChange={(e) => setCoverAlt(e.target.value)}
                  className={field}
                />
                <p className="mt-2 text-xs text-muted">
                  Needed so screen readers can describe it.
                </p>
              </div>
            ) : (
              <input type="hidden" name="cover_alt" value="" />
            )}
          </div>

          {post ? (
            <div className="rounded-3xl border border-line bg-white p-6">
              <p className={label}>Delete</p>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                This removes the post for good. There is no undo.
              </p>
              <button
                type="submit"
                formAction={deletePost}
                formNoValidate
                onClick={(e) => {
                  const sure = window.confirm(
                    `Delete "${post.title}" for good? This cannot be undone.`,
                  );
                  if (!sure) e.preventDefault();
                }}
                className="mt-4 inline-flex h-11 items-center gap-2 rounded-full border border-red-200 px-4 text-sm font-semibold text-red-600 transition hover:border-red-400"
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
                Delete this post
              </button>
            </div>
          ) : null}
        </aside>
      </div>
    </form>
  );
}
