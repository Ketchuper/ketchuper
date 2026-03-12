// Review Booster 配下の店舗設定
// 構成: Review Booster（サービス） > 各店舗（BARVEL, CEBUOCTO, ...）。新規店舗はこの stores に追加し、パスは /{id}。
// 店舗管理の詳細: docs/店舗管理.md

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
          ja: "いれば教えてください（名前・特徴どちらでもOK）",
          en: "If any (name or description OK)"
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

  "barvel": {
    id: "barvel",
    name: "BARVEL",
    nameEn: "BARVEL",
    logoPath: "/barvel-logo.png",
    googleMapsUrl: "https://maps.google.com/",
    placeId: "",

    theme: {
      primaryColor: "#06b6d4",
      secondaryColor: "#a855f7",
      logoGlow: "drop-shadow(0 0 20px rgba(255, 0, 0, 0.6)) drop-shadow(0 0 40px rgba(0, 255, 255, 0.4))"
    },

    features: {
      keywords: {
        enabled: true,
        options: {
          ja: [
            "ダーツ・カラオケ無料",
            "時間無制限飲み放題",
            "出入り自由・ハシゴ酒",
            "スタッフ最高"
          ],
          en: [
            "Free Darts & Karaoke",
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
          ja: "いれば教えてください（名前・特徴どちらでもOK）",
          en: "If any (name or description OK)"
        }
      },
      rating: {
        enabled: true,
        default: 5
      }
    },

    promptContext: {
      ja: "沖縄県沖縄市上地のアミューズメントバー「BARVEL」本店。NEWバビロンビル4F。「誰でも気軽に楽しめる」がコンセプトで、賑やかな雰囲気。ダーツ・カラオケ・ビリヤード完備。サイコロゲームやスタッフとの交流も人気。料金は1時間2,000円・2時間3,000円・時間無制限3,500円。単品900円・スタッフドリンク1,000円。ダーツ・カラオケ無料、リストバンドで再入場無料。21:00〜翌3:00（金土は5:00）、木曜定休。予約なしOK、団体はInstagram DM。現金・クレジット・PayPay等対応。",
      en: "BARVEL (main store), amusement bar in Ueji, Okinawa City (NEW Babylon Bldg 4F). Concept: fun for everyone, lively vibe. Darts, karaoke, billiards. Popular for dice games and staff interaction. Pricing: 1h ¥2,000, 2h ¥3,000, unlimited ¥3,500. Single drink ¥900, staff drink ¥1,000. Darts and karaoke free; re-entry free with wristband. Open 21:00-3:00 (Fri/Sat until 5:00), closed Thu. Walk-ins OK; groups can reserve via Instagram DM. Cash, cards, PayPay accepted."
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
  },

  "bar-replica": {
    id: "bar-replica",
    name: "BAR REPLICA",
    nameEn: "BAR REPLICA",
    logoPath: "/bar-replica-logo.png",
    googleMapsUrl: "https://local.google.com/place?placeid=ChIJf3vflBtV5DQRMXZ5XhkdRyg&utm_medium=noren&utm_source=gbp&utm_campaign=2026",
    placeId: "ChIJf3vflBtV5DQRMXZ5XhkdRyg",

    theme: {
      primaryColor: "#3A92A4",
      secondaryColor: "#A8383B",
      logoGlow: "drop-shadow(0 0 12px rgba(58, 146, 164, 0.5)) drop-shadow(0 0 24px rgba(168, 56, 59, 0.3))"
    },

    features: {
      keywords: {
        enabled: true,
        options: {
          ja: ["🎯 ダーツ・カラオケ無料", "💸 女性無料・コスパ最強", "🗽 アメリカンな雰囲気", "🌃 朝まで遊べる・2次会"],
          en: ["🎯 Free Darts & Karaoke", "💸 Women Free / Great Value", "🗽 American Vibe", "🌃 Open late / 2nd party"]
        }
      },
      companion: {
        enabled: true,
        options: { ja: ["友達", "同僚", "恋人", "一人"], en: ["Friends", "Coworkers", "Partner", "Solo"] }
      },
      gender: {
        enabled: true,
        options: { ja: ["男性", "女性"], en: ["Male", "Female"] }
      },
      visitType: {
        enabled: true,
        options: { ja: ["地元・沖縄住み", "旅行・観光"], en: ["Local", "Tourist"] }
      },
      staffName: {
        enabled: true,
        placeholder: { ja: "いれば教えてください（名前・特徴どちらでもOK）", en: "If any (name or description OK)" }
      },
      rating: {
        enabled: true,
        default: 5
      }
    },

    promptContext: {
      ja: "沖縄県名護市にあるアメリカンスタイルのバー『BAR REPLICA』。最大の特徴は女性飲み放題無料、男性2時間3500円の圧倒的コスパ。店内ではダーツ、ビアポン、カラオケが無料で遊び放題。朝まで営業（金土は翌5時まで）しており、2次会や3次会に最適。外国人客も多く国際色豊かな雰囲気。",
      en: "BAR REPLICA, an American-style bar in Nago, Okinawa. Features free all-you-can-drink for women and 3,500 yen for 2 hours for men. Free darts, beer pong, and karaoke. Open late (until 5 AM on weekends), perfect for after-parties. Great international vibe with many foreign customers."
    },
    singlePageLayout: true
  },

  // マスターテンプレート（新規店舗用のコピー元。質問項目・UIはBARVELと同じ。名前・ロゴ・URL・キーワードだけ差し替えて使う）
  "_template": {
    id: "_template",
    name: "テンプレート店舗",
    nameEn: "Template Store",
    logoPath: "/template-logo.png",
    googleMapsUrl: "https://maps.google.com/",
    placeId: "template",

    theme: {
      primaryColor: "#06b6d4",
      secondaryColor: "#a855f7",
      logoGlow: "drop-shadow(0 0 20px rgba(6, 182, 212, 0.4)) drop-shadow(0 0 40px rgba(168, 85, 247, 0.3))"
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
          ja: "いれば教えてください（名前・特徴どちらでもOK）",
          en: "If any (name or description OK)"
        }
      },
      rating: {
        enabled: true,
        default: 5
      }
    },

    promptContext: {
      ja: "（ここに店舗の説明を書く）",
      en: "(Store description here)"
    },
    singlePageLayout: false
  }
};

// ヘルパー関数
export function getStoreConfig(storeId: string): StoreConfig | null {
  return stores[storeId] || null;
}

/** 公開する店舗IDのみ。_template はコピー用のため一覧に含めない */
export function getAllStoreIds(): string[] {
  return Object.keys(stores).filter((id) => !id.startsWith("_"));
}

export function isValidStoreId(storeId: string): boolean {
  return storeId in stores;
}
