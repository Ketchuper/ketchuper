# 作業指示書：MIMO$A KOZA Review Booster キーワード改訂（AI実装者向け）

作成: 2026-11-07 / 状態: **未実装**（本番は `f0dc589` のまま）  
対象: `/mimosa-koza` のみ（`storeId: "mimosa-koza"`、legacy-generator）

---

## 0. 絶対に守ること

1. **触るのは `mimosa-koza` 分岐だけ。** BARVEL KOZA（`barvel-koza`）・BARVEL・CEBUOCTO・BAR REPLICA・IMUA の設定、文言、プロンプト、挙動を1文字も変えない。BARVEL KOZA と MIMO$A KOZA は別店舗・別業態（バー／古着）。
2. **作業ブランチは `origin/main` から切る。** `/Users/CBDs/Dev/MEO Auto/barvel-review` の作業ツリーには未コミットのWIP（IMUA等）があるので、そこから直接コミットしない。既存の clean worktree `/Users/CBDs/Dev/MEO Auto/barvel-review-mimosa-ship`（`ship/mimosa-koza`）を `origin/main` に揃えてから使う。
3. **legacy-generator のまま。** `reviewMode` を付けない。neutral-invite に変えない。
4. **`placeId` は空のまま。** ChIJ を推測で入れない。`googleMapsUrl` は `https://maps.app.goo.gl/PLDHWVEn6xhuz6aW9` を維持。
5. 本番反映は **QA（第5節）合格後のみ**。`main` への push で Vercel（`barvel-review`）が自動デプロイされる。

---

## 1. 背景と目的

目指す姿（店主確認済み）: **音楽×古着×LIVE のお店であり、コミュニティの中心のような店**として見られたい。

現行の問題:
- 「古着屋のみ」として飲酒系を一律禁止しているが、実態は古着屋とバーを兼ね、DJ・LIVEイベントを開く。MEO（差別化語）とAIO（AI要約の店舗像）の両方で一番強い属性を捨てている。
- 「セレクトのセンス」「品揃え」は形容・量の主張で検索語として弱い。実際の主力は **アーティストT・US古着（お酒ブランドや企業とのコラボデザインT）**。

根拠（確認済み事実）:
| 事実 | 出典 |
|---|---|
| Googleカテゴリ＝衣料品店、沖縄市諸見里1-25-8 ハピネスプラザビル702、既存口コミ1件「古着もライブも見られる新しいタイプの店」 | Google掲載（Exa経由） |
| 13:00–24:00、月〜木定休。古着屋とバー兼業、ラッパー・DJのライブ、DJワークショップ | OLDBASE |
| メンズ・レディース両方あり／接客・コーデ提案あり／諸見里を出してよい | 店主確認（2026-11-07） |
| AI検索「コザ 古着 DJ ライブ」で MIMO$A KOZA が挙がる | WebSearch（2026-11-07） |

---

## 2. 確定キーワード（選択肢6つ）

日本語ラベルは `stores.ts` の `options.ja` と `actions.ts` の `keywordVariations` / `keywordContextsEn` の **キーと完全一致** させること（UIの内部値は日本語）。

| # | ja（キー） | en（表示） |
|---|---|---|
| 1 | コザ・沖縄市エリアで寄りやすい | Easy to stop by in Koza / Okinawa City |
| 2 | アーティストTやUS古着が豊富 | Artist tees & US vintage |
| 3 | メンズもレディースも楽しめる | Both menswear and womenswear |
| 4 | 店内の音楽と空気感が良かった | Music & vibe in the shop |
| 5 | スタッフの接客・コーディネート提案 | Staff help & styling tips |
| 6 | DJ・LIVEイベントが楽しめた | DJ & live events |

削除するキー: `古着・ヴィンテージの品揃えが良い` / `店内の音楽・雰囲気が最高` / `セレクトのセンスが良い`（`actions.ts` の対応エントリも削除。他店が使っていないことを grep で確認してから消す）。

---

## 3. `src/config/stores.ts`（`"mimosa-koza"` ブロックのみ）

