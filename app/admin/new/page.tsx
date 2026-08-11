import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Editor } from "@/components/admin/Editor";

export default function NewPostPage() {
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
        New post
      </h1>

      <Editor />
    </div>
  );
}
