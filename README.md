# Review Booster（Map Engine）

**Map Engine** の **Review Booster**（MEO用・Google口コミ下書き生成サービス）の開発用リポジトリです。  
**Review Booster の下に各店舗**が並ぶ構成で、現在は **BARVEL KOZA** と **CEBUOCTO** を運用しています。

## 事業・サービス・店舗の関係

| 階層 | 名前 | 説明 |
|------|------|------|
| 事業 | **Map Engine** | 事業全体 |
| サービス | **Review Booster** | Google口コミ下書きをAIで生成するWebサービス |
| 店舗 | **BARVEL KOZA** | 有料で実証実験中（沖縄コザのバー） |
| 店舗 | **CEBUOCTO** | 営業代理点（フィリピン・セブ島のマリンツアー） |
| 店舗 | （今後追加） | Review Booster の下に `/{店舗ID}` で追加 |

- 店舗ごとの設定は **`src/config/stores.ts`** で管理。新規店舗もここに追加し、パスは **`/{店舗ID}`** にします。
- **サイト名・URL**: 開発・ドキュメント上は **Review Booster**。本番URLは BARVEL の NFC の都合でいまは変更しない（現状のVercelドメインのまま運用）。
- **テンプレート**: BARVEL用の Review Booster をテンプレートとする。新規店舗は**同じテンプレをコピーしたうえで**変更を加え、アンケート項目は固定。→ [docs/テンプレート方針.md](docs/テンプレート方針.md)

### Review Booster 配下の店舗一覧

| 店舗 | パス | 備考 |
|------|------|------|
| BARVEL KOZA | `/` または `/barvel-koza` | トップを割り当て（NFC用） |
| CEBUOCTO | `/cebuocto` | 南国テーマ・1ページ・専用UI |
| （新規店舗） | `/{店舗ID}` | `stores.ts` に追加すれば `[storeId]` で表示。詳細は [docs/店舗管理.md](docs/店舗管理.md) |

### 現在見れない場合の主な原因と確認

| 原因 | 確認方法 | 対処 |
|------|----------|------|
| **Vercel のプロジェクト名を変えた** | NFCに書いたURL（例: `https://barvel-review.vercel.app`）をブラウザで開く | プロジェクト名を**元の名前に戻す**（Settings → General → Project Name）。NFCのURLを変えられないなら、Vercel側のドメインは変えないこと。 |
| **直近のデプロイが失敗している** | Vercel の **Deployments** で最新が Ready か、Failed か確認 | **Build Logs** でエラー内容を確認。`npm run build` をローカルで実行して同じエラーが出ればコードを修正。 |
| **環境変数未設定** | 口コミ生成ボタンを押すとエラーになる | **Settings → Environment Variables** で `OPENAI_API_KEY` を設定し、**Redeploy**。 |
| **別のプロジェクトを開いている** | v0-cebuocto-review-form など、APIのないプロジェクトのURLを見ている | **このリポジトリ（Review Booster）をデプロイしたプロジェクト**の **Settings → Domains** に出ているURLを使う。 |

**NFC用URLを変えずにデプロイする**: いつも通り `git push origin main` するだけ。Vercel のプロジェクト名やドメインを変更しなければ、これまで通り同じURLで見られます。

---

## 営業に回すまで（最短）

1. **デプロイ**  
   - このリポジトリを Vercel にデプロイ（Git連携で `main` プッシュで自動デプロイ）。BARVEL の NFC で使っているURLを変えられないため、**Vercel のプロジェクト名・ドメインは変更しない**。
2. **環境変数**  
   - Vercel の **Settings → Environment Variables** で `OPENAI_API_KEY` を設定し、Redeploy。
