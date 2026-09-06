"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

type Business = {
  id: string;
  name: string;
  owner_name: string | null;
  slug: string;
  location: string;
  whatsapp: string | null;
  google_review_url: string | null;
  maps_url: string | null;
  instagram_url: string | null;
  facebook_url: string | null;
  tiktok_url: string | null;
  menu_url: string | null;
  business_type: string | null;
  theme: string | null;
  logo_url: string | null;
  created_at: string;
};

const businessTypes = [
  "Restaurant",
  "Cafe",
  "Hotel",
  "Lodge",
  "Salon",
  "Spa",
  "Travel",
  "Shop",
  "Kirana",
  "Pharmacy",
  "Clinic",
  "Other",
];

const themes = [
  "professional",
  "luxury",
  "minimal",
  "warm",
  "futuristic",
  "nature",
  "elegant",
  "modern",
  "dark",
  "colorful",
];

export default function BusinessesPage() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [editingBusiness, setEditingBusiness] =
    useState<Business | null>(null);

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function loadBusinesses() {
    setLoading(true);
    setMessage("");

    const { data, error } = await supabase
      .from("businesses")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("LOAD BUSINESSES ERROR:", error);

      const errorMessage =
        error.message ||
        error.details ||
        error.hint ||
        "Unable to load businesses.";

      setMessage(`Error loading businesses: ${errorMessage}`);
      setLoading(false);
      return;
    }

    setBusinesses((data || []) as Business[]);
    setLoading(false);
  }

  useEffect(() => {
    loadBusinesses();
  }, []);

  const filteredBusinesses = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return businesses;
    }

    return businesses.filter((business) => {
      return (
        business.name?.toLowerCase().includes(query) ||
        business.owner_name?.toLowerCase().includes(query) ||
        business.location?.toLowerCase().includes(query) ||
        business.business_type?.toLowerCase().includes(query) ||
        business.slug?.toLowerCase().includes(query)
      );
    });
  }, [businesses, search]);

  function openEdit(business: Business) {
    setMessage("");
    setEditingBusiness({
      ...business,
    });
  }

  function closeEdit() {
    if (saving) return;

    setEditingBusiness(null);
    setMessage("");
  }

  async function saveBusiness() {
    if (!editingBusiness) return;

    const name = editingBusiness.name?.trim();
    const location = editingBusiness.location?.trim();

    if (!name) {
      setMessage("Business name is required.");
      return;
    }

    if (!location) {
      setMessage("Location is required.");
      return;
    }

    setSaving(true);
    setMessage("");

    const updateData = {
      name,

      owner_name:
        editingBusiness.owner_name?.trim() || null,

      location,

      whatsapp:
        editingBusiness.whatsapp?.trim() || null,

      google_review_url:
        editingBusiness.google_review_url?.trim() || null,

      maps_url:
        editingBusiness.maps_url?.trim() || null,

      instagram_url:
        editingBusiness.instagram_url?.trim() || null,

      facebook_url:
        editingBusiness.facebook_url?.trim() || null,

      tiktok_url:
        editingBusiness.tiktok_url?.trim() || null,

      menu_url:
        editingBusiness.menu_url?.trim() || null,

      business_type:
        editingBusiness.business_type || "Other",

      theme:
        editingBusiness.theme || "professional",

      logo_url:
        editingBusiness.logo_url?.trim() || null,
    };

    console.log("UPDATING BUSINESS:", {
      id: editingBusiness.id,
      data: updateData,
    });

    /*
     * IMPORTANT:
     *
     * Do NOT use:
     *
     * .select()
     * .single()
     *
     * here.
     *
     * The previous version failed with:
     *
     * PGRST116
     * "The result contains 0 rows"
     *
     * The dashboard only needs to perform the update.
     * After that, we reload the businesses from Supabase.
     */

    const { error } = await supabase
      .from("businesses")
      .update(updateData)
      .eq("id", editingBusiness.id);

    if (error) {
      const errorMessage =
        error.message ||
        error.details ||
        error.hint ||
        "Unknown Supabase error";

      const errorCode =
        error.code || "NO_CODE";

      console.error(
        "UPDATE BUSINESS FAILED",
        errorMessage,
        errorCode,
        error.details,
        error.hint
      );

      setMessage(
        `Update failed [${errorCode}]: ${errorMessage}`
      );

      setSaving(false);
      return;
    }

    console.log("BUSINESS UPDATED SUCCESSFULLY");

    setMessage("Business updated successfully.");

    setEditingBusiness(null);

    await loadBusinesses();

    setSaving(false);
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-slate-400">
                Admin Dashboard
              </p>

              <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                Businesses
              </h1>

              <p className="mt-2 max-w-2xl text-sm text-slate-400">
                Manage business profiles, review links, branding,
                themes, and QR review settings.
              </p>
            </div>

            <a
              href="/admin/add-business"
              className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
            >
              + Add Business
            </a>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="flex-1">
              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search by business, owner, location, type, or slug..."
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-slate-500"
              />
            </div>

            <div className="text-sm text-slate-400">
              {filteredBusinesses.length} business
              {filteredBusinesses.length === 1 ? "" : "es"}
            </div>
          </div>
        </div>

        {/* Messages */}
        {message && (
          <div
            className={`mb-6 rounded-xl border px-4 py-3 text-sm ${
              message.toLowerCase().includes("success")
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                : "border-red-500/30 bg-red-500/10 text-red-300"
            }`}
          >
            {message}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-10 text-center text-sm text-slate-400">
            Loading businesses...
          </div>
        )}

        {/* Empty state */}
        {!loading && filteredBusinesses.length === 0 && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-10 text-center">
            <h2 className="text-lg font-semibold">
              No businesses found
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              {search
                ? "Try a different search."
                : "Add your first business to get started."}
            </p>

            {!search && (
              <a
                href="/admin/add-business"
                className="mt-5 inline-flex rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-slate-200"
              >
                Add Business
              </a>
            )}
          </div>
        )}

        {/* Business list */}
        {!loading && filteredBusinesses.length > 0 && (
          <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left">
                <thead className="border-b border-slate-800 bg-slate-950/60">
                  <tr>
                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Business
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Owner
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Location
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Type
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Theme
                    </th>

                    <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-800">
                  {filteredBusinesses.map((business) => (
                    <tr
                      key={business.id}
                      className="transition hover:bg-slate-800/30"
                    >
                      <td className="px-5 py-5">
                        <div className="flex items-center gap-3">
                          {business.logo_url ? (
                            <img
                              src={business.logo_url}
                              alt={business.name}
                              className="h-11 w-11 rounded-xl object-cover"
                            />
                          ) : (
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-800 text-lg font-bold text-slate-300">
                              {business.name
                                ?.charAt(0)
                                ?.toUpperCase() || "B"}
                            </div>
                          )}

                          <div className="min-w-0">
                            <div className="font-semibold text-white">
                              {business.name}
                            </div>

                            <div className="mt-1 text-xs text-slate-500">
                              /{business.slug}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-5 text-sm text-slate-300">
                        {business.owner_name || "—"}
                      </td>

                      <td className="px-5 py-5 text-sm text-slate-300">
                        {business.location || "—"}
                      </td>

                      <td className="px-5 py-5">
                        <span className="rounded-full border border-slate-700 bg-slate-950 px-3 py-1 text-xs text-slate-300">
                          {business.business_type || "Other"}
                        </span>
                      </td>

                      <td className="px-5 py-5">
                        <span className="text-sm capitalize text-slate-300">
                          {business.theme || "professional"}
                        </span>
                      </td>

                      <td className="px-5 py-5">
                        <div className="flex justify-end gap-2">
                          <a
                            href={`/r/${business.slug}`}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-lg border border-slate-700 px-3 py-2 text-xs font-medium text-slate-300 transition hover:bg-slate-800"
                          >
                            View
                          </a>

                          <a
                            href={`/qr/${business.slug}`}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-lg border border-slate-700 px-3 py-2 text-xs font-medium text-slate-300 transition hover:bg-slate-800"
                          >
                            QR
                          </a>

                          <button
                            type="button"
                            onClick={() =>
                              openEdit(business)
                            }
                            className="rounded-lg bg-white px-3 py-2 text-xs font-semibold text-slate-950 transition hover:bg-slate-200"
                          >
                            Edit
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingBusiness && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-slate-800 bg-slate-950 shadow-2xl">
            {/* Modal header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-800 bg-slate-950 px-6 py-5">
              <div>
                <h2 className="text-xl font-bold">
                  Edit Business
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Update business information and review settings.
                </p>
              </div>

              <button
                type="button"
                onClick={closeEdit}
                disabled={saving}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-800 text-slate-400 transition hover:bg-slate-900 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                ×
              </button>
            </div>

            <div className="space-y-7 p-6">
              {/* Basic information */}
              <section>
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-400">
                  Basic Information
                </h3>

                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      Business Name
                    </label>

                    <input
                      type="text"
                      value={editingBusiness.name || ""}
                      onChange={(event) =>
                        setEditingBusiness({
                          ...editingBusiness,
                          name: event.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-slate-500"
                      placeholder="Business name"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      Owner Name
                    </label>

                    <input
                      type="text"
                      value={
                        editingBusiness.owner_name || ""
                      }
                      onChange={(event) =>
                        setEditingBusiness({
                          ...editingBusiness,
                          owner_name:
                            event.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-slate-500"
                      placeholder="Owner name"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      Location
                    </label>

                    <input
                      type="text"
                      value={
                        editingBusiness.location || ""
                      }
                      onChange={(event) =>
                        setEditingBusiness({
                          ...editingBusiness,
                          location:
                            event.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-slate-500"
                      placeholder="Kathmandu, Nepal"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      WhatsApp
                    </label>

                    <input
                      type="text"
                      value={
                        editingBusiness.whatsapp || ""
                      }
                      onChange={(event) =>
                        setEditingBusiness({
                          ...editingBusiness,
                          whatsapp:
                            event.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-slate-500"
                      placeholder="97798XXXXXXXX"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      Business Type
                    </label>

                    <select
                      value={
                        editingBusiness.business_type ||
                        "Other"
                      }
                      onChange={(event) =>
                        setEditingBusiness({
                          ...editingBusiness,
                          business_type:
                            event.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none focus:border-slate-500"
                    >
                      {businessTypes.map((type) => (
                        <option
                          key={type}
                          value={type}
                        >
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      Theme
                    </label>

                    <select
                      value={
                        editingBusiness.theme ||
                        "professional"
                      }
                      onChange={(event) =>
                        setEditingBusiness({
                          ...editingBusiness,
                          theme:
                            event.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none focus:border-slate-500"
                    >
                      {themes.map((theme) => (
                        <option
                          key={theme}
                          value={theme}
                        >
                          {theme.charAt(0).toUpperCase() +
                            theme.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </section>

              {/* Branding */}
              <section>
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-400">
                  Branding
                </h3>

                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Logo URL
                </label>

                <input
                  type="url"
                  value={
                    editingBusiness.logo_url || ""
                  }
                  onChange={(event) =>
                    setEditingBusiness({
                      ...editingBusiness,
                      logo_url: event.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-slate-500"
                  placeholder="https://example.com/logo.png"
                />
              </section>

              {/* Review */}
              <section>
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-400">
                  Review & Google
                </h3>

                <div className="space-y-5">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      Google Review URL
                    </label>

                    <input
                      type="url"
                      value={
                        editingBusiness.google_review_url ||
                        ""
                      }
                      onChange={(event) =>
                        setEditingBusiness({
                          ...editingBusiness,
                          google_review_url:
                            event.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-slate-500"
                      placeholder="https://g.page/r/..."
                    />

                    <p className="mt-2 text-xs text-slate-500">
                      This link is used by the Google review
                      button on the customer review page.
                    </p>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      Google Maps URL
                    </label>

                    <input
                      type="url"
                      value={
                        editingBusiness.maps_url || ""
                      }
                      onChange={(event) =>
                        setEditingBusiness({
                          ...editingBusiness,
                          maps_url: event.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-slate-500"
                      placeholder="https://maps.google.com/..."
                    />
                  </div>
                </div>
              </section>

              {/* Social */}
              <section>
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-400">
                  Social & Links
                </h3>

                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      Instagram URL
                    </label>

                    <input
                      type="url"
                      value={
                        editingBusiness.instagram_url ||
                        ""
                      }
                      onChange={(event) =>
                        setEditingBusiness({
                          ...editingBusiness,
                          instagram_url:
                            event.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-slate-500"
                      placeholder="https://instagram.com/..."
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      Facebook URL
                    </label>

                    <input
                      type="url"
                      value={
                        editingBusiness.facebook_url ||
                        ""
                      }
                      onChange={(event) =>
                        setEditingBusiness({
                          ...editingBusiness,
                          facebook_url:
                            event.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500"
                      placeholder="https://facebook.com/..."
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      TikTok URL
                    </label>

                    <input
                      type="url"
                      value={
                        editingBusiness.tiktok_url ||
                        ""
                      }
                      onChange={(event) =>
                        setEditingBusiness({
                          ...editingBusiness,
                          tiktok_url:
                            event.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500"
                      placeholder="https://tiktok.com/@..."
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      Menu URL
                    </label>

                    <input
                      type="url"
                      value={
                        editingBusiness.menu_url || ""
                      }
                      onChange={(event) =>
                        setEditingBusiness({
                          ...editingBusiness,
                          menu_url:
                            event.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500"
                      placeholder="https://example.com/menu"
                    />
                  </div>
                </div>
              </section>

              {/* Slug */}
              <section>
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-400">
                  System Information
                </h3>

                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                  <div className="text-xs uppercase tracking-wider text-slate-500">
                    Slug
                  </div>

                  <div className="mt-1 font-mono text-sm text-slate-300">
                    {editingBusiness.slug}
                  </div>

                  <p className="mt-2 text-xs text-slate-500">
                    The slug is not changed during editing so
                    existing QR codes and review URLs remain
                    stable.
                  </p>
                </div>
              </section>
            </div>

            {/* Modal footer */}
            <div className="sticky bottom-0 flex flex-col-reverse gap-3 border-t border-slate-800 bg-slate-950 px-6 py-5 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeEdit}
                disabled={saving}
                className="rounded-xl border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={saveBusiness}
                disabled={saving}
                className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving
                  ? "Saving..."
                  : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}