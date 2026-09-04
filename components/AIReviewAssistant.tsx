"use client";

import { useState } from "react";

type ReviewStyle = "short" | "natural" | "detailed";

function pick<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

export default function AIReviewAssistant({
  businessName,
}: {
  businessName: string;
  googleReviewUrl: string;
  whatsapp: string;
}) {
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [details, setDetails] = useState("");
  const [result, setResult] = useState("");
  const [style, setStyle] = useState<ReviewStyle>("natural");
  const [copied, setCopied] = useState(false);

  const topics = [
    "Service",
    "Quality",
    "Staff",
    "Atmosphere",
    "Cleanliness",
    "Value",
  ];

  function toggleTopic(topic: string) {
    setSelectedTopics((current) =>
      current.includes(topic)
        ? current.filter((item) => item !== topic)
        : [...current, topic]
    );

    setResult("");
    setCopied(false);
  }

  function formatTopics(items: string[]) {
    const words = items.map((item) => item.toLowerCase());

    if (words.length === 0) return "";
    if (words.length === 1) return words[0];

    if (words.length === 2) {
      return `${words[0]} and ${words[1]}`;
    }

    return `${words.slice(0, -1).join(", ")}, and ${
      words[words.length - 1]
    }`;
  }

  function createReview() {
    const openings = [
      `I had a great experience at ${businessName}.`,
      `Really enjoyed my visit to ${businessName}.`,
      `I had a wonderful experience at ${businessName}.`,
      `${businessName} gave me a very pleasant experience.`,
      `I genuinely enjoyed my time at ${businessName}.`,
    ];

    const middleSentences = [
      `Everything felt welcoming and comfortable.`,
      `The overall experience was smooth and enjoyable.`,
      `You can tell that real effort goes into serving customers well.`,
      `The experience left a very positive impression.`,
      `I would happily recommend this place to others.`,
    ];

    const endings = [
      `I would definitely visit again.`,
      `Highly recommended!`,
      `Looking forward to coming back again.`,
      `Thank you for a great experience.`,
      `Definitely worth visiting.`,
    ];

    const topicText = formatTopics(selectedTopics);

    const topicSentence =
      selectedTopics.length > 0
        ? `I especially appreciated the ${topicText}.`
        : "";

    const detailText = details.trim();

    const reviewParts = [
      pick(openings),
      topicSentence,
      detailText,
      style !== "short" ? pick(middleSentences) : "",
      style === "detailed"
        ? `Overall, it was a memorable and enjoyable experience.`
        : "",
      pick(endings),
    ].filter(Boolean);

    setResult(reviewParts.join(" "));
    setCopied(false);
  }

  async function copyReview() {
    if (!result) return;

    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      alert("Please copy the review manually.");
    }
  }

  return (
    <div className="space-y-5">
      {/* TOPICS */}
      <div>
        <p className="mb-3 text-sm font-semibold text-[#26352c]">
          What did you like?
        </p>

        <div className="flex flex-wrap gap-2">
          {topics.map((topic) => {
            const selected = selectedTopics.includes(topic);

            return (
              <button
                key={topic}
                type="button"
                onClick={() => toggleTopic(topic)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                  selected
                    ? "border-[#1f4a31] bg-[#1f4a31] text-white"
                    : "border-[#d8e0d8] bg-white text-[#526057] hover:border-[#1f4a31]"
                }`}
              >
                {topic}
              </button>
            );
          })}
        </div>
      </div>

      {/* REVIEW STYLE */}
      <div>
        <p className="mb-3 text-sm font-semibold text-[#26352c]">
          Review style
        </p>

        <div className="grid grid-cols-3 gap-2">
          {(["short", "natural", "detailed"] as ReviewStyle[]).map(
            (item) => (
              <button
                key={item}
                type="button"
                onClick={() => {
                  setStyle(item);
                  setResult("");
                  setCopied(false);
                }}
                className={`rounded-xl px-3 py-3 text-sm font-semibold capitalize transition ${
                  style === item
                    ? "bg-[#1f4a31] text-white"
                    : "border border-[#d8e0d8] bg-white text-[#5c6a61]"
                }`}
              >
                {item}
              </button>
            )
          )}
        </div>
      </div>

      {/* DETAILS */}
      <div>
        <textarea
          value={details}
          onChange={(event) => {
            setDetails(event.target.value);
            setResult("");
            setCopied(false);
          }}
          placeholder="Share your experience in a few words (optional)"
          className="min-h-[110px] w-full rounded-2xl border border-[#d8e0d8] bg-white p-4 text-sm text-[#26352c] outline-none placeholder:text-[#9aa59d] focus:border-[#1f4a31]"
        />
      </div>

      {/* GENERATE */}
      <button
        type="button"
        onClick={createReview}
        className="w-full rounded-2xl bg-[#1f4a31] px-5 py-4 font-bold text-white transition hover:bg-[#163a25]"
      >
        Generate My Review
      </button>

      {/* RESULT */}
      {result && (
        <div className="rounded-2xl border border-[#d8e0d8] bg-white p-4">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#5f7a68]">
            Your review draft
          </p>

          <textarea
            value={result}
            onChange={(event) => {
              setResult(event.target.value);
              setCopied(false);
            }}
            className="mt-3 min-h-[140px] w-full rounded-xl border border-[#e1e7e1] bg-[#fafcf9] p-4 text-sm leading-7 text-[#26352c] outline-none focus:border-[#1f4a31]"
          />

          <div className="mt-3 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={createReview}
              className="rounded-xl border border-[#d8e0d8] bg-[#f7faf7] py-3 text-sm font-semibold text-[#314137] transition hover:bg-[#edf3ed]"
            >
              Another Version
            </button>

            <button
              type="button"
              onClick={copyReview}
              className="rounded-xl bg-[#1f4a31] py-3 text-sm font-semibold text-white transition hover:bg-[#163a25]"
            >
              {copied ? "Copied!" : "Copy Review"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}