export type MarineHubHotel = {
  /** QRの ?hotel= と貸出ログで使う固定表記 */
  id: string;
  /** 表示名（パンフ・LP用） */
  label: string;
  /** official = まず置く2件 */
  tier: "official" | "pipeline";
  /** 置き場所メモ（フロント横など） */
  placeHint: string;
  /** 初回置く部数の目安 */
  initialQty: number;
  /** ホテル正式名が分かったら埋める。空なら label を印刷に使う */
  formalName: string;
};

export type MarineHubConfig = {
  brand: string;
  operator: string;
  tagline: string;
  supportLine: string;
  /** 印刷・チラシに載せる電話（空ならプレースホルダ表示） */
  phone: string;
  phoneDisplay: string;
  /** 公式LINEの友だち追加URL（空ならInstagramへ） */
  lineUrl: string;
  instagramUrl: string;
  instagramHandle: string;
  websiteUrl: string;
  toursUrl: string;
  mapsUrl: string;
  qrTargetPath: string;
  qrFallbackUrl: string;
  /** 今週の本命：シュノーケルレンタル */
  snorkelRental: {
    productName: string;
    tagline: string;
    supportLine: string;
    includes: ReadonlyArray<string>;
    howTo: ReadonlyArray<{ title: string; detail: string }>;
    priceHint: string;
    depositHint: string;
    qrTargetPath: string;
  };
  /** オフィシャル紹介2件を先頭に。正式名が分かり次第 formalName / label を更新 */
  hotels: ReadonlyArray<MarineHubHotel>;
  plans: ReadonlyArray<{
    id: string;
    name: string;
    blurb: string;
    priceHint: string;
    url: string;
    badge: string;
  }>;
};

/**
 * マリンハブ（車＝店舗）集客の連絡先・導線設定。
 * 印刷前に phone / lineUrl を必ず実値に差し替えること。
 */
export const marineHub: MarineHubConfig = {
  brand: "マリンハブ",
  operator: "CEBUOCTO（セブオクト）",
  tagline: "ホテルで迷ったら、ここで決まる。",
  supportLine: "半日で海も空も。日本語で安心。",

  phone: "",
  phoneDisplay: "電話番号（印刷前に記入）",
  lineUrl: "",

  instagramUrl: "https://www.instagram.com/cebuocto/",
  instagramHandle: "@cebuocto",
  websiteUrl: "https://cebuocto.com/",
  toursUrl: "https://cebuocto.com/tour/",
  mapsUrl: "https://maps.app.goo.gl/zM4SC3s4k7rMazSbA",

  qrTargetPath: "/marine-hub",
  qrFallbackUrl: "https://cebuocto.com/",

  snorkelRental: {
    productName: "シュノーケルレンタル",
    tagline: "ホテルで借りて、そのまま海へ。",
    supportLine: "マスク・シュノーケル・フィン。日本語で受付。",
    includes: ["マスク", "シュノーケル", "フィン", "使い方の案内（日本語）"],
    howTo: [
      { title: "QRまたは電話", detail: "希望日時・人数・ホテル名を送る" },
      { title: "受取", detail: "ホテル受取 or 指定場所（要相談）" },
      { title: "返却", detail: "返却場所・時間を申し込み時に確定" },
    ],
    priceHint: "料金（印刷前に記入）",
    depositHint: "デポジット有無（印刷前に記入）",
    qrTargetPath: "/marine-hub/snorkel-rental",
  },

  hotels: [
    {
      id: "official-1",
      label: "オフィシャルホテル①",
      tier: "official",
      placeHint: "フロント横ラック（要確認）",
      initialQty: 30,
      formalName: "",
    },
    {
      id: "official-2",
      label: "オフィシャルホテル②",
      tier: "official",
      placeHint: "フロント横ラック（要確認）",
      initialQty: 30,
      formalName: "",
    },
  ],

  plans: [
    {
      id: "marinesports-combo",
      name: "離島マリン詰め合わせ",
      blurb: "パラセーリング・バナナ・シュノーケル＋船上BBQ",
      priceHint: "P6,500〜",
      url: "https://cebuocto.com/tour/snorkel_marinesports/",
      badge: "人気1位",
    },
    {
      id: "halfday-parasail",
      name: "半日パラセーリング",
      blurb: "空中散歩＋海上アクティビティ。時間がなくてもOK",
      priceHint: "P5,000〜",
      url: "https://cebuocto.com/tour/marinesports/",
      badge: "半日",
    },
    {
      id: "shark-sumilon",
      name: "ジンベイ＆滝＆スミロン",
      blurb: "セブの定番を1日で。遭遇できない場合は一部返金保証",
      priceHint: "P5,500〜",
      url: "https://cebuocto.com/tour/shark_fall_sumilon/",
      badge: "1日王道",
    },
  ],
};

export type MarineHubPlan = (typeof marineHub.plans)[number];

export function getMarineHubPhoneLabel(): string {
  return marineHub.phone || marineHub.phoneDisplay;
}

export function getMarineHubPhoneHref(): string | null {
  if (!marineHub.phone) return null;
  const digits = marineHub.phone.replace(/[^\d+]/g, "");
  return digits ? `tel:${digits}` : null;
}

export function getMarineHubPrimaryCta(): { label: string; href: string } {
  if (marineHub.lineUrl) {
    return { label: "公式LINEで申し込む", href: marineHub.lineUrl };
  }
  return { label: "Instagram DMで申し込む", href: marineHub.instagramUrl };
}

/** QR用の絶対URLを組み立てる（ブラウザ上では origin を優先） */
export function buildMarineHubBookingUrl(
  origin?: string,
  hotel?: string,
  path: string = marineHub.qrTargetPath
): string {
  const base = origin
    ? `${origin.replace(/\/$/, "")}${path}`
    : path === marineHub.snorkelRental.qrTargetPath
      ? `${marineHub.qrFallbackUrl.replace(/\/$/, "")}${path}`
      : marineHub.qrFallbackUrl;
  if (!hotel) return base;
  const sep = base.includes("?") ? "&" : "?";
  return `${base}${sep}src=hotel&hotel=${encodeURIComponent(hotel)}`;
}

export function getOfficialHotels(): MarineHubHotel[] {
  return marineHub.hotels.filter((h) => h.tier === "official");
}

export function getHotelPrintName(hotel: MarineHubHotel): string {
  return hotel.formalName.trim() || hotel.label;
}

export function buildSnorkelRentalUrl(origin?: string, hotel?: string): string {
  return buildMarineHubBookingUrl(origin, hotel, marineHub.snorkelRental.qrTargetPath);
}
