"use client";

import Image from "next/image";
import Link from "next/link";

const IG_URL = "https://www.instagram.com/mimosa.koza/";
const OFFICIAL_IG = "https://www.instagram.com/mimosa.mybrain/";
const DEADLINE = "2026-08-15";
const TARGET_YEN = 120_000;

function daysLeft(): number {
  const end = new Date(`${DEADLINE}T23:59:59+09:00`);
  const now = new Date();
  return Math.max(0, Math.ceil((end.getTime() - now.getTime()) / 86_400_000));
}

export default function MimosaKozaCampaignPage() {
  const left = daysLeft();

  return (
    <main className="relative overflow-x-hidden bg-[var(--mk-bg)] text-[var(--mk-fg)]">
      {/* —— HERO: brand first, one composition —— */}
      <section className="relative min-h-dvh w-full flex flex-col justify-end">
        <div className="absolute inset-0">
          <Image
            src="/mimosa-koza/hero-wide.jpg"
            alt="MIMO$A KOZA"
            fill
            priority
            className="object-cover object-center scale-105"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,10,0.35)_0%,rgba(10,10,10,0.55)_42%,rgba(10,10,10,0.92)_78%,#0a0a0a_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(43,166,27,0.18),transparent_55%)]" />
          <div className="mk-grain" aria-hidden />
        </div>

        <div className="relative z-10 px-5 sm:px-8 pb-[calc(2.5rem+env(safe-area-inset-bottom,0px))] pt-24 max-w-5xl mx-auto w-full">
          <p className="mk-rise text-[11px] uppercase tracking-[0.42em] text-[var(--mk-sand)] mb-5">
            Apparel &amp; Culture · Koza, Okinawa
          </p>

          <h1 className="mk-rise mk-rise-delay-1 mk-display text-[clamp(3.4rem,14vw,7.5rem)]">
            MIMO<span className="mk-neon">$</span>A
            <br />
            <span className="text-[0.72em] tracking-[0.08em]">KOZA</span>
          </h1>

          <p className="mk-rise mk-rise-delay-2 mt-5 max-w-md text-[15px] sm:text-base leading-relaxed text-white/75">
            古着 × 音楽。コザからストリートを切り取る一点物を、
            <span className="text-[var(--mk-green)]"> 8/15 </span>
            までに手に入れて。
          </p>

          <div className="mk-rise mk-rise-delay-3 mt-8 flex flex-col sm:flex-row gap-3 sm:items-center">
            <a
              href={IG_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-[var(--mk-green)] text-[#061006] mk-display text-lg tracking-wider rounded-md shadow-[0_0_28px_rgba(43,166,27,0.35)] hover:brightness-110 transition"
            >
              Instagram で見る
            </a>
            <Link
              href="/mimosa-koza/review"
              className="inline-flex items-center justify-center px-6 py-3.5 border border-white/25 text-sm tracking-wide rounded-md hover:border-[var(--mk-green)]/60 hover:text-[var(--mk-green)] transition"
            >
              来店後の口コミを書く
            </Link>
          </div>

          <div className="mt-10 flex items-end gap-6 text-xs tracking-widest uppercase text-white/45">
            <div>
              <p className="text-[10px] mb-1 text-white/35">Deadline</p>
              <p className="mk-display text-2xl text-white/85 normal-case tracking-normal">
                8/15
              </p>
            </div>
            <div className="h-8 w-px bg-white/15" />
            <div>
              <p className="text-[10px] mb-1 text-white/35">Days left</p>
              <p className="mk-display text-2xl text-[var(--mk-green)] normal-case tracking-normal">
                {left}
              </p>
            </div>
            <div className="h-8 w-px bg-white/15" />
            <div>
              <p className="text-[10px] mb-1 text-white/35">Push target</p>
              <p className="mk-display text-2xl text-white/85 normal-case tracking-normal">
                +¥{TARGET_YEN.toLocaleString("ja-JP")}
              </p>
            </div>
          </div>

          <div className="mt-8 h-px w-40 bg-[var(--mk-green)] mk-pulse-line" />
        </div>
      </section>

      {/* —— ONE JOB: summer offer —— */}
      <section className="relative px-5 sm:px-8 py-20 md:py-28">
        <div className="max-w-5xl mx-auto grid md:grid-cols-[1.1fr_0.9fr] gap-10 md:gap-14 items-center">
          <div>
            <p className="text-[11px] uppercase tracking-[0.35em] text-[var(--mk-green)] mb-3">
              Summer Push · to 8/15
            </p>
            <h2 className="mk-display text-4xl sm:text-5xl md:text-6xl mb-5">
              一点物が
              <br />
              <span className="mk-neon">動く夏。</span>
            </h2>
            <p className="text-white/65 leading-relaxed max-w-lg">
              棚のベストを毎日1点ストーリーで公開。2点以上で店頭セット割。週末は音楽と合わせたドロップを回し、8/15までの追加売上を取り切る。
            </p>
            <ul className="mt-8 space-y-3 text-sm text-white/70">
              <li className="flex gap-3">
                <span className="text-[var(--mk-green)]">01</span>
                毎日「今日の一点物」を @mimosa.koza ストーリーズへ
              </li>
              <li className="flex gap-3">
                <span className="text-[var(--mk-green)]">02</span>
                2点で10%オフ / 3点で15%オフ（8/15まで）
              </li>
              <li className="flex gap-3">
                <span className="text-[var(--mk-green)]">03</span>
                週末ドロップ＋来店口コミでリピート導線
              </li>
            </ul>
          </div>
          <div className="relative aspect-[4/5] md:aspect-[3/4] overflow-hidden rounded-sm">
            <Image
              src="/mimosa-koza/spot.jpg"
              alt="MIMO$A KOZA spot"
              fill
              className="object-cover"
              sizes="(max-width:768px) 100vw, 40vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <p className="absolute bottom-4 left-4 right-4 text-xs tracking-[0.25em] uppercase text-white/80">
              Physical spot · Okinawa City
            </p>
          </div>
        </div>
      </section>

      {/* —— ONE JOB: visit CTA —— */}
      <section className="relative border-t border-[var(--mk-line)] px-5 sm:px-8 py-20 md:py-24">
        <div className="max-w-3xl mx-auto text-center">
          <Image
            src="/mimosa-koza/logo-sm.png"
            alt="MIMO$A"
            width={96}
            height={96}
            className="mx-auto mb-8 opacity-90 drop-shadow-[0_0_24px_rgba(43,166,27,0.25)]"
          />
          <h2 className="mk-display text-4xl sm:text-5xl md:text-6xl">
            COME THROUGH
            <br />
            <span className="mk-neon">KOZA.</span>
          </h2>
          <p className="mt-5 text-white/60 max-w-md mx-auto leading-relaxed">
            最新ドロップ・営業・取り置きは Instagram が最短。クルー公式は @mimosa.mybrain。
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={IG_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-3.5 bg-[var(--mk-green)] text-[#061006] mk-display text-lg rounded-md"
            >
              @mimosa.koza
            </a>
            <a
              href={OFFICIAL_IG}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-3.5 border border-white/20 rounded-md text-sm hover:border-white/40 transition"
            >
              Crew @mimosa.mybrain
            </a>
          </div>
          <p className="mt-12 text-[11px] tracking-[0.3em] uppercase text-white/30">
            Map Engine · Review Booster support
          </p>
        </div>
      </section>
    </main>
  );
}
