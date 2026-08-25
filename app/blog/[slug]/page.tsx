import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HomeCta } from "@/components/HomeCta";
import { PostArticle } from "@/components/blog/PostArticle";
import { PostViewTracker } from "@/components/analytics/PostViewTracker";
import { getPublishedPost, getPublishedPosts } from "@/lib/posts";
import { site } from "@/lib/content";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPost(slug);

  if (!post) return { title: `Not found — ${site.name}` };

  const description = post.excerpt ?? blurbFrom(post.body);

  return {
    title: `${post.title} — ${site.name}`,
    description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description,
      url: `${site.url}/blog/${post.slug}`,
      publishedTime: post.published_at ?? undefined,
      authors: [site.name],
      images: post.cover_url ? [{ url: post.cover_url }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      images: post.cover_url ? [post.cover_url] : undefined,
    },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPublishedPost(slug);

  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt ?? blurbFrom(post.body),
    datePublished: post.published_at ?? post.created_at,
    dateModified: post.updated_at,
    image: post.cover_url ? [post.cover_url] : undefined,
    author: {
      "@type": "Person",
      name: site.name,
      url: site.url,
    },
    mainEntityOfPage: `${site.url}/blog/${post.slug}`,
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PostViewTracker slug={post.slug} />
      <PostArticle post={post} />
      <HomeCta />
    </main>
  );
}

/** Fallback description when a post has no excerpt: the opening prose, trimmed. */
function blurbFrom(body: string) {
  return body
    .replace(/[#>*_`\[\]]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 155);
}
