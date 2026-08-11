"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/posts";

export type ActionState = { error?: string; message?: string };

/** Rebuilds the public pages a post appears on. */
function refreshPublicPages() {
  revalidatePath("/blog");
  revalidatePath("/blog/[slug]", "page");
  revalidatePath("/sitemap.xml");
  revalidatePath("/blog/rss.xml");
}

export async function signIn(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Enter your email and password." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: "That email and password did not match. Try again." };
  }

  redirect("/admin");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function savePost(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const id = String(formData.get("id") ?? "").trim();
  const intent = String(formData.get("intent") ?? "save");
  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "");
  const excerpt = String(formData.get("excerpt") ?? "").trim();
  const coverUrl = String(formData.get("cover_url") ?? "").trim();
  const coverAlt = String(formData.get("cover_alt") ?? "").trim();
  const rawSlug = String(formData.get("slug") ?? "").trim();
  const tags = String(formData.get("tags") ?? "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

  if (!title) return { error: "Give the post a title before saving." };

  const slug = slugify(rawSlug || title);
  if (!slug) return { error: "That title does not make a usable web address." };

  // The e2e suite asserts every image on the site has alt text, and screen
  // readers need it regardless. Block a publish that would break that.
  if (coverUrl && !coverAlt) {
    return { error: "Describe the cover image so screen readers can read it." };
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const status =
    intent === "publish"
      ? "published"
      : intent === "unpublish"
        ? "draft"
        : String(formData.get("status") ?? "draft");

  const values = {
    slug,
    title,
    body,
    excerpt: excerpt || null,
    cover_url: coverUrl || null,
    cover_alt: coverAlt || null,
    tags,
    status,
    updated_at: new Date().toISOString(),
    // Stamp the publish date the first time it goes live, and keep it after.
    ...(intent === "publish" ? { published_at: publishedAt(formData) } : {}),
  };

  if (id) {
    // Read the row back so the confirmation reports what actually happened,
    // not what the button was hoping for.
    const { data: updated, error } = await supabase
      .from("posts")
      .update(values)
      .eq("id", id)
      .select("status")
      .maybeSingle();

    if (error) return { error: friendly(error.message) };
    if (!updated) return { error: "That post could not be found." };

    refreshPublicPages();
    return {
      message:
        updated.status === "published"
          ? "Published. It is live on the site now."
          : "Saved as a draft. It is not on the site yet.",
    };
  }

  const { data, error } = await supabase
    .from("posts")
    .insert(values)
    .select("id")
    .single();

  if (error) return { error: friendly(error.message) };

  refreshPublicPages();
  redirect(`/admin/${data.id}`);
}

export async function deletePost(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const supabase = await createClient();
  await supabase.from("posts").delete().eq("id", id);

  refreshPublicPages();
  redirect("/admin");
}

function publishedAt(formData: FormData) {
  const existing = String(formData.get("published_at") ?? "").trim();
  return existing || new Date().toISOString();
}

function friendly(message: string) {
  if (message.includes("posts_slug_key")) {
    return "Another post already uses that web address. Change the slug.";
  }
  return message;
}
