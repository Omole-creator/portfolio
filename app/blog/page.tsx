import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
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
      <PageHeader
        eyebrow={blogPage.eyebrow}
        title={blogPage.title}
        intro={blogPage.intro}
      />

      <section className="bg-paper py-20 md:py-24">
        <div className="container-x">
          {posts.length ? (
            <div className="grid gap-8 md:grid-cols-2">
              {posts.map((post, i) => (
                <Reveal key={post.id} delay={Math.min(i, 3) * 0.05}>
                  <PostCard post={post} />
                </Reveal>
              ))}
            </div>
          ) : (
            <Reveal>
              <p className="max-w-xl text-lg leading-relaxed text-muted">
                {blogPage.emptyState}
              </p>
            </Reveal>
          )}
        </div>
      </section>

      <HomeCta />
    </main>
  );
}
