"use server";

import OpenAI from "openai";
import { generateRandomParams, ReviewGenerationParams } from "@/lib/reviewParams";

// 環境変数からAPIキーを安全に読み込む
const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  console.error("❌ OPENAI_API_KEY が設定されていません");
  throw new Error("API key is not configured. Please contact the administrator.");
}

console.log("✅ OpenAI API Key loaded");

const openai = new OpenAI({
  apiKey: apiKey,
});

// シンプルなレート制限（メモリベース）
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

// クリーンアップ
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitMap.entries()) {
    if (now > value.resetTime) {
      rateLimitMap.delete(key);
    }
  }
}, 60000);

function checkSimpleRateLimit(identifier: string): { success: boolean; waitSeconds: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(identifier);
  
  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + 60000 });
    return { success: true, waitSeconds: 0 };
  }
  
  // 1分間に6回まで（やり直し・言語切替を考慮）
  if (entry.count >= 6) {
    const waitSeconds = Math.ceil((entry.resetTime - now) / 1000);
    return { success: false, waitSeconds };
  }
  
  entry.count++;
  return { success: true, waitSeconds: 0 };
}

export async function generateReview(
  keywords: string[], 
  staffName: string, 
  rating: number,
  companion: string = "友達",
  gender: string = "男性",
  visitType: string = "地元",
  language: string = "ja",
  clientId: string = "default", // クライアント側から送られる一意のID
  storeId: string = "barvel-koza" // 店舗ID（デフォルトはBARVEL）
) {
  // 店舗によって文脈を変更
  const isCebuOcto = storeId === "cebuocto";
  const storeName = isCebuOcto ? "CEBUOCTO" : "BARVEL KOZA";
  const storeContext = isCebuOcto ? "セブ島" : "沖縄コザ";
  // レート制限チェック（クライアントIDベース）
  const rateLimitResult = checkSimpleRateLimit(clientId);

  if (!rateLimitResult.success) {
    console.warn(`⚠️ Rate limit exceeded for client: ${clientId}`);
    throw new Error(
      language === "ja"
        ? `リクエストが多すぎます。${rateLimitResult.waitSeconds}秒後に再試行してください。`
        : `Too many requests. Please try again in ${rateLimitResult.waitSeconds} seconds.`
    );
  }

  console.log(`✅ Rate limit OK for client: ${clientId}`);

  // パラメータ生成（毎回ランダム）
  const hasStaff = Boolean(staffName && staffName.trim().length > 0);
  const params = generateRandomParams(gender, rating, hasStaff);
  
  console.log(`🎲 Generated params:`, params);

  // スタッフ名を「推し」として扱う
  const staffMention = staffName ? `${staffName}さん` : "スタッフ";
  const mentionStaff = hasStaff && Math.random() < params.staffMentionRate;
  
  // キーワードの自動言い換え用のバリエーション定義
  const keywordVariations: Record<string, string[]> = {
    // BARVEL KOZA用
    "ダーツ・ビリヤード無料": [
      "ダーツとビリヤードが無料",
      "ダーツもビリヤードもタダ",
      "ゲームが遊び放題",
      "ダーツとビリヤードが0円",
      "無料でダーツとビリヤード",
      "ダーツやビリヤードで遊べる"
    ],
    "時間無制限飲み放題": [
      "時間制限なしの飲み放題",
      "飲み放題が時間無制限",
      "時間を気にせず飲める",
      "定額で朝まで飲める",
      "時間制限ない飲み放題"
    ],
    "出入り自由・ハシゴ酒": [
      "出入り自由",
      "リストバンドで出入りできる",
      "ハシゴ酒に便利",
      "自由に出入りできる",
      "出入り自由なシステム"
    ],
    "スタッフ最高": [
      "スタッフが良い",
      "スタッフが親切",
      "スタッフのノリが良い",
      "スタッフと話せて楽しい",
      "接客が良い"
    ],
    
    // CEBUOCTO用（V0デザインの良かったポイントに対応）
    "海がキレイ": ["海が透き通っていてキレイ", "透明度が高い海", "エメラルドグリーンの海", "海が本当に綺麗"],
    "スタッフが親切": ["スタッフが親切で安心", "日本人スタッフが丁寧", "スタッフの対応が良かった", "気さくで話しやすい"],
    "写真・動画が最高": ["写真をたくさん撮ってくれた", "動画も撮影してくれた", "思い出が残る写真", "プロっぽい写真"],
    "安心・安全": ["安全管理がしっかり", "安心して楽しめた", "安全第一で案内", "丁寧な説明で安心"],
    "大興奮": ["めちゃくちゃ楽しかった", "最高に盛り上がった", "テンション上がった", "一生忘れない体験"],
    "シュノーケル": ["シュノーケリングが楽しかった", "海中が綺麗だった", "魚がたくさん見えた", "シュノーケルが気持ち良かった"],
    "イルカに会えた": ["イルカに会えて感激", "野生のイルカが見れた", "イルカと泳げた", "イルカが近くに来た"],
    "ウミガメに会えた": ["ウミガメに会えた", "ウミガメと泳いだ", "ウミガメが目の前を", "亀に会えてラッキー"],
    "景色が絶景": ["景色が絶景だった", "眺めが最高", "空と海が綺麗", "パノラマがすごい"],
    "コスパ良い": ["コスパが良い", "料金の割に充実", "お得なプラン", "価格相応以上"],
    "食事が美味しい": ["ランチが美味しかった", "ご飯も美味しい", "食事付きで満足", "地元の味が楽しめた"],
    "一生の思い出": ["一生の思い出になった", "忘れられない体験", "また来たい", "家族にも勧めたい"]
  };
  
  // 英語版の設定
  if (language === "en") {
    const companionEn: Record<string, string> = {
      "友達": "friends",
      "同僚": "coworkers",
      "恋人": "partner",
      "一人": "solo"
    };
    
    const genderEn = gender === "女性" ? "female" : "male";
    const visitTypeEn = visitType === "観光" ? "tourist" : "local";
    const companionText = companionEn[companion] || "friends";
    
    const keywordContextsEn: Record<string, string> = {
      "ダーツ・ビリヤード無料": "Emphasize that darts, pool, and karaoke are ALL FREE and unlimited. Mention how incredible the value is",
      "時間無制限飲み放題": "Highlight the UNLIMITED time all-you-can-drink system. No rush, stay until morning for a flat rate",
      "出入り自由・ハシゴ酒": "Mention the wristband system that lets you leave and come back. Perfect for bar hopping in Koza",
      "スタッフ最高": "Emphasize how fun and friendly the staff are. Great vibes, easy to talk to, never feel alone"
    };
    
    const selectedContextsEn = keywords
      .map(kw => keywordContextsEn[kw])
      .filter(Boolean)
      .join(". ");
    
    const staffMentionEn = staffName ? staffName : "the staff";
    
    const prompt = `You're a ${genderEn} customer in your 20s-30s who visited BARVEL KOZA in Koza, Okinawa. You're writing a Google Maps review with a fun, slightly tipsy vibe.

【CRITICAL】Write the ENTIRE review in ENGLISH ONLY. Do NOT use any Japanese words or characters!

【Your Experience】
- Rating: ${rating} stars
- Visit type: ${visitTypeEn} (${visitTypeEn === "local" ? "You live in Okinawa" : "You're visiting Okinawa for travel"})
- Came with: ${companionText}
- What you enjoyed: ${keywords.join(", ")}
${hasStaff ? `- Favorite staff: ${staffMentionEn}` : ""}

【Key Points to Emphasize】
${selectedContextsEn}

【STRICT RULES】
1. **Write a COMPLETE review that ends properly** (Never cut off mid-sentence!!!)
2. **Length: 100-130 characters** (Short but complete with a closing statement)
3. **Casual, fun tone** (like "dude", "literally", "so good", "amazing")
4. **NO formal AI language** - Sound like a real excited customer
5. **Past tense** (describe what happened: "went", "had", "was")
6. **Use 2-3 emojis naturally** 🎯🍺😂✨
7. **End with a positive closing** ("Definitely coming back!" "Highly recommend!")
${hasStaff ? `8. **Mention ${staffMentionEn} like a fan** ("${staffMentionEn} was hilarious", "Can't wait to see ${staffMentionEn} again")` : ""}

【Good Examples】
${companionText === "friends" && keywords.includes("ダーツ・ビリヤード無料") ? `"Went with friends after hitting other bars in Koza - darts and pool are FREE!? Stayed till morning 😂 ${hasStaff ? staffMentionEn + " made it even better!" : "Staff was awesome!"} Best value ever 🎯 Definitely coming back!"` : ""}
${companionText === "solo" && keywords.includes("スタッフ最高") ? `"Stopped by solo after work and ${hasStaff ? staffMentionEn : "the staff"} kept me entertained all night! Never felt alone 🍺 Free entry/exit system is clutch for bar hopping. See you again soon! ✨"` : ""}

Write ONE complete review following the rules above for a **${companionText} ${visitTypeEn} visit**. NEVER cut off mid-sentence!!!

【SUPER IMPORTANT】
1. Write ONLY in ENGLISH - no Japanese!
2. End with a complete sentence! Use closings like "Coming back!", "Highly recommend!", "See you soon!" etc.`;

    try {
      console.log(`🚀 OpenAI実行開始 (EN)`, { keywords, staffName, rating, companion, gender, visitType });
      
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You're a customer in your 20s-30s who visited BARVEL KOZA in Koza, Okinawa. Write a Google Maps review with a fun, friendly tone in ENGLISH ONLY."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.9,
        max_tokens: 500,
        top_p: 0.95,
      });
      
      const reviewText = completion.choices[0]?.message?.content || "";
      
      if (!reviewText) {
        throw new Error("OpenAI returned empty response");
      }
      
      console.log(`✅ OpenAI生成成功 (EN):`, reviewText);
      return reviewText.trim();
      
    } catch (error: any) {
      console.error(`❌ 口コミ生成エラー (EN):`, error);
      
      if (error.message?.includes("API key") || error.message?.includes("authentication") || error.status === 401) {
        throw new Error("API authentication failed. Please contact administrator.");
      }
      
      if (error.message?.includes("quota") || error.message?.includes("limit") || error.status === 429) {
        throw new Error("API usage limit reached. Please try again later.");
      }
      
      if (error.message?.includes("network") || error.message?.includes("fetch") || error.code === "ENOTFOUND") {
        throw new Error("Network error occurred. Please check your connection.");
      }
      
      if (error.message?.includes("timeout") || error.code === "ETIMEDOUT") {
        throw new Error("Request timed out. Please try again.");
      }
      
      throw new Error("Failed to generate review. Please try again.");
    }
  }
  
  // キーワードをランダムに言い換え
  const selectedKeywordTexts = keywords.map(kw => {
    const variations = keywordVariations[kw] || [kw];
    return variations[Math.floor(Math.random() * variations.length)];
  });

  // 日本語プロンプト（パラメータ駆動型）
  const isFemale = gender === "女性";
  const isLocal = visitType === "地元";
  
  // 文体スタイルの説明
  const styleDescriptions: Record<string, string> = {
    "simple": "短く簡潔に。〜だった、〜できた、で終わる",
    "satisfied": "満足感を表現。〜で良かった、〜も楽しめた",
    "evaluative": "評価を明確に。〜が印象的、〜なのも良い",
    "recommend": "推奨スタイル。〜行った、〜だった、おすすめ",
    "narrative": "エピソード重視。具体的な体験を描写"
  };
  
  // 読点スタイルの説明
  const commaDescriptions: Record<string, string> = {
    "minimal": "ほとんど使わない",
    "standard": "文法通りに使う",
    "chaotic": "不規則な位置に打つ",
    "none": "一切使わない"
  };
  
  // 店舗固有の設定
  const storeSpecificSettings = isCebuOcto 
    ? {
        storeName: "CEBUOCTO",
        locationContext: "セブ島旅行中",
        activityType: "マリンアクティビティ",
        mood: "ハイテンション、楽しかった、感謝の気持ち",
        forbiddenWords: ["スタッフ名は出さない"], // 仕様通り
        mandatoryEmoji: ["🌊", "🚤", "✨", "📸"] // CEBUOCTO推奨
      }
    : {
        storeName: "BARVEL KOZA",
        locationContext: isLocal ? "沖縄在住" : "旅行で沖縄訪問中",
        activityType: "飲み",
        mood: "楽しかった",
        forbiddenWords: [],
        mandatoryEmoji: []
      };
  
  // 店名配置の指示を生成
  const storeNameInstructions: Record<string, string> = {
    "beginning": `冒頭で「${storeSpecificSettings.storeName}」という店名を自然に入れる`,
    "middle": `文の途中で「${storeSpecificSettings.storeName}」を自然に言及する`,
    "end": `締めの部分で「${storeSpecificSettings.storeName}」を入れる`,
    "none": "店名は入れなくても良い（自然な流れ優先）"
  };

  const prompt = `あなたは${isFemale ? "20代後半の女性" : "20代後半の男性"}。${storeSpecificSettings.locationContext}。Googleマップに口コミを書いています。

【訪問内容】
${params.includeTime ? params.timeContext : ""}${companion}と${storeSpecificSettings.activityType}に行きました。

良かった点:
${selectedKeywordTexts.map(t => `・${t}`).join("\n")}
${mentionStaff && !isCebuOcto ? `・${staffMention}の接客` : ""}
${isCebuOcto ? "・日本人スタッフの気配り" : ""}

【書き方の特徴】
${isFemale 
  ? `感情を素直に表現。楽しかった気持ちを伝える。絵文字${params.emojiCount}個程度使ってOK${isCebuOcto ? "（🌊🚤✨📸などがおすすめ）" : ""}。`
  : `事実を淡々と伝える。絵文字は${params.emojiCount > 0 ? "1個まで" : "使わない"}。落ち着いた表現。`}
${isCebuOcto ? `\nテンション: ${storeSpecificSettings.mood}` : ""}

【文体（今回）】
${styleDescriptions[params.stylePattern]}

【ルール】
・文字数: 約${params.length}文字
・店名の配置: ${storeNameInstructions[params.storeNamePosition]}
・助詞を省略した口語も自然に（例: ダーツ無料で良い、海きれい）
・読点: ${commaDescriptions[params.commaStyle]}
・冒頭: 毎回違う書き出しで（${companion}と${storeName}に、は使いすぎ。別の表現で）
${isCebuOcto 
  ? `・観光客として。楽しかった体験を。
