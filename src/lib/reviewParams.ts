// レビュー生成パラメータ（リサーチベース）

export interface ReviewGenerationParams {
  // 基本パラメータ
  length: number;                // 文字数（60〜150）
  tension: number;               // テンション（1〜5）
  emojiCount: number;            // 絵文字の数（0〜3）
  
  // リサーチベースパラメータ
  emotionWordRatio: number;      // 感情語の割合（0.03〜0.15）
  intensifierFrequency: number;  // 強調表現の頻度（0.1〜0.7）
  gratitudeLevel: number;        // 感謝表現レベル（0.2〜0.9）
  
  // AI検出回避パラメータ
  particleOmission: number;      // 助詞省略率（0.15〜0.25）
  commaStyle: string;            // 読点スタイル
  
  // 構造パラメータ
  narrativePattern: string;      // ナラティブパターン
  includeTime: boolean;          // 時間情報を含むか
  timeContext: string;           // 時間的文脈
  includeSpatial: boolean;       // 空間ワード挿入
  spatialWord: string;           // 空間ワード
  
  // 文体パラメータ
  stylePattern: string;          // 文体パターン
  staffMentionRate: number;      // スタッフ言及率（0.9）
  
  // 店名配置
  storeNamePosition: string;     // 店名の位置（beginning/middle/end/none）
  openingPattern: string;        // 冒頭パターン
}

/**
 * 性別・星評価に基づいてランダムパラメータを生成
 */
export function generateRandomParams(
  gender: string,
  rating: number,
  hasStaff: boolean
): ReviewGenerationParams {
  // 基本パラメータ（性別による）
  const isFemale = gender === "女性";
  
  // 星評価によるテンション調整
  const baseTension = rating; // 星5なら5、星4なら4
  const tensionRange = isFemale 
    ? { min: Math.max(3, baseTension), max: 5 }
    : { min: Math.max(1, baseTension - 1), max: Math.min(3, baseTension) };
  
  const tension = randomInRange(tensionRange.min, tensionRange.max);
  
  // 文字数（極端な長短を混ぜる）
  const lengthOptions = [60, 70, 80, 90, 100, 120, 150];
  const length = lengthOptions[Math.floor(Math.random() * lengthOptions.length)];
  
  // 絵文字
  const emojiCount = isFemale 
    ? randomInRange(1, 3)
    : randomInRange(0, 1);
  
  // リサーチベースパラメータ
  const emotionWordRatio = isFemale
    ? randomFloat(0.08, 0.15)  // 女性: 8〜15%
    : randomFloat(0.03, 0.07); // 男性: 3〜7%
  
  const intensifierFrequency = isFemale
    ? randomFloat(0.4, 0.7)    // 女性: 高頻度
    : randomFloat(0.1, 0.3);   // 男性: 低頻度
  
  const gratitudeLevel = isFemale
    ? randomFloat(0.6, 0.9)    // 女性: 感謝多め
    : randomFloat(0.2, 0.5);   // 男性: 感謝少なめ
  
  // AI検出回避
  const particleOmission = randomFloat(0.15, 0.25); // 15〜25%
  
  const commaStyles = ["minimal", "standard", "chaotic", "none"];
  const commaStyle = commaStyles[Math.floor(Math.random() * commaStyles.length)];
  
  // ナラティブパターン（Small Stories）
  const narrativePatterns = [
    "の帰りに",
    "と行った",
    "の締めに",
    "で立ち寄った",
    "に行ってきた",
    "を訪れた"
  ];
  const narrativePattern = narrativePatterns[Math.floor(Math.random() * narrativePatterns.length)];
  
  // 時間情報（20%の確率）
  const includeTime = Math.random() < 0.2;
  const timeContext = includeTime ? generateTimeContext() : "";
  
  // 空間ワード（デフォルトOFF、将来的にON/OFF可能）
  const includeSpatial = false; // デフォルトOFF
  const spatialWords = ["店内", "カウンター", "入り口", "奥の方", "テーブル席"];
  const spatialWord = spatialWords[Math.floor(Math.random() * spatialWords.length)];
  
  // 文体パターン
  const stylePatterns = [
    "simple",      // 「〜だった。〜できた。」
    "satisfied",   // 「〜で良かった！〜も楽しめた」
    "evaluative",  // 「〜が印象的。〜なのも良い」
    "recommend",   // 「〜行った。〜だった。おすすめ」
    "narrative"    // エピソード重視
  ];
  const stylePattern = stylePatterns[Math.floor(Math.random() * stylePatterns.length)];
  
  // スタッフ言及率
  const staffMentionRate = hasStaff ? 0.9 : 0;
  
  // 店名の位置をランダム化
  const storeNamePositions = ["beginning", "middle", "end", "none"];
  const storeNameWeights = [0.3, 0.3, 0.3, 0.1]; // 30%, 30%, 30%, 10%
  const storeNamePosition = weightedRandom(storeNamePositions, storeNameWeights);
  
  // 冒頭パターンをランダム化（「友達に誘われて」に偏らないよう多めに）
  const openingPatterns = [
    "行った",
    "行ってきた",
    "訪れた",
    "立ち寄った",
    "飲みに行った",
    "遊びに行った",
    "飲んでみた",
    "寄った",
    "はしごした"
  ];
  const openingPattern = openingPatterns[Math.floor(Math.random() * openingPatterns.length)];
  
  return {
    length,
    tension,
    emojiCount,
    emotionWordRatio,
    intensifierFrequency,
    gratitudeLevel,
    particleOmission,
    commaStyle,
    narrativePattern,
    includeTime,
    timeContext,
    includeSpatial,
    spatialWord,
    stylePattern,
    staffMentionRate,
    storeNamePosition,
    openingPattern
  };
}

/**
 * 重み付きランダム選択
 */
function weightedRandom(items: string[], weights: number[]): string {
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  let random = Math.random() * totalWeight;
  
  for (let i = 0; i < items.length; i++) {
    random -= weights[i];
    if (random <= 0) {
      return items[i];
    }
  }
  
  return items[0];
}

/**
 * 時間的文脈を生成
 */
function generateTimeContext(): string {
  const now = new Date();
  const hour = now.getHours();
  const day = now.getDay();
  
  const dayNames = ["日曜", "月曜", "火曜", "水曜", "木曜", "金曜", "土曜"];
  const dayName = dayNames[day];
  
  // 営業時間: 21時〜27時（翌朝3時）
  const isBusinessHours = hour >= 21 || hour <= 3;
  
  if (!isBusinessHours) {
    // 営業時間外ならランダムな曜日を使う
    return `${dayNames[Math.floor(Math.random() * 7)]}の夜に`;
  }
  
  // 営業時間内なら実際の曜日を使う
  if (hour >= 21) {
    return `${dayName}の夜に`;
  } else {
    // 深夜〜早朝（0〜3時）
    return `${dayNames[(day - 1 + 7) % 7]}の深夜に`; // 前日扱い
  }
}

/**
 * ヘルパー関数
 */
function randomInRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}
