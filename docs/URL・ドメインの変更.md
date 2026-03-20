# Review Booster：URL・ドメインを「Review Booster / 店舗名」にする方法

事業名は Map Engine、サービス名は Review Booster です。  
URLを `barvel-review` ではなく **Review Booster** ベースにしたい場合の手順です。

---

## 現在の状態

- **デプロイ先**: Vercel のプロジェクト名が `barvel-review` のため、デフォルトURLは `https://barvel-review.vercel.app`
- **ルート `/`**: LP（サービス紹介・作成中）
- **店舗**: `https://barvel-review.vercel.app/barvel-koza`、`/bar-replica`、`/cebuocto` など

---

## 方法A: Vercel のプロジェクト名を変更する（無料）

1. [Vercel Dashboard](https://vercel.com) にログインし、対象プロジェクトを開く。
2. **Settings** → **General** → **Project Name** を `review-booster` に変更して保存。
3. 本番URLが **`https://review-booster.vercel.app`** に変わります。
   - LP: `https://review-booster.vercel.app/`
   - BARVEL: `https://review-booster.vercel.app/barvel-koza`
   - BAR REPLICA: `https://review-booster.vercel.app/bar-replica`
   - CEBUOCTO: `https://review-booster.vercel.app/cebuocto`

**注意（NFC）**: いま BARVEL の NFC が `barvel-review.vercel.app` のルート (`/`) を指している場合、プロジェクト名変更後は **`https://review-booster.vercel.app/barvel-koza`** を指すようにNFCの内容を更新してください。ルートは LP のため、BARVEL は `/barvel-koza` のみです。

---

## 方法B: カスタムドメインを使う

例: `reviewbooster.mapengine.jp` や `review-booster.com` など。

1. ドメインを取得し、Vercel の **Settings** → **Domains** でプロジェクトに追加。
2. DNS で Vercel の指示どおり CNAME 等を設定。
3. 本番URLを **`https://（取得したドメイン）/`** として運用。
   - LP: `https://（ドメイン）/`
   - 店舗: `https://（ドメイン）/barvel-koza`、`/bar-replica` など

旧 URL（`barvel-review.vercel.app`）にアクセスが残る場合は、Vercel の **Redirects** で `barvel-review.vercel.app` → `（新ドメイン）/barvel-koza` などにリダイレクトすると、NFCをすぐには変えられない場合でも対応できます。

---

## まとめ

| 目的 | 手順 |
|------|------|
| URLの冒頭を `review-booster` にする | 方法A: Vercel で Project Name を `review-booster` に変更 |
| 独自ドメインで「Review Booster / 店舗名」にする | 方法B: カスタムドメインを追加 |
| ルートを LP にする | 済（`/` = LP、店舗は `/{店舗ID}`） |
| BARVEL の NFC を壊さない | NFCの指し先を **`（本番URL）/barvel-koza`** に更新するか、旧URLから `/barvel-koza` へリダイレクト |
