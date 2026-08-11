import type { Metadata } from "next";
import { HomeCta } from "@/components/HomeCta";
import { Reveal } from "@/components/Reveal";
import { PostCard } from "@/components/blog/PostCard";
import { getPublishedPosts } from "@/lib/posts";
import { blogPage, site } from "@/lib/content";

// Static, then rebuilt on demand whenever a post is published or edited.
// The 60 second window is only a fallback if a revalidation call is missed.
export const revalidate = 60;

export const metadata: Metadata = {
  title: `Blog — ${site.name}`,
  description: blogPage.metaDescription,
  alternates: {
    canonical: "/blog",
    types: { "application/rss+xml": `${site.url}/blog/rss.xml` },
  },
};

export default async function BlogPage() {
  const posts = await getPublishedPosts();

  return (
    <main>
      <section className="bg-paper pt-36 pb-20 md:pt-40 md:pb-24">
        <div className="container-x">
          {/* No visible headline here by choice. The h1 stays for screen readers. */}
          <h1 className="sr-only">{blogPage.srTitle}</h1>

          {posts.length ? (
            <div className="grid gap-8 md:grid-cols-2">
              {posts.map((post, i) => (
                <Reveal key={post.id} delay={Math.min(i, 3) * 0.05}>
                  <PostCard post={post} />
                </Reveal>
              ))}
            </div>
          ) : (
            <p className="text-lg text-muted">{blogPage.emptyState}</p>
          )}
        </div>
      </section>

      <HomeCta />
    </main>
  );
}
