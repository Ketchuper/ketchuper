# 🌊 CEBUOCTO（セブオクト）設定完了

新店舗「CEBUOCTO」の実装が完了しました！

---

## 📍 アクセスURL

### **ローカル（テスト）**
```
http://localhost:3000/cebuocto
```

### **本番環境**
```
https://barvel-review.vercel.app/cebuocto
```

---

## 🎨 ロゴ設定

### **必要な作業**

CEBUOCTOのロゴ画像を以下の場所に配置してください：

```
/Users/CBDs/MEO Auto/barvel-review/public/cebuocto-logo.png
```

**推奨サイズ**: 高さ200px程度（横幅は自動調整）

**ファイル形式**: PNG（透過背景推奨）

---

## ⚙️ 設定内容

### **有効な機能**
- ✅ 星評価（1〜5）
- ✅ キーワード選択（4種類）
- ✅ 同行者選択
- ✅ 性別選択

### **無効な機能**
- ❌ 来店タイプ（観光客専用のため不要）
- ❌ スタッフ名入力（仕様上禁止）

### **キーワード**
1. 半日プランで満喫
2. パラセーリング
3. アイランドホッピング
4. 写真・スタッフ

### **テーマカラー**
- Primary: Blue (#3b82f6)
- Secondary: Cyan (#06b6d4)

---

## 🎯 口コミ生成の特徴

### **CEBUOCTO専用の調整**

```yaml
ペルソナ:
  - 日本からセブ島旅行中の観光客
  
テンション:
  - ハイテンション
  - 楽しかった
  - 感謝の気持ち
  
必須要素:
  - 半日プランの効率性
  - 安全性と楽しさ
  - 日本人スタッフへの感謝
  
推奨絵文字:
  🌊 🚤 ✨ 📸
  
禁止:
  - 特定のスタッフ名は出さない
```

---

## 🧪 テスト手順

1. ロゴ画像を配置
2. ローカルサーバーで確認
   ```bash
   npm run dev
   ```
3. `http://localhost:3000/cebuocto`にアクセス
4. 口コミを5回生成してバリエーション確認

---

## 🚀 デプロイ

ロゴ配置後、以下のコマンドでデプロイ：

```bash
cd "/Users/CBDs/MEO Auto/barvel-review"
git add .
git commit -m "Add CEBUOCTO store configuration"
git push
```

Vercelが自動デプロイします（1〜2分）。

---

## 📊 現在の店舗一覧

| 店舗ID | URL | 状態 |
|--------|-----|------|
| barvel-koza | `/` または `/barvel-koza` | ✅ 稼働中 |
| cebuocto | `/cebuocto` | 🆕 実装完了 |

---

次の店舗追加も同様に`stores.ts`に追加するだけ！
