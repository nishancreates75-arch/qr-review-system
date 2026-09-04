"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createAuthClient } from "@/lib/supabase/auth-client";

export default function AdminLogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);

    const supabase = createAuthClient();

    await supabase.auth.signOut();

    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-2.5 text-sm font-medium text-red-300 transition hover:bg-red-500/10 disabled:opacity-50"
    >
      {loading ? "Signing out..." : "Logout"}
    </button>
  );
}