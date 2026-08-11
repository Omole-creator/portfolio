import type { Metadata } from "next";

// The writing desk is not for search engines. robots.ts also disallows /admin.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main className="min-h-screen bg-paper pt-28 pb-20">{children}</main>;
}
