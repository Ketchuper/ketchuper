# 今週のゴール：シュノーケルレンタルをオフィシャル2ホテルに置く

口癖: **やれることをやり切る。** 広げない。2件に置くまでが完了。

## 今やること（この順だけ）

| # | やること | 完了の定義 |
|---|----------|------------|
| 1 | オフィシャル2件の正式名を `marineHub.ts` の `hotels[].formalName` に書く | 印刷物にホテル名が出る |
| 2 | `phone` / 料金文言を `marineHub.ts` に書く | プレースホルダが消える |
| 3 | `/marine-hub/snorkel-rental/pamphlet` でホテル①を選んで印刷 | 部数分の紙が手元にある |
| 4 | ホテル①に置く → 貸出ログ1行 | 置き場所写真 or メモあり |
| 5 | ホテル②も同じ | 2件ともログに「置いた」 |

終わったら初めて次（車内チラシ・他ホテル）に進む。

## URL

| 媒体 | パス |
|------|------|
| レンタル申込LP（QR先） | `/marine-hub/snorkel-rental` |
| レンタルパンフ印刷 | `/marine-hub/snorkel-rental/pamphlet` |
| 貸出ログ | [hotel-lending-log.md](./hotel-lending-log.md) |

## オフィシャル2件

設定正本: `src/config/marineHub.ts` → `hotels`（`tier: "official"`）

QRは `?src=hotel&hotel=（表記）`。貸出ログのホテル名と**同じ表記**。
