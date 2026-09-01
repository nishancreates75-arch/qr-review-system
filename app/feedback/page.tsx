"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";

function FeedbackContent() {
  const searchParams = useSearchParams();

  const business = searchParams.get("business") || "the business";
  const whatsapp = searchParams.get("whatsapp") || "";

  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [message, setMessage] = useState("");

  const topics = [
    "Service",
    "Food",
    "Cleanliness",
    "Waiting Time",
    "Price",
    "Staff",
    "Other",
  ];

  function toggleTopic(topic: string) {
    setSelectedTopics((current) =>
      current.includes(topic)
        ? current.filter((item) => item !== topic)
        : [...current, topic]
    );
  }

  function submitFeedback() {
    if (!message.trim() && selectedTopics.length === 0) {
      alert("Please select an issue or write your feedback.");
      return;
    }

    if (!whatsapp) {
      alert("WhatsApp number is not configured for this business.");
      return;
    }

    const feedbackText = `
PRIVATE FEEDBACK

Business: ${business}

Issues: ${
      selectedTopics.length > 0
        ? selectedTopics.join(", ")
        : "Not specified"
    }

Customer Feedback:
${message.trim() || "No additional message provided."}
    `.trim();

    const whatsappUrl = `https://wa.me/${whatsapp}?text=${encodeURIComponent(
      feedbackText
    )}`;

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-black p-5 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#1e3a8a,transparent_35%),radial-gradient(circle_at_bottom_right,#7c3aed,transparent_30%),radial-gradient(circle_at_bottom_left,#06b6d4,transparent_25%)]" />

      <div className="relative z-10 flex min-h-screen items-center justify-center">
        <div className="w-full max-w-md rounded-[32px] border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-xl">
          <div className="text-center">
            <p className="text-xs font-bold tracking-[0.3em] text-cyan-300">
              PRIVATE FEEDBACK
            </p>

            <h1 className="mt-3 text-3xl font-black">
              Help {business} Improve
            </h1>

            <p className="mt-3 text-sm leading-6 text-white/70">
              We're sorry your experience wasn't perfect. Your feedback
              will be sent privately to the business.
            </p>
          </div>

          <div className="mt-8">
            <p className="mb-4 text-center text-sm font-semibold">
              What could we improve?
            </p>

            <div className="flex flex-wrap justify-center gap-2">
              {topics.map((topic) => (
                <button
                  key={topic}
                  type="button"
                  onClick={() => toggleTopic(topic)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    selectedTopics.includes(topic)
                      ? "bg-gradient-to-r from-cyan-400 to-blue-500 text-white"
                      : "border border-white/15 bg-white/5 text-white/70"
                  }`}
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>

          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Tell us what happened..."
            className="mt-6 min-h-36 w-full rounded-2xl border border-white/15 bg-black/20 p-4 text-sm leading-6 text-white outline-none placeholder:text-white/40 focus:border-cyan-300"
          />

          <button
            type="button"
            onClick={submitFeedback}
            className="mt-5 w-full rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 px-6 py-4 font-bold text-white shadow-lg transition hover:scale-[1.02]"
          >
            💬 SEND PRIVATE FEEDBACK
          </button>

          <p className="mt-4 text-center text-xs leading-5 text-white/40">
            Your feedback will open WhatsApp before sending.
          </p>
        </div>
      </div>
    </main>
  );
}

export default function FeedbackPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-black text-white">
          Loading feedback...
        </main>
      }
    >
      <FeedbackContent />
    </Suspense>
  );
}