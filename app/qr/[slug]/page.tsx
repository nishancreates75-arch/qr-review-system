"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { businesses } from "@/data/businesses";

export default function QRPage() {
  const [qrCode, setQrCode] = useState("");
  const [businessName, setBusinessName] = useState("");

  useEffect(() => {
    async function generateQR() {
      const slug = window.location.pathname.split("/").pop();

      if (!slug) return;

      const business =
        businesses[slug as keyof typeof businesses];

      if (!business) return;

      setBusinessName(business.name);

      const url = `${window.location.origin}/r/${slug}`;

      const qr = await QRCode.toDataURL(url, {
        width: 800,
        margin: 2,
      });

      setQrCode(qr);
    }

    generateQR();
  }, []);

  function downloadQR() {
    if (!qrCode) return;

    const slug = window.location.pathname.split("/").pop();

    const link = document.createElement("a");
    link.href = qrCode;
    link.download = `${slug}-qr-code.png`;
    link.click();
  }

  if (!businessName) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
        Generating QR...
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-black p-5 text-white">
      <div className="w-full max-w-md rounded-3xl border border-white/20 bg-white/10 p-8 text-center backdrop-blur-xl">
        <h1 className="text-3xl font-bold">
          {businessName}
        </h1>

        <p className="mt-2 text-white/60">
          Scan to open our review page
        </p>

        {qrCode && (
          <>
            <img
              src={qrCode}
              alt={`${businessName} QR Code`}
              className="mx-auto mt-8 w-72 rounded-2xl bg-white p-4"
            />

            <button
              onClick={downloadQR}
              className="mt-6 w-full rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 px-6 py-4 font-bold"
            >
              ⬇ DOWNLOAD QR CODE
            </button>
          </>
        )}
      </div>
    </main>
  );
}