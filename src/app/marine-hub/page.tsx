import { Suspense } from "react";
import type { Metadata } from "next";
import { Fraunces, Noto_Sans_JP } from "next/font/google";
import MarineHubBookingPage from "./MarineHubBookingClient";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-mh-display",
  display: "swap",
});

const sans = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-mh-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "マリンハブ申し込み | CEBUOCTO",
  description: "ホテル・車経由のセブ島マリンツアー申し込み。半日プランから日本語で安心予約。",
};

function Fallback() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-[#04222c] text-white">
      読み込み中…
    </div>
  );
}

export default function MarineHubPage() {
  return (
    <div className={`${display.variable} ${sans.variable}`}>
      <Suspense fallback={<Fallback />}>
        <MarineHubBookingPage />
      </Suspense>
    </div>
  );
}
