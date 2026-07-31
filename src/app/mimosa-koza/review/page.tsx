"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { generateReview } from "@/app/actions";
import { getStoreConfig } from "@/config/stores";
import { Loader2, Copy, ExternalLink, Sparkles, Star } from "lucide-react";

const STORE_ID = "mimosa-koza";

function getClientId(): string {
  if (typeof window === "undefined") return "server";
  const key = "mimosa-koza-client-id";
  try {
    let id = sessionStorage.getItem(key);
    if (!id) {
      id = `mimosa-koza-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
      sessionStorage.setItem(key, id);
    }
    return id;
  } catch {
    return `mimosa-koza-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
  }
}

export default function MimosaKozaReviewPage() {
  const store = getStoreConfig(STORE_ID);
  const [rating, setRating] = useState(5);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [companion, setCompanion] = useState("友達");
  const [gender, setGender] = useState("男性");
  const [visitType, setVisitType] = useState("地元");
  const [staff, setStaff] = useState("");
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [clientId, setClientId] = useState("default");

  useEffect(() => {
    setClientId(getClientId());
  }, []);

  if (!store) {
    return (
      <main className="min-h-dvh flex items-center justify-center p-6 text-white/70">
        店舗設定が見つかりません
      </main>
    );
  }

  const kw = store.features.keywords.options.ja;
  const companions = store.features.companion.options.ja;
  const genders = store.features.gender.options.ja;
  const visits = store.features.visitType.options.ja;

  const toggleKeyword = (k: string) => {
    setKeywords((prev) =>
      prev.includes(k) ? prev.filter((x) => x !== k) : [...prev, k]
    );
  };

  const handleGenerate = async () => {
    setLoading(true);
    setReview("");
    try {
      const text = await generateReview(
        keywords,
        staff,
        rating,
        companion,
        gender,
        visitType,
        "ja",
        clientId,
        STORE_ID
      );
      setReview(text);
      setTimeout(
        () =>
          document
            .getElementById("mk-review-result")
            ?.scrollIntoView({ behavior: "smooth", block: "center" }),
        80
      );
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "エラーが発生しました。しばらくしてから再試行してください。";
      alert(`⚠️ ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!review) return;
    await navigator.clipboard.writeText(review);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <main className="min-h-dvh px-4 sm:px-6 pt-8 pb-[calc(2.5rem+env(safe-area-inset-bottom,0px))]">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/mimosa-koza"
            className="text-xs tracking-[0.25em] uppercase text-white/45 hover:text-[var(--mk-green)] transition"
          >
            ← Campaign
          </Link>
          <Image
            src="/mimosa-koza/logo-sm.png"
            alt="MIMO$A"
            width={40}
            height={40}
            className="opacity-90"
          />
        </div>

        <h1 className="mk-display text-4xl mb-2">
          REVIEW <span className="mk-neon">BOOSTER</span>
        </h1>
        <p className="text-sm text-white/55 mb-8">
          MIMO$A KOZA の Google 口コミ下書きを作成。コピーして投稿してください。
        </p>

        {/* Rating */}
        <div className="mb-6">
          <p className="text-[11px] tracking-[0.3em] uppercase text-white/40 mb-3">
            評価
          </p>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setRating(n)}
                className="p-1"
                aria-label={`${n} stars`}
              >
                <Star
                  className={`w-7 h-7 ${
                    n <= rating
                      ? "fill-[var(--mk-green)] text-[var(--mk-green)]"
                      : "text-white/20"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Keywords */}
        <div className="mb-6">
          <p className="text-[11px] tracking-[0.3em] uppercase text-white/40 mb-3">
            良かったポイント
          </p>
          <div className="flex flex-wrap gap-2">
            {kw.map((k) => {
              const on = keywords.includes(k);
              return (
                <button
                  key={k}
                  type="button"
                  onClick={() => toggleKeyword(k)}
                  className={`px-3 py-2 text-sm rounded-md border transition ${
                    on
                      ? "border-[var(--mk-green)] bg-[var(--mk-green-soft)] text-[var(--mk-green)]"
                      : "border-white/15 text-white/70 hover:border-white/30"
                  }`}
                >
                  {k}
                </button>
              );
            })}
          </div>
        </div>

        {/* Companion / gender / visit */}
        <div className="grid grid-cols-1 gap-5 mb-6">
          <div>
            <p className="text-[11px] tracking-[0.3em] uppercase text-white/40 mb-2">
              誰と
            </p>
            <div className="flex flex-wrap gap-2">
              {companions.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCompanion(c)}
                  className={`px-3 py-2 text-sm rounded-md border ${
                    companion === c
                      ? "border-[var(--mk-green)] text-[var(--mk-green)]"
                      : "border-white/15 text-white/65"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[11px] tracking-[0.3em] uppercase text-white/40 mb-2">
              ご本人は？
            </p>
            <div className="flex flex-wrap gap-2">
              {genders.map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGender(g)}
                  className={`px-3 py-2 text-sm rounded-md border ${
                    gender === g
                      ? "border-[var(--mk-green)] text-[var(--mk-green)]"
                      : "border-white/15 text-white/65"
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[11px] tracking-[0.3em] uppercase text-white/40 mb-2">
              来店タイプ
            </p>
            <div className="flex flex-wrap gap-2">
              {visits.map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setVisitType(v)}
                  className={`px-3 py-2 text-sm rounded-md border ${
                    visitType === v
                      ? "border-[var(--mk-green)] text-[var(--mk-green)]"
                      : "border-white/15 text-white/65"
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        </div>

        {store.features.staffName.enabled && (
          <div className="mb-8">
            <p className="text-[11px] tracking-[0.3em] uppercase text-white/40 mb-2">
              推しスタッフ
            </p>
            <input
              value={staff}
              onChange={(e) => setStaff(e.target.value)}
              placeholder={store.features.staffName.placeholder.ja}
              className="w-full h-11 px-3 rounded-md bg-white/5 border border-white/15 text-sm outline-none focus:border-[var(--mk-green)]/60"
            />
          </div>
        )}

        <button
          type="button"
          onClick={handleGenerate}
          disabled={loading || keywords.length === 0}
          className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-md bg-[var(--mk-green)] text-[#061006] mk-display text-lg disabled:opacity-40"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Sparkles className="w-5 h-5" />
          )}
          口コミを生成
        </button>

        {review && (
          <div
            id="mk-review-result"
            className="mt-8 rounded-md border border-white/15 bg-white/[0.03] p-4"
          >
            <p className="text-sm leading-relaxed whitespace-pre-wrap mb-4">
              {review}
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center justify-center gap-2 flex-1 py-2.5 rounded-md border border-white/20 text-sm hover:border-[var(--mk-green)]/50"
              >
                <Copy className="w-4 h-4" />
                {copied ? "コピーしました" : "コピー"}
              </button>
              <a
                href={store.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 flex-1 py-2.5 rounded-md bg-white/10 text-sm"
              >
                <ExternalLink className="w-4 h-4" />
                Googleマップで投稿
              </a>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
