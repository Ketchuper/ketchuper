// 店舗設定の型定義

export interface StoreFeatures {
  keywords: {
    enabled: boolean;
    options: {
      ja: string[];
      en: string[];
    };
  };
  companion: {
    enabled: boolean;
    options: {
      ja: string[];
      en: string[];
    };
  };
  gender: {
    enabled: boolean;
    options: {
      ja: string[];
      en: string[];
    };
  };
  visitType: {
    enabled: boolean;
    options: {
      ja: string[];
      en: string[];
    };
  };
  staffName: {
    enabled: boolean;
    placeholder: {
      ja: string;
      en: string;
    };
  };
  rating: {
    enabled: boolean;
    default: number;
  };
}

export interface StoreConfig {
  // 基本情報
  id: string;
  name: string;
  nameEn: string;
  logoPath: string;
  googleMapsUrl: string;
  placeId: string;
  
  // テーマ
  theme: {
    primaryColor: string;
    secondaryColor: string;
    logoGlow: string;
  };
  
  // 機能設定（ON/OFF可能）
  features: StoreFeatures;
  
  // プロンプト用のコンテキスト
  promptContext: {
    ja: string;
    en: string;
  };

  // 1ページ構成（入力〜生成を1画面に収める）
  singlePageLayout?: boolean;
}

// 店舗設定データベース
export const stores: Record<string, StoreConfig> = {
  "barvel-koza": {
    id: "barvel-koza",
    name: "BARVEL KOZA",
    nameEn: "BARVEL KOZA",
    logoPath: "/barvel-logo.png",
    googleMapsUrl: "https://local.google.com/place?placeid=ChIJGWb3_AwT5TQRjGx04c24hBk&utm_medium=noren&utm_source=gbp&utm_campaign=2026",
    placeId: "ChIJGWb3_AwT5TQRjGx04c24hBk",
    
    theme: {
      primaryColor: "#06b6d4", // cyan
      secondaryColor: "#a855f7", // purple
      logoGlow: "drop-shadow(0 0 20px rgba(255, 0, 0, 0.6)) drop-shadow(0 0 40px rgba(0, 255, 255, 0.4))"
    },
    
    features: {
      keywords: {
        enabled: true,
        options: {
          ja: [
            "ダーツ・ビリヤード無料",
            "時間無制限飲み放題",
            "出入り自由・ハシゴ酒",
            "スタッフ最高"
          ],
          en: [
            "Free Darts & Pool",
            "Unlimited Time All-You-Can-Drink",
            "Free Entry/Exit",
            "Amazing Staff"
          ]
        }
      },
      companion: {
        enabled: true,
        options: {
          ja: ["友達", "同僚", "恋人", "一人"],
          en: ["Friends", "Coworkers", "Partner", "Solo"]
        }
      },
      gender: {
        enabled: true,
        options: {
          ja: ["男性", "女性"],
          en: ["Male", "Female"]
        }
      },
      visitType: {
        enabled: true,
        options: {
          ja: ["地元", "観光"],
          en: ["Local", "Tourist"]
        }
      },
      staffName: {
        enabled: true,
        placeholder: {
          ja: "覚えてなかったらその人の特徴でもOK！例：メガネのお兄さん",
          en: "Name or description! e.g., Guy with glasses"
        }
      },
      rating: {
        enabled: true,
        default: 5
      }
    },
    
    promptContext: {
      ja: "沖縄県コザのバー「BARVEL KOZA」。ダーツ・ビリヤード・カラオケ無料、時間無制限飲み放題が特徴。20代〜30代の若者に人気。",
      en: "BARVEL KOZA is a bar in Koza, Okinawa. Features free darts, pool, karaoke, and unlimited time all-you-can-drink. Popular with young adults in their 20s-30s."
    },
    singlePageLayout: false
  },
  
  "cebuocto": {
    id: "cebuocto",
    name: "CEBUOCTO",
    nameEn: "CEBUOCTO (セブオクト)",
    logoPath: "/cebuocto-logo.png",
    googleMapsUrl: "https://maps.app.goo.gl/zM4SC3s4k7rMazSbA",
    placeId: "cebuocto", // Google Place IDが必要な場合は後で更新
    
    theme: {
      primaryColor: "#0d9488",   // 南国・海をイメージした teal
      secondaryColor: "#f59e0b", // サンセット・温かみの amber
      logoGlow: "drop-shadow(0 0 12px rgba(13, 148, 136, 0.4)) drop-shadow(0 0 24px rgba(245, 158, 11, 0.2))"
    },
    
    features: {
      keywords: {
        enabled: true,
        options: {
          ja: [
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
            "一生の思い出"
          ],
          en: [
            "Beautiful sea",
            "Friendly staff",
            "Great photos/videos",
            "Safe & secure",
            "So exciting",
            "Snorkeling",
            "Saw dolphins",
            "Saw sea turtles",
            "Stunning views",
            "Great value",
            "Delicious food",
            "Memory of a lifetime"
          ]
        }
      },
      companion: {
        enabled: true,
        options: {
          ja: ["友達", "家族", "恋人", "一人"],
          en: ["Friends", "Family", "Partner", "Solo"]
        }
      },
      gender: {
        enabled: true,
        options: {
          ja: ["男性", "女性"],
          en: ["Male", "Female"]
        }
      },
      visitType: {
        enabled: false, // セブ島観光客専用なので不要
        options: {
          ja: ["観光"],
          en: ["Tourist"]
        }
      },
      staffName: {
        enabled: false, // 仕様上、スタッフ名は禁止
        placeholder: {
          ja: "",
          en: ""
        }
      },
      rating: {
        enabled: true,
        default: 5
      }
    },
    
    promptContext: {
      ja: "セブ島のマリンアクティビティツアー「CEBUOCTO（セブオクト）」。半日プランで効率的に、パラセーリング・アイランドホッピング・シュノーケルなどが楽しめる。海がキレイ、イルカやウミガメに会えることも。日本人スタッフが親切で写真・動画も撮ってくれ、安心・安全。",
      en: "Marine activity tour in Cebu 'CEBUOCTO'. Half-day plan for time efficiency. Parasailing, island hopping, snorkeling. Crystal clear sea, dolphins and sea turtles. Japanese staff are friendly, take great photos/videos, and ensure safety."
    },
    singlePageLayout: true
  }
};

// ヘルパー関数
export function getStoreConfig(storeId: string): StoreConfig | null {
  return stores[storeId] || null;
}

export function getAllStoreIds(): string[] {
  return Object.keys(stores);
}

export function isValidStoreId(storeId: string): boolean {
  return storeId in stores;
}
