import { createPublicClient } from "./supabase/public";

export type PostStatus = "draft" | "published";

export type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  body: string;
  cover_url: string | null;
  cover_alt: string | null;
  tags: string[];
  status: PostStatus;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

// Everything except the body, for list views.
export type PostSummary = Omit<Post, "body">;

const SUMMARY_COLUMNS =
  "id, slug, title, excerpt, cover_url, cover_alt, tags, status, published_at, created_at, updated_at";

/** Published posts, newest first. Returns an empty list if Supabase is unset. */
export async function getPublishedPosts(): Promise<PostSummary[]> {
  const supabase = createPublicClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("posts")
    .select(SUMMARY_COLUMNS)
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error) {
    console.error("Could not load posts:", error.message);
    return [];
  }

  return (data ?? []) as PostSummary[];
}

/** One published post by slug, or null when it does not exist yet. */
export async function getPublishedPost(slug: string): Promise<Post | null> {
  const supabase = createPublicClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("status", "published")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error(`Could not load post "${slug}":`, error.message);
    return null;
  }

  return (data as Post) ?? null;
}

/** Turns a title into a URL-safe slug. */
export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/** Rough reading time. 220 words a minute, never less than one. */
export function readingTime(body: string) {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

export function formatDate(value: string | null) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
