import QRCode from "qrcode";
import { supabase } from "@/lib/supabase";

export default async function QRPage({
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

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const reviewUrl = `${baseUrl}/r/${business.slug}`;

  const qrCode = await QRCode.toDataURL(reviewUrl, {
    width: 500,
    margin: 2,
  });

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black p-6 text-white">
      <h1 className="text-center text-3xl font-bold">
        {business.name}
      </h1>

      <p className="mt-2 text-white/60">
        Scan to leave a review
      </p>

      <img
        src={qrCode}
        alt={`QR code for ${business.name}`}
        className="mt-8 rounded-2xl bg-white p-4"
      />

      <p className="mt-6 break-all text-center text-sm text-white/50">
        {reviewUrl}
      </p>
    </main>
  );
}