/**
 * ロゴの黒背景を透過にする（1回限りのスクリプト）
 * 使い方: node scripts/make-logo-transparent.mjs
 */
import sharp from "sharp";
import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const inputPath = join(root, "public", "cebuocto-logo.png");
const outputPath = join(root, "public", "cebuocto-logo.png");

// この値以下を「黒」とみなして透過（0〜255）
const BLACK_THRESHOLD = 35;

const { data, info } = await sharp(inputPath)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const { width, height, channels } = info;
for (let i = 0; i < data.length; i += channels) {
  const r = data[i];
  const g = data[i + 1];
  const b = data[i + 2];
  if (r <= BLACK_THRESHOLD && g <= BLACK_THRESHOLD && b <= BLACK_THRESHOLD) {
    data[i + 3] = 0;
  }
}

await sharp(data, {
  raw: { width, height, channels: 4 },
})
  .png()
  .toFile(outputPath);

console.log("Done: public/cebuocto-logo.png の黒背景を透過にしました。");