3. **URL共有**  
   - BARVEL: 現在の本番URL（NFC用）の `/` または `.../barvel-koza`  
   - その他店舗（CEBUOCTO など）: 現在の本番URLの `/{店舗ID}`（例: `.../cebuocto`）。  
   - 実際のURLは Vercel の **Settings → Domains** で確認。v0-cebuocto-review-form.vercel.app は別プロジェクト・APIなしなので使わないこと。
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
| **総合** | **84点** | 実運用可能。Review Booster としてデプロイして利用可能。 |

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

## デプロイ（Review Booster 本番用）

本番で使う場合は **Vercel** へのデプロイを推奨します。BARVEL の NFC で現在のURLを使っているため、**既存のプロジェクト名・ドメインは変えずに**デプロイを進めてください。

### 1. Vercelでプロジェクトをインポート

1. [Vercel](https://vercel.com) にログイン
2. **Add New** → **Project**（新規の場合）、または既存の **Review Booster 用プロジェクト**を開く
3. このリポジトリを Git で連携

### 2. 環境変数を設定

Vercelのプロジェクト **Settings** → **Environment Variables** で次を追加します。

| 名前 | 値 | 備考 |
|------|-----|------|
| `OPENAI_API_KEY` | （OpenAIのAPIキー） | 必須。Server Actionsで使用 |

保存後、**Redeploy** で反映されます。

### 3. CLIでデプロイする場合

**※ デプロイはご自身のPCで実行してください（Vercelログインが必要です）**

```bash
cd review-booster      # またはこのリポジトリのフォルダ名
npm run build          # ビルド確認
npx vercel login       # 初回のみ。ブラウザでVercelにログイン
npx vercel --prod      # 本番デプロイ（プロジェクト名を review-booster にすると URL が揃う）
```

環境変数は `npx vercel env add OPENAI_API_KEY` で追加するか、Vercelダッシュボードの **Settings → Environment Variables** で設定してください。

### 公開URL

- 本番: Vercel の **Settings → Domains** に表示されているURL（NFC用のため変更しない）
- BARVEL KOZA: 本番URLの `/` または `/barvel-koza`
- CEBUOCTO: 本番URLの `/cebuocto`

### v0-cebuocto-review-form を非公開にする（紛らわしさ解消）

**v0-cebuocto-review-form.vercel.app** は V0 由来の別プロジェクトで API がなく、本番では使わないため非公開にしておくとよいです。

1. [Vercel](https://vercel.com) にログイン → **v0-cebuocto-review-form** プロジェクトを開く。
2. **Settings** → **General** の一番下までスクロール。
3. **Delete Project** でプロジェクトごと削除する（非公開にできる一番確実な方法）。  
   **または**、**Settings → Domains** で本番ドメイン（v0-cebuocto-review-form.vercel.app）を削除すると、そのURLでは開けなくなります（デプロイ自体は残るので、別の *.vercel.app のプレビューURLではまだ見られる可能性はあります）。
4. 完全に消すなら **Delete Project** がおすすめです。

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

**前提**: ターミナルを開き、このリポジトリ（review-booster）のフォルダにいること。

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
   - 表示されたURL（例: `https://review-booster.vercel.app`）を開く。
   - 星を選んで口コミ生成を1回試し、エラーが出ないか確認する。

---

### 予備案：手動デプロイの細かいステップ（Git連携・ダッシュボード編）

**前提**: このプロジェクトを GitHub / GitLab / Bitbucket のリポジトリにプッシュ済みであること。

1. **Vercel にログイン**
   - ブラウザで [https://vercel.com](https://vercel.com) を開き、ログインする。

2. **新規プロジェクト作成**
   - **Add New…** → **Project** をクリックする。

3. **リポジトリを選ぶ**
   - 一覧から **review-booster**（またはこのリポジトリ名）を選ぶ。なければ **Import Git Repository** でURLを指定する。

4. **設定を確認**
   - Framework Preset: **Next.js** のまま。
   - Root Directory: リポジトリ直下に `package.json` があるなら空のまま。サブフォルダならその名前に指定。
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
