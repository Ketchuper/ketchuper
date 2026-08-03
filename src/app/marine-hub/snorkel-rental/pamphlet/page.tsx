"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Fraunces, Noto_Sans_JP } from "next/font/google";
import {
  getHotelPrintName,
  getMarineHubPhoneLabel,
  getOfficialHotels,
  marineHub,
  type MarineHubHotel,
} from "@/config/marineHub";
import { MarineHubQr, useSnorkelRentalUrl } from "@/components/marine-hub/shared";

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
 * シュノーケルレンタル専用パンフ（オフィシャル2ホテル向け・今置く分）
 * ホテル切替 → 印刷。QRに hotel= が埋め込まれる。
 */
export default function SnorkelRentalPamphletPage() {
  const hotels = getOfficialHotels();
  const [hotelId, setHotelId] = useState(hotels[0]?.id ?? "");
  const hotel = useMemo(
    () => hotels.find((h) => h.id === hotelId) ?? hotels[0],
    [hotels, hotelId]
  );
  const hotelName = hotel ? getHotelPrintName(hotel) : "";
  const bookingUrl = useSnorkelRentalUrl(hotelName || undefined);
  const phone = getMarineHubPhoneLabel();
  const r = marineHub.snorkelRental;

  return (
    <div className={`${display.variable} ${sans.variable} pamphlet-root`}>
      <div className="no-print toolbar">
        <p>シュノーケルレンタルパンフ — オフィシャル2件にまず置く</p>
        <label className="hotel-select">
          置くホテル
          <select value={hotelId} onChange={(e) => setHotelId(e.target.value)}>
            {hotels.map((h: MarineHubHotel) => (
              <option key={h.id} value={h.id}>
                {getHotelPrintName(h)}
              </option>
            ))}
          </select>
        </label>
        <button type="button" onClick={() => window.print()}>
          このホテル分を印刷
        </button>
        <Link href="/marine-hub/snorkel-rental">申込LP</Link>
        <Link href="/marine-hub">ツアーLP</Link>
      </div>

      <div className="sheet">
        <section className="page front">
          <div className="wave" aria-hidden />
          <p className="brand-en">MARINE HUB RENTAL</p>
          <h1 className="brand-ja">{r.productName}</h1>
          <p className="operator">{marineHub.brand} / {marineHub.operator}</p>
          <p className="tagline">{r.tagline}</p>
          <p className="support">{r.supportLine}</p>

          {hotelName ? (
            <p className="hotel-chip">設置: {hotelName}</p>
          ) : null}

          <ul className="plans">
            {r.includes.map((item) => (
              <li key={item}>
                <span className="badge">SET</span>
                <div>
                  <strong>{item}</strong>
                </div>
                <span className="price" />
              </li>
            ))}
          </ul>

          <p className="price-line">
            {r.priceHint}
            <span>{r.depositHint}</span>
          </p>

          <div className="cta-row">
            <MarineHubQr url={bookingUrl} size={120} label="レンタル申込" />
            <div className="cta-text">
              <p className="cta-label">QRまたは電話で今すぐ</p>
              <p className="phone">TEL {phone}</p>
              <p className="sub">
                Instagram {marineHub.instagramHandle}
                <br />
                ホテル名を伝えると受取がスムーズ
              </p>
            </div>
          </div>
        </section>

        <section className="page back">
          <div className="wave soft" aria-hidden />
          <h2>借り方（3ステップ）</h2>
          <ol className="steps">
            {r.howTo.map((step) => (
              <li key={step.title}>
                <strong>{step.title}</strong>
                <span>{step.detail}</span>
              </li>
            ))}
          </ol>

          <div className="why">
            <h3>このホテルのお客様へ</h3>
            <p>
              {hotelName
                ? `${hotelName} 滞在の方は、フロントのパンフからそのまま申し込めます。`
                : "フロントのパンフからそのまま申し込めます。"}
              受取・返却は申し込み時にご案内します。
            </p>
          </div>

          <div className="cta-row bottom">
            <MarineHubQr url={bookingUrl} size={100} label="申込QR" />
            <div className="cta-text">
              <p className="brand-mini">
                {marineHub.brand} · {r.productName}
              </p>
              <p className="phone">TEL {phone}</p>
              <p className="sub">やれることをやり切る。</p>
            </div>
          </div>

          <p className="hotel-note">
            ※ホテルスタッフ様へ：残部が少なくなったらお声がけください。部数ログに残して補充します。
          </p>
        </section>
      </div>

      <style jsx global>{`
        .pamphlet-root {
          --ink: #04222c;
          --deep: #0a4a58;
          --accent: #1fa896;
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
        .toolbar a,
        .hotel-select select {
          border: 1px solid var(--deep);
          background: white;
          padding: 0.45rem 0.8rem;
          border-radius: 0.35rem;
          text-decoration: none;
          color: var(--ink);
          cursor: pointer;
        }
        .hotel-select {
          display: flex;
          align-items: center;
          gap: 0.4rem;
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
          background: linear-gradient(160deg, #f7fffd 0%, #e7f6f3 40%, #d4efe9 100%);
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
          letter-spacing: 0.28em;
          font-size: 11px;
          font-weight: 700;
          color: var(--accent);
        }
        .brand-ja {
          position: relative;
          margin: 0.35rem 0 0;
          font-family: var(--font-mh-display), Georgia, serif;
          font-size: 34px;
          line-height: 1.1;
          font-weight: 700;
        }
        .operator {
          position: relative;
          margin: 0.4rem 0 0;
          font-size: 13px;
          font-weight: 700;
        }
        .tagline {
          position: relative;
          margin: 1rem 0 0;
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
        .hotel-chip {
          position: relative;
          display: inline-block;
          margin: 0.9rem 0 0;
          padding: 0.25rem 0.6rem;
          border: 1px solid rgba(4, 34, 44, 0.2);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.04em;
        }
        .plans {
          position: relative;
          list-style: none;
          margin: 1.1rem 0 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
        }
        .plans li {
          display: grid;
          grid-template-columns: 44px 1fr auto;
          gap: 0.55rem;
          align-items: center;
          padding-bottom: 0.4rem;
          border-bottom: 1px solid rgba(4, 34, 44, 0.12);
        }
        .badge {
          font-size: 10px;
          font-weight: 700;
          color: var(--accent);
        }
        .plans strong {
          font-size: 14px;
        }
        .price-line {
          position: relative;
          margin: 0.9rem 0 0;
          font-size: 14px;
          font-weight: 700;
        }
        .price-line span {
          margin-left: 0.6rem;
          font-size: 11px;
          font-weight: 500;
          color: rgba(4, 34, 44, 0.65);
        }
        .cta-row {
          position: relative;
          margin-top: 1.2rem;
          display: flex;
          gap: 1rem;
          align-items: center;
        }
        .cta-row.bottom {
          margin-top: 1.6rem;
        }
        .cta-label {
          margin: 0;
          font-size: 12px;
          font-weight: 700;
        }
        .phone {
          margin: 0.35rem 0 0;
          font-size: 20px;
          font-weight: 900;
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
          margin-top: 1.4rem;
          padding-top: 1rem;
          border-top: 1px solid rgba(4, 34, 44, 0.12);
        }
        .why h3 {
          margin: 0;
          font-size: 13px;
          letter-spacing: 0.06em;
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
          margin: 1.4rem 0 0;
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
