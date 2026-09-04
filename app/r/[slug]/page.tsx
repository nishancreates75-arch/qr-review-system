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
        <div className="text-center">
          <h1 className="text-2xl font-bold">
            Business not found
          </h1>

          <p className="mt-2 text-sm text-white/50">
            Please check the business link and try again.
          </p>
        </div>
      </main>
    );
  }

  // Record page visit / QR scan
const { error: scanError } = await supabase
  .from("qr_scans")
  .insert({
    business_id: business.id,
  });

if (scanError) {
  console.error(
    "QR scan tracking error:",
    scanError.message,
    scanError.details,
    scanError.hint
  );
}

  const formattedBusiness = {
    name: business.name || "",
    location: business.location || "",
    googleReviewUrl: business.google_review_url || "",
    phone: business.phone || "",
    whatsapp: business.whatsapp || "",
    mapsUrl: business.maps_url || "",
    logoUrl: business.logo_url || "",
    instagramUrl: business.instagram_url || "",
    facebookUrl: business.facebook_url || "",
    tiktokUrl: business.tiktok_url || "",
    menuUrl: business.menu_url || "",
    theme: business.theme || "professional",
    logoUrl: business.logo_url || "",
  };

  return <ReviewPage business={formattedBusiness} />;
}