# マスターテンプレート（コピー元）

新規店舗を追加するときは、**この設定をそのままコピー**して `src/config/stores.ts` の `stores` に追加し、以下だけ差し替える。

- `id` / `name` / `nameEn`
- `logoPath` → `public/{店舗ID}-logo.png` を用意し `"/{店舗ID}-logo.png"`
- `googleMapsUrl` / `placeId`
- `theme`（必要に応じて）
- `features.keywords.options`（良かったポイントの文言を店舗用に）
- 不要な項目は `features.*.enabled: false` に（companion / gender / visitType / staffName）
- `promptContext`（口コミ生成用の店舗説明）
- 1ページ構成にする場合は `singlePageLayout: true`

**注意**: 質問項目は増やさず・減らさず、**ON/OFF と文言の差し替えのみ**。UIは `[storeId]` 共通のため、このテンプレと同じ並び・同じレイアウトになる。

**他店舗を作る時の流れ**（決めること一覧・Gemini で協議→最終仕様→実装）は [新規店舗の作り方.md](新規店舗の作り方.md) を参照。

---

## コピー用ブロック（stores に追加するオブジェクト）

```ts
"新規店舗ID": {
  id: "新規店舗ID",
  name: "店舗名",
  nameEn: "Store Name",
  logoPath: "/新規店舗ID-logo.png",
  googleMapsUrl: "https://maps.google.com/...",
  placeId: "Google Place ID または任意",

  theme: {
    primaryColor: "#06b6d4",
    secondaryColor: "#a855f7",
    logoGlow: "drop-shadow(0 0 20px rgba(6, 182, 212, 0.4)) drop-shadow(0 0 40px rgba(168, 85, 247, 0.3))"
  },

  features: {
    keywords: {
      enabled: true,
      options: {
        ja: ["良かったポイント1", "良かったポイント2", "良かったポイント3", "良かったポイント4"],
        en: ["Good point 1", "Good point 2", "Good point 3", "Good point 4"]
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
      options: { ja: ["地元", "観光"], en: ["Local", "Tourist"] }
    },
    staffName: {
      enabled: true,
      placeholder: { ja: "いれば教えてください（名前・特徴どちらでもOK）", en: "If any (name or description OK)" }
    },
    rating: { enabled: true, default: 5 }
  },

  promptContext: {
    ja: "（店舗の説明をここに書く）",
    en: "(Store description here)"
  },
  singlePageLayout: false
}
```

---

## 動作確認

- マスターテンプレの見た目・質問数は **`http://localhost:3000/_template`** で確認できる（本番一覧には出さない）。
- ロゴは `public/template-logo.png` が無いと表示されない。新規店舗では `logoPath` をその店舗のロゴにすること。
