# Review Booster（MEO用口コミ下書き生成）

Google口コミ用の下書きをAIで生成するWebアプリです。**Review Booster** が製品名で、そのお客さんとして以下2つを運用しています。

| お客さん | 役割 | URL |
|----------|------|-----|
| **BARVEL KOZA** | 有料で実証実験を実施中（沖縄コザのバー） | `/` または `/barvel-koza` |
| **CEBUOCTO** | 営業代理点（フィリピン・セブ島のマリンツアー） | `/cebuocto` |

- どちらも同じアプリ内で店舗IDごとに設定を切り替えています（`src/config/stores.ts`）。
- 使えるものを早くデプロイして営業に回す想定です。

---

## 営業に回すまで（最短）

1. **デプロイ**  
   - このリポジトリを Vercel にデプロイ（Git連携で `main` プッシュで自動デプロイ）。
2. **環境変数**  
   - Vercel の **Settings → Environment Variables** で `OPENAI_API_KEY` を設定し、Redeploy。
3. **URL共有**  
   - BARVEL用: `https://（プロジェクト名）.vercel.app/` または `.../barvel-koza`  
   - CEBUOCTO用（営業代理点）: `https://（プロジェクト名）.vercel.app/cebuocto`
4. **営業への伝達**  
   - 「口コミ下書きが自動作成される。星・ポイントを選んで生成 → コピー → Googleマップで投稿」と手順だけ共有すれば利用可能。

---

## 総合評価（100点満点）

| 評価項目 | 得点 | 備考 |
|----------|------|------|
| **完成度** | 88点 | 星評価・キーワード・誰と・性別・店舗対応まで一通り実装済み。微調整の余地あり。 |
| **口コミ品質・ばらつき** | 82点 | 冒頭・締め・NG語の指示で自然さ向上。類似度は許容範囲。 |
| **UI・使いやすさ** | 85点 | 星・トグル・キーワード選択が分かりやすい。多言語対応。 |
| **評価制度の一貫性** | 85点 | 星→テンション・プロンプト対応。店名位置の重みも整合。 |
| **デプロイ・本番準備** | 80点 | Vercel想定。要・環境変数 `OPENAI_API_KEY` の設定。 |
| **総合** | **84点** | 実運用可能。Barvelで実際に使う方にデプロイして利用可能。 |

---

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## デプロイ（Barvelで実際に使う方向け）

本番で使う場合は **Vercel** へのデプロイを推奨します。

### 1. Vercelでプロジェクトをインポート

