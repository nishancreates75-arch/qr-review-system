import AIReviewAssistant from "./AIReviewAssistant";

type Business = {
  name: string;
  location: string;
  googleReviewUrl: string;
  phone: string;
  whatsapp: string;
  mapsUrl: string;
  instagramUrl: string;
  menuUrl: string;
  theme: string;
};

export default function ReviewPage({
  business,
}: {
  business: Business;
}) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#1e3a8a,transparent_35%),radial-gradient(circle_at_bottom_right,#7c3aed,transparent_30%),radial-gradient(circle_at_bottom_left,#06b6d4,transparent_25%)]" />

      <div className="absolute -top-20 -left-20 h-72 w-72 animate-pulse rounded-full bg-blue-500/30 blur-3xl" />
      <div className="absolute top-1/3 -right-20 h-72 w-72 animate-pulse rounded-full bg-purple-500/30 blur-3xl" />
      <div className="absolute -bottom-20 left-1/4 h-72 w-72 animate-pulse rounded-full bg-cyan-400/20 blur-3xl" />

      <div className="relative z-10 flex min-h-screen items-center justify-center p-5">
        <div className="w-full max-w-md rounded-[32px] border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-xl">

          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-3xl border border-cyan-300/40 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 text-5xl shadow-2xl">
            🏨
          </div>

          <div className="text-center">
            <p className="text-xs tracking-[0.35em] text-cyan-300">
              WELCOME TO
            </p>

            <h1 className="mt-2 text-4xl font-black">
              {business.name}
            </h1>

            <p className="mt-2 text-sm text-white/60">
              {business.location}
            </p>
          </div>

          <div className="my-7 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />

          <div className="text-center">
            <h2 className="text-xl font-bold">
              HOW WAS YOUR EXPERIENCE?
            </h2>

            <p className="mt-3 text-sm leading-6 text-white/70">
              Thank you for visiting us. We'd love to hear about your experience.
            </p>
          </div>

          <div className="my-6 text-center text-3xl">
            ⭐ ⭐ ⭐ ⭐ ⭐
          </div>

          <AIReviewAssistant
  businessName={business.name}
  googleReviewUrl={business.googleReviewUrl}
  whatsapp={business.whatsapp}
/>
          <a
            href={business.googleReviewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 block rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 px-6 py-4 text-center font-bold text-white shadow-lg"
          >
            ⭐ LEAVE A GOOGLE REVIEW
          </a>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <a
              href={business.menuUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-2xl border border-white/20 bg-white/10 p-4 text-center font-semibold"
            >
              🍽️ View Menu
            </a>

            <a
              href={business.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-2xl border border-white/20 bg-white/10 p-4 text-center font-semibold"
            >
              📍 Find Us
            </a>

            <a
              href={business.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-2xl border border-white/20 bg-white/10 p-4 text-center font-semibold"
            >
              📸 Instagram
            </a>

            <a
              href={`tel:${business.phone}`}
              className="rounded-2xl border border-white/20 bg-white/10 p-4 text-center font-semibold"
            >
              📞 Call Us
            </a>
          </div>

          <a
            href={`/feedback?business=${encodeURIComponent(
              business.name
            )}&whatsapp=${business.whatsapp}`}
            className="mt-4 block w-full rounded-2xl border border-cyan-300/30 bg-white/5 px-5 py-3 text-center font-semibold text-cyan-200"
          >
            💬 SEND PRIVATE FEEDBACK
          </a>

        </div>
      </div>
    </main>
  );
}