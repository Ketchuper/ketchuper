"use client";

import { useState, useEffect } from "react";
import { generateReview } from "../actions";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Loader2, Copy, ExternalLink, Sparkles, Star } from "lucide-react";

function getClientId(): string {
  if (typeof window === "undefined") return "server";
  let id = sessionStorage.getItem("cebuocto-client-id");
  if (!id) {
    id = `cebuocto-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
    sessionStorage.setItem("cebuocto-client-id", id);
  }
  return id;
}

const KEYWORDS_JA = [
  "海がキレイ",
  "スタッフが親切",
  "写真・動画が最高",
  "安心・安全",
  "大興奮",
  "シュノーケル",
  "イルカに会えた",
  "ウミガメに会えた",
  "景色が絶景",
  "コスパ良い",
  "食事が美味しい",
  "一生の思い出",
];

const COMPANIONS_JA = ["友達", "家族", "恋人", "一人"];
const GENDERS_JA = ["男性", "女性"];

const GOOGLE_MAPS_URL = "https://maps.app.goo.gl/zQf15Qzi5adydRep8?g_st=ic";

export default function CebuoctoReviewPage() {
  const [rating, setRating] = useState(5);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [companion, setCompanion] = useState("友達");
  const [gender, setGender] = useState("男性");
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [clientId, setClientId] = useState("default");

  useEffect(() => {
    setClientId(getClientId());
  }, []);

  const handleGenerate = async () => {
    setLoading(true);
    setReview("");
    try {
      const text = await generateReview(
        keywords,
        "",
        rating,
        companion,
        gender,
        "観光",
        "ja",
        clientId,
        "cebuocto"
      );
      setReview(text);
      setTimeout(() => document.getElementById("review-result")?.scrollIntoView({ behavior: "smooth", block: "center" }), 100);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "エラーが発生しました。しばらくしてから再試行してください。";
      alert(`⚠️ ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(review);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = review;
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <div className="min-h-screen text-slate-800 font-sans antialiased cebuocto-bg bg-gradient-to-b from-sky-200 via-amber-50/90 to-orange-100">
      {/* 背面のグラデーション（z-index用のレイヤー） */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-sky-200 via-amber-50/90 to-orange-100" />

      <main className="relative mx-auto max-w-lg px-4 py-6 sm:py-10">
        {/* CEBUOCTO ロゴ（トップ） */}
        <div className="flex justify-center pb-4">
          <img
            src="/cebuocto-logo.png"
            alt="CEBUOCTO"
            className="h-20 w-auto object-contain sm:h-24"
          />
        </div>

        {/* 白いカード */}
        <div className="rounded-3xl bg-white/95 p-6 shadow-xl shadow-slate-200/50 backdrop-blur-sm sm:p-8">
          {/* タイトル（見出し） */}
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl">
              Google 口コミ下書き作成
            </h1>
            <p className="mt-2 text-slate-500">
              タップするだけで口コミが完成します
            </p>
          </div>

          {/* 1 評価 */}
          <section className="mb-8">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-400">
              1 評価
            </h2>
            <div className="flex justify-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="rounded-lg p-1 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-amber-400"
                >
                  <Star
                    className="h-10 w-10 sm:h-12 sm:w-12"
                    fill={rating >= star ? "#f59e0b" : "none"}
                    stroke={rating >= star ? "#f59e0b" : "#cbd5e1"}
                    strokeWidth={1.5}
                  />
                </button>
              ))}
            </div>
          </section>

          {/* 2 良かったポイント */}
          <section className="mb-8">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-400">
              2 良かったポイント
            </h2>
            <p className="mb-4 text-center text-xs text-slate-500">いくつでも選べます</p>
            <div className="flex flex-wrap justify-center gap-2">
              <ToggleGroup
                type="multiple"
                value={keywords}
                onValueChange={setKeywords}
                className="flex flex-wrap justify-center gap-2"
              >
                {KEYWORDS_JA.map((kw) => (
                  <ToggleGroupItem
                    key={kw}
                    value={kw}
                    className="rounded-full border-2 border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors data-[state=on]:border-amber-400 data-[state=on]:bg-amber-50 data-[state=on]:text-amber-800"
                  >
                    {kw}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>
          </section>

          {/* 3 誰と */}
          <section className="mb-8">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-400">
              3 誰と
            </h2>
            <div className="flex flex-wrap justify-center gap-2">
              <ToggleGroup
                type="single"
                value={companion}
                onValueChange={(v) => v && setCompanion(v)}
                className="flex flex-wrap justify-center gap-2"
              >
                {COMPANIONS_JA.map((c) => (
                  <ToggleGroupItem
                    key={c}
                    value={c}
                    className="rounded-full border-2 border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 data-[state=on]:border-amber-400 data-[state=on]:bg-amber-50 data-[state=on]:text-amber-800"
                  >
                    {c}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>
          </section>

          {/* 4 あなた */}
          <section className="mb-8">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-400">
              4 あなた
            </h2>
            <div className="flex flex-wrap justify-center gap-2">
              <ToggleGroup
                type="single"
                value={gender}
                onValueChange={(v) => v && setGender(v)}
                className="flex flex-wrap justify-center gap-2"
              >
                {GENDERS_JA.map((g) => (
                  <ToggleGroupItem
                    key={g}
                    value={g}
                    className="rounded-full border-2 border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 data-[state=on]:border-amber-400 data-[state=on]:bg-amber-50 data-[state=on]:text-amber-800"
                  >
                    {g}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>
          </section>

          {/* CTA */}
          <Button
            onClick={handleGenerate}
            disabled={loading || keywords.length === 0}
            className="w-full rounded-2xl bg-orange-500 py-6 text-lg font-bold text-white shadow-lg shadow-orange-500/30 transition hover:bg-orange-600 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <Sparkles className="h-5 w-5" />
                口コミを自動作成
              </>
            )}
          </Button>

          {/* 結果エリア */}
          {review && (
            <div id="review-result" className="mt-8 space-y-4 rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                className="min-h-[120px] w-full resize-y rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-800 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/20"
              />
              <p className="text-center text-xs text-slate-500">
                ①コピー → ②Googleマップで投稿 → ③ペースト
              </p>
              <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-center">
                <Button
                  onClick={handleCopy}
                  className={`flex-1 rounded-xl py-4 font-bold ${
                    copied ? "bg-emerald-500 text-white" : "bg-sky-500 text-white hover:bg-sky-600"
                  }`}
                >
                  <Copy className="mr-2 h-4 w-4" />
                  {copied ? "コピーしました" : "① コピー"}
                </Button>
                <Button
                  onClick={() => window.open(GOOGLE_MAPS_URL, "_blank")}
                  disabled={!copied}
                  className="flex-1 rounded-xl border-2 border-slate-300 bg-white py-4 font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  ② Googleマップで投稿
                </Button>
              </div>
            </div>
          )}

          <p className="mt-8 text-center text-xs text-slate-400">
            Powered by CEBUOCTO
          </p>
        </div>
      </main>

    </div>
  );
}
