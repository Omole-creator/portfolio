import type { Metadata } from "next";
import Link from "next/link";

// The writing desk is not for search engines. robots.ts also disallows /admin.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-paper pt-28 pb-20">
      <div className="container-x mb-8">
        <nav className="inline-flex rounded-full border border-line bg-white p-1 text-sm font-semibold">
          <Link
            href="/admin"
            className="rounded-full px-4 py-1.5 text-muted transition-colors hover:text-ink"
          >
            Posts
          </Link>
          <Link
            href="/admin/metrics"
            className="rounded-full px-4 py-1.5 text-muted transition-colors hover:text-ink"
          >
            Metrics
          </Link>
        </nav>
      </div>
      {children}
    </main>
  );
}
