"use client";

import { useState, type FormEvent } from "react";
import { supabase } from "@/lib/supabase";

const businessTypes = [
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

const themes = [
  { value: "professional", label: "Modern Professional" },
  { value: "warm", label: "Warm & Elegant" },
  { value: "minimal", label: "Minimal Clean" },
  { value: "luxury", label: "Dark Luxury" },
  { value: "nature", label: "Nature Green" },
  { value: "gradient", label: "Gradient Modern" },
  { value: "glass", label: "Glassmorphism" },
  { value: "vibrant", label: "Bold & Vibrant" },
  { value: "pastel", label: "Soft Pastel" },
  { value: "classic", label: "Classic Elegant" },
];

function createSlug(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function AddBusinessPage() {
  const [businessName, setBusinessName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [location, setLocation] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [logoUrl, setLogoUrl] = useState("");

  const [businessType, setBusinessType] =
    useState("Restaurant");

  const [theme, setTheme] =
    useState("professional");

  const [googleReviewUrl, setGoogleReviewUrl] =
    useState("");

  const [mapsUrl, setMapsUrl] = useState("");

  const [instagramUrl, setInstagramUrl] =
    useState("");

  const [facebookUrl, setFacebookUrl] =
    useState("");

  const [tiktokUrl, setTiktokUrl] =
    useState("");

  const [menuUrl, setMenuUrl] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const slug = createSlug(businessName);

  async function createBusiness(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setMessage("");

    if (!businessName.trim()) {
      setMessage("Please enter a business name.");
      return;
    }

    if (!location.trim()) {
      setMessage("Please enter the location.");
      return;
    }

    if (!whatsapp.trim()) {
      setMessage("Please enter a WhatsApp number.");
      return;
    }

    if (!slug) {
      setMessage("Please enter a valid business name.");
      return;
    }

    setLoading(true);

    const { error } = await supabase
      .from("businesses")
      .insert({
        name: businessName.trim(),
        owner_name: ownerName.trim() || null,
        slug,
        location: location.trim(),
        whatsapp: whatsapp.trim(),
        logo_url: logoUrl.trim() || null,
        google_review_url:
          googleReviewUrl.trim() || null,
        maps_url: mapsUrl.trim() || null,
        instagram_url:
          instagramUrl.trim() || null,
        facebook_url:
          facebookUrl.trim() || null,
        tiktok_url: tiktokUrl.trim() || null,
        menu_url: menuUrl.trim() || null,
        business_type: businessType,
        theme,
      });

    if (error) {
      setMessage(`Error: ${error.message}`);
      setLoading(false);
      return;
    }

    setMessage(
      `Business created successfully! Review page: /r/${slug}`
    );

    setBusinessName("");
    setOwnerName("");
    setLocation("");
    setWhatsapp("");
    setLogoUrl("");
    setBusinessType("Restaurant");
    setTheme("professional");
    setGoogleReviewUrl("");
    setMapsUrl("");
    setInstagramUrl("");
    setFacebookUrl("");
    setTiktokUrl("");
    setMenuUrl("");

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-[#09090b] text-white">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-10">
          <p className="text-xs font-semibold tracking-[0.2em] text-blue-400">
            BUSINESS MANAGEMENT
          </p>

          <h1 className="mt-2 text-4xl font-semibold tracking-tight">
            Add Business
          </h1>

          <p className="mt-3 text-sm text-zinc-500">
            Create a new business profile for your QR
            review platform.
          </p>
        </div>

        {message && (
          <div
            className={`mb-6 rounded-xl border px-5 py-4 text-sm ${
              message.startsWith("Error")
                ? "border-red-500/30 bg-red-500/10 text-red-300"
                : "border-blue-500/30 bg-blue-500/10 text-blue-300"
            }`}
          >
            {message}
          </div>
        )}

        <form
          onSubmit={createBusiness}
          className="overflow-hidden rounded-2xl border border-zinc-800 bg-[#111113]"
        >
          {/* BASIC INFORMATION */}

          <div className="border-b border-zinc-800 px-6 py-5">
            <h2 className="font-semibold">
              Basic Information
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              Required information about the business.
            </p>
          </div>

          <div className="grid gap-5 p-6 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-zinc-300">
                Business Name
                <span className="ml-1 text-blue-400">*</span>
              </label>

              <input
                required
                value={businessName}
                onChange={(event) =>
                  setBusinessName(event.target.value)
                }
                placeholder="Example: Himalayan Hotel"
                className="w-full rounded-xl border border-zinc-700 bg-[#09090b] px-4 py-3 text-sm outline-none placeholder:text-zinc-600 focus:border-blue-500"
              />

              {slug && (
                <p className="mt-2 text-xs text-zinc-500">
                  Business URL:{" "}
                  <span className="text-blue-400">
                    /r/{slug}
                  </span>
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">
                Business Owner Name
              </label>

              <input
                value={ownerName}
                onChange={(event) =>
                  setOwnerName(event.target.value)
                }
                placeholder="Example: Nisha"
                className="w-full rounded-xl border border-zinc-700 bg-[#09090b] px-4 py-3 text-sm outline-none placeholder:text-zinc-600 focus:border-blue-500"
              />

              <p className="mt-2 text-xs text-zinc-500">
                Optional. This can be displayed on the review page.
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">
                Business Type
              </label>

              <select
                value={businessType}
                onChange={(event) =>
                  setBusinessType(event.target.value)
                }
                className="w-full rounded-xl border border-zinc-700 bg-[#09090b] px-4 py-3 text-sm outline-none focus:border-blue-500"
              >
                {businessTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">
                Review Page Theme
              </label>

              <select
                value={theme}
                onChange={(event) =>
                  setTheme(event.target.value)
                }
                className="w-full rounded-xl border border-blue-500/40 bg-[#09090b] px-4 py-3 text-sm outline-none focus:border-blue-400"
              >
                {themes.map((item) => (
                  <option
                    key={item.value}
                    value={item.value}
                  >
                    {item.label}
                  </option>
                ))}
              </select>

              <p className="mt-2 text-xs text-zinc-500">
                Choose how this business review page looks.
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">
                Location
                <span className="ml-1 text-blue-400">*</span>
              </label>

              <input
                required
                value={location}
                onChange={(event) =>
                  setLocation(event.target.value)
                }
                placeholder="Pokhara, Nepal"
                className="w-full rounded-xl border border-zinc-700 bg-[#09090b] px-4 py-3 text-sm outline-none placeholder:text-zinc-600 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">
                WhatsApp Number
                <span className="ml-1 text-blue-400">*</span>
              </label>

              <input
                required
                value={whatsapp}
                onChange={(event) =>
                  setWhatsapp(event.target.value)
                }
                placeholder="9779800000000"
                className="w-full rounded-xl border border-zinc-700 bg-[#09090b] px-4 py-3 text-sm outline-none placeholder:text-zinc-600 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">
                Business Logo / Image URL
              </label>

              <input
                value={logoUrl}
                onChange={(event) =>
                  setLogoUrl(event.target.value)
                }
                placeholder="https://example.com/logo.png"
                className="w-full rounded-xl border border-zinc-700 bg-[#09090b] px-4 py-3 text-sm outline-none placeholder:text-zinc-600 focus:border-blue-500"
              />

              <p className="mt-2 text-xs text-zinc-500">
                Optional: paste a direct link to the business logo.
              </p>
            </div>
          </div>

          {/* GOOGLE & BUSINESS LINKS */}

          <div className="border-y border-zinc-800 px-6 py-5">
            <h2 className="font-semibold">
              Google & Business Links
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              These links are optional.
            </p>
          </div>

          <div className="grid gap-5 p-6 md:grid-cols-2">
            <InputField
              label="Google Review Link"
              value={googleReviewUrl}
              setValue={setGoogleReviewUrl}
              placeholder="https://g.page/..."
            />

            <InputField
              label="Google Maps Link"
              value={mapsUrl}
              setValue={setMapsUrl}
              placeholder="https://maps.google.com/..."
            />

            <InputField
              label="Menu Link"
              value={menuUrl}
              setValue={setMenuUrl}
              placeholder="https://..."
            />
          </div>

          {/* SOCIAL MEDIA */}

          <div className="border-y border-zinc-800 px-6 py-5">
            <h2 className="font-semibold">
              Social Media
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              Add only the social accounts the business uses.
            </p>
          </div>

          <div className="grid gap-5 p-6 md:grid-cols-2">
            <InputField
              label="Instagram"
              value={instagramUrl}
              setValue={setInstagramUrl}
              placeholder="https://instagram.com/..."
            />

            <InputField
              label="Facebook"
              value={facebookUrl}
              setValue={setFacebookUrl}
              placeholder="https://facebook.com/..."
            />

            <InputField
              label="TikTok"
              value={tiktokUrl}
              setValue={setTiktokUrl}
              placeholder="https://tiktok.com/@..."
            />
          </div>

          {/* BUTTONS */}

          <div className="flex flex-col gap-3 border-t border-zinc-800 px-6 py-5 sm:flex-row sm:justify-end">
            <a
              href="/admin"
              className="rounded-xl border border-zinc-700 px-6 py-3 text-center text-sm font-medium text-zinc-300 transition hover:bg-zinc-900"
            >
              Cancel
            </a>

            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-blue-500 px-7 py-3 text-sm font-semibold text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Creating Business..."
                : "Create Business"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

function InputField({
  label,
  value,
  setValue,
  placeholder,
}: {
  label: string;
  value: string;
  setValue: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-zinc-300">
        {label}
      </label>

      <input
        value={value}
        onChange={(event) =>
          setValue(event.target.value)
        }
        placeholder={placeholder}
        className="w-full rounded-xl border border-zinc-700 bg-[#09090b] px-4 py-3 text-sm outline-none placeholder:text-zinc-600 focus:border-blue-500"
      />
    </div>
  );
}