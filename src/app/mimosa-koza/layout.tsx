import type { Metadata, Viewport } from "next";
import { Anton, DM_Sans } from "next/font/google";
import "./mimosa.css";

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-mimosa-display",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-mimosa-body",
});

export const metadata: Metadata = {
  title: "MIMO$A KOZA | 古着 × 音楽 — 8/15 SUMMER PUSH",
  description:
    "沖縄市コザのコンセプトショップ MIMO$A KOZA。古着×音楽。8/15までの夏の追加売上チャレンジ。Instagram @mimosa.koza",
  openGraph: {
    title: "MIMO$A KOZA | SUMMER PUSH to 8/15",
    description: "古着 × 音楽。コザからストリートカルチャーを発信。",
    images: ["/mimosa-koza/hero-wide.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function MimosaKozaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${anton.variable} ${dmSans.variable} mimosa-koza-root`}
      lang="ja"
    >
      {children}
    </div>
  );
}