・半日プランの効率性を強調（午後は買い物など他の予定も可能）
・安全性と楽しさの両立を言及
・日本人スタッフへの感謝も自然に`
  : `・${isLocal ? "地元民として。知ってることに驚かない。" : "観光客として。"}
・感情語: ${isFemale ? "感情を込めて" : "控えめに"}
・強調表現（とても、すごく）: ${isFemale ? "使ってOK" : "あまり使わない"}
${isFemale ? "・感謝の気持ちも表現OK" : ""}`}

【冒頭のバリエーション例】
${isCebuOcto 
  ? `・セブ島で${companion}とツアー参加
・${params.includeTime ? params.timeContext : "旅行中に"}${companion}と体験
・${companion}とCEBUOCTOのツアーに
・セブ旅行の目玉として
・${companion}に誘われて参加`
  : `・${params.includeTime ? params.timeContext : "週末に"}${companion}と飲んだ
・コザで${companion}と遊んだ
・ハシゴ酒の締めに寄った
・久しぶりに${companion}と
・仕事帰りに${companion}と
・${companion}${params.openingPattern}
・地元の飲み屋を探して
（「${companion}に誘われて行った」は使うなら1回だけ。他を優先）`}

【締めのバリエーション】
毎回違う締めで。例: 一文で終わる、また来たい、おすすめ、感想だけ、比較（他店より）、一言（良かった）など。型にハマらない。

【禁止】
・同じ冒頭パターンを繰り返さない
・矛盾しない
・${rating === 5 ? "星5なのでポジティブに（大袈裟すぎない）" : `星${rating}なので適度な評価に`}
${rating < 5 ? "・小さな不満を入れても良い" : ""}

【NGワード（使いすぎ注意・別表現で）】
最高、素敵、また行く、楽しい時間、過ごした、ゆっくり、印象的 → 使うなら1回まで。ゆっくり→落ち着いて/のんびり、印象的→覚えてる/良かった、など言い換え可。

自然で毎回違う構成の口コミを書いてください。`;

  try {
    console.log(`🚀 OpenAI実行開始 (JA)`, { 
      keywords, 
      staffName, 
      rating, 
      companion, 
      gender, 
      visitType,
      params 
    });
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `あなたは普通の人間です。Googleマップに短い口コミを書いています。決まった型や構造はありません。自分らしく、自由に書いてください。`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.95, // 高めのバリエーション
      max_tokens: 300,
      top_p: 0.95,
      frequency_penalty: 0.4, // 繰り返し抑制
      presence_penalty: 0.4,  // 新表現促進
    });
    
    const reviewText = completion.choices[0]?.message?.content || "";
    
    if (!reviewText) {
      throw new Error("OpenAI returned empty response");
    }
    
    console.log(`✅ OpenAI生成成功 (JA):`, reviewText);
    return reviewText.trim();
    
  } catch (error: any) {
    console.error(`❌ 口コミ生成エラー (JA):`, error);
    
    if (error.message?.includes("API key") || error.message?.includes("authentication") || error.status === 401) {
      throw new Error("APIキーの認証に失敗しました。管理者に連絡してください。");
    }
    
    if (error.message?.includes("quota") || error.message?.includes("limit") || error.status === 429) {
      throw new Error("API使用制限に達しました。しばらく待ってから再試行してください。");
    }
    
    if (error.message?.includes("network") || error.message?.includes("fetch") || error.code === "ENOTFOUND") {
      throw new Error("ネットワークエラーが発生しました。接続を確認してください。");
    }
    
    if (error.message?.includes("timeout") || error.code === "ETIMEDOUT") {
      throw new Error("リクエストがタイムアウトしました。もう一度試してください。");
    }
    
    throw new Error("口コミの生成に失敗しました。もう一度お試しください。");
  }
}
