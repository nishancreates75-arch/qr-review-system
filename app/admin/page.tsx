"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import AdminLogoutButton from "@/components/AdminLogoutButton";

type Business = {
  id: string;
  name: string;
  slug: string;
  location: string;
  business_type: string | null;
  created_at?: string;
};

type QRScan = {
  id: string;
  business_id: string;
  created_at: string;
};

export default function AdminDashboard() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [scans, setScans] = useState<QRScan[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadDashboard() {
    setLoading(true);

    const [
      { data: businessData, error: businessError },
      { data: scanData, error: scanError },
    ] = await Promise.all([
      supabase
        .from("businesses")
        .select("*")
        .order("created_at", { ascending: false }),

      supabase
        .from("qr_scans")
        .select("*")
        .order("created_at", { ascending: false }),
    ]);

    if (businessError) {
      console.error("Business error:", businessError);
    }

    if (scanError) {
      console.error("QR scan error:", scanError);
    }

    setBusinesses((businessData || []) as Business[]);
    setScans((scanData || []) as QRScan[]);
    setLoading(false);
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  const dashboardStats = useMemo(() => {
    const now = new Date();

    const todayStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(now.getDate() - 7);

    const todayScans = scans.filter((scan) => {
      return new Date(scan.created_at) >= todayStart;
    });

    const weeklyScans = scans.filter((scan) => {
      return new Date(scan.created_at) >= sevenDaysAgo;
    });

    const businessScanCounts: Record<string, number> = {};

    scans.forEach((scan) => {
      businessScanCounts[scan.business_id] =
        (businessScanCounts[scan.business_id] || 0) + 1;
    });

    const rankedBusinesses = businesses
      .map((business) => ({
        ...business,
        scans: businessScanCounts[business.id] || 0,
      }))
      .sort((a, b) => b.scans - a.scans);

    const topBusiness = rankedBusinesses[0];

    return {
      totalScans: scans.length,
      todayScans: todayScans.length,
      weeklyScans: weeklyScans.length,
      topBusiness,
      rankedBusinesses,
    };
  }, [businesses, scans]);

  const businessTypeStats = useMemo(() => {
    const counts: Record<string, number> = {};

    businesses.forEach((business) => {
      const type = business.business_type || "Other";

      counts[type] = (counts[type] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([type, count]) => ({
        type,
        count,
      }))
      .sort((a, b) => b.count - a.count);
  }, [businesses]);

  const recentBusinesses = businesses.slice(0, 5);

  return (
    <main className="min-h-screen bg-[#09090f] text-white">
      <div className="mx-auto max-w-7xl px-6 py-8 md:px-10">
        {/* Header */}
        <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-bold tracking-[0.3em] text-blue-400">
              ADMIN DASHBOARD
            </p>

            <h1 className="mt-2 text-4xl font-bold tracking-tight">
              System Overview
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-white/40">
              Monitor businesses, QR activity and customer engagement from
              one professional dashboard.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
  <Link
    href="/admin/add-business"
    className="inline-flex items-center justify-center rounded-xl bg-blue-500 px-6 py-3 font-semibold transition hover:bg-blue-400"
  >
    + Add Business
  </Link>

  <AdminLogoutButton />
</div>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-12 text-center text-white/40">
            Loading dashboard...
          </div>
        ) : (
          <>
            {/* Main Statistics */}
            <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              <DashboardCard
                label="Total Businesses"
                value={businesses.length}
                description="Businesses in your system"
                icon="▦"
              />

              <DashboardCard
                label="Total QR Scans"
                value={dashboardStats.totalScans}
                description="All recorded QR activity"
                icon="QR"
              />

              <DashboardCard
                label="Today's Scans"
                value={dashboardStats.todayScans}
                description="QR activity today"
                icon="◉"
              />

              <DashboardCard
                label="Last 7 Days"
                value={dashboardStats.weeklyScans}
                description="Recent customer activity"
                icon="↗"
              />
            </section>

            {/* Top Business */}
            <section className="mt-8 rounded-2xl border border-blue-500/20 bg-gradient-to-r from-blue-500/[0.08] to-transparent p-6">
              <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs font-bold tracking-[0.25em] text-blue-400">
                    TOP PERFORMING BUSINESS
                  </p>

                  {dashboardStats.topBusiness ? (
                    <>
                      <h2 className="mt-3 text-2xl font-bold">
                        {dashboardStats.topBusiness.name}
                      </h2>

                      <p className="mt-2 text-sm text-white/40">
                        {dashboardStats.topBusiness.location}
                      </p>
                    </>
                  ) : (
                    <h2 className="mt-3 text-xl font-bold">
                      No scan data yet
                    </h2>
                  )}
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/20 px-7 py-5 text-center">
                  <p className="text-3xl font-bold text-blue-400">
                    {dashboardStats.topBusiness?.scans || 0}
                  </p>

                  <p className="mt-1 text-xs text-white/40">
                    TOTAL SCANS
                  </p>
                </div>
              </div>
            </section>

            {/* Quick Actions */}
            <section className="mt-8">
              <div className="mb-5">
                <p className="text-xs font-bold tracking-[0.25em] text-blue-400">
                  QUICK ACTIONS
                </p>

                <h2 className="mt-2 text-2xl font-bold">
                  Manage your system
                </h2>
              </div>

              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                <QuickAction
                  title="Add Business"
                  description="Create a business and review page."
                  href="/admin/add-business"
                  action="Add Business"
                />

                <QuickAction
                  title="Businesses"
                  description="Manage all registered businesses."
                  href="/admin/businesses"
                  action="Manage"
                />

                <QuickAction
                  title="QR Manager"
                  description="Open and manage QR codes."
                  href="/admin/qr"
                  action="Open QR"
                />

                <QuickAction
                  title="Analytics"
                  description="View QR scan performance."
                  href="/admin/analytics"
                  action="View Analytics"
                />
              </div>
            </section>

            {/* Dashboard Content */}
            <section className="mt-8 grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
              {/* Recent Businesses */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.03]">
                <div className="flex items-center justify-between border-b border-white/10 p-6">
                  <div>
                    <p className="text-xs font-bold tracking-[0.25em] text-blue-400">
                      RECENT BUSINESSES
                    </p>

                    <h2 className="mt-2 text-xl font-bold">
                      Latest additions
                    </h2>
                  </div>

                  <Link
                    href="/admin/businesses"
                    className="text-sm text-blue-400 transition hover:text-blue-300"
                  >
                    View all →
                  </Link>
                </div>

                {recentBusinesses.length === 0 ? (
                  <div className="p-10 text-center">
                    <p className="font-medium">
                      No businesses yet
                    </p>

                    <p className="mt-2 text-sm text-white/40">
                      Add your first business to get started.
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-white/10">
                    {recentBusinesses.map((business) => (
                      <div
                        key={business.id}
                        className="flex items-center justify-between gap-4 p-5 transition hover:bg-white/[0.02]"
                      >
                        <div className="flex min-w-0 items-center gap-4">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10 font-bold text-blue-400">
                            {business.name.charAt(0).toUpperCase()}
                          </div>

                          <div className="min-w-0">
                            <h3 className="truncate font-semibold">
                              {business.name}
                            </h3>

                            <p className="mt-1 truncate text-sm text-white/40">
                              {business.location}
                            </p>
                          </div>
                        </div>

                        <span className="hidden rounded-full border border-white/10 px-3 py-1 text-xs text-white/50 sm:inline-block">
                          {business.business_type || "Other"}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Business Categories */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.03]">
                <div className="border-b border-white/10 p-6">
                  <p className="text-xs font-bold tracking-[0.25em] text-blue-400">
                    BUSINESS TYPES
                  </p>

                  <h2 className="mt-2 text-xl font-bold">
                    Categories
                  </h2>
                </div>

                {businessTypeStats.length === 0 ? (
                  <div className="p-10 text-center text-sm text-white/40">
                    Business categories will appear here.
                  </div>
                ) : (
                  <div className="space-y-5 p-6">
                    {businessTypeStats.map((item) => {
                      const percentage =
                        businesses.length > 0
                          ? (item.count / businesses.length) * 100
                          : 0;

                      return (
                        <div key={item.type}>
                          <div className="mb-2 flex items-center justify-between text-sm">
                            <span className="text-white/70">
                              {item.type}
                            </span>

                            <span className="font-semibold">
                              {item.count}
                            </span>
                          </div>

                          <div className="h-2 overflow-hidden rounded-full bg-white/5">
                            <div
                              className="h-full rounded-full bg-blue-500"
                              style={{
                                width: `${percentage}%`,
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </section>

            {/* Top Businesses */}
            <section className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03]">
              <div className="flex items-center justify-between border-b border-white/10 p-6">
                <div>
                  <p className="text-xs font-bold tracking-[0.25em] text-blue-400">
                    PERFORMANCE
                  </p>

                  <h2 className="mt-2 text-xl font-bold">
                    Top businesses by QR scans
                  </h2>
                </div>

                <Link
                  href="/admin/analytics"
                  className="text-sm text-blue-400"
                >
                  Full Analytics →
                </Link>
              </div>

              <div className="divide-y divide-white/10">
                {dashboardStats.rankedBusinesses.slice(0, 5).map(
                  (business, index) => (
                    <div
                      key={business.id}
                      className="flex items-center justify-between gap-5 p-5"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-sm font-bold text-blue-400">
                          #{index + 1}
                        </div>

                        <div>
                          <h3 className="font-semibold">
                            {business.name}
                          </h3>

                          <p className="mt-1 text-sm text-white/40">
                            {business.location}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-xl font-bold">
                          {business.scans}
                        </p>

                        <p className="text-xs text-white/40">
                          scans
                        </p>
                      </div>
                    </div>
                  )
                )}

                {dashboardStats.rankedBusinesses.length === 0 && (
                  <div className="p-10 text-center text-white/40">
                    No businesses available.
                  </div>
                )}
              </div>
            </section>

            {/* System Status */}
            <section className="mt-8 rounded-2xl border border-green-500/20 bg-green-500/[0.04] p-6">
              <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs font-bold tracking-[0.25em] text-green-400">
                    SYSTEM STATUS
                  </p>

                  <h2 className="mt-2 text-xl font-bold">
                    QR Review System is active
                  </h2>

                  <p className="mt-2 text-sm text-white/40">
                    Businesses, QR tracking, review pages and analytics are
                    connected.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-green-400" />

                  <span className="text-sm font-medium text-green-400">
                    System Online
                  </span>
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}

function DashboardCard({
  label,
  value,
  description,
  icon,
}: {
  label: string;
  value: number;
  description: string;
  icon: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-blue-500/30 hover:bg-white/[0.04]">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-white/50">
            {label}
          </p>

          <p className="mt-4 text-4xl font-bold">
            {value}
          </p>

          <p className="mt-3 text-sm text-white/30">
            {description}
          </p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10 text-sm font-bold text-blue-400">
          {icon}
        </div>
      </div>
    </div>
  );
}

function QuickAction({
  title,
  description,
  href,
  action,
}: {
  title: string;
  description: string;
  href: string;
  action: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-blue-500/40 hover:bg-white/[0.05]"
    >
      <h3 className="text-lg font-bold">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-6 text-white/40">
        {description}
      </p>

      <p className="mt-6 text-sm font-semibold text-blue-400 transition group-hover:text-blue-300">
        {action} →
      </p>
    </Link>
  );
}