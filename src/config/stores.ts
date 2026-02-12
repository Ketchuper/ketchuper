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
    }
  },
  
  "cebuocto": {
    id: "cebuocto",
    name: "CEBUOCTO",
    nameEn: "CEBUOCTO (セブオクト)",
    logoPath: "/cebuocto-logo.png",
    googleMapsUrl: "https://maps.app.goo.gl/zQf15Qzi5adydRep8?g_st=ic",
    placeId: "cebuocto", // Google Place IDが必要な場合は後で更新
    
    theme: {
      primaryColor: "#3b82f6", // blue-500
      secondaryColor: "#06b6d4", // cyan-500
      logoGlow: "drop-shadow(0 0 20px rgba(59, 130, 246, 0.6)) drop-shadow(0 0 40px rgba(6, 182, 212, 0.4))"
    },
    
    features: {
      keywords: {
        enabled: true,
        options: {
          ja: [
            "半日プランで満喫",
            "パラセーリング",
            "アイランドホッピング",
            "写真・スタッフ"
          ],
          en: [
            "Half-day Plan",
            "Parasailing",
            "Island Hopping",
            "Photos & Staff"
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
      ja: "セブ島のマリンアクティビティツアー「CEBUOCTO（セブオクト）」。半日プランで効率的に、パラセーリング・アイランドホッピングなどが楽しめる。日本人スタッフが親切で安全管理も万全。",
      en: "Marine activity tour in Cebu 'CEBUOCTO'. Half-day plan for time efficiency. Parasailing, island hopping, and more. Japanese staff ensures safety and great photos."
    }
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
