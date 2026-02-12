"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getStoreConfig, StoreConfig } from "@/config/stores";
import { generateReview } from "../actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Loader2, Copy, ExternalLink, Sparkles, Star } from "lucide-react";

// クライアントIDを生成・保持（店舗ごと）
function getClientId(storeId: string): string {
  if (typeof window === "undefined") return "server";
  
  let clientId = sessionStorage.getItem(`${storeId}-client-id`);
  if (!clientId) {
    clientId = `${storeId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem(`${storeId}-client-id`, clientId);
  }
  return clientId;
}

export default function StoreReviewBooster() {
  const params = useParams();
  const storeId = params.storeId as string;
  
  const [storeConfig, setStoreConfig] = useState<StoreConfig | null>(null);
  const [language, setLanguage] = useState<"ja" | "en">("ja");
  const [rating, setRating] = useState(5);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [staff, setStaff] = useState("");
  const [companion, setCompanion] = useState("");
  const [gender, setGender] = useState("");
  const [visitType, setVisitType] = useState("");
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [clientId, setClientId] = useState("default");
  const [notFound, setNotFound] = useState(false);

  // 店舗設定を読み込み
  useEffect(() => {
    const config = getStoreConfig(storeId);
    if (!config) {
      // 店舗が見つからない場合
      setNotFound(true);
      return;
    }
    
    setStoreConfig(config);
    setRating(config.features.rating.default);
    
    // デフォルト値を設定
    if (config.features.companion.enabled) {
      setCompanion(config.features.companion.options[language][0]);
    }
    if (config.features.gender.enabled) {
      setGender(config.features.gender.options[language][0]);
    }
    if (config.features.visitType.enabled) {
      setVisitType(config.features.visitType.options[language][0]);
    }
  }, [storeId, language]);

  // クライアントIDを初期化
  useEffect(() => {
    if (storeId) {
      setClientId(getClientId(storeId));
    }
  }, [storeId]);

  // レビュー生成
  const handleGenerate = async () => {
    if (!storeConfig) return;
    
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
        language,
        clientId,
        storeId  // 店舗IDを渡す
      );
      setReview(text);
      
      // 自動スクロール
      setTimeout(() => {
        document.getElementById('review-result')?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }, 100);
    } catch (error: any) {
      console.error("口コミ生成エラー:", error);
      
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
      await navigator.clipboard.writeText(review);
      copySuccess = true;
    } catch (err) {
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
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } else {
      const msg = language === "ja" 
        ? "⚠️ コピーに失敗しました。\n\n上のテキストを長押しして手動でコピーしてください。"
        : "⚠️ Copy failed.\n\nPlease long press the text above to copy manually.";
      alert(msg);
    }
  };

  // Googleマップを開く専用関数
  const handleOpenGoogleMaps = () => {
    if (storeConfig) {
      window.open(storeConfig.googleMapsUrl, "_blank");
    }
  };

  if (notFound) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <div className="text-xl mb-4">店舗が見つかりません</div>
          <a href="/" className="text-cyan-500 underline">トップページに戻る</a>
        </div>
      </div>
    );
  }

  if (!storeConfig) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⏳</div>
          <div className="text-xl">読み込み中...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-4 font-sans selection:bg-cyan-500 pb-20">
      {/* ヘッダーエリア */}
      <header className="py-6 text-center animate-in slide-in-from-top duration-500">
        <div className="relative inline-block">
          <img 
            src={storeConfig.logoPath}
            alt={storeConfig.name} 
            className="h-24 w-auto mx-auto animate-pulse-glow"
            style={{
              filter: storeConfig.theme.logoGlow,
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
            style={{
              background: language === "ja" 
                ? `linear-gradient(to right, ${storeConfig.theme.primaryColor}, ${storeConfig.theme.secondaryColor})`
                : undefined
            }}
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
            style={{
              background: language === "en" 
                ? `linear-gradient(to right, ${storeConfig.theme.primaryColor}, ${storeConfig.theme.secondaryColor})`
                : undefined
            }}
          >
            🇺🇸 English
          </button>
        </div>
      </header>

      <style jsx>{`
        @keyframes pulse-glow {
          0%, 100% {
            filter: ${storeConfig.theme.logoGlow};
            opacity: 1;
          }
          50% {
            filter: ${storeConfig.theme.logoGlow};
            opacity: 0.7;
          }
        }
      `}</style>

      <main className="max-w-2xl mx-auto space-y-6 mt-8">
        {/* 1. 星評価 */}
        {storeConfig.features.rating.enabled && (
          <section className="space-y-4">
            <h2 className="text-lg font-bold border-l-4 border-purple-500 pl-2">
              {language === "ja" ? "1. 評価を選んでください ⭐" : "1. Select Rating ⭐"}
            </h2>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className={`p-3 rounded-lg transition-all ${
                    rating >= star
                      ? "text-yellow-400 scale-110"
                      : "text-gray-600 hover:text-yellow-200"
                  }`}
                >
                  <Star className="h-8 w-8" fill={rating >= star ? "currentColor" : "none"} />
                </button>
              ))}
            </div>
          </section>
        )}

        {/* 2. キーワード選択 */}
        {storeConfig.features.keywords.enabled && (
          <section className="space-y-4">
            <h2 className="text-lg font-bold border-l-4 border-purple-500 pl-2">
              {language === "ja" ? "2. 良かったポイントを選んでください 🎯" : "2. Select What You Enjoyed 🎯"}
            </h2>
            <ToggleGroup
              type="multiple"
              value={keywords}
              onValueChange={setKeywords}
              className="grid grid-cols-2 gap-3"
            >
              {storeConfig.features.keywords.options[language].map((keyword, index) => (
                <ToggleGroupItem
                  key={index}
                  value={storeConfig.features.keywords.options.ja[index]}
                  className="bg-gray-900 border-gray-800 data-[state=on]:bg-gradient-to-r data-[state=on]:from-cyan-500 data-[state=on]:to-purple-600 data-[state=on]:text-white text-gray-400 hover:text-white transition-all px-4 py-3 text-sm font-bold rounded-xl"
                >
                  {keyword}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </section>
        )}

        {/* 3. 誰と来たか */}
        {storeConfig.features.companion.enabled && (
          <section className="space-y-4">
            <h2 className="text-lg font-bold border-l-4 border-purple-500 pl-2">
              {language === "ja" ? "3. 誰と来ましたか？👥" : "3. Who did you come with? 👥"}
            </h2>
            <ToggleGroup
              type="single"
              value={companion}
              onValueChange={(value) => value && setCompanion(value)}
              className="grid grid-cols-2 gap-3"
            >
              {storeConfig.features.companion.options[language].map((option, index) => (
                <ToggleGroupItem
                  key={index}
                  value={storeConfig.features.companion.options.ja[index]}
                  className="bg-gray-900 border-gray-800 data-[state=on]:bg-gradient-to-r data-[state=on]:from-cyan-500 data-[state=on]:to-purple-600 data-[state=on]:text-white text-gray-400 hover:text-white transition-all px-4 py-3 text-sm font-bold rounded-xl"
                >
                  {option}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </section>
        )}

        {/* 4. 性別 */}
        {storeConfig.features.gender.enabled && (
          <section className="space-y-4">
            <h2 className="text-lg font-bold border-l-4 border-purple-500 pl-2">
              {language === "ja" ? "あなたは？👤" : "You are? 👤"}
            </h2>
            <ToggleGroup
              type="single"
              value={gender}
              onValueChange={(value) => value && setGender(value)}
              className="grid grid-cols-2 gap-3"
            >
              {storeConfig.features.gender.options[language].map((option, index) => (
                <ToggleGroupItem
                  key={index}
                  value={storeConfig.features.gender.options.ja[index]}
                  className="bg-gray-900 border-gray-800 data-[state=on]:bg-gradient-to-r data-[state=on]:from-cyan-500 data-[state=on]:to-purple-600 data-[state=on]:text-white text-gray-400 hover:text-white transition-all px-4 py-3 text-sm font-bold rounded-xl"
                >
                  {option}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </section>
        )}

        {/* 5. 来店タイプ */}
        {storeConfig.features.visitType.enabled && (
          <section className="space-y-4">
            <h2 className="text-lg font-bold border-l-4 border-purple-500 pl-2">
              {language === "ja" ? "来店タイプ 🚶" : "Visit Type 🚶"}
            </h2>
            <ToggleGroup
              type="single"
              value={visitType}
              onValueChange={(value) => value && setVisitType(value)}
              className="grid grid-cols-2 gap-3"
            >
              {storeConfig.features.visitType.options[language].map((option, index) => (
                <ToggleGroupItem
                  key={index}
                  value={storeConfig.features.visitType.options.ja[index]}
                  className="bg-gray-900 border-gray-800 data-[state=on]:bg-gradient-to-r data-[state=on]:from-cyan-500 data-[state=on]:to-purple-600 data-[state=on]:text-white text-gray-400 hover:text-white transition-all px-4 py-3 text-sm font-bold rounded-xl"
                >
                  {option}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </section>
        )}

        {/* 6. スタッフ名 */}
        {storeConfig.features.staffName.enabled && (
          <section className="space-y-4">
            <h2 className="text-lg font-bold border-l-4 border-purple-500 pl-2">
              {language === "ja" ? "推しスタッフ（複数OK！）" : "Favorite Staff (Optional)"}
            </h2>
            <input
              className="w-full bg-gray-900 border-gray-800 text-white p-4 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none placeholder:text-gray-600"
              placeholder={storeConfig.features.staffName.placeholder[language]}
              value={staff}
              onChange={(e) => setStaff(e.target.value)}
            />
          </section>
        )}

        {/* 7. 生成ボタン */}
        <Button 
          onClick={handleGenerate} 
          disabled={loading || (storeConfig.features.keywords.enabled && keywords.length === 0)}
          className="w-full py-8 text-xl font-black rounded-2xl shadow-lg transition-all active:scale-95 disabled:opacity-50 text-white"
          style={{
            background: `linear-gradient(to right, ${storeConfig.theme.primaryColor}, ${storeConfig.theme.secondaryColor})`,
            boxShadow: `0 0 20px ${storeConfig.theme.primaryColor}80`
          }}
        >
          {loading ? <Loader2 className="animate-spin mr-2 h-6 w-6" /> : <Sparkles className="mr-2 h-6 w-6" />}
          {language === "ja" ? "口コミを自動作成 🪄" : "Generate Review 🪄"}
        </Button>

        {/* 8. 結果表示エリア */}
        {review && (
          <Card id="review-result" className="p-4 bg-gray-900/90 border-cyan-500/50 space-y-4 animate-in fade-in zoom-in duration-300 shadow-lg">
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
