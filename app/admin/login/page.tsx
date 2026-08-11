import type { Metadata } from "next";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata: Metadata = {
  title: "Sign in",
};

export default function LoginPage() {
  const configured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );

  return (
    <div className="container-x">
      <div className="mx-auto max-w-md rounded-3xl border border-line bg-white p-8 md:p-10">
        <p className="eyebrow text-gold-hover">Writing desk</p>
        <h1 className="mt-3 text-3xl font-semibold text-ink">Sign in</h1>

        {configured ? (
          <>
            <p className="mt-3 leading-relaxed text-muted">
              This is where you write and publish. Only you have an account
              here.
            </p>
            <LoginForm />
          </>
        ) : (
          <p className="mt-3 leading-relaxed text-muted">
            The writing desk is not connected yet. Add
            NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your
            environment, then reload this page.
          </p>
        )}
      </div>
    </div>
  );
}
