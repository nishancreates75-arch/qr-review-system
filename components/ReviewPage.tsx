"use client";

import { useState } from "react";
import AIReviewAssistant from "./AIReviewAssistant";

type Business = {
  name: string;
  ownerName?: string;
  businessType?: string;
  location: string;
  googleReviewUrl: string;
  phone: string;
  whatsapp: string;
  mapsUrl: string;
  instagramUrl: string;
  facebookUrl: string;
  tiktokUrl: string;
  menuUrl: string;
  theme: string;
  logoUrl?: string;
};

function getBusinessEmoji(type?: string) {
  const normalized = type?.toLowerCase() || "";

  if (normalized.includes("restaurant")) return "🍽️";
  if (normalized.includes("hotel")) return "🏨";
  if (normalized.includes("lodge")) return "🛏️";
  if (normalized.includes("cafe")) return "☕";
  if (normalized.includes("shop")) return "🛍️";
  if (normalized.includes("salon")) return "✂️";
  if (normalized.includes("pharmacy")) return "💊";
  if (normalized.includes("clinic")) return "🏥";
  if (normalized.includes("travel")) return "✈️";
  if (normalized.includes("kirana")) return "🛒";

  return "🏢";
}

function getTheme(theme: string) {
  switch (theme) {
    case "luxury":
      return {
        page: "bg-[#111111]",
        hero: "bg-[#17120d]",
        card: "bg-[#1b1b1b] border-[#39332a]",
        text: "text-[#f5efe5]",
        muted: "text-[#b9ad9c]",
        button: "bg-[#b89152] hover:bg-[#a77f43]",
      };

    case "nature":
      return {
        page: "bg-[#edf5ed]",
        hero: "bg-[#1e4d32]",
        card: "bg-white border-[#d7e4d8]",
        text: "text-[#20352a]",
        muted: "text-[#6d7e72]",
        button: "bg-[#2f6b45] hover:bg-[#245638]",
      };

    case "warm":
      return {
        page: "bg-[#fff7ef]",
        hero: "bg-[#7c3f24]",
        card: "bg-white border-[#f0d8c8]",
        text: "text-[#3d281d]",
        muted: "text-[#80695b]",
        button: "bg-[#a95632] hover:bg-[#8f4323]",
      };

    case "minimal":
      return {
        page: "bg-[#f6f6f6]",
        hero: "bg-[#222222]",
        card: "bg-white border-[#e5e5e5]",
        text: "text-[#222222]",
        muted: "text-[#777777]",
        button: "bg-[#222222] hover:bg-[#111111]",
      };

    case "vibrant":
      return {
        page: "bg-[#fff4f7]",
        hero: "bg-[#9b174d]",
        card: "bg-white border-[#f2c8d8]",
        text: "text-[#3a1022]",
        muted: "text-[#8c5b6c]",
        button: "bg-[#db2777] hover:bg-[#be185d]",
      };

    case "pastel":
      return {
        page: "bg-[#f7f4ff]",
        hero: "bg-[#6650a4]",
        card: "bg-white border-[#e1daf2]",
        text: "text-[#31284b]",
        muted: "text-[#7e7596]",
        button: "bg-[#7862b6] hover:bg-[#6650a4]",
      };

    case "classic":
      return {
        page: "bg-[#f5f1e8]",
        hero: "bg-[#49382d]",
        card: "bg-[#fffdf8] border-[#ded4c5]",
        text: "text-[#33271f]",
        muted: "text-[#766b61]",
        button: "bg-[#5d4738] hover:bg-[#49382d]",
      };

    case "gradient":
      return {
        page: "bg-gradient-to-br from-[#eef2ff] via-[#fdf2f8] to-[#ecfeff]",
        hero: "bg-gradient-to-r from-[#4338ca] via-[#7c3aed] to-[#db2777]",
        card: "bg-white/90 border-white",
        text: "text-[#28234a]",
        muted: "text-[#716c8d]",
        button: "bg-[#6d28d9] hover:bg-[#5b21b6]",
      };

    case "glass":
      return {
        page: "bg-gradient-to-br from-[#0f172a] via-[#172554] to-[#312e81]",
        hero: "bg-transparent",
        card: "bg-white/10 border-white/20 backdrop-blur-xl",
        text: "text-white",
        muted: "text-white/70",
        button: "bg-white text-[#312e81] hover:bg-white/90",
      };

    case "professional":
    default:
      return {
        page: "bg-[#f3f5f1]",
        hero: "bg-[#102b1d]",
        card: "bg-white border-black/5",
        text: "text-[#1f2d25]",
        muted: "text-[#647067]",
        button: "bg-[#1f4a31] hover:bg-[#163a25]",
      };
  }
}

