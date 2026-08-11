"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { ExternalLink, ImagePlus, Trash2 } from "lucide-react";
import { savePost, deletePost, type ActionState } from "@/app/admin/actions";
import { createClient } from "@/lib/supabase/client";
import { slugify, type Post } from "@/lib/posts";
import { PostBody } from "@/components/blog/PostBody";

const initial: ActionState = {};

const field =
  "mt-2 w-full rounded-xl border border-line bg-white px-4 py-3 text-ink outline-none transition focus:border-gold";
const label = "text-sm font-semibold text-ink";

export function Editor({ post }: { post?: Post }) {
  const [state, action, pending] = useActionState(savePost, initial);

  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(post?.slug));
  const [body, setBody] = useState(post?.body ?? "");
  const [coverUrl, setCoverUrl] = useState(post?.cover_url ?? "");
  const [coverAlt, setCoverAlt] = useState(post?.cover_alt ?? "");
  const [tab, setTab] = useState<"write" | "preview">("write");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const published = post?.status === "published";

  function onTitleChange(value: string) {
    setTitle(value);
    if (!slugTouched) setSlug(slugify(value));
  }

  async function onUpload(file: File) {
    setUploading(true);
    setUploadError("");

    const supabase = createClient();
    const extension = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
    const path = `${crypto.randomUUID()}.${extension}`;

    const { error } = await supabase.storage
      .from("blog-images")
      .upload(path, file, { cacheControl: "31536000", upsert: false });

    if (error) {
      setUploadError("That image did not upload. Try again.");
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from("blog-images").getPublicUrl(path);
    setCoverUrl(data.publicUrl);
    setUploading(false);
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

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="space-y-6">
          <div className="rounded-3xl border border-line bg-white p-6 md:p-8">
            <div>
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
                placeholder="Why your first 100 customers should not come from ads"
              />
            </div>

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
                placeholder="One or two sentences. This shows on the blog index and in Google."
              />
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
                  placeholder="Growth, Community"
                />
                <p className="mt-2 text-xs text-muted">Separate with commas.</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-line bg-white p-6 md:p-8">
            <div className="flex items-center justify-between gap-4">
              <span className={label}>Post</span>
              <div className="flex gap-1 rounded-full bg-paper p-1">
                {(["write", "preview"] as const).map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setTab(option)}
                    className={`rounded-full px-4 py-1.5 text-sm font-semibold capitalize transition ${
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
              <textarea
                name="body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={22}
                className={`${field} font-mono text-sm leading-relaxed`}
                placeholder={"## A heading\n\nWrite in Markdown. **Bold**, *italic*, [links](https://example.com), and lists all work."}
              />
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

            {coverUrl ? (
              // Plain img on purpose: this is the editor, and the file was
              // uploaded a second ago, so next/image optimisation adds nothing.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={coverUrl}
                alt={coverAlt || "Cover image preview"}
                className="mt-3 aspect-[16/9] w-full rounded-xl border border-line object-cover"
              />
            ) : null}

            <label className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-full border border-line px-4 py-2 text-sm font-semibold text-ink transition hover:border-gold">
              <ImagePlus className="h-4 w-4" aria-hidden="true" />
              {uploading
                ? "Uploading..."
                : coverUrl
                  ? "Replace image"
                  : "Upload image"}
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                disabled={uploading}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void onUpload(file);
                }}
              />
            </label>

            {uploadError ? (
              <p role="alert" className="mt-2 text-sm text-red-600">
                {uploadError}
              </p>
            ) : null}

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
                  placeholder="What is in the picture?"
                />
                <p className="mt-2 text-xs text-muted">
                  Needed so screen readers can describe it.
                </p>
              </div>
            ) : (
              <input type="hidden" name="cover_alt" value="" />
            )}
          </div>

          <div className="rounded-3xl border border-line bg-white p-6">
            <p className={label}>
              {published ? "Live on the site" : "Draft, not visible yet"}
            </p>

            {state.error ? (
              <p role="alert" className="mt-3 text-sm font-medium text-red-600">
                {state.error}
              </p>
            ) : null}
            {state.message ? (
              <p className="mt-3 text-sm font-medium text-green-700">
                {state.message}
              </p>
            ) : null}

            <div className="mt-4 space-y-3">
              <button
                type="submit"
                name="intent"
                value="save"
                disabled={pending}
                className="w-full rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-ink transition hover:border-gold disabled:opacity-60"
              >
                {pending ? "Saving..." : "Save"}
              </button>

              <button
                type="submit"
                name="intent"
                value={published ? "unpublish" : "publish"}
                disabled={pending}
                className="w-full rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-navy-soft disabled:opacity-60"
              >
                {published ? "Move back to draft" : "Publish"}
              </button>
            </div>

            {post ? (
              <div className="mt-5 space-y-2 border-t border-line pt-5 text-sm">
                <Link
                  href={
                    published
                      ? `/blog/${post.slug}`
                      : `/admin/preview/${post.slug}`
                  }
                  className="inline-flex items-center gap-1.5 font-semibold text-navy underline-offset-4 hover:text-gold-hover hover:underline"
                >
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  {published ? "View it live" : "Preview the draft"}
                </Link>
              </div>
            ) : null}
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
                className="mt-4 inline-flex items-center gap-2 rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:border-red-400"
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
