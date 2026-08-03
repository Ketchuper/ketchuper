"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  getHotelPrintName,
  getMarineHubPhoneLabel,
  getMarineHubPrimaryCta,
  getOfficialHotels,
  marineHub,
} from "@/config/marineHub";
import { ContactBlock, MarineHubQr, useSnorkelRentalUrl } from "@/components/marine-hub/shared";

function buildInquiryText(input: {
  hotel: string;
  date: string;
  people: string;
  name: string;
}) {
  const r = marineHub.snorkelRental;
  return [
    `【${r.productName}申し込み】`,
    `ホテル: ${input.hotel || "（未記入）"}`,
    `利用日: ${input.date || "（未記入）"}`,
    `人数: ${input.people || "（未記入）"}`,
    `お名前: ${input.name || "（未記入）"}`,
    "",
    "受取・返却の案内をお願いします。",
  ].join("\n");
}

export default function SnorkelRentalClient() {
  const searchParams = useSearchParams();
  const initialHotel = searchParams.get("hotel") ?? "";
  const src = searchParams.get("src") ?? "direct";
  const official = getOfficialHotels();

  const [hotel, setHotel] = useState(initialHotel);
  const [date, setDate] = useState("");
  const [people, setPeople] = useState("2");
  const [name, setName] = useState("");
  const [copied, setCopied] = useState(false);

  const bookingUrl = useSnorkelRentalUrl(hotel || undefined);
  const cta = getMarineHubPrimaryCta();
  const r = marineHub.snorkelRental;

  const inquiry = useMemo(
    () => buildInquiryText({ hotel, date, people, name }),
    [hotel, date, people, name]
  );

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await navigator.clipboard.writeText(inquiry);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // ignore
    }
    window.open(cta.href, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="mh-root min-h-dvh text-white">
      <div className="mh-atmosphere" aria-hidden />
      <main className="relative mx-auto flex w-full max-w-lg flex-col gap-10 px-5 pb-16 pt-10 sm:px-8">
        <header className="space-y-4">
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-[var(--mh-accent)]">
            MARINE HUB · {marineHub.operator}
          </p>
          <h1
            className="text-4xl leading-tight tracking-tight sm:text-5xl"
            style={{ fontFamily: "var(--font-mh-display), Georgia, serif" }}
          >
            {r.productName}
          </h1>
          <p className="max-w-md text-base leading-relaxed text-white/85">
            {r.tagline}
            <span className="mt-1 block text-sm text-white/65">{r.supportLine}</span>
          </p>
          {src === "hotel" || hotel ? (
            <p className="inline-block border-l-2 border-[var(--mh-accent)] pl-3 text-sm text-white/80">
              ホテル経由
              {hotel ? `（${hotel}）` : ""}
            </p>
          ) : null}
        </header>

        <section className="space-y-3" aria-labelledby="includes-heading">
          <h2 id="includes-heading" className="text-lg font-semibold tracking-wide">
            セット内容
          </h2>
          <ul className="grid grid-cols-2 gap-2 text-sm text-white/85">
            {r.includes.map((item) => (
              <li key={item} className="border-b border-white/15 py-2">
                {item}
              </li>
            ))}
          </ul>
          <p className="text-sm text-[var(--mh-accent)]">
            {r.priceHint}
            <span className="ml-2 text-white/55">{r.depositHint}</span>
          </p>
        </section>

        <section className="space-y-3" aria-labelledby="howto-heading">
          <h2 id="howto-heading" className="text-lg font-semibold tracking-wide">
            借り方
          </h2>
          <ol className="space-y-3">
            {r.howTo.map((step, i) => (
              <li key={step.title} className="grid grid-cols-[2rem_1fr] gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-sm font-bold">
                  {i + 1}
                </span>
                <div>
                  <p className="font-medium">{step.title}</p>
                  <p className="text-sm text-white/65">{step.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="space-y-4" aria-labelledby="apply-heading">
          <h2 id="apply-heading" className="text-lg font-semibold tracking-wide">
            申し込み（30秒）
          </h2>
          <form onSubmit={onSubmit} className="space-y-3">
            <label className="block space-y-1 text-sm">
              <span className="text-white/70">お名前</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mh-input"
                placeholder="山田"
                autoComplete="name"
              />
            </label>
            <label className="block space-y-1 text-sm">
              <span className="text-white/70">滞在ホテル</span>
              <input
                value={hotel}
                onChange={(e) => setHotel(e.target.value)}
                className="mh-input"
                list="official-hotels"
                placeholder="オフィシャルホテル名"
              />
              <datalist id="official-hotels">
                {official.map((h) => (
                  <option key={h.id} value={getHotelPrintName(h)} />
                ))}
              </datalist>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block space-y-1 text-sm">
                <span className="text-white/70">利用日</span>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="mh-input"
                />
              </label>
              <label className="block space-y-1 text-sm">
                <span className="text-white/70">人数</span>
                <input
                  value={people}
                  onChange={(e) => setPeople(e.target.value)}
                  className="mh-input"
                  inputMode="numeric"
                />
              </label>
            </div>
            <button type="submit" className="mh-btn-primary w-full">
              {copied ? "文面をコピーしました → 送信先を開きます" : "文面をコピーして申し込む"}
            </button>
          </form>
        </section>

        <section className="grid grid-cols-[1fr_auto] items-end gap-4 border-t border-white/15 pt-8">
          <div className="space-y-2">
            <p className="text-sm font-medium">電話・その他</p>
            <ContactBlock />
            <p className="text-xs text-white/50">TEL {getMarineHubPhoneLabel()}</p>
          </div>
          <MarineHubQr url={bookingUrl} size={112} label="このページ" />
        </section>

        <p className="text-center text-[11px] text-white/40">
          印刷用:{" "}
          <Link className="underline" href="/marine-hub/snorkel-rental/pamphlet">
            レンタルパンフ
          </Link>
        </p>
      </main>

      <style jsx global>{`
        .mh-root {
          --mh-ink: #04222c;
          --mh-accent: #3ecfc0;
          background:
            radial-gradient(120% 80% at 10% -10%, rgba(62, 207, 192, 0.28), transparent 55%),
            radial-gradient(90% 60% at 100% 0%, rgba(14, 116, 144, 0.35), transparent 50%),
            linear-gradient(165deg, #04222c 0%, #0a4a58 48%, #062f3a 100%);
          font-family: var(--font-mh-sans), "Hiragino Sans", sans-serif;
        }
        .mh-atmosphere {
          pointer-events: none;
          position: fixed;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E");
          opacity: 0.45;
          mix-blend-mode: soft-light;
        }
        .mh-input {
          width: 100%;
          border-radius: 0.5rem;
          border: 1px solid rgba(255, 255, 255, 0.22);
          background: rgba(4, 34, 44, 0.55);
          padding: 0.7rem 0.85rem;
          color: white;
          outline: none;
        }
        .mh-input:focus {
          border-color: var(--mh-accent);
        }
        .mh-btn-primary {
          border-radius: 0.5rem;
          background: var(--mh-accent);
          color: var(--mh-ink);
          font-weight: 700;
          padding: 0.85rem 1rem;
          min-height: 3rem;
        }
      `}</style>
    </div>
  );
}
