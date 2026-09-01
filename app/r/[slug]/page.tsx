import ReviewPage from "@/components/ReviewPage";
import { businesses } from "@/data/businesses";

export default async function BusinessPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const business = businesses[slug as keyof typeof businesses];

  if (!business) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
        <h1 className="text-2xl font-bold">Business not found</h1>
      </main>
    );
  }

  return <ReviewPage business={business} />;
}