- `features.keywords.options.ja` / `.en` を第2節の6件に置換（順序も第2節どおり）。
- `promptContext` を置換:
  - ja: `沖縄市諸見里（コザ）の古着屋「MIMO$A KOZA」。アーティストTとUS古着（企業・お酒ブランドのコラボデザインT等）が中心で、メンズ・レディースあり。店内の音楽と空気感が核で、DJ・LIVEイベントも開く、音楽と古着のコミュニティの拠点。`
  - en: `MIMO$A KOZA: vintage clothing store in Moromizato, Okinawa City (Koza). Mainly artist tees and US vintage (including corporate and beer/liquor brand collab tees), for men and women. Music-driven atmosphere; also hosts DJ & live events — a community spot for music and vintage lovers.`
- 冒頭コメントに改訂日と本指示書のパスを1行追記してよい。
- それ以外（色・ロゴ・同行者・性別・来店タイプ・スタッフ名・星）は変更しない。

---

## 4. `src/app/actions.ts`（`isMimosaKoza` 分岐のみ）

### 4.1 `keywordVariations`（日本語）
MIMO$A セクションを次で置換。各キー5件前後。

- `コザ・沖縄市エリアで寄りやすい`:
  `コザ周りで立ち寄りやすかった` / `沖縄市諸見里で寄りやすかった` / `沖縄市エリアで寄りやすい立地` / `諸見里でフラッと入れた` / `コザの流れで寄れた`
  （「諸見里」を含む言い換えを2件入れて、ランダムで出る状態にする）
- `アーティストTやUS古着が豊富`:
  `アーティストTが充実してた` / `USの古着がしっかり揃ってる` / `企業ロゴのコラボTが面白い` / `お酒ブランドのコラボTが見つかった` / `バンドTやアーティストTを掘れた`
- `メンズもレディースも楽しめる`: 現行の言い換えをそのまま流用。
- `店内の音楽と空気感が良かった`:
  `流れてる音楽がセンス良かった` / `店内の音楽と空気感が好き` / `音楽が店の顔になってる` / `居心地のいい空気感` / `音楽と古着の相性が良い`
- `スタッフの接客・コーディネート提案`: 現行の言い換えを流用。
- `DJ・LIVEイベントが楽しめた`:
  `DJの日に行けて楽しかった` / `LIVEイベントが熱かった` / `古着を見ながらLIVEも楽しめた` / `音楽好きが集まってて楽しい` / `イベントの日の空気が最高`

### 4.2 `keywordContextsEn`（英語）
旧3キーを削除し、第2節の6キーすべてに英語指示を用意:
- 寄りやすい: `Mention it was easy to stop by around Koza / Okinawa City (Moromizato is OK to name)`
- アーティストT: `Highlight artist tees and US vintage, including fun corporate or beer/liquor brand collab tees`
- メンズレディース: 現行を流用
- 音楽と空気感: `Emphasize the music and overall vibe of the shop`
- スタッフ: 現行を流用
- DJ・LIVE: `Mention enjoying a DJ or live event at the shop; music lovers gather here`

`companionEn` に `"家族": "family"` を追加（現状は未定義で "friends" に落ちる）。他店の値は変えない。

### 4.3 禁止語の見直し（日英とも）
現行の「飲酒系を一律禁止」を、**BARVEL混入語の禁止**に置き換える。

- 常に禁止: 飲み放題 / ダーツ / ビリヤード / カラオケ / ハシゴ酒 / リストバンド / 業態を「バー」「飲み屋」と言い換えること / 未成年飲酒を想起させる表現
- ドリンク・お酒:
  - `DJ・LIVEイベントが楽しめた` を選んだときだけ、**1回まで軽く**触れてよい（例: 「ドリンク片手に」）。主題にしない。
  - それ以外は触れない。ただし `アーティストTやUS古着が豊富` の言い換えとしての「お酒ブランドのコラボT」は可（飲酒の描写ではなく商品名として）。
- 英語 `strictRulesEn` の 8 を上記に合わせて書き換え。`(no alcohol emojis)` は維持。
- 日本語ルール行「業態は古着屋（アパレル）。飲み屋・飲み放題・…バーなどの表現は禁止」を、上記の条件分岐（`keywords.includes("DJ・LIVEイベントが楽しめた")`）で出し分ける。

