"use client";

import Link from "next/link";
import { Fraunces, Noto_Sans_JP } from "next/font/google";
import { getMarineHubPhoneLabel, marineHub } from "@/config/marineHub";
import { MarineHubQr, useMarineHubBookingUrl } from "@/components/marine-hub/shared";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-mh-display",
  display: "swap",
});

const sans = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-mh-sans",
  display: "swap",
});

/**
 * 車内・ホテルフロント用チラシ（QR＋電話を大きく）
 * 印刷: A6〜A5 / 余白なし / 背景グラフィックあり
 */
export default function MarineHubFlyerPage() {
  const bookingUrl = useMarineHubBookingUrl();
  const phone = getMarineHubPhoneLabel();

  return (
    <div className={`${display.variable} ${sans.variable} flyer-root`}>
      <div className="no-print toolbar">
        <p>チラシ — QRと電話が主役。車内ポケット／フロント横向け</p>
        <button type="button" onClick={() => window.print()}>
          印刷する
        </button>
        <Link href="/marine-hub/pamphlet">パンフへ</Link>
      </div>

      <article className="flyer">
        <div className="glow" aria-hidden />
        <p className="en">MARINE HUB</p>
        <h1>{marineHub.brand}</h1>
        <p className="op">{marineHub.operator}</p>
        <p className="hook">{marineHub.tagline}</p>

        <div className="qr-wrap">
          <MarineHubQr url={bookingUrl} size={168} label="ここから申込" />
        </div>

        <p className="phone-label">電話</p>
        <p className="phone">{phone}</p>
        <p className="ig">
          {marineHub.instagramHandle} · LINE / DM OK
        </p>
        <p className="note">半日で海も空も。日本語で安心。</p>
      </article>

      {/* 2枚目：切り分け用の複製レイアウト（1シート2枚印刷向け簡易） */}
      <article className="flyer twin">
        <div className="glow" aria-hidden />
        <p className="en">MARINE HUB</p>
        <h1>{marineHub.brand}</h1>
        <p className="op">{marineHub.operator}</p>
        <p className="hook">{marineHub.tagline}</p>
        <div className="qr-wrap">
          <MarineHubQr url={bookingUrl} size={168} label="ここから申込" />
        </div>
        <p className="phone-label">電話</p>
        <p className="phone">{phone}</p>
        <p className="ig">
          {marineHub.instagramHandle} · LINE / DM OK
        </p>
        <p className="note">半日で海も空も。日本語で安心。</p>
      </article>

      <style jsx global>{`
        .flyer-root {
          --ink: #04222c;
          --accent: #2ec4b6;
          font-family: var(--font-mh-sans), "Hiragino Sans", sans-serif;
          background: #cfe4df;
          color: white;
          min-height: 100dvh;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }
        .toolbar {
          color: var(--ink);
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          align-items: center;
          font-size: 0.8rem;
          max-width: 420px;
          width: 100%;
        }
        .toolbar button,
        .toolbar a {
          border: 1px solid var(--ink);
          background: white;
          color: var(--ink);
          padding: 0.45rem 0.8rem;
          border-radius: 0.35rem;
          text-decoration: none;
          cursor: pointer;
        }
        .flyer {
          position: relative;
          width: 105mm;
          min-height: 148mm;
          box-sizing: border-box;
          padding: 10mm 9mm;
          overflow: hidden;
          background:
            radial-gradient(90% 70% at 80% -10%, rgba(46, 196, 182, 0.45), transparent 55%),
            linear-gradient(165deg, #04222c 0%, #0a5463 55%, #083b47 100%);
          box-shadow: 0 10px 30px rgba(4, 34, 44, 0.2);
          text-align: center;
        }
        .glow {
          position: absolute;
          inset: auto -20% -25% -20%;
          height: 55%;
          background: radial-gradient(circle at 50% 0%, rgba(46, 196, 182, 0.35), transparent 70%);
          pointer-events: none;
        }
        .en {
          position: relative;
          margin: 0;
          letter-spacing: 0.38em;
          font-size: 11px;
          font-weight: 700;
          color: var(--accent);
        }
        .flyer h1 {
          position: relative;
          margin: 0.4rem 0 0;
          font-family: var(--font-mh-display), Georgia, serif;
          font-size: 34px;
          line-height: 1.05;
        }
        .op {
          position: relative;
          margin: 0.35rem 0 0;
          font-size: 12px;
          font-weight: 700;
          opacity: 0.9;
        }
        .hook {
          position: relative;
          margin: 0.9rem auto 0;
          max-width: 18ch;
          font-size: 15px;
          font-weight: 700;
          line-height: 1.4;
        }
        .qr-wrap {
          position: relative;
          margin: 1.1rem auto 0;
          width: fit-content;
        }
        .phone-label {
          position: relative;
          margin: 0.9rem 0 0;
          font-size: 11px;
          letter-spacing: 0.2em;
          opacity: 0.75;
        }
        .phone {
          position: relative;
          margin: 0.2rem 0 0;
          font-size: 22px;
          font-weight: 900;
          letter-spacing: 0.02em;
        }
        .ig {
          position: relative;
          margin: 0.45rem 0 0;
          font-size: 11px;
          opacity: 0.8;
        }
        .note {
          position: relative;
          margin: 0.7rem 0 0;
          font-size: 11px;
          opacity: 0.7;
        }
        @media print {
          @page {
            size: A5;
            margin: 8mm;
          }
          .no-print {
            display: none !important;
          }
          .flyer-root {
            background: white;
            padding: 0;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 6mm;
            align-items: start;
          }
          .flyer {
            box-shadow: none;
            width: auto;
            min-height: 120mm;
            break-inside: avoid;
          }
        }
      `}</style>
    </div>
  );
}
