import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { PostSummary } from "@/lib/posts";
import { PostMeta } from "./PostMeta";

export function PostCard({ post }: { post: PostSummary }) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-3xl border border-line bg-white transition-transform duration-300 hover:-translate-y-1">
      {post.cover_url ? (
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-paper">
          <Image
            src={post.cover_url}
            alt={post.cover_alt ?? post.title}
            fill
            sizes="(min-width: 1024px) 32rem, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </div>
      ) : null}

      <div className="flex flex-1 flex-col p-7">
        <PostMeta date={post.published_at} tags={post.tags} />

        <h2 className="mt-4 text-2xl font-semibold leading-snug text-ink">
          <Link href={`/blog/${post.slug}`} className="after:absolute after:inset-0">
            {post.title}
          </Link>
        </h2>

        {post.excerpt ? (
          <p className="mt-3 leading-relaxed text-muted">{post.excerpt}</p>
        ) : null}

        <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-navy transition-colors group-hover:text-gold-hover">
          Read it
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </span>
      </div>
    </article>
  );
}
