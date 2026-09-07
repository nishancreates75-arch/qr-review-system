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

type ThemeConfig = {
  layout: "classic" | "editorial" | "minimal" | "organic" | "tech" | "playful";
  page: string;
  hero: string;
  heroGlow: string;
  heroPattern: string;
  card: string;
  cardInner: string;
  text: string;
  muted: string;
  accent: string;
  accentText: string;
  button: string;
  buttonText: string;
  action: string;
  actionIcon: string;
  privateBox: string;
  privateButton: string;
  logo: string;
  title: string;
  sectionLabel: string;
  starsEmpty: string;
  starsFull: string;
  footer: string;
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

/*
 * The admin dashboard may contain older theme values from before the
 * 10-theme redesign. These aliases keep old businesses looking correct
 * instead of silently falling back to Professional.
 */
function normalizeTheme(theme?: string) {
  const value = (theme || "professional").toLowerCase();

  const aliases: Record<string, string> = {
    vibrant: "colorful",
    pastel: "elegant",
    classic: "luxury",
    gradient: "modern",
    glass: "futuristic",
  };

  return aliases[value] || value;
}

function getTheme(theme?: string): ThemeConfig {
  switch (normalizeTheme(theme)) {
    case "luxury":
      return {
        layout: "editorial",
        page: "bg-[#0d0b09]",
        hero: "bg-[#17120d]",
        heroGlow:
          "bg-[radial-gradient(circle_at_50%_0%,rgba(218,180,103,0.28),transparent_52%)]",
        heroPattern:
          "before:absolute before:inset-x-6 before:top-7 before:h-px before:bg-gradient-to-r before:from-transparent before:via-[#c9a45c]/70 before:to-transparent",
        card: "bg-[#151311] border-[#6d5630] shadow-[0_25px_80px_rgba(0,0,0,0.45)]",
        cardInner: "bg-[#1d1914] border-[#51412b]",
        text: "text-[#f5ead6]",
        muted: "text-[#b9a98d]",
        accent: "text-[#e1bd72]",
        accentText: "text-[#241b0d]",
        button:
          "bg-gradient-to-r from-[#b88a3f] via-[#e0bd6f] to-[#b88a3f] hover:brightness-110 shadow-lg shadow-[#a77c32]/20",
        buttonText: "text-[#21170a]",
        action:
          "bg-[#171411] border-[#5c492d] hover:border-[#d2ae62] hover:bg-[#211b14]",
        actionIcon: "text-[#dfbb70]",
        privateBox: "bg-[#181511] border-[#5c492d]",
        privateButton:
          "bg-[#d1aa5d] text-[#21170a] hover:bg-[#e0bd6f]",
        logo:
          "rounded-2xl border-[#d4ae61] bg-[#211a10] shadow-[0_0_30px_rgba(212,174,97,0.18)]",
        title: "font-serif tracking-tight text-[#f7e7c2]",
        sectionLabel: "text-[#d6b56c]",
        starsEmpty: "text-[#5b5245]",
        starsFull: "text-[#f4c95d]",
        footer: "text-[#aa9778]",
      };

    case "minimal":
      return {
        layout: "minimal",
        page: "bg-[#fafafa]",
        hero: "bg-white",
        heroGlow: "bg-gradient-to-b from-slate-100 to-transparent",
        heroPattern:
          "before:absolute before:right-6 before:top-6 before:h-2 before:w-2 before:rounded-full before:bg-slate-300",
        card: "bg-white border-slate-200 shadow-[0_18px_60px_rgba(15,23,42,0.08)]",
        cardInner: "bg-slate-50 border-slate-200",
        text: "text-slate-900",
        muted: "text-slate-500",
        accent: "text-slate-900",
        accentText: "text-white",
        button:
          "bg-slate-900 hover:bg-slate-800 shadow-sm",
        buttonText: "text-white",
        action:
          "bg-white border-slate-200 hover:border-slate-400 hover:bg-slate-50",
        actionIcon: "text-slate-700",
        privateBox: "bg-slate-50 border-slate-200",
        privateButton: "bg-slate-900 text-white hover:bg-slate-800",
        logo:
          "rounded-xl border-slate-200 bg-slate-100 shadow-sm",
        title: "font-sans font-semibold tracking-tight text-slate-900",
        sectionLabel: "text-slate-500",
        starsEmpty: "text-slate-300",
        starsFull: "text-slate-900",
        footer: "text-slate-400",
      };

    case "warm":
      return {
        layout: "organic",
        page: "bg-[#fff8f0]",
        hero: "bg-[#8f4527]",
        heroGlow:
          "bg-[radial-gradient(circle_at_15%_10%,rgba(255,224,188,0.3),transparent_30%),radial-gradient(circle_at_90%_0%,rgba(255,187,128,0.2),transparent_32%)]",
        heroPattern:
          "before:absolute before:left-5 before:top-8 before:h-16 before:w-16 before:rounded-full before:border before:border-orange-200/30",
        card: "bg-[#fffdf9] border-[#efd9c6] shadow-[0_20px_65px_rgba(120,65,35,0.12)]",
        cardInner: "bg-[#fff5e9] border-[#f0d7c1]",
        text: "text-[#4a2a1b]",
        muted: "text-[#8a6c5b]",
        accent: "text-[#b5532d]",
        accentText: "text-white",
        button:
          "bg-[#bd5c32] hover:bg-[#a94c27] shadow-lg shadow-[#bd5c32]/15",
        buttonText: "text-white",
        action:
          "bg-[#fffaf4] border-[#ecd6c0] hover:bg-[#fff2e4] hover:border-[#d9ad8b]",
        actionIcon: "text-[#b5532d]",
        privateBox: "bg-[#fff5e9] border-[#ecd0b6]",
        privateButton: "bg-[#a84d29] text-white hover:bg-[#8f4021]",
        logo:
          "rounded-[28%] border-[#fff1df] bg-white/15 shadow-xl",
        title: "font-serif italic tracking-tight",
        sectionLabel: "text-[#a44d2a]",
        starsEmpty: "text-[#e5c9b4]",
        starsFull: "text-[#e16a2f]",
        footer: "text-[#9a7866]",
      };

    case "nature":
      return {
        layout: "organic",
        page: "bg-[#eef7ef]",
        hero: "bg-[#215a38]",
        heroGlow:
          "bg-[radial-gradient(circle_at_10%_0%,rgba(179,226,171,0.3),transparent_35%),radial-gradient(circle_at_90%_20%,rgba(119,181,126,0.25),transparent_35%)]",
        heroPattern:
          "before:absolute before:-right-5 before:-top-8 before:h-28 before:w-28 before:rotate-45 before:rounded-[40%] before:border before:border-green-200/20",
        card: "bg-white border-[#d5e6d7] shadow-[0_20px_65px_rgba(34,91,57,0.12)]",
        cardInner: "bg-[#f2f8f2] border-[#dbe9dc]",
        text: "text-[#203b2a]",
        muted: "text-[#6c8273]",
        accent: "text-[#2f7047]",
        accentText: "text-white",
        button:
          "bg-[#2f7047] hover:bg-[#255c39] shadow-lg shadow-[#2f7047]/15",
        buttonText: "text-white",
        action:
          "bg-[#f7fbf7] border-[#d5e6d7] hover:bg-[#edf7ee] hover:border-[#a9c9ad]",
        actionIcon: "text-[#2f7047]",
        privateBox: "bg-[#f0f8f1] border-[#d1e5d3]",
        privateButton: "bg-[#2f7047] text-white hover:bg-[#255c39]",
        logo:
          "rounded-[45%_55%_50%_50%] border-[#d6ebd9] bg-white/15 shadow-xl",
        title: "font-sans font-bold tracking-tight",
        sectionLabel: "text-[#2f7047]",
        starsEmpty: "text-[#c9d9cc]",
        starsFull: "text-[#e6ad32]",
        footer: "text-[#719078]",
      };

    case "elegant":
      return {
        layout: "editorial",
        page: "bg-[#fbf8f4]",
        hero: "bg-[#f7f1ea]",
        heroGlow:
          "bg-[radial-gradient(circle_at_50%_0%,rgba(170,126,94,0.16),transparent_48%)]",
        heroPattern:
          "before:absolute before:inset-5 before:rounded-[32px] before:border before:border-[#d8c5b5]/50",
        card: "bg-[#fffdfa] border-[#e5d8cc] shadow-[0_22px_70px_rgba(91,67,50,0.1)]",
        cardInner: "bg-[#faf5ef] border-[#e5d8cc]",
        text: "text-[#3b2d26]",
        muted: "text-[#806f65]",
        accent: "text-[#8a6048]",
        accentText: "text-white",
        button:
          "bg-[#8b634b] hover:bg-[#76523e] shadow-lg shadow-[#8b634b]/15",
        buttonText: "text-white",
        action:
          "bg-[#fffdf9] border-[#e3d5c9] hover:bg-[#f8f0e8]",
        actionIcon: "text-[#8b634b]",
        privateBox: "bg-[#faf4ed] border-[#e2d3c6]",
        privateButton: "bg-[#8b634b] text-white hover:bg-[#76523e]",
        logo:
          "rounded-full border-[#b79a84] bg-[#f5eee7] shadow-md",
        title: "font-serif font-semibold tracking-tight",
        sectionLabel: "text-[#8b634b]",
        starsEmpty: "text-[#d9cabe]",
        starsFull: "text-[#bd844e]",
        footer: "text-[#947e70]",
      };

    case "modern":
      return {
        layout: "classic",
        page: "bg-[#f1f6ff]",
        hero: "bg-[#173f91]",
        heroGlow:
          "bg-[radial-gradient(circle_at_0%_0%,rgba(104,169,255,0.42),transparent_38%),radial-gradient(circle_at_100%_0%,rgba(48,84,198,0.35),transparent_40%)]",
        heroPattern:
          "before:absolute before:-right-10 before:-top-10 before:h-36 before:w-36 before:rounded-full before:bg-white/10",
        card: "bg-white border-[#d8e5fb] shadow-[0_22px_70px_rgba(29,78,216,0.12)]",
        cardInner: "bg-[#f4f8ff] border-[#d8e5fb]",
        text: "text-[#102b5c]",
        muted: "text-[#617393]",
        accent: "text-[#1d5bd1]",
        accentText: "text-white",
        button:
          "bg-[#1467e8] hover:bg-[#0f58c9] shadow-lg shadow-[#1467e8]/20",
        buttonText: "text-white",
        action:
          "bg-white border-[#d6e4fb] hover:bg-[#f3f7ff] hover:border-[#a9c6f2]",
        actionIcon: "text-[#1765d2]",
        privateBox: "bg-[#f2f7ff] border-[#d5e3f8]",
        privateButton: "bg-[#1467e8] text-white hover:bg-[#0f58c9]",
        logo:
          "rounded-[22px] border-white/80 bg-white/15 shadow-xl",
        title: "font-sans font-extrabold tracking-tight",
        sectionLabel: "text-[#1765d2]",
        starsEmpty: "text-[#c7d5ec]",
        starsFull: "text-[#f5b301]",
        footer: "text-[#7186a8]",
      };

    case "futuristic":
      return {
        layout: "tech",
        page: "bg-[#050816]",
        hero: "bg-[#070b20]",
        heroGlow:
          "bg-[radial-gradient(circle_at_50%_0%,rgba(0,229,255,0.25),transparent_42%),radial-gradient(circle_at_10%_40%,rgba(125,63,255,0.2),transparent_32%)]",
        heroPattern:
          "before:absolute before:inset-4 before:rounded-[28px] before:border before:border-cyan-400/20 before:[box-shadow:inset_0_0_30px_rgba(0,229,255,0.05)]",
        card: "bg-[#0b1022] border-cyan-400/30 shadow-[0_0_60px_rgba(0,229,255,0.08)]",
        cardInner: "bg-[#0b1328] border-cyan-400/20",
        text: "text-cyan-50",
        muted: "text-slate-400",
        accent: "text-cyan-300",
        accentText: "text-[#02151a]",
        button:
          "bg-gradient-to-r from-cyan-400 to-blue-500 hover:brightness-110 shadow-[0_0_24px_rgba(0,229,255,0.22)]",
        buttonText: "text-[#031018]",
        action:
          "bg-[#081126] border-cyan-400/25 hover:border-cyan-300 hover:bg-[#0c1730]",
        actionIcon: "text-cyan-300",
        privateBox: "bg-[#081126] border-cyan-400/25",
        privateButton:
          "bg-cyan-400 text-[#031018] hover:bg-cyan-300 shadow-[0_0_18px_rgba(0,229,255,0.2)]",
        logo:
          "rounded-[18px] border-cyan-300 bg-[#0a1630] shadow-[0_0_30px_rgba(0,229,255,0.25)]",
        title: "font-mono font-bold tracking-tight",
        sectionLabel: "text-cyan-300",
        starsEmpty: "text-slate-700",
        starsFull: "text-cyan-300",
        footer: "text-slate-500",
      };

    case "dark":
      return {
        layout: "tech",
        page: "bg-[#090909]",
        hero: "bg-[#111111]",
        heroGlow:
          "bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.11),transparent_48%)]",
        heroPattern:
          "before:absolute before:inset-x-7 before:bottom-5 before:h-px before:bg-white/10",
        card: "bg-[#151515] border-[#303030] shadow-[0_24px_80px_rgba(0,0,0,0.5)]",
        cardInner: "bg-[#1b1b1b] border-[#303030]",
        text: "text-white",
        muted: "text-[#8d8d8d]",
        accent: "text-[#f2c94c]",
        accentText: "text-[#17130a]",
        button:
          "bg-[#f2c94c] hover:bg-[#ffd95e] shadow-lg shadow-yellow-500/10",
        buttonText: "text-[#17130a]",
        action:
          "bg-[#171717] border-[#303030] hover:bg-[#202020] hover:border-[#4a4a4a]",
        actionIcon: "text-[#f2c94c]",
        privateBox: "bg-[#171717] border-[#303030]",
        privateButton: "bg-[#f2c94c] text-[#17130a] hover:bg-[#ffd95e]",
        logo:
          "rounded-full border-[#e7e7e7] bg-[#202020] shadow-xl",
        title: "font-sans font-extrabold tracking-tight",
        sectionLabel: "text-[#f2c94c]",
        starsEmpty: "text-[#414141]",
        starsFull: "text-[#f2c94c]",
        footer: "text-[#666666]",
      };

    case "colorful":
      return {
        layout: "playful",
        page: "bg-[#fff7fb]",
        hero: "bg-gradient-to-br from-[#2563eb] via-[#7c3aed] to-[#ec4899]",
        heroGlow:
          "bg-[radial-gradient(circle_at_0%_0%,rgba(255,255,255,0.35),transparent_30%),radial-gradient(circle_at_100%_0%,rgba(255,213,79,0.3),transparent_28%)]",
        heroPattern:
          "before:absolute before:-left-8 before:-top-8 before:h-28 before:w-28 before:rotate-12 before:rounded-[35%] before:bg-yellow-300/20 after:absolute after:-right-8 after:bottom-0 after:h-32 after:w-32 after:rounded-full after:bg-cyan-300/20",
        card: "bg-white border-[#f1d6eb] shadow-[0_24px_75px_rgba(124,58,237,0.12)]",
        cardInner:
          "bg-gradient-to-br from-[#fff7fb] to-[#f2f7ff] border-[#ecd9ef]",
        text: "text-[#261746]",
        muted: "text-[#766788]",
        accent: "text-[#db2777]",
        accentText: "text-white",
        button:
          "bg-gradient-to-r from-[#2563eb] via-[#7c3aed] to-[#ec4899] hover:brightness-105 shadow-lg shadow-purple-500/20",
        buttonText: "text-white",
        action:
          "bg-white border-[#e7dff0] hover:bg-[#faf5ff] hover:border-[#c9b5e3]",
        actionIcon: "text-[#7c3aed]",
        privateBox:
          "bg-gradient-to-r from-[#f8f1ff] to-[#fff1f8] border-[#eadcf1]",
        privateButton:
          "bg-gradient-to-r from-[#7c3aed] to-[#ec4899] text-white hover:brightness-105",
        logo:
          "rounded-[35%] border-white bg-white/20 shadow-xl",
        title: "font-sans font-black tracking-tight",
        sectionLabel: "text-[#7c3aed]",
        starsEmpty: "text-[#d8cee3]",
        starsFull: "text-[#f59e0b]",
        footer: "text-[#927ca7]",
      };

    case "professional":
    default:
      return {
        layout: "classic",
        page: "bg-[#f4f7f5]",
        hero: "bg-[#123524]",
        heroGlow:
          "bg-[radial-gradient(circle_at_50%_0%,rgba(121,186,139,0.28),transparent_48%)]",
        heroPattern:
          "before:absolute before:right-6 before:top-8 before:h-20 before:w-20 before:rounded-full before:border before:border-white/10",
        card: "bg-white border-[#dce5df] shadow-[0_22px_65px_rgba(25,60,42,0.1)]",
        cardInner: "bg-[#f7faf8] border-[#e0e9e3]",
        text: "text-[#1e3027]",
        muted: "text-[#65756c]",
        accent: "text-[#1f613d]",
        accentText: "text-white",
        button:
          "bg-[#1f613d] hover:bg-[#184e31] shadow-lg shadow-[#1f613d]/15",
        buttonText: "text-white",
        action:
          "bg-white border-[#dfe8e2] hover:bg-[#f4f8f5] hover:border-[#bdd1c3]",
        actionIcon: "text-[#1f613d]",
        privateBox: "bg-[#f5f9f6] border-[#dbe7df]",
        privateButton: "bg-[#1f613d] text-white hover:bg-[#184e31]",
        logo:
          "rounded-2xl border-white bg-white/15 shadow-xl",
        title: "font-sans font-bold tracking-tight",
        sectionLabel: "text-[#1f613d]",
        starsEmpty: "text-[#cbd8cf]",
        starsFull: "text-[#f5b301]",
        footer: "text-[#74867b]",
      };
  }
}


function getLayoutClasses(layout: ThemeConfig["layout"]) {
  switch (layout) {
    case "editorial":
      return {
        main: "font-serif",
        heroSection: "pb-32 pt-14",
        content: "-mt-20",
        card: "rounded-[34px] p-6 sm:p-8",
        rating: "py-2",
        actions: "gap-2",
      };
    case "minimal":
      return {
        main: "font-sans",
        heroSection: "pb-24 pt-10",
        content: "-mt-10",
        card: "rounded-[18px] p-5 sm:p-7",
        rating: "py-0",
        actions: "gap-2",
      };
    case "organic":
      return {
        main: "font-sans",
        heroSection: "pb-32 pt-14",
        content: "-mt-24",
        card: "rounded-[42px] p-5 sm:p-7",
        rating: "py-2",
        actions: "gap-3",
      };
    case "tech":
      return {
        main: "font-mono",
        heroSection: "pb-32 pt-12",
        content: "-mt-20",
        card: "rounded-[20px] p-4 sm:p-6",
        rating: "py-1",
        actions: "gap-2",
      };
    case "playful":
      return {
        main: "font-sans",
        heroSection: "pb-32 pt-12",
        content: "-mt-24",
        card: "rounded-[38px] p-5 sm:p-7",
        rating: "py-2",
        actions: "gap-3",
      };
    case "classic":
    default:
      return {
        main: "font-sans",
        heroSection: "pb-28 pt-12",
        content: "-mt-16",
        card: "rounded-[30px] p-5 sm:p-6",
        rating: "py-1",
        actions: "gap-3",
      };
  }
}

function getThemeDecor(layout: ThemeConfig["layout"]) {
  switch (layout) {
    case "editorial":
      return (
        <>
          <div className="pointer-events-none absolute left-0 top-0 h-full w-1/3 bg-white/[0.025]" />
          <div className="pointer-events-none absolute bottom-8 right-8 h-24 w-24 rounded-full border border-white/10" />
        </>
      );
    case "minimal":
      return (
        <>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-black/10" />
          <div className="pointer-events-none absolute right-7 top-7 h-3 w-3 rounded-full bg-current opacity-10" />
        </>
      );
    case "organic":
      return (
        <>
          <div className="pointer-events-none absolute -left-12 bottom-[-50px] h-32 w-32 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute right-[-35px] top-[-35px] h-28 w-28 rounded-[45%] border border-white/10 rotate-12" />
        </>
      );
    case "tech":
      return (
        <>
          <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.08)_1px,transparent_1px)] [background-size:24px_24px]" />
          <div className="pointer-events-none absolute inset-x-8 bottom-8 border-t border-white/10" />
        </>
      );
    case "playful":
      return (
        <>
          <div className="pointer-events-none absolute -left-8 top-10 h-20 w-20 rotate-12 rounded-[30%] bg-white/10" />
          <div className="pointer-events-none absolute -right-7 bottom-4 h-24 w-24 rounded-full bg-white/10" />
        </>
      );
    default:
      return null;
  }
}