export default function ReviewPage({
  business,
}: {
  business: Business;
}) {
  const [rating, setRating] = useState(0);

  const colors = getTheme(business.theme);

  const businessEmoji = getBusinessEmoji(
    business.businessType
  );

  const ratingText =
    rating === 0
      ? "Tap a star to rate your experience"
      : rating === 1
      ? `We're sorry your experience at ${business.name} was disappointing`
      : rating === 2
      ? `Thank you for sharing your experience with ${business.name}`
      : rating === 3
      ? `Thanks for visiting ${business.name}`
      : rating === 4
      ? `We're happy you enjoyed your experience at ${business.name}!`
      : `Amazing! Thank you for supporting ${business.name}!`;

  return (
    <main
      className={`min-h-screen ${colors.page} ${colors.text}`}
    >
      {/* HERO */}

      <section
        className={`relative overflow-hidden px-5 pb-28 pt-12 text-white ${colors.hero}`}
      >
        <div className="absolute inset-0 opacity-30">
          <div className="absolute left-0 top-0 h-full w-full bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.3),transparent_55%)]" />
        </div>

        <div className="relative mx-auto max-w-md text-center">

          {/* LOGO */}

          <div className="mx-auto mb-5 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-white/80 bg-white/10 shadow-xl">
            {business.logoUrl ? (
              <img
                src={business.logoUrl}
                alt={`${business.name} logo`}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-4xl">
                {businessEmoji}
              </span>
            )}
          </div>

          {/* BUSINESS TYPE */}

          {business.businessType && (
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/70">
              {business.businessType}
            </p>
          )}

          {/* OWNER */}

          {business.ownerName && (
            <p className="mt-3 text-sm font-medium text-white/80">
              Welcome from {business.ownerName}
            </p>
          )}

          {/* BUSINESS NAME */}

          <h1 className="mt-3 text-4xl font-bold tracking-tight">
            {business.name}
          </h1>

          <p className="mt-3 text-sm tracking-wide text-white/75">
            Thank you for visiting us
          </p>

          {business.location && (
            <p className="mt-4 text-sm text-white/80">
              📍 {business.location}
            </p>
          )}
        </div>
      </section>

      {/* MAIN */}

      <div className="relative z-10 mx-auto -mt-16 w-full max-w-md px-4 pb-10">

        <div
          className={`rounded-[30px] border p-6 shadow-xl ${colors.card}`}
        >

          {/* RATING */}

          <section className="text-center">

            <p
              className={`text-xs font-bold uppercase tracking-[0.18em] ${colors.muted}`}
            >
              Share your experience
            </p>

            <h2 className="mt-3 text-2xl font-bold">
              How was your visit?
            </h2>

            <p
              className={`mt-2 text-sm ${colors.muted}`}
            >
              Tell us about your experience at{" "}
              <span className="font-semibold">
                {business.name}
              </span>
              .
            </p>

            {/* STARS */}

            <div className="mt-7 flex justify-center gap-2">

              {[1, 2, 3, 4, 5].map((star) => (

                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`text-4xl transition duration-200 hover:scale-110 ${
                    star <= rating
                      ? "text-[#f5b301]"
                      : "text-[#d7ddd8]"
                  }`}
                  aria-label={`Rate ${star} stars`}
                >
                  ★
                </button>

              ))}

            </div>

            <p
              className={`mt-4 text-sm font-medium ${colors.muted}`}
            >
              {ratingText}
            </p>

          </section>

          {/* AI REVIEW */}

          <section className="mt-8">

            <div className="mb-4">

              <p
                className={`text-xs font-bold uppercase tracking-[0.18em] ${colors.muted}`}
              >
                {business.businessType
                  ? `${business.businessType} Review`
                  : "Review"}
              </p>

              <h3 className="mt-2 text-xl font-bold">
                Create your review
              </h3>

              <p
                className={`mt-2 text-sm leading-6 ${colors.muted}`}
              >
                Select what you enjoyed at{" "}
                <span className="font-semibold">
                  {business.name}
                </span>{" "}
                and create a natural review in your own words.
              </p>

            </div>

            <div className="rounded-3xl border border-black/5 bg-black/[0.02] p-4">

              <AIReviewAssistant
                businessName={business.name}
                businessType={
                  business.businessType || "Business"
                }
                rating={rating}
              />

            </div>

          </section>

          {/* GOOGLE */}

          {business.googleReviewUrl && (

            <a
              href={business.googleReviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`mt-6 flex items-center justify-center gap-3 rounded-2xl px-5 py-4 text-center font-bold text-white transition ${colors.button}`}
            >

              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-sm font-bold text-[#4285F4]">
                G
              </span>

              Post Review on Google

            </a>

          )}

          {business.googleReviewUrl && (
            <p
              className={`mt-3 text-center text-xs ${colors.muted}`}
            >
              Your review will open directly in Google.
            </p>
          )}

          {/* QUICK ACTIONS */}

          {(business.menuUrl ||
            business.mapsUrl ||
            business.phone ||
            business.instagramUrl) && (

            <section className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">

              {business.menuUrl && (

                <a
                  href={business.menuUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-2 rounded-2xl border border-black/10 bg-black/[0.02] px-2 py-4 text-xs font-semibold transition hover:scale-[1.02]"
                >
                  <span className="text-xl">
                    📖
                  </span>

                  Menu

                </a>

              )}

              {business.mapsUrl && (

                <a
                  href={business.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-2 rounded-2xl border border-black/10 bg-black/[0.02] px-2 py-4 text-xs font-semibold transition hover:scale-[1.02]"
                >
                  <span className="text-xl">
                    📍
                  </span>

                  Directions

                </a>

              )}

              {business.phone && (

                <a
                  href={`tel:${business.phone}`}
                  className="flex flex-col items-center gap-2 rounded-2xl border border-black/10 bg-black/[0.02] px-2 py-4 text-xs font-semibold transition hover:scale-[1.02]"
                >
                  <span className="text-xl">
                    ☎️
                  </span>

                  Call

                </a>

              )}

              {business.instagramUrl && (

                <a
                  href={business.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-2 rounded-2xl border border-black/10 bg-black/[0.02] px-2 py-4 text-xs font-semibold transition hover:scale-[1.02]"
                >
                  <span className="text-xl">
                    📸
                  </span>

                  Instagram

                </a>

              )}

            </section>

          )}

          {/* PRIVATE FEEDBACK */}

          {business.whatsapp && (

            <a
              href={`/feedback?business=${encodeURIComponent(
                business.name
              )}&whatsapp=${encodeURIComponent(
                business.whatsapp
              )}`}
              className="mt-6 flex items-center justify-between rounded-2xl border border-black/10 bg-black/[0.02] px-5 py-4 transition hover:bg-black/[0.05]"
            >

              <div className="flex items-center gap-4">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-black/5 text-lg">
                  🔒
                </div>

                <div>

                  <p className="font-semibold">
                    Private feedback
                  </p>

                  <p
                    className={`mt-1 text-xs ${colors.muted}`}
                  >
                    Help {business.name} improve — visible only to the business team.
                  </p>

                </div>

              </div>

              <span
                className={`text-xl ${colors.muted}`}
              >
                ›
              </span>

            </a>

          )}

        </div>

        {/* SOCIAL */}

        {(business.facebookUrl ||
          business.tiktokUrl) && (

          <div className="mt-5 flex justify-center gap-3">

            {business.facebookUrl && (

              <a
                href={business.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl bg-white px-4 py-3 text-sm font-medium shadow-sm"
              >
                Facebook
              </a>

            )}

            {business.tiktokUrl && (

              <a
                href={business.tiktokUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl bg-white px-4 py-3 text-sm font-medium shadow-sm"
              >
                TikTok
              </a>

            )}

          </div>

        )}

        <p
          className={`mt-7 text-center text-xs ${colors.muted}`}
        >
          Thank you for supporting local businesses
        </p>

      </div>
    </main>
  );
}