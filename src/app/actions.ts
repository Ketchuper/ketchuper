"use server";

import OpenAI from "openai";
import { headers } from "next/headers";
import { checkRateLimit, getClientIP } from "@/lib/rateLimit";

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

export async function generateReview(
  keywords: string[], 
  staffName: string, 
  rating: number,
  companion: string = "友達",
  gender: string = "男性",
  visitType: string = "地元",
  language: string = "ja"
) {
  // レート制限チェック
  let clientIP = "unknown";
  try {
    const headersList = await headers();
    clientIP = getClientIP(headersList);
  } catch (error) {
    console.warn("⚠️ Could not get client IP, using fallback");
    // IPが取得できない場合はレート制限をスキップ（開発環境対応）
  }

  const rateLimitResult = checkRateLimit(clientIP, 3, 60000); // 1分間に3回まで

  if (!rateLimitResult.success) {
    const waitSeconds = Math.ceil((rateLimitResult.reset - Date.now()) / 1000);
    console.warn(`⚠️ Rate limit exceeded for IP: ${clientIP}`);
    
    throw new Error(
      language === "ja"
        ? `リクエストが多すぎます。${waitSeconds}秒後に再試行してください。`
        : `Too many requests. Please try again in ${waitSeconds} seconds.`
    );
  }

  console.log(`✅ Rate limit OK for IP: ${clientIP} (${rateLimitResult.remaining}/${rateLimitResult.limit} remaining)`);

  // スタッフ名を「推し」として扱う
  const staffMention = staffName ? `${staffName}さん` : "スタッフ";
  const hasStaff = staffName && staffName.trim().length > 0;
  
  // 同行者に応じた表現パターン
  const companionContexts = {
    "友達": ["友達と", "友達数人で", "仲間と", "友人たちと"],
    "同僚": ["会社の同僚と", "職場の仲間と", "仕事仲間と", "同期と"],
    "恋人": ["彼女と", "彼氏と", "パートナーと", "デートで"],
    "一人": ["一人で", "ソロで", "ふらっと一人で", "仕事帰りに一人で"],
  };
  
  // 性別に応じた一人称や表現（少し酔っ払ったテンション）
  const genderTone = gender === "女性" 
    ? "女性目線で、少し酔っ払った楽しいテンション。堅苦しくない口語体" 
    : "男性目線で、少し酔っ払った楽しいテンション。堅苦しくない口語体";
  
  // 地元 or 観光に応じた表現
  const visitContext = visitType === "観光"
    ? "観光・旅行で沖縄を訪れた設定。「旅行で来た」「沖縄旅行中に」などの表現を使う"
    : "沖縄在住・地元の設定。「いつも通っている」「地元で有名」などの表現を使う。旅行感は一切出さない";
  
  // キーワード別の強調ポイント
  const keywordContexts: Record<string, string> = {
    "ダーツ・ビリヤード無料": "ダーツもビリヤードもカラオケも全部無料で遊び放題なことに驚いた様子。お得すぎる点を強調",
    "時間無制限飲み放題": "時間を気にせず朝まで定額で飲める点に感動。コスパ最強を強調",
    "出入り自由・ハシゴ酒": "リストバンドで出入り自由なシステムが便利。コザのハシゴ酒の拠点に最適という点を強調",
    "スタッフ最高": "スタッフのノリが良い、接客が楽しい、一人でも寂しくない点を強調"
  };
  
  const selectedContexts = keywords
    .map(kw => keywordContexts[kw])
    .filter(Boolean)
    .join("。");
  
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
  
  // 日本語版のプロンプト
  const prompt = `あなたは沖縄コザの「BARVEL KOZA」を訪れた20代〜30代の${gender}客で、少し酔っ払って楽しいテンション。Googleマップに実体験の口コミを投稿します。

【体験内容】
- 評価: ${rating}つ星
- 来店タイプ: ${visitType}（${visitContext}）
- 誰と来た: ${companion}
- 良かったポイント: ${keywords.join("、")}
${hasStaff ? `- 推しスタッフ: ${staffMention}（ファン目線で言及する）` : ""}

【強調すべきポイント】
${selectedContexts}

【絶対に守るルール】
1. **必ず完結した文章で最後まで書き切る**（途中で絶対に終わらない！！！）
2. **文字数: 120〜150文字程度**（長すぎず、必ず締めの言葉で完結させる）
3. **20〜30代の少し酔っ払った口調**（「マジで」「やばい」「最高」などの口語表現）
4. **堅苦しいAI感を排除**（「です・ます」調は控えめ、タメ口メイン）
5. **${visitType}の設定を守る**: ${visitContext}
6. **${companion}と来た設定を反映**: ${companionContexts[companion as keyof typeof companionContexts].join("、")}などを使う
7. **${genderTone}で書く**
8. **絵文字2〜3個を自然に使用**
9. **過去形で実体験として記述**（「〜した」「〜だった」）
10. **前向きな締めくくり**（「また行く」「おすすめ」など）
${hasStaff ? `11. **スタッフを「推し」として言及**: 「${staffMention}が面白かった」「また${staffMention}に会いに行く」などファン目線で` : ""}

【良い例】
${companion === "友達" && keywords.includes("ダーツ・ビリヤード無料") ? `「友達とコザ飲みの締めに寄ったら、ダーツもビリヤードも全部無料でマジでビビった😂 時間も気にせず朝まで遊べるし、${hasStaff ? staffMention + "のノリも最高で" : ""}コスパやばすぎ🎯 また絶対行く！」` : ""}
${companion === "一人" && keywords.includes("スタッフ最高") ? `「仕事帰りに一人で寄ったら${hasStaff ? staffMention : "スタッフ"}が絡んでくれて楽しかった🍺 一人でも全然寂しくないし、出入り自由だからハシゴの拠点に最適！${hasStaff ? "また" + staffMention + "に会いに行くわ〜" : "また行く〜"}✨」` : ""}
${companion === "恋人" && keywords.includes("時間無制限飲み放題") ? `「彼女と初めて行ったけど、時間制限なしの飲み放題で朝までゆっくりできた😊 ${hasStaff ? staffMention + "も気さくだし、" : ""}雰囲気も良くてデートにもおすすめ！また来ます🔄」` : ""}

上記ルールに従い、**${companion}と来た${visitType}の設定**で、少し酔っ払ったテンションの口コミを1つ作成してください。

【超重要】文章は必ず完結させること！「また行く！」「おすすめ！」などの締めの言葉で終わること。途中で終わるのは絶対NG！！！`;

  try {
    console.log(`🚀 OpenAI実行開始 (JA)`, { keywords, staffName, rating, companion, gender, visitType });
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "あなたは沖縄県コザの「BARVEL KOZA」を訪れた20代〜30代の顧客です。Googleマップに投稿する口コミを、親しみやすく楽しいトーンで書いてください。"
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
