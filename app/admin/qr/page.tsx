"use client";

import { useEffect, useRef, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { supabase } from "@/lib/supabase";

type Business = {
  id: string;
  name: string;
  slug: string;
  location: string;
  business_type: string | null;
};

export default function QRManagerPage() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const qrRefs = useRef<Record<string, HTMLDivElement | null>>({});

  async function loadBusinesses() {
    setLoading(true);

    const { data, error } = await supabase
      .from("businesses")
      .select("id, name, slug, location, business_type")
      .order("name", { ascending: true });

    if (error) {
      console.error(error);
      setMessage(`Error loading businesses: ${error.message}`);
      setLoading(false);
      return;
    }

    setBusinesses((data || []) as Business[]);
    setLoading(false);
  }

  useEffect(() => {
    loadBusinesses();
  }, []);

  const filteredBusinesses = businesses.filter((business) => {
    const searchText = search.toLowerCase();

    return (
      business.name.toLowerCase().includes(searchText) ||
      business.location.toLowerCase().includes(searchText) ||
      (business.business_type || "")
        .toLowerCase()
        .includes(searchText)
    );
  });

  function getReviewUrl(slug: string) {
    if (typeof window === "undefined") return "";

    return `${window.location.origin}/r/${slug}`;
  }

  async function copyReviewLink(slug: string, name: string) {
    try {
      await navigator.clipboard.writeText(getReviewUrl(slug));

      setMessage(`Review link copied for ${name}`);

      setTimeout(() => {
        setMessage("");
      }, 3000);
    } catch (error) {
      console.error(error);
      setMessage("Could not copy the review link.");
    }
  }

  function downloadQR(business: Business) {
    const container = qrRefs.current[business.id];

    if (!container) {
      setMessage("QR code is not ready yet.");
      return;
    }

    const canvas = container.querySelector("canvas");

    if (!canvas) {
      setMessage("QR canvas not found.");
      return;
    }

    const pngUrl = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");

    const link = document.createElement("a");

    link.href = pngUrl;
    link.download = `${business.slug}-qr-code.png`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setMessage(`QR code downloaded for ${business.name}`);

    setTimeout(() => {
      setMessage("");
    }, 3000);
  }

  return (
    <main className="min-h-screen bg-[#09090f] text-white">
      <div className="mx-auto max-w-7xl px-6 py-8 md:px-10">
        {/* Header */}
        <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-bold tracking-[0.3em] text-blue-400">
              QR MANAGEMENT
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight">
              QR Codes
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-white/40">
              Generate, preview and download QR codes for every business
              review page.
            </p>
          </div>

          <button
            type="button"
            onClick={loadBusinesses}
            className="rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold transition hover:border-blue-500/40 hover:bg-white/[0.07]"
          >
            Refresh Businesses
          </button>
        </div>

        {/* Search */}
        <section className="mb-8 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="font-semibold">
                Business QR Directory
              </h2>

              <p className="mt-1 text-sm text-white/40">
                {filteredBusinesses.length} of {businesses.length} businesses
              </p>
            </div>

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search businesses..."
              className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none transition placeholder:text-white/25 focus:border-blue-500 md:max-w-sm"
            />
          </div>
        </section>

        {/* Message */}
        {message && (
          <div className="mb-6 rounded-xl border border-blue-500/20 bg-blue-500/10 px-5 py-4 text-sm text-blue-300">
            {message}
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-12 text-center text-white/40">
            Loading QR codes...
          </div>
        ) : filteredBusinesses.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-12 text-center">
            <h2 className="font-semibold">
              No businesses found
            </h2>

            <p className="mt-2 text-sm text-white/40">
              Add a business first to generate a QR code.
            </p>
          </div>
        ) : (
          <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredBusinesses.map((business) => {
              const reviewUrl = getReviewUrl(business.slug);

              return (
                <div
                  key={business.id}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-blue-500/30 hover:bg-white/[0.05]"
                >
                  {/* Business Info */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h2 className="truncate text-lg font-bold">
                        {business.name}
                      </h2>

                      <p className="mt-2 truncate text-sm text-white/40">
                        {business.location}
                      </p>

                      <span className="mt-3 inline-block rounded-full border border-white/10 px-3 py-1 text-xs text-white/50">
                        {business.business_type || "Other"}
                      </span>
                    </div>

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10 text-xs font-bold text-blue-400">
                      QR
                    </div>
                  </div>

                  {/* QR Code */}
                  <div className="my-6 flex justify-center">
                    <div
                      ref={(element) => {
                        qrRefs.current[business.id] = element;
                      }}
                      className="rounded-2xl bg-white p-4"
                    >
                      <QRCodeCanvas
                        value={reviewUrl}
                        size={220}
                        level="H"
                        includeMargin={true}
                      />
                    </div>
                  </div>

                  {/* URL */}
                  <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                    <p className="text-xs text-white/30">
                      REVIEW PAGE
                    </p>

                    <p className="mt-1 truncate text-xs text-white/60">
                      {reviewUrl}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        copyReviewLink(
                          business.slug,
                          business.name
                        )
                      }
                      className="rounded-xl border border-white/10 px-4 py-3 text-sm font-medium text-white/70 transition hover:border-blue-500/40 hover:text-white"
                    >
                      Copy Link
                    </button>

                    <a
                      href={`/r/${business.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-xl border border-white/10 px-4 py-3 text-center text-sm font-medium text-white/70 transition hover:border-blue-500/40 hover:text-white"
                    >
                      Open Page
                    </a>
                  </div>

                  <button
                    type="button"
                    onClick={() => downloadQR(business)}
                    className="mt-3 w-full rounded-xl bg-blue-500 px-4 py-3 text-sm font-semibold transition hover:bg-blue-400"
                  >
                    Download QR PNG
                  </button>
                </div>
              );
            })}
          </section>
        )}
      </div>
    </main>
  );
}