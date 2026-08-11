import Link from "next/link";
import { PenLine, Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { formatDate, type PostSummary } from "@/lib/posts";
import { signOut } from "./actions";

export default async function AdminHome() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("posts")
    .select(
      "id, slug, title, excerpt, cover_url, cover_alt, tags, status, published_at, created_at, updated_at",
    )
    .order("updated_at", { ascending: false });

  const posts = (data ?? []) as PostSummary[];

  return (
    <div className="container-x">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow text-gold-hover">Writing desk</p>
          <h1 className="mt-3 text-3xl font-semibold text-ink md:text-4xl">
            Your posts
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <form action={signOut}>
            <button
              type="submit"
              className="text-sm font-semibold text-muted underline-offset-4 transition hover:text-ink hover:underline"
            >
              Sign out
            </button>
          </form>
          <Link
            href="/admin/new"
            className="inline-flex items-center gap-2 rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-navy-soft"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            New post
          </Link>
        </div>
      </div>

      {error ? (
        <p role="alert" className="mt-8 text-sm text-red-600">
          Could not load your posts: {error.message}
        </p>
      ) : null}

      {posts.length ? (
        <ul className="mt-8 space-y-3">
          {posts.map((post) => (
            <li key={post.id}>
              <Link
                href={`/admin/${post.id}`}
                className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-line bg-white px-6 py-5 transition hover:border-gold"
              >
                <div className="min-w-0">
                  <p className="truncate font-semibold text-ink">
                    {post.title}
                  </p>
                  <p className="mt-1 text-sm text-muted">
                    {post.status === "published"
                      ? `Published ${formatDate(post.published_at)}`
                      : "Draft"}
                    <span aria-hidden="true"> · </span>
                    /blog/{post.slug}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                    post.status === "published"
                      ? "bg-navy text-white"
                      : "border border-line text-muted"
                  }`}
                >
                  {post.status === "published" ? "Live" : "Draft"}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-8 rounded-3xl border border-dashed border-line bg-white p-10 text-center">
          <PenLine className="mx-auto h-8 w-8 text-gold" aria-hidden="true" />
          <p className="mt-4 text-lg font-semibold text-ink">
            Nothing written yet.
          </p>
          <p className="mt-2 leading-relaxed text-muted">
            Start with chapter one and the rest gets easier.
          </p>
          <Link
            href="/admin/new"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-navy-soft"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Write your first post
          </Link>
        </div>
      )}
    </div>
  );
}
