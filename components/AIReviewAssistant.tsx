"use client";

import { useState } from "react";

type ExperienceType = "poor" | "okay" | "good" | "excellent";
type ReviewStyle = "short" | "natural" | "detailed";



function pick<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function pickMany<T>(items: T[], count: number): T[] {
  const copy = [...items];
  const result: T[] = [];

  while (copy.length > 0 && result.length < count) {
    const index = Math.floor(Math.random() * copy.length);
    result.push(copy.splice(index, 1)[0]);
  }

  return result;
}

export default function AIReviewAssistant({
  businessName,
  googleReviewUrl,
  whatsapp,
}: {
  businessName: string;
  googleReviewUrl: string;
  whatsapp: string;
}) {
  const [rating, setRating] = useState(75);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [details, setDetails] = useState("");
  const [result, setResult] = useState("");
  const [style, setStyle] = useState<ReviewStyle>("natural");

  function getExperienceType(): ExperienceType {
    if (rating <= 25) return "poor";
    if (rating <= 50) return "okay";
    if (rating <= 75) return "good";
    return "excellent";
  }

  const experienceType = getExperienceType();

  const experienceLabel =
    experienceType === "poor"
      ? "Could be better"
      : experienceType === "okay"
        ? "It was okay"
        : experienceType === "good"
          ? "Really good"
          : "Loved it";

  const isPositive =
    experienceType === "good" ||
    experienceType === "excellent";

  const topics = isPositive
    ? ["Food", "Service", "Atmosphere", "Staff", "Cleanliness", "Value"]
    : ["Service", "Food", "Cleanliness", "Waiting Time", "Price"];

  function toggleTopic(topic: string) {
    setSelectedTopics((current) =>
      current.includes(topic)
        ? current.filter((item) => item !== topic)
        : [...current, topic]
    );

    setResult("");
  }

  function formatTopics(items: string[]) {
    const words = items.map((item) => item.toLowerCase());

    if (words.length === 0) return "";
    if (words.length === 1) return words[0];
    if (words.length === 2) return `${words[0]} and ${words[1]}`;

    return `${words.slice(0, -1).join(", ")}, and ${
      words[words.length - 1]
    }`;
  }

  function createTopicSentence() {
    if (selectedTopics.length === 0) return "";

    const topicText = formatTopics(selectedTopics);

    if (selectedTopics.length === 1) {
      return pick([
        `The ${topicText} was definitely one of the highlights.`,
        `I especially liked the ${topicText}.`,
        `The ${topicText} really stood out to me.`,
        `I was genuinely impressed by the ${topicText}.`,
        `The ${topicText} made a noticeable difference.`,
        `What stood out most was the ${topicText}.`,
        `I particularly enjoyed the ${topicText}.`,
        `The ${topicText} added a lot to the overall experience.`,
      ]);
    }

    return pick([
      `The ${topicText} were all excellent.`,
      `I especially appreciated the ${topicText}.`,
      `The ${topicText} were some of the best parts of the visit.`,
      `I was impressed by the ${topicText}.`,
      `The ${topicText} really made the experience better.`,
      `Everything from the ${topicText} came together really nicely.`,
    ]);
  }

  function createPositiveReview() {
    const excellentOpenings = [
      `Honestly, I had an amazing time at ${businessName}.`,
      `What a lovely experience at ${businessName}.`,
      `I genuinely enjoyed my visit to ${businessName}.`,
      `I wasn't expecting much, but I ended up loving the experience.`,
      `This was easily one of the better experiences I've had recently.`,
      `I left ${businessName} with a really positive impression.`,
      `Such a pleasant experience from start to finish.`,
      `I had a genuinely memorable visit to ${businessName}.`,
      `Everything felt better than I expected.`,
      `I really enjoyed my time here.`,
    ];

    const goodOpenings = [
      `I had a really nice experience at ${businessName}.`,
      `Overall, I had a very enjoyable visit.`,
      `I had a good time and really enjoyed the experience.`,
      `This was a pleasant visit overall.`,
      `I came away with a very positive impression.`,
      `I genuinely enjoyed my time at ${businessName}.`,
      `It turned out to be a really enjoyable experience.`,
      `I was pleasantly surprised by how much I enjoyed my visit.`,
      `A really nice experience overall.`,
      `I had a great time here.`,
    ];

    const middleSentences = [
      `Everything felt comfortable and welcoming.`,
      `The whole experience felt relaxed and easy.`,
      `There was a nice attention to detail throughout.`,
      `You can tell that effort goes into creating a good experience.`,
      `The overall atmosphere made the visit even more enjoyable.`,
      `It felt like a place where guests are genuinely looked after.`,
      `The experience was smooth, comfortable, and enjoyable.`,
      `There was a really pleasant feeling throughout the visit.`,
      `Everything came together better than expected.`,
      `It was one of those places where you immediately feel comfortable.`,
      `The experience felt natural rather than overly formal.`,
      `There was a warm and welcoming feel to the whole place.`,
    ];

    const endings = [
      `I'd happily come back again.`,
      `I would definitely visit again.`,
      `I'd be happy to recommend it to others.`,
      `Definitely worth visiting.`,
      `I would gladly return in the future.`,
      `I'd happily recommend this place.`,
      `Looking forward to visiting again.`,
      `I would absolutely consider coming back.`,
      `Overall, a place I would recommend.`,
      `I left feeling very satisfied with the experience.`,
      `It was a genuinely enjoyable visit.`,
      `Definitely a positive experience.`,
    ];

    const opening =
      experienceType === "excellent"
        ? pick(excellentOpenings)
        : pick(goodOpenings);

    const topicSentence = createTopicSentence();

    const middle =
      style === "short"
        ? ""
        : pick(middleSentences);

    const extraMiddle =
      style === "detailed"
        ? pickMany(
            middleSentences.filter(
              (sentence) => sentence !== middle
            ),
            1
          )[0]
        : "";

    const parts = [
      opening,
      topicSentence,
      details.trim(),
      middle,
      extraMiddle,
      pick(endings),
    ].filter(Boolean);

    return parts.join(" ");
  }

  function createFeedback() {
    const openings = [
      `I wanted to share some honest feedback about my visit.`,
      `My experience wasn't quite what I had hoped for.`,
      `There were a few things that could have been better.`,
      `I hope this feedback can be useful.`,
      `I wanted to share my experience so there is an opportunity to improve.`,
      `The visit was okay, but there are definitely areas that could be improved.`,
    ];

    const topicText = formatTopics(selectedTopics);

    const topicSentence =
      selectedTopics.length === 0
        ? ""
        : selectedTopics.length === 1
          ? `I think the ${topicText} could use some improvement.`
          : `I think the ${topicText} could all be improved.`;

    const endings = [
      `I hope this feedback is helpful.`,
      `Hopefully this can help improve future experiences.`,
      `I hope these comments are taken constructively.`,
      `I would appreciate seeing improvements in these areas.`,
      `Thank you for taking the time to consider this feedback.`,
    ];

    return [
      pick(openings),
      topicSentence,
      details.trim(),
      pick(endings),
    ]
      .filter(Boolean)
      .join(" ");
  }

  function createReview() {
 if (!isPositive) {
  const feedbackUrl = `/feedback?business=${encodeURIComponent(
    businessName
  )}&whatsapp=${encodeURIComponent(whatsapp)}`;

  window.location.href = feedbackUrl;
  return;
}

  const review = createPositiveReview();
  setResult(review);
}

  async function copyReview() {
    if (!result) return;

    await navigator.clipboard.writeText(result);
    alert("Copied to clipboard!");
  }

  function postToGoogle() {
  window.open(
    googleReviewUrl,
    "_blank",
    "noopener,noreferrer"
  );
}

  return (
    <section className="mt-6 rounded-3xl border border-white/15 bg-white/5 p-5 shadow-xl backdrop-blur-xl">
      <div className="text-center">
        <p className="text-xs font-bold tracking-[0.25em] text-cyan-300">
          YOUR EXPERIENCE
        </p>

        <h2 className="mt-2 text-2xl font-black text-white">
          How was your visit?
        </h2>
      </div>

      <div className="mt-8">
        <input
          type="range"
          min="0"
          max="100"
          step="25"
          value={rating}
          onChange={(event) => {
            setRating(Number(event.target.value));
            setSelectedTopics([]);
            setResult("");
          }}
          className="h-3 w-full cursor-pointer appearance-none rounded-full bg-gradient-to-r from-red-500 via-yellow-400 to-green-500"
        />

        <div className="mt-4 flex justify-between text-xs font-medium text-white/60">
          <span>Could be better</span>
          <span>Loved it</span>
        </div>

        <p className="mt-5 text-center text-2xl font-black">
          {experienceLabel}
        </p>
      </div>

      <div className="mt-8">
        <p className="mb-3 text-center text-sm font-semibold text-white/80">
          {isPositive ? "What stood out?" : "What could we improve?"}
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

      {isPositive && (
        <div className="mt-6">
          <p className="mb-3 text-center text-sm font-semibold">
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
                  }}
                  className={`rounded-xl px-3 py-3 text-xs font-semibold capitalize ${
                    style === item
                      ? "bg-cyan-400 text-black"
                      : "border border-white/15 bg-white/5 text-white/70"
                  }`}
                >
                  {item}
                </button>
              )
            )}
          </div>
        </div>
      )}

      <textarea
        value={details}
        onChange={(event) => {
          setDetails(event.target.value);
          setResult("");
        }}
        placeholder="Add your own details (optional)"
        className="mt-6 min-h-24 w-full rounded-2xl border border-white/15 bg-black/20 p-4 text-sm text-white outline-none placeholder:text-white/40"
      />

      <button
        type="button"
        onClick={createReview}
        className="mt-5 w-full rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 px-6 py-4 font-bold text-white shadow-lg"
      >
        {isPositive
          ? "✨ GENERATE MY REVIEW"
          : "💬 CREATE MY FEEDBACK"}
      </button>

      {result && (
        <div className="mt-6 rounded-2xl border border-cyan-300/30 bg-black/30 p-5">
          <p className="text-xs font-bold tracking-widest text-cyan-300">
            REVIEW DRAFT
          </p>

          <textarea
            value={result}
            onChange={(event) => setResult(event.target.value)}
            className="mt-4 min-h-40 w-full rounded-xl border border-white/10 bg-black/20 p-4 text-sm leading-7 text-white outline-none"
          />

          <button
            type="button"
            onClick={createReview}
            className="mt-4 w-full rounded-xl bg-white/10 py-3 font-semibold"
          >
            🔄 ANOTHER VERSION
          </button>

          <button
            type="button"
            onClick={copyReview}
            className="mt-3 w-full rounded-xl border border-cyan-300/30 bg-white/5 py-3 font-semibold text-cyan-200"
          >
            📋 COPY REVIEW
          </button>

          <button
            type="button"
            onClick={postToGoogle}
            className="mt-3 w-full rounded-xl bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 py-3 font-bold"
          >
            ⭐ READY TO POST REVIEW
          </button>
        </div>
      )}
    </section>
  );
}