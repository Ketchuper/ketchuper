"use client";

import Link from "next/link";
import { Fraunces, Noto_Sans_JP } from "next/font/google";
import {
  getMarineHubPhoneLabel,
  marineHub,
} from "@/config/marineHub";
import { MarineHubQr, useMarineHubBookingUrl } from "@/components/marine-hub/shared";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-mh-display",
  display: "swap",
});

const sans = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-mh-sans",
  display: "swap",
});

/**
 * ホテル向けパンフ（急ぎ用）
 * ブラウザで開いて Cmd/Ctrl+P → 用紙A5 / 余白最小 / 背景グラフィックあり
 */
export default function MarineHubPamphletPage() {
  const bookingUrl = useMarineHubBookingUrl();
  const phone = getMarineHubPhoneLabel();

  return (
    <div className={`${display.variable} ${sans.variable} pamphlet-root`}>
      <div className="no-print toolbar">
        <p>
          ホテル向けパンフ — 印刷前に <code>src/config/marineHub.ts</code> の phone / lineUrl を記入
        </p>
        <button type="button" onClick={() => window.print()}>
          印刷する
        </button>
        <Link href="/marine-hub/flyer">チラシへ</Link>
        <Link href="/marine-hub">申し込みLPへ</Link>
      </div>

      <div className="sheet">
        {/* 表面 */}
        <section className="page front">
          <div className="wave" aria-hidden />
          <p className="brand-en">MARINE HUB</p>
          <h1 className="brand-ja">{marineHub.brand}</h1>
          <p className="operator">{marineHub.operator}</p>
          <p className="tagline">{marineHub.tagline}</p>
          <p className="support">{marineHub.supportLine}</p>

          <ul className="plans">
            {marineHub.plans.map((p) => (
              <li key={p.id}>
                <span className="badge">{p.badge}</span>
                <div>
                  <strong>{p.name}</strong>
                  <span className="blurb">{p.blurb}</span>
                </div>
                <span className="price">{p.priceHint}</span>
              </li>
            ))}
          </ul>

          <div className="cta-row">
            <MarineHubQr url={bookingUrl} size={120} label="スマホで申込" />
            <div className="cta-text">
              <p className="cta-label">QRまたは電話で今すぐ</p>
              <p className="phone">TEL {phone}</p>
              <p className="sub">
                Instagram {marineHub.instagramHandle}
                <br />
                {marineHub.websiteUrl.replace(/^https?:\/\//, "")}
              </p>
            </div>
          </div>
        </section>

        {/* 裏面 */}
        <section className="page back">
          <div className="wave soft" aria-hidden />
          <h2>ホテルのお客様へ</h2>
          <ol className="steps">
            <li>
              <strong>QRを撮る</strong>
              <span>日本語の申し込みページが開きます</span>
            </li>
            <li>
              <strong>希望日・人数を送る</strong>
              <span>LINE / DM / 電話、どれでもOK</span>
            </li>
            <li>
              <strong>ホテル名を伝える</strong>
              <span>送迎の相談もスムーズになります</span>
            </li>
          </ol>

          <div className="why">
            <h3>選ばれる理由</h3>
            <p>日本語対応 · 半日プランあり · GoPro撮影データ特典（対象プラン） · Google口コミ高評価</p>
          </div>

          <div className="cta-row bottom">
            <MarineHubQr url={bookingUrl} size={100} label="申込QR" />
            <div className="cta-text">
              <p className="brand-mini">{marineHub.brand} / {marineHub.operator}</p>
              <p className="phone">TEL {phone}</p>
              <p className="sub">車でもホテルでも、同じ申し込み先です</p>
            </div>
          </div>

          <p className="hotel-note">
            ※ホテルスタッフ様へ：残部が少なくなったらお声がけください。補充に伺います。
          </p>
        </section>
      </div>

      <style jsx global>{`
        .pamphlet-root {
          --ink: #04222c;
          --deep: #0a4a58;
          --accent: #1fa896;
          --foam: #e8fffa;
          --sand: #f3f7f6;
          font-family: var(--font-mh-sans), "Hiragino Sans", sans-serif;
          color: var(--ink);
          background: #d7e6e3;
          min-height: 100dvh;
          padding: 1rem;
        }
        .toolbar {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          align-items: center;
          margin: 0 auto 1rem;
          max-width: 148mm;
          font-size: 0.8rem;
        }
        .toolbar button,
        .toolbar a {
          border: 1px solid var(--deep);
          background: white;
          padding: 0.45rem 0.8rem;
          border-radius: 0.35rem;
          text-decoration: none;
          color: var(--ink);
          cursor: pointer;
        }
        .sheet {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          align-items: center;
        }
        .page {
          position: relative;
          width: 148mm;
          min-height: 210mm;
          background:
            linear-gradient(160deg, #f7fffd 0%, #e7f6f3 40%, #d4efe9 100%);
          overflow: hidden;
          padding: 12mm 11mm 10mm;
          box-sizing: border-box;
          box-shadow: 0 8px 28px rgba(4, 34, 44, 0.12);
        }
        .wave {
          position: absolute;
          inset: auto -10% -8% -10%;
          height: 42%;
          background:
            radial-gradient(120% 80% at 20% 0%, rgba(31, 168, 150, 0.35), transparent 60%),
            radial-gradient(100% 70% at 90% 30%, rgba(10, 74, 88, 0.25), transparent 55%);
          pointer-events: none;
        }
        .wave.soft {
          height: 28%;
          opacity: 0.7;
        }
        .brand-en {
          position: relative;
          margin: 0;
          letter-spacing: 0.35em;
          font-size: 11px;
          font-weight: 700;
          color: var(--accent);
        }
        .brand-ja {
          position: relative;
          margin: 0.35rem 0 0;
          font-family: var(--font-mh-display), Georgia, serif;
          font-size: 42px;
          line-height: 1.05;
          font-weight: 700;
        }
        .operator {
          position: relative;
          margin: 0.4rem 0 0;
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 0.04em;
        }
        .tagline {
          position: relative;
          margin: 1.1rem 0 0;
          font-size: 18px;
          font-weight: 700;
          line-height: 1.45;
          max-width: 28ch;
        }
        .support {
          position: relative;
          margin: 0.35rem 0 0;
          font-size: 13px;
          color: rgba(4, 34, 44, 0.72);
        }
        .plans {
          position: relative;
          list-style: none;
          margin: 1.4rem 0 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
        }
        .plans li {
          display: grid;
          grid-template-columns: 52px 1fr auto;
          gap: 0.55rem;
          align-items: start;
          padding-bottom: 0.55rem;
          border-bottom: 1px solid rgba(4, 34, 44, 0.12);
        }
        .badge {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.06em;
          color: var(--accent);
          padding-top: 0.15rem;
        }
        .plans strong {
          display: block;
          font-size: 13px;
        }
        .blurb {
          display: block;
          margin-top: 0.15rem;
          font-size: 11px;
          color: rgba(4, 34, 44, 0.7);
          line-height: 1.4;
        }
        .price {
          font-size: 12px;
          font-weight: 700;
          white-space: nowrap;
        }
        .cta-row {
          position: relative;
          margin-top: 1.4rem;
          display: flex;
          gap: 1rem;
          align-items: center;
        }
        .cta-row.bottom {
          margin-top: 1.8rem;
        }
        .cta-label {
          margin: 0;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.04em;
        }
        .phone {
          margin: 0.35rem 0 0;
          font-size: 20px;
          font-weight: 900;
          letter-spacing: 0.02em;
        }
        .sub {
          margin: 0.35rem 0 0;
          font-size: 11px;
          line-height: 1.45;
          color: rgba(4, 34, 44, 0.7);
        }
        .back h2 {
          position: relative;
          margin: 0;
          font-size: 22px;
          font-family: var(--font-mh-display), Georgia, serif;
        }
        .steps {
          position: relative;
          margin: 1.2rem 0 0;
          padding: 0;
          list-style: none;
          counter-reset: step;
          display: flex;
          flex-direction: column;
          gap: 0.9rem;
        }
        .steps li {
          counter-increment: step;
          display: grid;
          grid-template-columns: 28px 1fr;
          gap: 0.55rem;
        }
        .steps li::before {
          content: counter(step);
          width: 28px;
          height: 28px;
          border-radius: 999px;
          background: var(--ink);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 700;
        }
        .steps strong {
          display: block;
          font-size: 14px;
        }
        .steps span {
          display: block;
          margin-top: 0.15rem;
          font-size: 12px;
          color: rgba(4, 34, 44, 0.7);
        }
        .why {
          position: relative;
          margin-top: 1.6rem;
          padding-top: 1rem;
          border-top: 1px solid rgba(4, 34, 44, 0.12);
        }
        .why h3 {
          margin: 0;
          font-size: 13px;
          letter-spacing: 0.08em;
        }
        .why p {
          margin: 0.45rem 0 0;
          font-size: 12px;
          line-height: 1.55;
        }
        .brand-mini {
          margin: 0;
          font-size: 12px;
          font-weight: 700;
        }
        .hotel-note {
          position: relative;
          margin: 1.6rem 0 0;
          font-size: 10px;
          color: rgba(4, 34, 44, 0.55);
        }
        @media print {
          @page {
            size: A5;
            margin: 0;
          }
          .no-print {
            display: none !important;
          }
          .pamphlet-root {
            background: white;
            padding: 0;
          }
          .sheet {
            gap: 0;
          }
          .page {
            box-shadow: none;
            width: 148mm;
            height: 210mm;
            min-height: 210mm;
            page-break-after: always;
            break-after: page;
          }
          .page.back {
            page-break-after: auto;
          }
        }
      `}</style>
    </div>
  );
}
