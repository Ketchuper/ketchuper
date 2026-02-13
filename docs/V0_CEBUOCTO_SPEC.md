# V0用：CEBUOCTO 口コミ生成フォームのデザイン仕様

V0（有料）に投げる用のプロンプトです。JSON形式で要件をまとめています。  
**作った後の利用方法**はこのファイルの末尾に記載しています。

---

## 1. V0に貼るプロンプト（要約）

```
南国・セブ島のマリンツアー会社「CEBUOCTO」の、Google口コミ下書きを生成する1ページフォームを作ってください。

- トーン: サイバーパンクではなく、南国・海・リゾート感。色はティール（#0d9488）とアンバー（#f59e0b）、背景はダークスレート〜ティールのグラデーション。
- 構成: 1画面に収まる。左カラム：評価（星1〜5）、良かったポイント（複数選択OKと明示）。右カラム：誰と、性別。その下：生成ボタン。結果エリアはカードで表示し、コピー・Googleマップ投稿の2ステップボタン。
- 良かったポイントは「当てはまるものをいくつでも選べます（複数選択OK）」と説明文を表示する。
- モバイルでは1カラムに折り返すレスポンシブ。
- 使用技術: Next.js App Router, React, Tailwind CSS, Radix UI の ToggleGroup（複数選択・単一選択）。
```

---

## 2. JSON形式（V0やAIにそのまま渡す用）

```json
{
  "project": "CEBUOCTO Review Booster form",
  "description": "南国・セブ島マリンツアー会社向けの口コミ下書き生成フォーム。1ページ構成。",
  "tone": "南国・リゾート。サイバーパンクやネオンは使わない。",
  "colors": {
    "primary": "#0d9488",
    "secondary": "#f59e0b",
    "background": "gradient from slate-900 via teal-950/30 to slate-900",
    "accentSelected": "teal-500/20 border teal-400/50",
    "textMuted": "gray-400",
    "textPrimary": "white / gray-100"
  },
  "layout": {
    "type": "single-page",
    "responsive": "grid 1 col on mobile, 2 cols on sm+",
    "sections": [
      { "id": "rating", "label_ja": "評価 ⭐", "label_en": "Rating ⭐", "type": "star-1-5" },
      { "id": "keywords", "label_ja": "良かったポイント 🎯", "label_en": "What You Enjoyed 🎯", "type": "multi-select", "hint_ja": "当てはまるものをいくつでも選べます（複数選択OK）", "hint_en": "Select all that apply (multiple OK)" },
      { "id": "companion", "label_ja": "誰と 👥", "label_en": "With whom 👥", "type": "single-select", "options_ja": ["友達", "家族", "恋人", "一人"], "options_en": ["Friends", "Family", "Partner", "Solo"] },
      { "id": "gender", "label_ja": "あなた 👤", "label_en": "You 👤", "type": "single-select", "options_ja": ["男性", "女性"], "options_en": ["Male", "Female"] }
    ],
    "cta": { "label_ja": "口コミを自動作成 🪄", "label_en": "Generate Review 🪄" },
    "result": {
      "textarea_editable": true,
      "steps": ["① コピー 📋", "② Googleマップで投稿 🚀"],
      "hint_ja": "①コピー → ②Googleマップで投稿 → ③ペースト",
      "hint_en": "①Copy → ②Open Google Maps → ③Paste"
    }
  },
  "tech": ["Next.js App Router", "React", "Tailwind CSS", "Radix UI ToggleGroup"]
}
```

---

## 3. 作った後の利用方法

1. **V0で生成**  
   - 上記プロンプトまたはJSONをV0に貼り、コンポーネントを生成する。

2. **コードの取り込み**  
   - V0が出力した React/Next のコードをコピーする。  
   - このリポジトリでは **CEBUOCTO 用のUIは `src/app/[storeId]/page.tsx` の「1ページ構成」の分岐（`isSinglePage === true`）** に対応しています。  
   - **方法A**: V0のコードを `src/components/cebuocto/CebuoctoForm.tsx` のような新コンポーネントとして保存し、`[storeId]/page.tsx` の `isSinglePage` のときに `<CebuoctoForm ... />` を表示するように差し替える。  
   - **方法B**: V0のデザインを参考に、既存の `[storeId]/page.tsx` 内のJSX・クラス名を手で書き換える。

3. **データのつなぎ方**  
   - フォームの state（星・キーワード・誰と・性別）は既存の `useState` と同一にそろえる。  
   - 生成ボタンは `handleGenerate` を呼ぶ。  
   - 結果表示は `review` を表示し、コピーは `handleCopy`、Googleマップは `handleOpenGoogleMaps`（`storeConfig.googleMapsUrl`）を呼ぶ。

4. **スタンドアロンで使う場合**  
   - V0のページをそのまま使うだけなら、ルートに新規ページ（例: `src/app/cebuocto-standalone/page.tsx`）を作り、そこにV0のコードを貼ってもよい。その場合は `generateReview` を import して同じ `storeId: "cebuocto"` で呼ぶ。

---

以上をREADMEやV0のプロンプト欄にコピペして使えます。
