import Link from "next/link";
import { notFound } from "next/navigation";
import { Eye } from "lucide-react";
import { PostArticle } from "@/components/blog/PostArticle";
import { createClient } from "@/lib/supabase/server";
import type { Post } from "@/lib/posts";

// Drafts are hidden from the public by row level security. This route reads
// them with the signed-in session instead, so a draft can be checked before it
// goes live.
export default async function PreviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (!data) notFound();

  const post = data as Post;

  return (
    <div className="-mt-28">
      <div className="sticky top-20 z-40 border-b border-gold/30 bg-gold/15 backdrop-blur">
        <div className="container-x flex flex-wrap items-center justify-between gap-3 py-3">
          <p className="inline-flex items-center gap-2 text-sm font-semibold text-ink">
            <Eye className="h-4 w-4" aria-hidden="true" />
            Preview{post.status === "draft" ? " of a draft" : ""}. Only you can
            see this.
          </p>
          <Link
            href={`/admin/${post.id}`}
            className="text-sm font-semibold text-navy underline-offset-4 hover:underline"
          >
            Back to the editor
          </Link>
        </div>
      </div>

      <PostArticle post={post} />
    </div>
  );
}
