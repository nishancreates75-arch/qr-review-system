"use client";

import { FormEvent, Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createAuthClient } from "@/lib/supabase/auth-client";

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const supabase = createAuthClient();

      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        console.error("LOGIN ERROR:", error);

        setMessage("Invalid email or password. Please try again.");
        setLoading(false);
        return;
      }

      const redirect = searchParams.get("redirect") || "/admin";

      router.push(redirect);
      router.refresh();
    } catch (error) {
      console.error("UNEXPECTED LOGIN ERROR:", error);

      setMessage("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#09090f] text-white">
      <div className="grid min-h-screen lg:grid-cols-2">
        <section className="hidden border-r border-white/10 bg-[#0c0c14] p-12 lg:flex lg:flex-col lg:justify-between">
          <div>
            <p className="text-xs font-bold tracking-[0.35em] text-blue-400">
              REVIEWFLOW
            </p>

            <h1 className="mt-5 max-w-lg text-5xl font-bold leading-tight">
              Manage your QR review system professionally.
            </h1>

            <p className="mt-6 max-w-md text-base leading-7 text-white/40">
              Access your businesses, QR codes, customer reviews and analytics
              from one secure administration dashboard.
            </p>
          </div>

          <div className="space-y-4">
            <Feature
              title="Business Management"
              description="Create and manage all your businesses."
            />

            <Feature
              title="QR Code System"
              description="Generate, download and print QR codes."
            />

            <Feature
              title="Real Analytics"
              description="Track QR scans and business activity."
            />
          </div>

          <p className="text-sm text-white/20">
            Secure administration access
          </p>
        </section>

        <section className="flex items-center justify-center p-6 md:p-10">
          <div className="w-full max-w-md">
            <div className="mb-10">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/10 text-xl font-bold text-blue-400">
                RF
              </div>

              <p className="mt-8 text-xs font-bold tracking-[0.3em] text-blue-400">
                ADMIN ACCESS
              </p>

              <h1 className="mt-3 text-3xl font-bold">
                Welcome back
              </h1>

              <p className="mt-3 text-sm leading-6 text-white/40">
                Sign in to access your ReviewFlow administration dashboard.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-white/70">
                  Email address
                </label>

                <input
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="admin@example.com"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3.5 text-sm outline-none transition placeholder:text-white/20 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-white/70">
                  Password
                </label>

                <input
                  type="password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3.5 text-sm outline-none transition placeholder:text-white/20 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {message && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  {message}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-blue-500 px-5 py-3.5 font-semibold transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Signing in..." : "Sign In to Dashboard"}
              </button>
            </form>

            <div className="mt-8 border-t border-white/10 pt-6">
              <p className="text-center text-xs text-white/25">
                Protected ReviewFlow administration system
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function Feature({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <h3 className="font-semibold">{title}</h3>

      <p className="mt-2 text-sm text-white/40">
        {description}
      </p>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#09090f] text-white">
          <div className="text-sm text-white/50">
            Loading admin login...
          </div>
        </main>
      }
    >
      <AdminLoginForm />
    </Suspense>
  );
}