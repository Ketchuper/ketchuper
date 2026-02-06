"use client";

import { useState } from "react";
import { generateReview } from "./actions"; // さっき作った脳みそを繋ぐ
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Loader2, Copy, ExternalLink, Sparkles, Star } from "lucide-react";

// Googleマップの投稿画面URL（ここにお客さんを飛ばします）
const REVIEW_URL = "https://local.google.com/place?placeid=ChIJGWb3_AwT5TQRjGx04c24hBk&utm_medium=noren&utm_source=gbp&utm_campaign=2026";

export default function ReviewBooster() {
  const [language, setLanguage] = useState<"ja" | "en">("ja");
  const [rating, setRating] = useState(5);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [staff, setStaff] = useState("");
  const [companion, setCompanion] = useState("友達");
  const [gender, setGender] = useState("男性");
  const [visitType, setVisitType] = useState("地元");
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);

  // ボタンが押されたらAIを呼ぶ関数
  const handleGenerate = async () => {
    setLoading(true);
    try {
      const text = await generateReview(keywords, staff, rating, companion, gender, visitType, language);
      setReview(text);
    } catch (error) {
      console.error(error);
      const errorMsg = language === "ja" 
        ? "ごめん！AIがちょっと疲れてるみたい。もう一回試して！"
        : "Oops! The AI is taking a break. Please try again!";
      alert(errorMsg);
    }
    setLoading(false);
  };

  // コピーしてGoogleマップを開く関数
  const handleCopyAndGo = () => {
    navigator.clipboard.writeText(review);
    window.open(REVIEW_URL, "_blank");
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 font-sans selection:bg-cyan-500 pb-20">
      {/* ヘッダーエリア */}
      <header className="py-6 text-center animate-in slide-in-from-top duration-500">
        <div className="relative inline-block">
          <img 
            src="/barvel-logo.png" 
            alt="BARVEL KOZA" 
            className="h-24 w-auto mx-auto animate-pulse-glow"
            style={{
              filter: 'drop-shadow(0 0 20px rgba(255, 0, 0, 0.6)) drop-shadow(0 0 40px rgba(0, 255, 255, 0.4))',
              animation: 'pulse-glow 2s ease-in-out infinite'
            }}
          />
        </div>
        
        {/* 言語切り替え */}
        <div className="mt-4 flex justify-center gap-2">
          <button
            onClick={() => setLanguage("ja")}
            className={`px-6 py-2 rounded-lg font-bold transition-all ${
              language === "ja"
                ? "bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-lg"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            }`}
          >
            🇯🇵 日本語
          </button>
          <button
            onClick={() => setLanguage("en")}
            className={`px-6 py-2 rounded-lg font-bold transition-all ${
              language === "en"
                ? "bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-lg"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            }`}
          >
            🇺🇸 English
          </button>
        </div>
      </header>
      
      <style jsx>{`
        @keyframes pulse-glow {
          0%, 100% {
            filter: drop-shadow(0 0 20px rgba(255, 0, 0, 0.6)) drop-shadow(0 0 40px rgba(0, 255, 255, 0.4));
            opacity: 1;
          }
          50% {
            filter: drop-shadow(0 0 30px rgba(255, 0, 0, 0.8)) drop-shadow(0 0 60px rgba(0, 255, 255, 0.6));
            opacity: 0.95;
          }
        }
      `}</style>

      <main className="max-w-md mx-auto space-y-8">
        
        {/* 1. 星評価 */}
        <section className="space-y-2 text-center">
            <h2 className="text-lg font-bold text-cyan-400">
              {language === "ja" ? "Rating" : "Rating"}
            </h2>
            <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} onClick={() => setRating(star)} className="focus:outline-none transition-transform active:scale-125">
                        <Star className={`w-10 h-10 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-700"}`} />
                    </button>
                ))}
            </div>
        </section>

        {/* 2. 誰と来たか */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold border-l-4 border-pink-500 pl-2">
            {language === "ja" ? "1. 誰と来た？" : "1. Who did you come with?"}
          </h2>
          <ToggleGroup type="single" value={companion} onValueChange={setCompanion} className="flex flex-wrap gap-3 justify-center">
            {(language === "ja" ? [
              { id: "友達", label: "👥 友達" },
              { id: "同僚", label: "💼 同僚" },
              { id: "恋人", label: "💑 恋人" },
              { id: "一人", label: "🚶 一人" },
            ] : [
              { id: "友達", label: "👥 Friends" },
              { id: "同僚", label: "💼 Coworkers" },
              { id: "恋人", label: "💑 Partner" },
              { id: "一人", label: "🚶 Solo" },
            ]).map((item) => (
              <ToggleGroupItem 
                key={item.id} 
                value={item.id} 
                className="data-[state=on]:bg-pink-600 data-[state=on]:text-white data-[state=on]:border-pink-400 border-2 border-gray-800 bg-gray-900/50 px-4 py-3 text-sm font-bold rounded-xl w-[48%] transition-all hover:bg-gray-800 hover:text-white"
              >
                {item.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </section>

        {/* 3. 性別 */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold border-l-4 border-blue-500 pl-2">
            {language === "ja" ? "2. あなたは？" : "2. You are?"}
          </h2>
          <ToggleGroup type="single" value={gender} onValueChange={setGender} className="flex gap-3 justify-center">
            {(language === "ja" ? [
              { id: "男性", label: "👨 男性" },
              { id: "女性", label: "👩 女性" },
            ] : [
              { id: "男性", label: "👨 Male" },
              { id: "女性", label: "👩 Female" },
            ]).map((item) => (
              <ToggleGroupItem 
                key={item.id} 
                value={item.id} 
                className="data-[state=on]:bg-blue-600 data-[state=on]:text-white data-[state=on]:border-blue-400 border-2 border-gray-800 bg-gray-900/50 px-6 py-3 text-sm font-bold rounded-xl flex-1 transition-all hover:bg-gray-800 hover:text-white"
              >
                {item.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </section>

        {/* 3-2. 地元 or 観光 */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold border-l-4 border-green-500 pl-2">
            {language === "ja" ? "2-2. 来店タイプ" : "2-2. Visit Type"}
          </h2>
          <ToggleGroup type="single" value={visitType} onValueChange={setVisitType} className="flex gap-3 justify-center">
            {(language === "ja" ? [
              { id: "地元", label: "🏠 地元・沖縄住み" },
              { id: "観光", label: "✈️ 旅行・観光" },
            ] : [
              { id: "地元", label: "🏠 Local" },
              { id: "観光", label: "✈️ Tourist" },
            ]).map((item) => (
              <ToggleGroupItem 
                key={item.id} 
                value={item.id} 
                className="data-[state=on]:bg-green-600 data-[state=on]:text-white data-[state=on]:border-green-400 border-2 border-gray-800 bg-gray-900/50 px-6 py-3 text-sm font-bold rounded-xl flex-1 transition-all hover:bg-gray-800 hover:text-white"
              >
                {item.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </section>

        {/* 4. キーワード選択（SGE対策の肝！） */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold border-l-4 border-cyan-500 pl-2">
            {language === "ja" ? "3. 何が良かった？" : "3. What did you enjoy?"}
          </h2>
          <ToggleGroup type="multiple" className="flex flex-wrap gap-3 justify-center" onValueChange={setKeywords}>
            {(language === "ja" ? [
              { id: "ダーツ・ビリヤード無料", label: "🎯 ダーツ・ビリヤード無料" },
              { id: "時間無制限飲み放題", label: "⏰ 時間無制限飲み放題" },
              { id: "出入り自由・ハシゴ酒", label: "🔄 出入り自由・ハシゴ酒" },
              { id: "スタッフ最高", label: "🤣 スタッフ最高" },
            ] : [
              { id: "ダーツ・ビリヤード無料", label: "🎯 Free Darts/Pool" },
              { id: "時間無制限飲み放題", label: "⏰ Unlimited Drinks" },
              { id: "出入り自由・ハシゴ酒", label: "🔄 Free Entry/Exit" },
              { id: "スタッフ最高", label: "🤣 Amazing Staff" },
            ]).map((item) => (
              <ToggleGroupItem 
                key={item.id} 
                value={item.id} 
                className="data-[state=on]:bg-cyan-600 data-[state=on]:text-white data-[state=on]:border-cyan-400 border-2 border-gray-800 bg-gray-900/50 px-4 py-6 text-sm font-bold rounded-2xl w-[48%] transition-all hover:bg-gray-800 hover:text-white"
              >
                {item.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </section>

        {/* 5. スタッフ名入力 */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold border-l-4 border-purple-500 pl-2">
            {language === "ja" ? "4. 推しスタッフ（複数OK！）" : "4. Favorite Staff (Optional)"}
          </h2>
          <input
            className="w-full bg-gray-900 border-gray-800 text-white p-4 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none placeholder:text-gray-600"
            placeholder={language === "ja" 
              ? "覚えてなかったらその人の特徴でもOK！例：メガネのお兄さん"
              : "Name or description! e.g., Guy with glasses"
            }
            value={staff}
            onChange={(e) => setStaff(e.target.value)}
          />
        </section>

        {/* 6. 生成ボタン */}
        <Button 
          onClick={handleGenerate} 
          disabled={loading || keywords.length === 0}
          className="w-full py-8 text-xl font-black rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:opacity-90 shadow-[0_0_20px_rgba(168,85,247,0.5)] transition-all active:scale-95 disabled:opacity-50 text-white"
        >
          {loading ? <Loader2 className="animate-spin mr-2 h-6 w-6" /> : <Sparkles className="mr-2 h-6 w-6" />}
          {language === "ja" ? "口コミを自動作成 🪄" : "Generate Review 🪄"}
        </Button>

        {/* 7. 結果表示エリア */}
        {review && (
          <Card className="p-4 bg-gray-900/90 border-cyan-500/50 space-y-4 animate-in fade-in zoom-in duration-300 shadow-[0_0_30px_rgba(6,182,212,0.2)]">
            <Textarea 
              value={review} 
              onChange={(e) => setReview(e.target.value)}
              className="bg-black/50 border-gray-700 text-white h-32 text-base leading-relaxed p-3 rounded-lg focus:ring-cyan-500"
            />
            <Button onClick={handleCopyAndGo} className="w-full py-6 text-lg font-bold bg-white text-black hover:bg-gray-200 rounded-xl shadow-lg">
              <Copy className="mr-2 h-5 w-5" /> 
              {language === "ja" ? "コピーして投稿画面へ" : "Copy & Post on Google"}
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
            <p className="text-[10px] text-center text-gray-400">
              {language === "ja" 
                ? "※ボタンを押すと文章がコピーされ、Googleマップの投稿画面が開きます。"
                : "※ Click to copy the review and open Google Maps posting page."
              }
            </p>
          </Card>
        )}
      </main>
    </div>
  );
}