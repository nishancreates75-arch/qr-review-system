import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      experienceType,
      details,
      topics,
      businessName,
    } = body;

    if (!details?.trim()) {
      return NextResponse.json(
        { error: "Please provide your experience details." },
        { status: 400 }
      );
    }

    const isPositive =
      experienceType === "excellent" ||
      experienceType === "good";

    const prompt = isPositive
      ? `Write a natural, authentic Google review draft for ${businessName || "this business"}.

Customer experience: ${experienceType}
Topics mentioned: ${topics?.join(", ") || "none"}
Customer notes: ${details}

Rules:
- Use only the customer's real experience.
- Do not invent facts.
- Keep it natural and concise.
- Do not exaggerate.
- Return only the review text.`
      : `Rewrite this customer's private feedback constructively for ${businessName || "this business"}.

Experience: ${experienceType}
Topics mentioned: ${topics?.join(", ") || "none"}
Customer notes: ${details}

Rules:
- Be respectful and constructive.
- Use only the customer's real experience.
- Do not invent facts.
- Keep it concise.
- Return only the feedback text.`;

    const response = await openai.responses.create({
      model: "gpt-5.6-luna",
      input: prompt,
    });

    return NextResponse.json({
      review: response.output_text,
    });
  } catch (error) {
    console.error("AI generation error:", error);

    return NextResponse.json(
      { error: "Unable to generate the review right now." },
      { status: 500 }
    );
  }
}