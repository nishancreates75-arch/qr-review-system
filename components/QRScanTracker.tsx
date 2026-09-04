"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function QRScanTracker({
  businessId,
}: {
  businessId: string;
}) {
  useEffect(() => {
    async function trackScan() {
      const { error } = await supabase.from("qr_scans").insert({
        business_id: businessId,
      });

      if (error) {
        console.error("QR scan tracking error:", error);
      }
    }

    trackScan();
  }, [businessId]);

  return null;
}