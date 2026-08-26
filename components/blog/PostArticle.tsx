import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CalendarCheck, Linkedin } from "lucide-react";
import type { Post } from "@/lib/posts";
import { readingTime } from "@/lib/posts";
import { site } from "@/lib/content";
import { PostMeta } from "./PostMeta";
import { PostBody } from "./PostBody";
import { TrackedLink } from "@/components/analytics/TrackedLink";

// The article body is deliberately not wrapped in Reveal. Revealed content sits
// at opacity 0 until it is scrolled into view, which would hide most of a long
// post from crawlers and from any screenshot that does not scroll.
export function PostArticle({ post }: { post: Post }) {
  return (
    <article>
      <header className="relative overflow-hidden bg-navy-deep pt-36 pb-16 text-white md:pt-40 md:pb-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-32 -top-24 h-96 w-96 rounded-full bg-gold/10 blur-3xl"
        />
        <div className="container-x relative max-w-3xl">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-gold underline-offset-4 transition-colors hover:underline"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to blog
          </Link>

          <h1 className="mt-6 text-4xl font-semibold leading-[1.1] tracking-tight md:text-5xl">
            {post.title}
          </h1>

          {post.excerpt ? (
            <p className="mt-6 text-lg leading-relaxed text-white/70">
              {post.excerpt}
            </p>
          ) : null}

          <div className="mt-7">
            <PostMeta
              date={post.published_at ?? post.created_at}
              minutes={readingTime(post.body)}
              tags={post.tags}
              tone="dark"
            />
          </div>
        </div>
      </header>

      <div className="bg-paper py-16 md:py-20">
        <div className="container-x max-w-3xl">
          {post.cover_url ? (
            <div className="relative mb-12 aspect-[16/9] w-full overflow-hidden rounded-2xl border border-line bg-white">
              <Image
                src={post.cover_url}
                alt={post.cover_alt ?? post.title}
                fill
                priority
                sizes="(min-width: 1024px) 48rem, 100vw"
                className="object-cover"
              />
            </div>
          ) : null}

          <PostBody body={post.body} />

          <footer className="mt-14 border-t border-line pt-8">
            <p className="font-display text-lg font-semibold text-ink">
              Written by {site.name}
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-5">
              <TrackedLink
                href={site.contact.calendly}
                cta="calendly"
                external
                className="inline-flex items-center gap-2 text-sm font-semibold text-navy underline-offset-4 transition-colors hover:text-gold-hover hover:underline"
              >
                <CalendarCheck className="h-4 w-4" aria-hidden="true" />
                Book a call
              </TrackedLink>
              <TrackedLink
                href={site.contact.linkedin}
                cta="linkedin"
                external
                className="inline-flex items-center gap-2 text-sm font-semibold text-navy underline-offset-4 transition-colors hover:text-gold-hover hover:underline"
              >
                <Linkedin className="h-4 w-4" aria-hidden="true" />
                Connect on LinkedIn
              </TrackedLink>
            </div>
          </footer>
        </div>
      </div>
    </article>
  );
}
