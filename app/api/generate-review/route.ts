import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const businessName = body.businessName || "this business";
    const rating = Number(body.rating) || 5;
    const keywords = Array.isArray(body.keywords) ? body.keywords : [];

    let review = "";

    if (rating >= 5) {
      review = `I had a wonderful experience at ${businessName}.`;

      if (keywords.length > 0) {
        review += ` I especially appreciated the ${keywords.join(", ")}.`;
      }

      review +=
        " The service was excellent and the overall experience was very enjoyable. I would definitely recommend this place to others.";
    } else if (rating >= 4) {
      review = `I had a good experience at ${businessName}.`;

      if (keywords.length > 0) {
        review += ` I liked the ${keywords.join(", ")}.`;
      }

      review +=
        " Overall, the experience was positive and I would be happy to visit again.";
    } else if (rating >= 3) {
      review = `My experience at ${businessName} was okay overall.`;

      if (keywords.length > 0) {
        review += ` I noticed the ${keywords.join(", ")}.`;
      }

      review +=
        " There are some things that could be improved, but I appreciate the effort of the team.";
    } else {
      review = `My experience at ${businessName} was not completely satisfactory.`;

      if (keywords.length > 0) {
        review += ` My main concerns were related to ${keywords.join(", ")}.`;
      }

      review +=
        " I hope the business can use this feedback to improve the customer experience.";
    }

    return NextResponse.json({
      review,
    });
  } catch {
    return NextResponse.json(
      {
        error: "Failed to generate review",
      },
      {
        status: 500,
      }
    );
  }
}