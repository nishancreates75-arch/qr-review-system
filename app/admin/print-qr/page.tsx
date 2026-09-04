"use client";

import { useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { supabase } from "@/lib/supabase";

type Business = {
  id: string;
  name: string;
  slug: string;
  location: string;
  business_type: string | null;
};

export default function PrintQRPage() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [selectedBusiness, setSelectedBusiness] =
    useState<Business | null>(null);

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadBusinesses();
  }, []);

  async function loadBusinesses() {
    setLoading(true);

    const { data, error } = await supabase
      .from("businesses")
      .select("id, name, slug, location, business_type")
      .order("name", { ascending: true });

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    const loadedBusinesses = (data || []) as Business[];

    setBusinesses(loadedBusinesses);

    if (loadedBusinesses.length > 0) {
      setSelectedBusiness(loadedBusinesses[0]);
    }

    setLoading(false);
  }

  const filteredBusinesses = businesses.filter((business) => {
    const searchText = search.toLowerCase();

    return (
      business.name.toLowerCase().includes(searchText) ||
      business.location.toLowerCase().includes(searchText)
    );
  });

  function getReviewUrl(slug: string) {
    if (typeof window === "undefined") {
      return "";
    }

    return `${window.location.origin}/r/${slug}`;
  }

  function printCard() {
    window.print();
  }

  return (
    <>
      <main className="min-h-screen bg-[#09090f] text-white print:bg-white">
        <div className="mx-auto max-w-7xl px-6 py-8 md:px-10 print:hidden">
          <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-bold tracking-[0.3em] text-blue-400">
                PRINT CENTER
              </p>

              <h1 className="mt-2 text-3xl font-bold tracking-tight">
                Print QR Cards
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-white/40">
                Create professional QR cards for your businesses.
                Customers can scan the QR code and leave a review.
              </p>
            </div>

            <button
              type="button"
              onClick={printCard}
              disabled={!selectedBusiness}
              className="rounded-xl bg-blue-500 px-6 py-3 font-semibold transition hover:bg-blue-400 disabled:opacity-50"
            >
              Print QR Card
            </button>
          </div>

          {loading ? (
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-12 text-center text-white/40">
              Loading businesses...
            </div>
          ) : (
            <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
              {/* Business Selector */}
              <section className="rounded-2xl border border-white/10 bg-white/[0.03]">
                <div className="border-b border-white/10 p-6">
                  <h2 className="font-bold">
                    Select Business
                  </h2>

                  <p className="mt-2 text-sm text-white/40">
                    Choose the business for the QR card.
                  </p>

                  <input
                    value={search}
                    onChange={(event) =>
                      setSearch(event.target.value)
                    }
                    placeholder="Search businesses..."
                    className="mt-5 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none placeholder:text-white/25 focus:border-blue-500"
                  />
                </div>

                <div className="max-h-[550px] overflow-y-auto">
                  {filteredBusinesses.map((business) => (
                    <button
                      key={business.id}
                      type="button"
                      onClick={() =>
                        setSelectedBusiness(business)
                      }
                      className={`w-full border-b border-white/10 p-5 text-left transition ${
                        selectedBusiness?.id === business.id
                          ? "bg-blue-500/10"
                          : "hover:bg-white/[0.03]"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <h3 className="font-semibold">
                            {business.name}
                          </h3>

                          <p className="mt-1 text-sm text-white/40">
                            {business.location}
                          </p>
                        </div>

                        <span className="text-xs text-blue-400">
                          Select
                        </span>
                      </div>
                    </button>
                  ))}

                  {filteredBusinesses.length === 0 && (
                    <div className="p-8 text-center text-sm text-white/40">
                      No businesses found.
                    </div>
                  )}
                </div>
              </section>

              {/* Preview */}
              <section className="flex items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] p-8">
                {selectedBusiness ? (
                  <QRCard
                    business={selectedBusiness}
                    reviewUrl={getReviewUrl(
                      selectedBusiness.slug
                    )}
                  />
                ) : (
                  <p className="text-white/40">
                    Select a business to preview the QR card.
                  </p>
                )}
              </section>
            </div>
          )}
        </div>

        {/* PRINT CARD */}
        {selectedBusiness && (
          <div className="hidden print:flex print:min-h-screen print:items-center print:justify-center">
            <QRCard
              business={selectedBusiness}
              reviewUrl={getReviewUrl(
                selectedBusiness.slug
              )}
            />
          </div>
        )}
      </main>

      <style jsx global>{`
        @media print {
          body {
            background: white !important;
          }

          @page {
            size: auto;
            margin: 15mm;
          }
        }
      `}</style>
    </>
  );
}

function QRCard({
  business,
  reviewUrl,
}: {
  business: Business;
  reviewUrl: string;
}) {
  return (
    <div className="w-full max-w-md rounded-[32px] bg-white p-8 text-center text-[#111] shadow-2xl print:w-[380px] print:shadow-none">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-xl font-bold text-white">
        QR
      </div>

      <p className="mt-6 text-xs font-bold tracking-[0.25em] text-blue-600">
        WE VALUE YOUR FEEDBACK
      </p>

      <h1 className="mt-3 text-3xl font-bold">
        {business.name}
      </h1>

      <p className="mt-2 text-sm text-gray-500">
        {business.location}
      </p>

      <div className="my-8 flex justify-center">
        <div className="rounded-2xl border-2 border-gray-100 p-4">
          <QRCodeCanvas
            value={reviewUrl}
            size={240}
            level="H"
            includeMargin={true}
          />
        </div>
      </div>

      <h2 className="text-xl font-bold">
        Scan & Review Us
      </h2>

      <p className="mx-auto mt-3 max-w-xs text-sm leading-6 text-gray-500">
        Scan this QR code with your phone and share your experience with us.
      </p>

      <div className="mt-8 rounded-2xl bg-gray-100 px-5 py-4">
        <p className="text-xs font-medium text-gray-500">
          THANK YOU FOR YOUR SUPPORT
        </p>
      </div>
    </div>
  );
}