1. [Vercel](https://vercel.com) にログイン
2. **Add New** → **Project**
3. このリポジトリをGitで連携するか、`vercel` CLIでデプロイ

### 2. 環境変数を設定

Vercelのプロジェクト **Settings** → **Environment Variables** で次を追加します。

| 名前 | 値 | 備考 |
|------|-----|------|
| `OPENAI_API_KEY` | （OpenAIのAPIキー） | 必須。Server Actionsで使用 |

保存後、**Redeploy** で反映されます。

### 3. CLIでデプロイする場合

**※ デプロイはご自身のPCで実行してください（Vercelログインが必要です）**

```bash
cd barvel-review
npm run build          # ビルド確認
npx vercel login       # 初回のみ。ブラウザでVercelにログイン
npx vercel --prod      # 本番デプロイ
```

環境変数は `npx vercel env add OPENAI_API_KEY` で追加するか、Vercelダッシュボードの **Settings → Environment Variables** で設定してください。

### 公開URL

- デフォルト: `https://（プロジェクト名）.vercel.app`
- BARVEL KOZA: `/` または `/barvel-koza`
- CEBUOCTO: `/cebuocto`

---

### 今回CLIでデプロイできなかった理由（前回はできた場合）

| 要因 | 前回できたとき | 今回できなかった理由 |
|------|----------------|----------------------|
| **認証ファイル** | 実行環境で `~/Library/Application Support/com.vercel.cli/auth.json` に書き込み可能だった | サンドボックスで同パスへの書き込みが禁止され「operation not permitted」 |
| **トークン** | 有効なVercelログイントークンが保存されていた | 保存されていたトークンが期限切れ／無効で「The specified token is not valid」 |
| **実行主体** | ユーザーが自分のPCで `vercel login` 済みのうえで `vercel --prod` を実行 | Cursor/Agent側から実行しており、対話ログインやトークン更新ができない |

**結論**: デプロイは「Vercelにログインした状態で、有効なトークンがある環境」でないと成功しない。前回はその条件が整っていたが、今回はトークン無効のため失敗している。

---

### 予備案：手動デプロイの細かいステップ（CLI編）

**前提**: ターミナルを開き、このプロジェクトの `barvel-review` フォルダにいること。

1. **ビルドが通るか確認**
   - `npm run build` を実行する。
   - エラーが出たら依存関係や型を直してから次へ。

2. **Vercel CLI の有無を確認**
   - `npx vercel --version` を実行する。
   - バージョンが表示されればOK（未導入なら自動で取得される）。

3. **Vercel にログイン**
   - `npx vercel login` を実行する。
   - ブラウザが開いたら、表示されたメールアドレスでログインする。
   - 「Success!」などと出たらターミナルに戻る。

4. **初回のみ：プロジェクト紐づけ**
   - `npx vercel link` を実行する。
   - 対話で「Set up and deploy?」→ **Y**、Org 選択、Project 名を入力（既存を選んでも可）。
   - 既に同じフォルダで `vercel` をやったことがあればスキップ可。

5. **環境変数を設定**
   - `npx vercel env add OPENAI_API_KEY` を実行する。
   - 値に OpenAI の API キーを入力し、Environment は **Production**（と必要なら Preview）を選ぶ。
   - または Vercel ダッシュボード → 対象プロジェクト → **Settings** → **Environment Variables** で `OPENAI_API_KEY` を追加する。

6. **本番デプロイ**
   - `npx vercel --prod` を実行する。
   - ビルド・アップロードが終わると、本番URLが表示される。

7. **動作確認**
   - 表示されたURL（例: `https://barvel-review-xxx.vercel.app`）を開く。
   - 星を選んで口コミ生成を1回試し、エラーが出ないか確認する。

---

### 予備案：手動デプロイの細かいステップ（Git連携・ダッシュボード編）

**前提**: このプロジェクトを GitHub / GitLab / Bitbucket のリポジトリにプッシュ済みであること。

1. **Vercel にログイン**
   - ブラウザで [https://vercel.com](https://vercel.com) を開き、ログインする。

2. **新規プロジェクト作成**
   - **Add New…** → **Project** をクリックする。

3. **リポジトリを選ぶ**
   - 一覧から `barvel-review`（または該当リポ名）を選ぶ。なければ **Import Git Repository** でURLを指定する。

4. **設定を確認**
   - Framework Preset: **Next.js** のまま。
   - Root Directory: リポジトリ直下に `package.json` があるなら空のまま。サブフォルダなら `barvel-review` などに指定。
   - **Deploy** はまだ押さない。

5. **環境変数を追加**
   - **Environment Variables** を開く。
   - Name: `OPENAI_API_KEY`、Value: （OpenAIのAPIキー）を入力する。
   - Environment: **Production**（と必要なら Preview）にチェックを入れる。

6. **デプロイ開始**
   - **Deploy** をクリックする。
   - ビルドが終わるまで待つ（数分）。

7. **結果を確認**
   - **Visit** でサイトを開く。
   - 星を選んで口コミ生成を1回試し、エラーが出ないか確認する。

8. **今後の更新**
   - 同じリポジトリに `git push` すると、Vercel が自動で再デプロイする。環境変数はダッシュボードで変更可能。

---

## Deploy on Vercel（公式）

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
