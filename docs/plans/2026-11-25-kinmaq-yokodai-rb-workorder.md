# 作業指示書：Next整体KINMAQ 横浜洋光台駅前院 Review Booster（`kinmaq-yokodai`）

作成: 2026-11-25 / 状態: **実装中（方針GO）**  
対象: `/kinmaq-yokodai` のみ（legacy-generator）

---

## 0. 絶対に守ること

1. 触るのは `kinmaq-yokodai` だけ。既存店は1文字も変えない。
2. `origin/main` から切った clean ブランチ／worktree で作業する。
3. legacy-generator のまま。`reviewMode` を付けない。
4. `placeId` は確認できた ChIJ のみ。現状は空。`googleMapsUrl` = `https://share.google/vk67zWd5RHiL3DzZP`。
5. 本番反映は QA 合格後のみ。

---

## 1. 店舗メモ（事実／推測を分ける）

| 項目 | 内容 | 確度 |
|------|------|------|
| 正式名 | Next整体KINMAQ 横浜洋光台駅前院 | 店主確認済 2026-11-24 |
| storeId | `kinmaq-yokodai` | 確定 |
| 住所・エリア | 〒235-0045 横浜市磯子区洋光台3-1-1 ショップ27 2階-10号 | Maps・公式で確認済 |
| 業態・USP | 整体。理学療法士による筋膜整体。肩こり・腰痛等 | 公式・GBP・AI要約で確認済 |
| Maps URL | https://share.google/vk67zWd5RHiL3DzZP | 依頼者提供 |
| placeId | 空 | ChIJ未確認 |
| IG | https://www.instagram.com/kinmaq_yokohama/ | 確認済 |
| 評価・口コミテーマ | 4.8 / 57件。丁寧な説明・施術後の軽さ・姿勢 | Maps要約（本文は保存しない） |
| トンマナ（色） | ロゴ紺×白。primary `#0A2744` / secondary `#4F8FBF` | ロゴから抽出 |
| ロゴ | あり → `public/kinmaq-yokodai-logo.png` | 店主提供 |

**再点検（2026-11-25）:** 「磯子区 整体」ローカルパック上位に当院が出ないため、選択肢から除外し文中補足へ。見出しは「洋光台 整体」。

---

## 2. MEO 分類

**毎回入れる見出し:** 洋光台 ＋ 整体／ EN: Yokodai, seitai (or bodywork clinic)

**選択肢（最大6）**

| # | ja（キー） | en |
|---|------------|-----|
| 1 | 洋光台駅前 | Near Yokodai Station |
| 2 | 理学療法士の施術 | Treatment by physical therapists |
| 3 | 筋膜整体 | Fascia-focused seitai |
| 4 | 肩こり・腰痛の相談 | For stiff shoulders & lower back |
| 5 | 姿勢・動きの相談 | For posture & movement |
| 6 | 長く続く不調の相談 | For lingering discomfort |

**文中補足のみ:** 磯子区、駅徒歩、説明が丁寧、半個室

**除外と理由:**
- 磯子区の整体（選択肢）→ 区単位パックでピンが上位に出にくい
- 整骨院／保険適用 → 業態誤り
- 完治・治った・再発しない → 効果保証
- 料金断定 → 変動しうる
- 他店比較 → 炎上リスク
- 横浜全域 → 距離負け

**AIO用の店説明一文（日）:**  
横浜市磯子区・洋光台駅前の整体院。国家資格の理学療法士による筋膜整体で、肩こり・腰痛などの相談に対応。

---

## 3. アンケート

- 星: 既定5
- 性別: 有効（本文に男/女と書かない）
- 来店: 地元／観光
- 同行者: 友達／家族／恋人／一人
- スタッフ名: **無効**（人名未確認）
- 条件付き解禁: なし

**theme:** primary `#0A2744` / secondary `#4F8FBF`

---

## 4–8. 実装・QA・出荷

- `stores.ts` / `actions.ts` / logo / README・店舗管理1行
- QA: 約20件 → `docs/reports/2026-11-25-kinmaq-yokodai-keyword-qa.md`
- コミット: `feat(kinmaq-yokodai): add Review Booster store`
- 本番: `https://barvel-review.vercel.app/kinmaq-yokodai`
