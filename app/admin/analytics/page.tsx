"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

type Business = {
  id: string;
  name: string;
  slug: string;
  location: string;
  business_type: string | null;
};

type QRScan = {
  id: string;
  business_id: string;
  created_at: string;
};

type BusinessPerformance = Business & {
  scans: number;
};

export default function AnalyticsPage() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [scans, setScans] = useState<QRScan[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadAnalytics() {
    setLoading(true);

    const [
      { data: businessData, error: businessError },
      { data: scanData, error: scanError },
    ] = await Promise.all([
      supabase
        .from("businesses")
        .select("id, name, slug, location, business_type")
        .order("name", { ascending: true }),

      supabase
        .from("qr_scans")
        .select("id, business_id, created_at")
        .order("created_at", { ascending: false }),
    ]);

    if (businessError) {
      console.error("Business analytics error:", businessError);
    }

    if (scanError) {
      console.error("QR scan analytics error:", scanError);
    }

    setBusinesses((businessData || []) as Business[]);
    setScans((scanData || []) as QRScan[]);
    setLoading(false);
  }

  useEffect(() => {
    loadAnalytics();
  }, []);

  const analytics = useMemo(() => {
    const now = new Date();

    const todayStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(now.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const todayScans = scans.filter(
      (scan) => new Date(scan.created_at) >= todayStart
    );

    const lastSevenDaysScans = scans.filter(
      (scan) => new Date(scan.created_at) >= sevenDaysAgo
    );

    const scanCounts: Record<string, number> = {};

    scans.forEach((scan) => {
      scanCounts[scan.business_id] =
        (scanCounts[scan.business_id] || 0) + 1;
    });

    const businessPerformance: BusinessPerformance[] = businesses
      .map((business) => ({
        ...business,
        scans: scanCounts[business.id] || 0,
      }))
      .sort((a, b) => b.scans - a.scans);

    const dailyScans = Array.from({ length: 7 }).map((_, index) => {
      const date = new Date();
      date.setDate(now.getDate() - (6 - index));
      date.setHours(0, 0, 0, 0);

      const nextDate = new Date(date);
      nextDate.setDate(date.getDate() + 1);

      const count = scans.filter((scan) => {
        const scanDate = new Date(scan.created_at);

        return scanDate >= date && scanDate < nextDate;
      }).length;

      return {
        label: date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        count,
      };
    });

    const maxDailyScans = Math.max(
      ...dailyScans.map((day) => day.count),
      1
    );

    return {
      totalScans: scans.length,
      todayScans: todayScans.length,
      lastSevenDays: lastSevenDaysScans.length,
      topBusiness: businessPerformance[0],
      businessPerformance,
      dailyScans,
      maxDailyScans,
    };
  }, [businesses, scans]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#09090f] p-8 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-12 text-center text-white/40">
            Loading analytics...
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#09090f] text-white">
      <div className="mx-auto max-w-7xl px-6 py-8 md:px-10">
        {/* Header */}
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-bold tracking-[0.3em] text-blue-400">
              ANALYTICS
            </p>

            <h1 className="mt-2 text-4xl font-bold tracking-tight">
              QR Performance
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-white/40">
              Monitor QR activity and see which businesses receive the
              most customer engagement.
            </p>
          </div>

          <button
            onClick={loadAnalytics}
            className="rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold transition hover:border-blue-500/40 hover:bg-white/[0.07]"
          >
            Refresh Data
          </button>
        </div>

        {/* Statistics */}
        <section className="grid gap-5 md:grid-cols-3">
          <StatCard
            label="TOTAL QR SCANS"
            value={analytics.totalScans}
            description="All recorded QR activity"
          />

          <StatCard
            label="TODAY'S SCANS"
            value={analytics.todayScans}
            description="Customer activity today"
          />

          <StatCard
            label="LAST 7 DAYS"
            value={analytics.lastSevenDays}
            description="Recent QR engagement"
          />
        </section>

        {/* Top Business */}
        <section className="mt-8 rounded-2xl border border-blue-500/20 bg-gradient-to-r from-blue-500/[0.08] to-transparent p-6">
          <p className="text-xs font-bold tracking-[0.25em] text-blue-400">
            TOP PERFORMER
          </p>

          {analytics.topBusiness ? (
            <div className="mt-5 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-bold">
                  {analytics.topBusiness.name}
                </h2>

                <p className="mt-2 text-sm text-white/40">
                  {analytics.topBusiness.location}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 px-8 py-5 text-center">
                <p className="text-4xl font-bold text-blue-400">
                  {analytics.topBusiness.scans}
                </p>

                <p className="mt-1 text-xs tracking-wider text-white/40">
                  QR SCANS
                </p>
              </div>
            </div>
          ) : (
            <p className="mt-4 text-sm text-white/40">
              No businesses or scan data available yet.
            </p>
          )}
        </section>

        {/* Last 7 Days */}
        <section className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <div className="mb-8">
            <p className="text-xs font-bold tracking-[0.25em] text-blue-400">
              SCAN ACTIVITY
            </p>

            <h2 className="mt-2 text-xl font-bold">
              Last 7 days
            </h2>
          </div>

          <div className="flex h-64 items-end gap-3">
            {analytics.dailyScans.map((day) => {
              const height =
                (day.count / analytics.maxDailyScans) * 100;

              return (
                <div
                  key={day.label}
                  className="flex h-full flex-1 flex-col justify-end"
                >
                  <div className="mb-2 text-center text-sm font-semibold">
                    {day.count}
                  </div>

                  <div className="relative flex-1">
                    <div className="absolute inset-x-0 bottom-0 h-full rounded-t-xl bg-white/[0.03]" />

                    <div
                      className="absolute inset-x-0 bottom-0 rounded-t-xl bg-blue-500 transition-all duration-500"
                      style={{
                        height: `${height}%`,
                      }}
                    />
                  </div>

                  <p className="mt-3 text-center text-xs text-white/40">
                    {day.label}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Business Rankings */}
        <section className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03]">
          <div className="border-b border-white/10 p-6">
            <p className="text-xs font-bold tracking-[0.25em] text-blue-400">
              BUSINESS PERFORMANCE
            </p>

            <h2 className="mt-2 text-xl font-bold">
              QR scan rankings
            </h2>
          </div>

          {analytics.businessPerformance.length === 0 ? (
            <div className="p-10 text-center text-white/40">
              No businesses available yet.
            </div>
          ) : (
            <div className="divide-y divide-white/10">
              {analytics.businessPerformance.map(
                (business, index) => (
                  <div
                    key={business.id}
                    className="flex items-center justify-between gap-5 p-5 transition hover:bg-white/[0.02]"
                  >
                    <div className="flex min-w-0 items-center gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10 font-bold text-blue-400">
                        #{index + 1}
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
            </div>
          )}
        </section>

        {/* Information */}
        <section className="mt-8 rounded-2xl border border-white/10 bg-white/[0.02] p-6">
          <p className="text-sm font-semibold">
            Analytics Information
          </p>

          <p className="mt-2 text-sm leading-6 text-white/40">
            Scan data is collected whenever a business review page is
            opened. The dashboard uses this data to calculate total scans,
            daily activity and business performance rankings.
          </p>
        </section>
      </div>
    </main>
  );
}

function StatCard({
  label,
  value,
  description,
}: {
  label: string;
  value: number;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <p className="text-xs font-bold tracking-[0.2em] text-blue-400">
        {label}
      </p>

      <p className="mt-5 text-4xl font-bold">
        {value}
      </p>

      <p className="mt-3 text-sm text-white/40">
        {description}
      </p>
    </div>
  );
}