function ActionLink({
  href,
  icon,
  label,
  theme,
}: {
  href: string;
  icon: string;
  label: string;
  theme: ThemeConfig;
}) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      className={`group flex min-h-[74px] flex-col items-center justify-center gap-2 rounded-2xl border px-2 py-3 text-center text-xs font-semibold transition duration-200 hover:-translate-y-0.5 hover:shadow-md ${theme.action}`}
    >
      <span
        className={`text-xl transition duration-200 group-hover:scale-110 ${theme.actionIcon}`}
      >
        {icon}
      </span>
      <span>{label}</span>
    </a>
  );
}

export default function ReviewPage({
  business,
}: {
  business: Business;
}) {
  const [rating, setRating] = useState(0);
  const colors = getTheme(business.theme);
  const layout = getLayoutClasses(colors.layout);
  const businessEmoji = getBusinessEmoji(business.businessType);

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
    <main className={`min-h-screen overflow-hidden ${colors.page} ${colors.text} ${layout.main}`}>
      <section
        className={`relative overflow-hidden px-5 text-white ${layout.heroSection} ${colors.hero} ${colors.heroPattern}`}
      >
        <div className={`absolute inset-0 ${colors.heroGlow}`} />
        {getThemeDecor(colors.layout)}
        <div className="relative mx-auto max-w-md text-center">
          <div
            className={`mx-auto mb-5 flex h-24 w-24 items-center justify-center overflow-hidden border-4 ${colors.logo} ${
              colors.layout === "minimal"
                ? "h-20 w-20 border-2"
                : colors.layout === "editorial"
                ? "h-28 w-28 border"
                : colors.layout === "tech"
                ? "h-20 w-20 border"
                : ""
            }`}
          >
            {business.logoUrl ? (
              <img
                src={business.logoUrl}
                alt={`${business.name} logo`}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-4xl">{businessEmoji}</span>
            )}
          </div>

          {business.businessType && (
            <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white/80 backdrop-blur">
              {business.businessType}
            </span>
          )}

          {business.ownerName && (
            <p className="mt-3 text-sm font-medium text-white/75">
              Welcome from {business.ownerName}
            </p>
          )}

          <h1 className={`mt-3 text-4xl ${colors.title}`}>
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

      <div className={`relative z-10 mx-auto w-full max-w-md px-4 pb-10 ${layout.content}`}>
        <div className={`border ${layout.card} ${colors.card}`}>
          <section className={`text-center ${layout.rating}`}>
            <p
              className={`text-xs font-bold uppercase tracking-[0.18em] ${colors.sectionLabel}`}
            >
              Share your experience
            </p>

            <h2
              className={`mt-3 text-2xl font-bold ${
                colors.layout === "editorial"
                  ? "text-3xl sm:text-4xl"
                  : colors.layout === "minimal"
                  ? "text-xl font-medium"
                  : colors.layout === "tech"
                  ? "text-xl uppercase tracking-[0.08em]"
                  : colors.layout === "playful"
                  ? "text-3xl font-black"
                  : ""
              }`}
            >
              How was your visit?
            </h2>

            <p className={`mt-2 text-sm leading-6 ${colors.muted}`}>
              Tell us about your experience at{" "}
              <span className="font-semibold">{business.name}</span>.
            </p>

            <div className="mt-6 flex justify-center gap-1.5 sm:gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`text-4xl transition duration-200 hover:scale-110 ${
                    star <= rating ? colors.starsFull : colors.starsEmpty
                  }`}
                  aria-label={`Rate ${star} stars`}
                >
                  ★
                </button>
              ))}
            </div>

            <p className={`mt-4 text-sm font-medium ${colors.muted}`}>
              {ratingText}
            </p>
          </section>

          <section className="mt-8">
            <div className="mb-4">
              <p
                className={`text-xs font-bold uppercase tracking-[0.18em] ${colors.sectionLabel}`}
              >
                {business.businessType
                  ? `${business.businessType} Review`
                  : "Review"}
              </p>

              <h3 className={`mt-2 text-xl ${colors.title}`}>
                Create your review
              </h3>

              <p className={`mt-2 text-sm leading-6 ${colors.muted}`}>
                Select what you enjoyed at{" "}
                <span className="font-semibold">{business.name}</span> and
                create a natural review in your own words.
              </p>
            </div>

            <div className={`rounded-3xl border p-4 ${colors.cardInner}`}>
              <AIReviewAssistant
                businessName={business.name}
                businessType={business.businessType || "Business"}
                rating={rating}
              />
            </div>
          </section>

          {business.googleReviewUrl && (
            <>
              <a
                href={business.googleReviewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`mt-6 flex items-center justify-center gap-3 px-5 py-4 text-center font-bold transition duration-200 hover:-translate-y-0.5 hover:shadow-lg ${
                  colors.layout === "minimal"
                    ? "rounded-xl"
                    : colors.layout === "editorial"
                    ? "rounded-full"
                    : colors.layout === "tech"
                    ? "rounded-lg uppercase tracking-wide"
                    : colors.layout === "playful"
                    ? "rounded-[20px]"
                    : "rounded-2xl"
                } ${colors.button} ${colors.buttonText}`}
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-sm font-bold text-[#4285F4] shadow-sm">
                  G
                </span>
                Post Review on Google
              </a>

              <p className={`mt-3 text-center text-xs ${colors.muted}`}>
                Your review will open directly in Google.
              </p>
            </>
          )}

          {(business.menuUrl ||
            business.mapsUrl ||
            business.phone ||
            business.instagramUrl) && (
            <section className={`mt-7 grid grid-cols-2 sm:grid-cols-4 ${layout.actions}`}>
              {business.menuUrl && (
                <ActionLink
                  href={business.menuUrl}
                  icon="📖"
                  label="Menu"
                  theme={colors}
                />
              )}

              {business.mapsUrl && (
                <ActionLink
                  href={business.mapsUrl}
                  icon="📍"
                  label="Directions"
                  theme={colors}
                />
              )}

              {business.phone && (
                <ActionLink
                  href={`tel:${business.phone}`}
                  icon="☎️"
                  label="Call"
                  theme={colors}
                />
              )}

              {business.instagramUrl && (
                <ActionLink
                  href={business.instagramUrl}
                  icon="📸"
                  label="Instagram"
                  theme={colors}
                />
              )}
            </section>
          )}

          {business.whatsapp && (
            <a
              href={`/feedback?business=${encodeURIComponent(
                business.name
              )}&whatsapp=${encodeURIComponent(business.whatsapp)}`}
              className={`mt-6 flex items-center justify-between border px-5 py-4 transition hover:-translate-y-0.5 hover:shadow-md ${
                colors.layout === "minimal"
                  ? "rounded-xl"
                  : colors.layout === "editorial"
                  ? "rounded-[28px]"
                  : colors.layout === "organic"
                  ? "rounded-[30px]"
                  : colors.layout === "tech"
                  ? "rounded-lg"
                  : "rounded-2xl"
              } ${colors.privateBox}`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${colors.privateButton}`}
                >
                  🔒
                </div>

                <div className="text-left">
                  <p className="font-semibold">Private feedback</p>
                  <p className={`mt-1 text-xs leading-5 ${colors.muted}`}>
                    Help {business.name} improve — visible only to the business
                    team.
                  </p>
                </div>
              </div>

              <span className={`text-xl ${colors.muted}`}>›</span>
            </a>
          )}
        </div>

        {(business.facebookUrl || business.tiktokUrl) && (
          <div className="mt-5 flex justify-center gap-3">
            {business.facebookUrl && (
              <a
                href={business.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`rounded-xl border px-4 py-3 text-sm font-medium shadow-sm transition hover:-translate-y-0.5 ${colors.action}`}
              >
                Facebook
              </a>
            )}

            {business.tiktokUrl && (
              <a
                href={business.tiktokUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`rounded-xl border px-4 py-3 text-sm font-medium shadow-sm transition hover:-translate-y-0.5 ${colors.action}`}
              >
                TikTok
              </a>
            )}
          </div>
        )}

        <p className={`mt-7 text-center text-xs ${colors.footer}`}>
          Thank you for supporting local businesses
        </p>
      </div>
    </main>
  );
}