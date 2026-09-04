"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Business = {
  id: string;
  name: string;
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
  created_at?: string;
};

const businessTypes = [
  "All",
  "Restaurant",
  "Hotel",
  "Lodge / Inn",
  "Cafe",
  "Kirana Pasal",
  "Travel Agency",
  "Shop",
  "Salon",
  "Pharmacy",
  "Clinic",
  "Other",
];

export default function BusinessesPage() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [message, setMessage] = useState("");
  const [editingBusiness, setEditingBusiness] =
    useState<Business | null>(null);
  const [saving, setSaving] = useState(false);

  async function loadBusinesses() {
    setLoading(true);
    setMessage("");

    const { data, error } = await supabase
      .from("businesses")
      .select("*")
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

  const filteredBusinesses = useMemo(() => {
    return businesses.filter((business) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        business.name.toLowerCase().includes(searchText) ||
        business.location.toLowerCase().includes(searchText) ||
        (business.business_type || "")
          .toLowerCase()
          .includes(searchText);

      const matchesType =
        typeFilter === "All" ||
        business.business_type === typeFilter;

      return matchesSearch && matchesType;
    });
  }, [businesses, search, typeFilter]);

  async function deleteBusiness(business: Business) {
    const confirmed = window.confirm(
      `Delete "${business.name}"? This cannot be undone.`
    );

    if (!confirmed) return;

    setMessage("");

    const { error } = await supabase
      .from("businesses")
      .delete()
      .eq("id", business.id);

    if (error) {
      console.error(error);
      setMessage(`Error deleting business: ${error.message}`);
      return;
    }

    setBusinesses((currentBusinesses) =>
      currentBusinesses.filter((item) => item.id !== business.id)
    );

    setMessage(`${business.name} was deleted successfully.`);
  }

  async function saveBusiness(event: React.FormEvent) {
    event.preventDefault();

    if (!editingBusiness) return;

    setSaving(true);
    setMessage("");

    const { error } = await supabase
      .from("businesses")
      .update({
        name: editingBusiness.name.trim(),
        location: editingBusiness.location.trim(),
        whatsapp: editingBusiness.whatsapp || null,
        google_review_url:
          editingBusiness.google_review_url || null,
        maps_url: editingBusiness.maps_url || null,
        instagram_url:
          editingBusiness.instagram_url || null,
        facebook_url:
          editingBusiness.facebook_url || null,
        tiktok_url: editingBusiness.tiktok_url || null,
        menu_url: editingBusiness.menu_url || null,
        business_type:
          editingBusiness.business_type || "Other",
        theme: editingBusiness.theme || "professional",
        logo_url: editingBusiness.logo_url || null,
      })
      .eq("id", editingBusiness.id);

    if (error) {
      console.error(error);
      setMessage(`Error updating business: ${error.message}`);
      setSaving(false);
      return;
    }

    setMessage(
      `${editingBusiness.name} was updated successfully.`
    );

    setEditingBusiness(null);
    setSaving(false);

    await loadBusinesses();
  }

  return (
    <main className="min-h-screen bg-[#09090f] text-white">
      <div className="mx-auto max-w-7xl px-6 py-8 md:px-10">
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-bold tracking-[0.3em] text-blue-400">
              BUSINESS MANAGEMENT
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight">
              Businesses
            </h1>

            <p className="mt-2 text-sm text-white/40">
              Search, manage, edit, and organize your businesses.
            </p>
          </div>

          <Link
            href="/admin/add-business"
            className="inline-flex items-center justify-center rounded-xl bg-blue-500 px-5 py-3 text-sm font-semibold transition hover:bg-blue-400"
          >
            + Add Business
          </Link>
        </div>

        <section className="rounded-2xl border border-white/10 bg-white/[0.03]">
          <div className="border-b border-white/10 p-5 md:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="font-semibold">
                  Business Directory
                </h2>

                <p className="mt-1 text-sm text-white/40">
                  {filteredBusinesses.length} of {businesses.length}{" "}
                  businesses
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Search businesses..."
                  className="min-w-[220px] rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none transition placeholder:text-white/25 focus:border-blue-500"
                />

                <select
                  value={typeFilter}
                  onChange={(event) =>
                    setTypeFilter(event.target.value)
                  }
                  className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none transition focus:border-blue-500"
                >
                  {businessTypes.map((type) => (
                    <option
                      key={type}
                      value={type}
                      className="bg-[#11111a]"
                    >
                      {type === "All"
                        ? "All Business Types"
                        : type}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {message && (
            <div className="border-b border-white/10 px-6 py-4">
              <p className="text-sm text-blue-300">
                {message}
              </p>
            </div>
          )}

          {loading ? (
            <div className="p-12 text-center text-white/40">
              Loading businesses...
            </div>
          ) : filteredBusinesses.length === 0 ? (
            <div className="p-12 text-center">
              <h3 className="font-semibold">
                No businesses found
              </h3>

              <p className="mt-2 text-sm text-white/40">
                Try changing your search or filter.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-white/10">
              {filteredBusinesses.map((business) => (
                <div
                  key={business.id}
                  className="flex flex-col gap-5 p-5 transition hover:bg-white/[0.02] md:p-6 xl:flex-row xl:items-center xl:justify-between"
                >
                  <div className="flex min-w-0 items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10 text-lg font-bold text-blue-400">
                      {business.name.charAt(0).toUpperCase()}
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="truncate font-semibold">
                          {business.name}
                        </h3>

                        <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-white/50">
                          {business.business_type || "Other"}
                        </span>
                      </div>

                      <p className="mt-2 text-sm text-white/40">
                        {business.location}
                      </p>

                      <p className="mt-1 text-xs text-white/25">
                        /r/{business.slug}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 xl:justify-end">
                    <a
                      href={`/r/${business.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium text-white/70 transition hover:border-blue-500/40 hover:text-white"
                    >
                      Review Page
                    </a>

                    <a
                      href={`/qr/${business.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium text-white/70 transition hover:border-blue-500/40 hover:text-white"
                    >
                      QR Code
                    </a>

                    <button
                      type="button"
                      onClick={() =>
                        setEditingBusiness({ ...business })
                      }
                      className="rounded-xl border border-blue-500/30 bg-blue-500/10 px-4 py-2.5 text-sm font-medium text-blue-300 transition hover:bg-blue-500/20"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => deleteBusiness(business)}
                      className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-2.5 text-sm font-medium text-red-300 transition hover:bg-red-500/10"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {editingBusiness && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 p-4 backdrop-blur-sm">
          <div className="mx-auto my-8 w-full max-w-3xl rounded-2xl border border-white/10 bg-[#11111a] shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
              <div>
                <h2 className="text-xl font-semibold">
                  Edit Business
                </h2>

                <p className="mt-1 text-sm text-white/40">
                  Update business information.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setEditingBusiness(null)}
                className="rounded-lg px-3 py-2 text-sm text-white/50 transition hover:bg-white/5 hover:text-white"
              >
                Close
              </button>
            </div>

            <form
              onSubmit={saveBusiness}
              className="space-y-5 p-6"
            >
              <div className="grid gap-5 md:grid-cols-2">
                <FormInput
                  label="Business Name"
                  value={editingBusiness.name}
                  onChange={(value) =>
                    setEditingBusiness({
                      ...editingBusiness,
                      name: value,
                    })
                  }
                  required
                />

                <FormInput
                  label="Location"
                  value={editingBusiness.location}
                  onChange={(value) =>
                    setEditingBusiness({
                      ...editingBusiness,
                      location: value,
                    })
                  }
                  required
                />

                <FormInput
                  label="WhatsApp"
                  value={editingBusiness.whatsapp || ""}
                  onChange={(value) =>
                    setEditingBusiness({
                      ...editingBusiness,
                      whatsapp: value,
                    })
                  }
                />

                <div>
                  <label className="mb-2 block text-sm text-white/60">
                    Business Type
                  </label>

                  <select
                    value={
                      editingBusiness.business_type || "Other"
                    }
                    onChange={(event) =>
                      setEditingBusiness({
                        ...editingBusiness,
                        business_type: event.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none focus:border-blue-500"
                  >
                    {businessTypes
                      .filter((type) => type !== "All")
                      .map((type) => (
                        <option
                          key={type}
                          value={type}
                          className="bg-[#11111a]"
                        >
                          {type}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm text-white/60">
                    Review Page Theme
                  </label>

                  <select
                    value={
                      editingBusiness.theme || "professional"
                    }
                    onChange={(event) =>
                      setEditingBusiness({
                        ...editingBusiness,
                        theme: event.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none focus:border-blue-500"
                  >
                    <option value="professional">
                      Modern Professional
                    </option>
                    <option value="warm">
                      Warm & Elegant
                    </option>
                    <option value="minimal">
                      Minimal Clean
                    </option>
                    <option value="luxury">
                      Dark Luxury
                    </option>
                    <option value="nature">
                      Nature Green
                    </option>
                    <option value="gradient">
                      Gradient Modern
                    </option>
                    <option value="glass">
                      Glassmorphism
                    </option>
                    <option value="vibrant">
                      Bold & Vibrant
                    </option>
                    <option value="pastel">
                      Soft Pastel
                    </option>
                    <option value="classic">
                      Classic Elegant
                    </option>
                  </select>
                </div>
<FormInput
  label="Business Logo URL"
  value={editingBusiness.logo_url || ""}
  onChange={(value) =>
    setEditingBusiness({
      ...editingBusiness,
      logo_url: value,
    })
  }
/>
                <FormInput
                  label="Google Review URL"
                  value={
                    editingBusiness.google_review_url || ""
                  }
                  onChange={(value) =>
                    setEditingBusiness({
                      ...editingBusiness,
                      google_review_url: value,
                    })
                  }
                />

                <FormInput
                  label="Google Maps URL"
                  value={editingBusiness.maps_url || ""}
                  onChange={(value) =>
                    setEditingBusiness({
                      ...editingBusiness,
                      maps_url: value,
                    })
                  }
                />

                <FormInput
                  label="Instagram URL"
                  value={editingBusiness.instagram_url || ""}
                  onChange={(value) =>
                    setEditingBusiness({
                      ...editingBusiness,
                      instagram_url: value,
                    })
                  }
                />

                <FormInput
                  label="Facebook URL"
                  value={editingBusiness.facebook_url || ""}
                  onChange={(value) =>
                    setEditingBusiness({
                      ...editingBusiness,
                      facebook_url: value,
                    })
                  }
                />

                <FormInput
                  label="TikTok URL"
                  value={editingBusiness.tiktok_url || ""}
                  onChange={(value) =>
                    setEditingBusiness({
                      ...editingBusiness,
                      tiktok_url: value,
                    })
                  }
                />

                <FormInput
                  label="Menu URL"
                  value={editingBusiness.menu_url || ""}
                  onChange={(value) =>
                    setEditingBusiness({
                      ...editingBusiness,
                      menu_url: value,
                    })
                  }
                />
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-white/10 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setEditingBusiness(null)}
                  className="rounded-xl border border-white/10 px-5 py-3 text-sm font-medium text-white/60 transition hover:bg-white/5 hover:text-white"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-blue-500 px-6 py-3 text-sm font-semibold transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving
                    ? "Saving..."
                    : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

function FormInput({
  label,
  value,
  onChange,
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm text-white/60">
        {label}
      </label>

      <input
        required={required}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none transition placeholder:text-white/20 focus:border-blue-500"
      />
    </div>
  );
}