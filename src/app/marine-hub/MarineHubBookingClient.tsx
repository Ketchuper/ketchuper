"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  getMarineHubPhoneLabel,
  getMarineHubPrimaryCta,
  marineHub,
} from "@/config/marineHub";
import { ContactBlock, MarineHubQr, useMarineHubBookingUrl } from "@/components/marine-hub/shared";

function buildInquiryText(input: {
  hotel: string;
  date: string;
  people: string;
  plan: string;
  name: string;
}) {
  return [
    "【マリンハブ申し込み】",
    `ホテル: ${input.hotel || "（未記入）"}`,
    `希望日: ${input.date || "（未記入）"}`,
    `人数: ${input.people || "（未記入）"}`,
    `希望プラン: ${input.plan || "相談したい"}`,
    `お名前: ${input.name || "（未記入）"}`,
    "",
    "上記で空き確認お願いします。",
  ].join("\n");
}

export default function MarineHubBookingPage() {
  const searchParams = useSearchParams();
  const initialHotel = searchParams.get("hotel") ?? "";
  const src = searchParams.get("src") ?? "direct";

  const [hotel, setHotel] = useState(initialHotel);
  const [date, setDate] = useState("");
  const [people, setPeople] = useState("2");
  const [plan, setPlan] = useState<string>(marineHub.plans[0]?.name ?? "");
  const [name, setName] = useState("");
  const [copied, setCopied] = useState(false);

  const bookingUrl = useMarineHubBookingUrl(hotel || undefined);
  const cta = getMarineHubPrimaryCta();

  const inquiry = useMemo(
    () => buildInquiryText({ hotel, date, people, plan, name }),
    [hotel, date, people, plan, name]
  );

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await navigator.clipboard.writeText(inquiry);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // clipboard may fail — still open CTA
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
            {marineHub.brand}
          </h1>
          <p className="max-w-md text-base leading-relaxed text-white/85">
            {marineHub.tagline}
            <span className="mt-1 block text-sm text-white/65">{marineHub.supportLine}</span>
          </p>
          {src === "hotel" || hotel ? (
            <p className="inline-block border-l-2 border-[var(--mh-accent)] pl-3 text-sm text-white/80">
              ホテル経由の申し込み
              {hotel ? `（${hotel}）` : ""}
            </p>
          ) : null}
        </header>

        <section className="space-y-4" aria-labelledby="plans-heading">
          <h2 id="plans-heading" className="text-lg font-semibold tracking-wide">
            今日決めるならこの3つ
          </h2>
          <ul className="space-y-3">
            {marineHub.plans.map((p) => (
              <li key={p.id}>
                <a
                  href={p.url}
                  target="_blank"
                  rel="noreferrer"
                  className="block border-b border-white/15 py-3 transition hover:border-[var(--mh-accent)]"
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="text-xs tracking-widest text-[var(--mh-accent)]">{p.badge}</span>
                    <span className="text-sm font-semibold text-[var(--mh-accent)]">{p.priceHint}</span>
                  </div>
                  <p className="mt-1 text-base font-medium">{p.name}</p>
                  <p className="mt-0.5 text-sm text-white/65">{p.blurb}</p>
                </a>
              </li>
            ))}
          </ul>
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
                placeholder="例: Waterfront Cebu"
              />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block space-y-1 text-sm">
                <span className="text-white/70">希望日</span>
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
            <label className="block space-y-1 text-sm">
              <span className="text-white/70">希望プラン</span>
              <select
                value={plan}
                onChange={(e) => setPlan(e.target.value)}
                className="mh-input"
              >
                {marineHub.plans.map((p) => (
                  <option key={p.id} value={p.name}>
                    {p.name}
                  </option>
                ))}
                <option value="相談したい">相談したい</option>
              </select>
            </label>
            <button type="submit" className="mh-btn-primary w-full">
              {copied ? "文面をコピーしました → 送信先を開きます" : "文面をコピーして申し込む"}
            </button>
            <p className="text-xs leading-relaxed text-white/55">
              送信で申し込み文面をコピーし、連絡先を開きます。貼り付けて送ってください。
            </p>
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
          <Link className="underline" href="/marine-hub/pamphlet">
            パンフレット
          </Link>{" "}
          /{" "}
          <Link className="underline" href="/marine-hub/flyer">
            チラシ
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
        .mh-input option {
          color: #04222c;
        }
        .mh-btn-primary {
          border-radius: 0.5rem;
          background: var(--mh-accent);
          color: var(--mh-ink);
          font-weight: 700;
          padding: 0.85rem 1rem;
          min-height: 3rem;
        }
        .mh-btn-primary:hover {
          filter: brightness(1.08);
        }
      `}</style>
    </div>
  );
}
