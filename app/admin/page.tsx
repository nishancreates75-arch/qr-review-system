"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminPage() {
  const [businessName, setBusinessName] = useState("");
  const [location, setLocation] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [googleReviewUrl, setGoogleReviewUrl] = useState("");
  const [mapsUrl, setMapsUrl] = useState("");

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  async function createBusiness(event: React.FormEvent) {
    event.preventDefault();

    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    const slug = businessName
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const { error } = await supabase.from("businesses").insert({
      name: businessName,
      slug,
      location,
      whatsapp,
      google_review_url: googleReviewUrl || null,
      maps_url: mapsUrl || null,
    });

    setLoading(false);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    setSuccessMessage(
      `Business created successfully! Review page: /r/${slug}`
    );

    setBusinessName("");
    setLocation("");
    setWhatsapp("");
    setGoogleReviewUrl("");
    setMapsUrl("");
  }

  return (
    <main className="min-h-screen bg-black p-6 text-white">
      <div className="mx-auto max-w-xl">
        <h1 className="text-3xl font-bold">Add New Business</h1>

        <p className="mt-2 text-white/60">
          Add a business without manually editing the code.
        </p>

        <form
          onSubmit={createBusiness}
          className="mt-8 space-y-5 rounded-3xl border border-white/10 bg-white/5 p-6"
        >
          <div>
            <label className="mb-2 block text-sm">Business Name</label>

            <input
              required
              value={businessName}
              onChange={(event) => setBusinessName(event.target.value)}
              placeholder="Example: Sharma Kirana Store"
              className="w-full rounded-xl border border-white/20 bg-black/30 p-3 outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm">Location</label>

            <input
              required
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              placeholder="Example: Kathmandu, Nepal"
              className="w-full rounded-xl border border-white/20 bg-black/30 p-3 outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm">WhatsApp Number</label>

            <input
              required
              value={whatsapp}
              onChange={(event) => setWhatsapp(event.target.value)}
              placeholder="9779800000000"
              className="w-full rounded-xl border border-white/20 bg-black/30 p-3 outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm">
              Google Review Link
            </label>

            <input
              value={googleReviewUrl}
              onChange={(event) =>
                setGoogleReviewUrl(event.target.value)
              }
              placeholder="Paste Google review link"
              className="w-full rounded-xl border border-white/20 bg-black/30 p-3 outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm">
              Google Maps Link
            </label>

            <input
              value={mapsUrl}
              onChange={(event) => setMapsUrl(event.target.value)}
              placeholder="Paste Google Maps link"
              className="w-full rounded-xl border border-white/20 bg-black/30 p-3 outline-none focus:border-cyan-400"
            />
          </div>

          {successMessage && (
            <div className="rounded-xl border border-green-400/30 bg-green-400/10 p-3 text-sm text-green-300">
              {successMessage}
            </div>
          )}

          {errorMessage && (
            <div className="rounded-xl border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-300">
              Error: {errorMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-cyan-400 to-blue-600 p-4 font-bold disabled:opacity-50"
          >
            {loading ? "CREATING..." : "CREATE BUSINESS"}
          </button>
        </form>
      </div>
    </main>
  );
}