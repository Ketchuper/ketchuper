import { Suspense } from "react";
import type { Metadata } from "next";
import { Fraunces, Noto_Sans_JP } from "next/font/google";
import SnorkelRentalClient from "./SnorkelRentalClient";

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
  title: "シュノーケルレンタル申し込み | マリンハブ",
  description: "ホテル滞在向けシュノーケルレンタル。マスク・フィンを日本語で受付。",
};

export default function SnorkelRentalPage() {
  return (
    <div className={`${display.variable} ${sans.variable}`}>
      <Suspense
        fallback={
          <div className="flex min-h-dvh items-center justify-center bg-[#04222c] text-white">
            読み込み中…
          </div>
        }
      >
        <SnorkelRentalClient />
      </Suspense>
    </div>
  );
}
