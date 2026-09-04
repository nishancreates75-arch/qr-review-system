"use client";

import { useState } from "react";
import AIReviewAssistant from "./AIReviewAssistant";

type Business = {
  name: string;
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

export default function ReviewPage({
  business,
}: {
  business: Business;
}) {
  const [rating, setRating] = useState(0);

  const ratingText =
    rating === 0
      ? "Tap a star to rate"
      : rating === 1
      ? "We're sorry to hear that"
      : rating === 2
      ? "Thank you for your feedback"
      : rating === 3
      ? "Thanks for sharing your experience"
      : rating === 4
      ? "We're glad you enjoyed your visit!"
      : "Amazing! Thank you so much!";

  return (
    <main className="min-h-screen bg-[#f3f5f1] text-[#1f2d25]">
      {/* HERO */}
      <section className="relative overflow-hidden bg-[#102b1d] px-5 pb-28 pt-12 text-white">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute left-0 top-0 h-full w-full bg-[radial-gradient(circle_at_top,#547a5d,transparent_55%)]" />
        </div>

        <div className="relative mx-auto max-w-md text-center">
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-white/80 bg-[#1d4a31] shadow-xl">
            {business.logoUrl ? (
              <img
                src={business.logoUrl}
                alt={`${business.name} logo`}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-4xl">🌿</span>
            )}
          </div>

          <h1 className="text-4xl font-bold tracking-tight">
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

      {/* MAIN CARD */}
      <div className="relative z-10 mx-auto -mt-16 w-full max-w-md px-4 pb-10">
        <div className="rounded-[30px] border border-black/5 bg-white p-6 shadow-xl">
          {/* RATING */}
          <section className="text-center">
            <h2 className="text-2xl font-bold text-[#1f2d25]">
              How was your experience?
            </h2>

            <p className="mt-2 text-sm text-[#647067]">
              Your feedback helps us serve you better.
            </p>

            <div className="mt-7 flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`text-4xl transition duration-200 hover:scale-110 ${
                    star <= rating
                      ? "text-[#e5a21a]"
                      : "text-[#d7ddd8]"
                  }`}
                  aria-label={`Rate ${star} stars`}
                >
                  ★
                </button>
              ))}
            </div>

            <p className="mt-4 text-sm font-medium text-[#66736a]">
              {ratingText}
            </p>
          </section>

          {/* AI REVIEW */}
          <section className="mt-8 rounded-3xl border border-[#dfe6df] bg-[#f8faf7] p-4">
            <div className="mb-4 flex items-start gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#e7efe8] text-xl">
                ✨
              </div>

              <div>
                <h3 className="font-bold text-[#203126]">
                  AI Review Assistant
                </h3>

                <p className="mt-1 text-sm leading-6 text-[#68746c]">
                  Share a few details and AI will help you write your
                  review.
                </p>
              </div>
            </div>

            <AIReviewAssistant
              businessName={business.name}
              googleReviewUrl={business.googleReviewUrl}
              whatsapp={business.whatsapp}
            />
          </section>

          {/* GOOGLE REVIEW */}
          {business.googleReviewUrl && (
            <a
              href={business.googleReviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 flex items-center justify-center gap-3 rounded-2xl bg-[#1f4a31] px-5 py-4 text-center font-bold text-white transition hover:bg-[#163a25]"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-sm">
                G
              </span>

              Write Review on Google
            </a>
          )}

          <p className="mt-3 text-center text-xs text-[#7b857e]">
            🔒 Your review goes directly to Google
          </p>

          {/* QUICK ACTIONS */}
          <section className="mt-7 grid grid-cols-4 divide-x divide-[#dfe5df] rounded-2xl border border-[#e2e7e2] bg-[#fafcf9]">
            {business.menuUrl && (
              <a
                href={business.menuUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-2 px-2 py-4 text-xs font-medium text-[#314137]"
              >
                <span className="text-xl">📖</span>
                Menu
              </a>
            )}

            {business.mapsUrl && (
              <a
                href={business.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-2 px-2 py-4 text-xs font-medium text-[#314137]"
              >
                <span className="text-xl">📍</span>
                Directions
              </a>
            )}

            {business.phone && (
              <a
                href={`tel:${business.phone}`}
                className="flex flex-col items-center gap-2 px-2 py-4 text-xs font-medium text-[#314137]"
              >
                <span className="text-xl">☎️</span>
                Call
              </a>
            )}

            {business.instagramUrl && (
              <a
                href={business.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-2 px-2 py-4 text-xs font-medium text-[#314137]"
              >
                <span className="text-xl">◎</span>
                Instagram
              </a>
            )}
          </section>

          {/* PRIVATE FEEDBACK */}
          <a
            href={`/feedback?business=${encodeURIComponent(
              business.name
            )}&whatsapp=${encodeURIComponent(
              business.whatsapp || ""
            )}`}
            className="mt-6 flex items-center justify-between rounded-2xl border border-[#dfe5df] bg-[#fafcf9] px-5 py-4 transition hover:bg-[#f1f5f0]"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#e8f0e9] text-lg">
                🔒
              </div>

              <div>
                <p className="font-semibold text-[#26352c]">
                  Private feedback
                </p>

                <p className="mt-1 text-xs text-[#748078]">
                  Help us improve — only visible to our team
                </p>
              </div>
            </div>

            <span className="text-xl text-[#738077]">›</span>
          </a>
        </div>

        {/* SOCIAL LINKS */}
        {(business.facebookUrl || business.tiktokUrl) && (
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

        <p className="mt-7 text-center text-xs text-[#849087]">
          Thank you for supporting local businesses
        </p>
      </div>
    </main>
  );
}