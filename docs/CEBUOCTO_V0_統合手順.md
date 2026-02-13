# V0で作った CEBUOCTO デザインを反映する手順

V0で「CEBUOCTO review form」のデザインができたら、次の流れでこのプロジェクトに組み込みます。

---

## ステップ1: V0からコードを取得する

1. V0の画面で **「Publish」** または **「Code」** を開く。
2. **「Copy code」** で React/Next.js のコードをコピーする。  
   （V0のバージョンによっては「Export」や「Copy」など別名のこともあります。）

---

## ステップ2: コードをプロジェクトに置く

**おすすめ**: V0のコードを **1つのコンポーネント** にまとめて保存する。

1. このリポジトリで `src/components/cebuocto/` フォルダを作る（無ければ）。
2. 例えば **`CebuoctoReviewForm.tsx`** という名前でファイルを作り、V0からコピーしたコードを貼り付ける。
3. V0のコードが「1ページ全体」の場合は、**フォーム部分だけ**（評価・良かったポイント・誰と・あなた・「口コミを自動作成」ボタン・結果表示）を抜き出してコンポーネント化する。

---

## ステップ3: 既存のAPIとつなぐ

CEBUOCTO の口コミ生成は、既存の **`generateReview`** を使います。V0のフォームから次のようにつなぎます。

| V0のUI | このプロジェクトでの扱い |
|--------|---------------------------|
| 評価（星1〜5） | `rating`（数値） |
| 良かったポイント（複数） | `keywords`（文字列の配列）※下記参照 |
| 誰と | `companion`（"友達" / "家族" / "恋人" / "一人"） |
| あなた | `gender`（"男性" / "女性"） |
| 「口コミを自動作成」ボタン | `handleGenerate` を呼ぶ |
| 生成されたテキスト表示 | `review` を表示 |
| コピー | `navigator.clipboard.writeText(review)` または既存の `handleCopy` |
| Googleマップで投稿 | `storeConfig.googleMapsUrl` を `window.open` |

**キーワードについて**  
V0の「良かったポイント」の文言は、すでに **`src/config/stores.ts`** の CEBUOCTO の `keywords.options.ja` に合わせてあります（海がキレイ、スタッフが親切、写真・動画が最高…など）。  
V0のボタンの `value` や `onClick` で選んだ項目を、そのまま **日本語の文字列の配列** にして `generateReview(keywords, ...)` に渡せば動きます。

**呼び方の例**（V0コンポーネント内で）:

```ts
import { generateReview } from "@/app/actions";

// 例: フォームの state
const [rating, setRating] = useState(5);
const [keywords, setKeywords] = useState<string[]>([]);
const [companion, setCompanion] = useState("友達");
const [gender, setGender] = useState("男性");
const [review, setReview] = useState("");
const [loading, setLoading] = useState(false);

async function handleGenerate() {
  setLoading(true);
  setReview("");
  try {
    const text = await generateReview(
      keywords,
      "",        // staffName（CEBUOCTOは未使用）
      rating,
      companion,
      gender,
      "観光",    // visitType（CEBUOCTOは固定でOK）
      "ja",      // language
      clientId,  // セッションなどで生成したID
      "cebuocto"
    );
    setReview(text);
  } finally {
    setLoading(false);
  }
}
```

`clientId` は、今の `[storeId]/page.tsx` のように `sessionStorage` で「cebuocto用に1つ」作って使い回す形でOKです。

---

## ステップ4: `/cebuocto` で表示する

**方法A: 今のページを差し替える**

- `src/app/[storeId]/page.tsx` の、`storeId === "cebuocto"` のとき（または `singlePageLayout === true` のとき）に、**今のJSXの代わりに** `<CebuoctoReviewForm />` を表示する。
- `CebuoctoReviewForm` に、`storeConfig`・`clientId`・`language` などを props で渡す。

**方法B: CEBUOCTO専用ページにする**

- `src/app/cebuocto/page.tsx` を新規作成し、その中で `<CebuoctoReviewForm />` だけを表示する。
- その場合、ルーティングは `/cebuocto` のまま。`[storeId]` の `storeId` は使わず、上記の `generateReview(..., "cebuocto")` で固定して呼ぶ。

どちらでも、**ブラウザで `/cebuocto` を開くと、V0デザインのフォームが表示される**ようにすれば完了です。

---

## ステップ5: 動作確認

1. `npm run dev` で起動し、`http://localhost:3000/cebuocto` を開く。
2. 評価・良かったポイント（複数）・誰と・あなたを選び、「口コミを自動作成」を押す。
3. テキストが表示されたら「コピー」→「Googleマップで投稿」の流れができるか確認する。

---

## 補足: キーワード一覧（stores に反映済み）

CEBUOCTO の「良かったポイント」は、V0デザインに合わせて次の12項目に更新してあります（`src/config/stores.ts`）。

- 海がキレイ / Beautiful sea  
- スタッフが親切 / Friendly staff  
- 写真・動画が最高 / Great photos/videos  
- 安心・安全 / Safe & secure  
- 大興奮 / So exciting  
- シュノーケル / Snorkeling  
- イルカに会えた / Saw dolphins  
- ウミガメに会えた / Saw sea turtles  
- 景色が絶景 / Stunning views  
- コスパ良い / Great value  
- 食事が美味しい / Delicious food  
- 一生の思い出 / Memory of a lifetime  

V0のボタンは、この文言（日本語なら `stores` の `ja` 配列）と一致させると、そのまま `keywords` として API に渡せます。

---

ここまでできれば、V0の見た目のまま「口コミを自動作成」〜コピー〜投稿まで動く状態になります。  
V0のコードを貼ったあと、import や型でエラーが出たら、そのファイル名とエラー内容を教えてもらえれば対応案を出します。
