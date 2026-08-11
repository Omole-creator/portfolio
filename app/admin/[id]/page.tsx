import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Editor } from "@/components/admin/Editor";
import { createClient } from "@/lib/supabase/server";
import type { Post } from "@/lib/posts";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!data) notFound();

  return (
    <div className="container-x">
      <Link
        href="/admin"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted underline-offset-4 transition hover:text-ink hover:underline"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        All posts
      </Link>

      <h1 className="mb-8 mt-4 text-3xl font-semibold text-ink md:text-4xl">
        Edit post
      </h1>

      <Editor post={data as Post} />
    </div>
  );
}