### 4.4 店舗像・締め
- `reviewAngle`（EN）: `This is a CLOTHING STORE, not a bar.` を `This is a vintage clothing store that also hosts DJ & live events — not a party bar.` に変更。
- `systemEn`: 古着屋であることは維持し、`Never describe it as a bar.` は残す。
- `storeSpecificSettings.mood`: `音楽と古着が好きな人が集まる場所。また顔を出したくなる`
- 日本語ルールに1行追加: `・締めは「音楽好きが集まる場所」「また顔を出したい」など居場所感で終えてよい。ただし「常連が多い」「毎週イベント」など未確認の事実は書かない`
- 英語ルールにも同趣旨を1行。

### 4.5 冒頭バリエーション（日本語）
- 既存の `セレクトショップ巡りの途中で` は残してよい。
- `DJ・LIVEイベントが楽しめた` 選択時だけ `・LIVEの日に${companion}と` / `・DJイベントに合わせて` を候補に追加（未選択時に出さない）。
- 英語 `goodExamplesEn` の参照キーを `店内の音楽と空気感が良かった` に更新。

---

## 5. QA（本番前に必須）

1. `npm run build` が通ること。
2. `/mimosa-koza` で6選択肢が日英とも表示され、英語表示でも内部値が日本語キーで送られること。
3. 生成サンプル **20件**（日本語14・英語6目安）。組み合わせ例: 単体6種、`DJ・LIVE`＋`音楽と空気感`、`アーティストT`＋`メンズレディース`、`寄りやすい` 単体×3（諸見里の出現確認）、同行者4種・地元/観光・男女を散らす。
4. 合格条件:
   - (a) 選んだ項目が全件で本文に出る（言い換え可）
   - (b) 飲み放題・ダーツ・ビリヤード・カラオケ・ハシゴ酒・リストバンドが0件
   - (c) `DJ・LIVE` 未選択の文にドリンク／お酒の描写が0件（コラボTの商品名は除く）
   - (d) 「バー」「飲み屋」と業態を書いた文が0件
   - (e) 「常連が多い」「毎週」など未確認事実が0件
   - (f) 寄りやすい選択時、20件中に「諸見里」が少なくとも1回出る
   - (g) 文が途中で切れていない
5. 回帰: `/barvel-koza` と `/` を開き、キーワード4件（ダーツ・ビリヤード無料／時間無制限飲み放題／出入り自由・ハシゴ酒／スタッフ最高）と同行者（友達・同僚・恋人・一人）が変わっていないこと。`git diff` に `mimosa` 以外の分岐変更が無いこと（`companionEn` の `家族` 追加のみ例外）。
6. 結果（生成文20件と判定）を `docs/reports/` に日付付きで保存。口コミ本文をログ出力に残さない運用はこの改訂の範囲外。

---

## 6. 出荷

- コミットメッセージ例: `feat(mimosa-koza): revise RB keywords for music × vintage × live positioning`
- `ship/mimosa-koza` → `main` に push。Vercel デプロイ後、`https://barvel-review.vercel.app/mimosa-koza` をブラウザで確認。
- 本番WIP作業ツリー側（`barvel-review`）の `mimosa-koza` 定義は旧キーワードのまま残っている。後でWIPをマージする担当者向けに、衝突時は本指示書の内容を正とする旨を README の店舗一覧備考に1行残す。

---

## 7. 範囲外（やらない・別タスク）

- 公式KOZAサイト（`koza.m-i-m-o-s-a.com`）は 2026-11-07 時点で 500。コード上は「ゲート通り周辺・毎週日曜17–0」で、Google掲載（諸見里・金〜日13–24）と不一致。AIOに最も効く修正だが本タスク外。統一する一文の案:  
  `沖縄市諸見里（コザ）の古着屋。アーティストTとUS古着が中心。DJ・LIVEイベントを開く、音楽と古着のコミュニティの拠点。`
- Google Business Profile の説明文更新（店主の管理画面が必要）。
- legacy-generator そのものの方針（自社仕様で Google ポリシーと衝突する現行契約と位置づけ）。キーワード改訂ではこのリスクは消えない。
