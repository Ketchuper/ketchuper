# マリンハブ — 車＝店舗の集客フレーム

正本。足りないのは「もの」ではなく**準備**（置き場所・導線・補充・申し込み先の固定）。  
今週の実行口: **[NOW-snorkel-rental-2hotels.md](./NOW-snorkel-rental-2hotels.md)**（やれることをやり切る＝オフィシャル2件にシュノーケルレンタルパンフを置く）。

## 仮説（最大3・検証前に憲法化しない）

1. **車は店舗** — 送迎バン／営業車の外見・車内・ドライバー一言が「店頭」。
2. **ホテルは不足分のキャッチ** — 店舗（車）だけでは足りない客を、フロントのパンフ＋QRで取る。
3. **申し込みは1本に寄せる** — ネット（QR→LP）と電話。ホテル名は必ず残す。

## 今週の完了（これだけ）

| 優先 | やること | 完了の定義 |
|------|----------|------------|
| 1 | シュノーケルレンタルパンフ | `/marine-hub/snorkel-rental/pamphlet` で印刷できる |
| 2 | オフィシャルホテル①に置く | 貸出ログに1行 |
| 3 | オフィシャルホテル②に置く | 貸出ログに1行 |

## 導線（レンタル）

```
[ホテル2件] フロントにレンタルパンフ
        ↓
[ネット] /marine-hub/snorkel-rental?src=hotel&hotel=○○
        ↓
LINE or 電話（受取・返却を確定）
```

## URL

| 媒体 | パス | 用途 |
|------|------|------|
| レンタル申込LP | `/marine-hub/snorkel-rental` | QRの飛び先（今の本命） |
| レンタルパンフ | `/marine-hub/snorkel-rental/pamphlet` | オフィシャル2件用印刷 |
| ツアー申込LP | `/marine-hub` | 後続 |
| ツアーパンフ | `/marine-hub/pamphlet` | 後続 |
| チラシ | `/marine-hub/flyer` | 後続 |

連絡先・ホテル名・料金は `src/config/marineHub.ts` を印刷前に埋める。

## 関連

- 今週実行: [NOW-snorkel-rental-2hotels.md](./NOW-snorkel-rental-2hotels.md)
- 貸出ログ: [hotel-lending-log.md](./hotel-lending-log.md)
- 車オペ: [car-as-store-ops.md](./car-as-store-ops.md)
- 公式サイト: https://cebuocto.com/
- Instagram: https://www.instagram.com/cebuocto/
