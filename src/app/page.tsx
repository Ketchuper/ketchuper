"use client";

import { useState, useEffect } from "react";
import { generateReview } from "./actions"; // さっき作った脳みそを繋ぐ
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Loader2, Copy, ExternalLink, Sparkles, Star } from "lucide-react";

// Googleマップの投稿画面URL（ここにお客さんを飛ばします）
const REVIEW_URL = "https://local.google.com/place?placeid=ChIJGWb3_AwT5TQRjGx04c24hBk&utm_medium=noren&utm_source=gbp&utm_campaign=2026";

// クライアントIDを生成・保持（ブラウザセッション単位）
function getClientId(): string {
  if (typeof window === "undefined") return "server";
  
  let clientId = sessionStorage.getItem("barvel-client-id");
  if (!clientId) {
    clientId = `client-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem("barvel-client-id", clientId);
  }
  return clientId;
}

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
  const [copied, setCopied] = useState(false);
  const [clientId, setClientId] = useState("default");

  // クライアントIDを初期化
  useEffect(() => {
    setClientId(getClientId());
  }, []);

  // ボタンが押されたらAIを呼ぶ関数
  const handleGenerate = async () => {
    setLoading(true);
    setReview(""); // 前の結果をクリア
    
    try {
      const text = await generateReview(keywords, staff, rating, companion, gender, visitType, language, clientId);
      setReview(text);
      
      // 🎯 UX改善：生成完了後に結果エリアまで自動スクロール
      setTimeout(() => {
        const resultElement = document.getElementById('review-result');
        if (resultElement) {
          resultElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    } catch (error: any) {
      console.error("口コミ生成エラー:", error);
      
      // より詳細なエラーメッセージ
      let errorMsg = "";
      if (error?.message?.includes("API key")) {
        errorMsg = language === "ja"
          ? "⚠️ API設定エラー\n管理者に連絡してください。"
          : "⚠️ API Configuration Error\nPlease contact the administrator.";
      } else if (error?.message?.includes("fetch") || error?.message?.includes("network")) {
        errorMsg = language === "ja"
          ? "⚠️ ネットワークエラー\nインターネット接続を確認してください。"
          : "⚠️ Network Error\nPlease check your internet connection.";
      } else if (error?.message?.includes("timeout")) {
        errorMsg = language === "ja"
          ? "⚠️ タイムアウト\n時間がかかりすぎています。もう一度試してください。"
          : "⚠️ Timeout\nTaking too long. Please try again.";
      } else {
        errorMsg = language === "ja"
          ? `⚠️ エラーが発生しました\n${error?.message || "もう一度試してください。"}`
          : `⚠️ An error occurred\n${error?.message || "Please try again."}`;
      }
      
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // コピー専用関数
  const handleCopy = async () => {
    let copySuccess = false;
    
    try {
      // モダンブラウザ向け
      await navigator.clipboard.writeText(review);
      copySuccess = true;
    } catch (err) {
      // フォールバック：古いブラウザや制限の厳しい環境向け
      const textArea = document.createElement('textarea');
      textArea.value = review;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        copySuccess = document.execCommand('copy');
      } catch (err2) {
        console.error('コピー失敗:', err2);
      }
      document.body.removeChild(textArea);
    }
    
    if (copySuccess) {
      // コピー成功のフィードバック
      setCopied(true);
      setTimeout(() => setCopied(false), 3000); // 3秒表示
    } else {
      // コピー失敗時の警告
      const msg = language === "ja" 
        ? "⚠️ コピーに失敗しました。\n\n上のテキストを長押しして手動でコピーしてください。"
        : "⚠️ Copy failed.\n\nPlease long press the text above to copy manually.";
      alert(msg);
    }
  };

  // Googleマップを開く専用関数
  const handleOpenGoogleMaps = () => {
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
          <p className="text-sm text-gray-400">
            {language === "ja" ? "当てはまるものをいくつでも選べます（複数選択OK）" : "Select all that apply (multiple OK)"}
          </p>
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
          <Card id="review-result" className="p-4 bg-gray-900/90 border-cyan-500/50 space-y-4 animate-in fade-in zoom-in duration-300 shadow-[0_0_30px_rgba(6,182,212,0.2)]">
            <Textarea 
              value={review} 
              onChange={(e) => setReview(e.target.value)}
              className="bg-black/50 border-gray-700 text-white h-32 text-base leading-relaxed p-3 rounded-lg focus:ring-cyan-500"
            />
            {/* ステップ表示 */}
            <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-3 text-sm">
              <div className="font-bold mb-2 text-cyan-400">
                {language === "ja" ? "📋 投稿手順" : "📋 How to Post"}
              </div>
              <div className="space-y-1 text-gray-300">
                <div>{language === "ja" ? "① 下の「コピー」ボタンをタップ" : "① Tap 'Copy' button below"}</div>
                <div>{language === "ja" ? "② 「Googleマップで投稿」ボタンをタップ" : "② Tap 'Post on Google Maps'"}</div>
                <div>{language === "ja" ? "③ 口コミ入力欄を長押し → ペースト" : "③ Long press review field → Paste"}</div>
              </div>
            </div>

            {/* ボタンを2つに分割 */}
            <div className="grid grid-cols-1 gap-3">
              {/* ステップ1: コピーボタン */}
              <Button 
                onClick={handleCopy} 
                className={`w-full py-6 text-lg font-bold rounded-xl shadow-lg transition-all ${
                  copied 
                    ? "bg-green-500 text-white hover:bg-green-600" 
                    : "bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:opacity-90"
                }`}
              >
                {copied ? (
                  <>
                    <Copy className="mr-2 h-5 w-5" /> 
                    {language === "ja" ? "✅ コピー完了！" : "✅ Copied!"}
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-5 w-5" /> 
                    {language === "ja" ? "① 口コミをコピー 📋" : "① Copy Review 📋"}
                  </>
                )}
              </Button>

              {/* ステップ2: Googleマップボタン */}
              <Button 
                onClick={handleOpenGoogleMaps}
                disabled={!copied}
                className={`w-full py-6 text-lg font-bold rounded-xl shadow-lg transition-all ${
                  copied
                    ? "bg-white text-black hover:bg-gray-200"
                    : "bg-gray-700 text-gray-400 cursor-not-allowed"
                }`}
              >
                <ExternalLink className="mr-2 h-5 w-5" /> 
                {language === "ja" ? "② Googleマップで投稿 🚀" : "② Post on Google Maps 🚀"}
              </Button>
            </div>

            {/* ヘルプテキスト */}
            {!copied && (
              <div className="text-xs text-gray-500 text-center">
                {language === "ja" 
                  ? "💡 まず「コピー」ボタンを押してください"
                  : "💡 Please tap 'Copy' button first"
                }
              </div>
            )}
          </Card>
        )}
      </main>
    </div>
  );
}