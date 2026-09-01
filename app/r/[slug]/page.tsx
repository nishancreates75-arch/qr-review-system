import ReviewPage from "@/components/ReviewPage";
import { supabase } from "@/lib/supabase";

export default async function BusinessPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const { data: business, error } = await supabase
    .from("businesses")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !business) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
        <h1 className="text-2xl font-bold">Business not found</h1>
      </main>
    );
  }

  return <ReviewPage business={business} />;
}