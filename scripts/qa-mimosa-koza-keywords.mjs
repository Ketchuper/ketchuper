/**
 * MIMO$A KOZA keyword revision QA — 20 samples.
 * Usage: node --env-file=.env.local scripts/qa-mimosa-koza-keywords.mjs
 */
import { readFileSync, writeFileSync, mkdirSync, unlinkSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { spawnSync } from "child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const KEYWORDS = [
  "コザ・沖縄市エリアで寄りやすい",
  "アーティストTやUS古着が豊富",
  "メンズもレディースも楽しめる",
  "店内の音楽と空気感が良かった",
  "スタッフの接客・コーディネート提案",
  "DJ・LIVEイベントが楽しめた",
];

const CASES = [
  { language: "ja", keywords: [KEYWORDS[0]], companion: "友達", gender: "男性", visitType: "地元" },
  { language: "ja", keywords: [KEYWORDS[0]], companion: "一人", gender: "女性", visitType: "観光" },
  { language: "ja", keywords: [KEYWORDS[0]], companion: "恋人", gender: "男性", visitType: "地元" },
  { language: "ja", keywords: [KEYWORDS[1]], companion: "友達", gender: "女性", visitType: "地元" },
  { language: "ja", keywords: [KEYWORDS[2]], companion: "家族", gender: "男性", visitType: "地元" },
  { language: "ja", keywords: [KEYWORDS[3]], companion: "一人", gender: "女性", visitType: "観光" },
  { language: "ja", keywords: [KEYWORDS[4]], companion: "恋人", gender: "女性", visitType: "地元" },
  { language: "ja", keywords: [KEYWORDS[5]], companion: "友達", gender: "男性", visitType: "観光" },
  { language: "ja", keywords: [KEYWORDS[5], KEYWORDS[3]], companion: "友達", gender: "女性", visitType: "地元" },
  { language: "ja", keywords: [KEYWORDS[1], KEYWORDS[2]], companion: "恋人", gender: "男性", visitType: "観光" },
  { language: "ja", keywords: [KEYWORDS[1], KEYWORDS[4]], companion: "一人", gender: "女性", visitType: "地元" },
  { language: "ja", keywords: [KEYWORDS[0], KEYWORDS[1]], companion: "家族", gender: "男性", visitType: "観光" },
  { language: "ja", keywords: [KEYWORDS[5], KEYWORDS[1], KEYWORDS[3]], companion: "友達", gender: "女性", visitType: "地元" },
  { language: "ja", keywords: [KEYWORDS[4], KEYWORDS[3]], companion: "一人", gender: "男性", visitType: "地元" },
  { language: "en", keywords: [KEYWORDS[0]], companion: "友達", gender: "男性", visitType: "地元" },
  { language: "en", keywords: [KEYWORDS[1]], companion: "恋人", gender: "女性", visitType: "観光" },
  { language: "en", keywords: [KEYWORDS[5], KEYWORDS[3]], companion: "友達", gender: "男性", visitType: "地元" },
  { language: "en", keywords: [KEYWORDS[1], KEYWORDS[2]], companion: "一人", gender: "女性", visitType: "地元" },
  { language: "en", keywords: [KEYWORDS[4]], companion: "家族", gender: "男性", visitType: "観光" },
  { language: "en", keywords: [KEYWORDS[5]], companion: "一人", gender: "女性", visitType: "地元" },
];

function prepareTempActions() {
  const src =
    "const console = { log() {}, warn() {}, error(...a: any[]) { globalThis.console.error(...a); } };\n" +
    readFileSync(join(root, "src/app/actions.ts"), "utf8")
      .replace(/^"use server";\s*/m, "")
      .replace(
        /from ["']@\/lib\/reviewParams["']/,
        'from "../src/lib/reviewParams"'
      )
      .replace(/setInterval\(\(\) => \{[\s\S]*?\}, 60000\);/, "/* rate-limit cleanup disabled in QA */");
  const tmp = join(root, "scripts/_actions.qa.tmp.ts");
  writeFileSync(tmp, src);
  return tmp;
}

function generateOnce(_tmp, payload) {
  const tsRunner = join(root, "scripts/_qa-runner.tmp.ts");
  writeFileSync(
    tsRunner,
    `import { generateReview } from "./_actions.qa.tmp";
async function main() {
  const p = ${JSON.stringify(payload)} as any;
  const t = await generateReview(
    p.keywords, p.staffName || "", p.rating || 5, p.companion, p.gender, p.visitType, p.language, p.clientId, "mimosa-koza"
  );
  process.stdout.write(t);
  process.exit(0); // clear setInterval from actions.ts
}
main().catch((e) => { console.error(e); process.exit(1); });
`
  );
  const tsxBin = join(root, "node_modules/.bin/tsx");
  const r = spawnSync(tsxBin, [tsRunner], {
    cwd: root,
    env: {
      ...process.env,
      NODE_NO_WARNINGS: "1",
    },
    encoding: "utf8",
    timeout: 180000,
  });
  try {
    unlinkSync(tsRunner);
  } catch {}
  if (r.stdout) {
    const lines = r.stdout
      .split(/\n/)
      .map((l) => l.trim())
      .filter(Boolean)
      .filter((l) => !l.startsWith("✅") && !l.startsWith("🚀") && !l.startsWith("🎲") && !l.startsWith("{") && !l.startsWith("keywords") && !/^npm /.test(l));
    const candidates = lines.filter((l) => l.length > 40);
    r.stdout = (candidates[candidates.length - 1] || lines[lines.length - 1] || "").trim();
    // treat as success if we got a review even when process was SIGTERM'd after write
    if (r.stdout.length > 40) r.status = 0;
  }
  return r;
}

function score(text, keywords) {
  const fail = [];
  const banned = ["飲み放題", "ダーツ", "ビリヤード", "カラオケ", "ハシゴ酒", "リストバンド"];
  for (const b of banned) if (text.includes(b)) fail.push(`banned:${b}`);
  if (/(飲み屋|(?<![コラボ])バー(?![A-Za-z]))/.test(text) || /\bas a bar\b|\bthe bar\b/i.test(text)) {
    fail.push("biz:bar");
  }
  if (/常連が多い|毎週イベント|events every week|lots of regulars/i.test(text)) fail.push("unverified");
  const selectedLive = keywords.includes("DJ・LIVEイベントが楽しめた");
  if (!selectedLive) {
    const drinky = /ドリンク|飲んだ|飲めて|乾杯|(?<!ブランドの)ビール|ハイボール|カクテル|with a drink|drank|drinking/i.test(text);
    const productOk = /お酒ブランド|コラボT|collab tee|brand collab|beer\/liquor brand/i.test(text);
    if (drinky && !productOk) fail.push("drink-without-live");
  }
  const tail = text.replace(/[\s🎵👕✨🎶🛍️🔥😊🙏❤️💕🎉]+$/u, "");
  if (!/[。！？.!?]$/.test(tail) && !/[.!?]$/.test(text.trim())) fail.push("truncated");
  return fail;
}

async function main() {
  if (!process.env.OPENAI_API_KEY) {
    console.error("OPENAI_API_KEY missing");
    process.exit(1);
  }
  const tmp = prepareTempActions();
  const results = [];
  for (let i = 0; i < CASES.length; i++) {
    const c = CASES[i];
    // in-process rate limit is 6/min per clientId; each case uses unique clientId so no pause needed
    const payload = {
      ...c,
      rating: 5,
      staffName: "",
      clientId: `qa-mimosa-${Date.now()}-${i + 1}`,
    };
    const r = generateOnce(tmp, payload);
    if (r.status !== 0 || !r.stdout) {
      const err = (r.stderr || r.stdout || r.error?.message || "unknown").slice(0, 800);
      results.push({ i: i + 1, ...c, error: err, fails: ["generate-error"] });
      console.error(`#${i + 1} generate-error`, err);
      continue;
    }
    const text = (r.stdout || "").trim();
    const fails = score(text, c.keywords);
    results.push({ i: i + 1, ...c, text, fails });
    console.log(`#${i + 1} ${fails.length ? "FAIL:" + fails.join(",") : "OK"} ${text.slice(0, 70).replace(/\n/g, " ")}`);
  }
  try {
    unlinkSync(tmp);
  } catch {}

  const withYori = results.filter((r) => r.keywords?.includes("コザ・沖縄市エリアで寄りやすい") && r.text);
  const moromizatoHits = withYori.filter((r) => /諸見里|Moromizato/i.test(r.text)).length;
  const allFail = results.flatMap((r) => (r.fails || []).map((f) => `#${r.i}:${f}`));
  const pass =
    results.length === 20 &&
    results.every((r) => r.text && (!r.fails || r.fails.length === 0)) &&
    moromizatoHits >= 1;

  mkdirSync(join(root, "docs/reports"), { recursive: true });
  writeFileSync(
    join(root, "docs/reports/2026-11-07-mimosa-koza-keyword-qa.json"),
    JSON.stringify({ date: new Date().toISOString(), pass, moromizatoHits, yoriCases: withYori.length, failList: allFail, results }, null, 2)
  );
  const md = [
    "# MIMO$A KOZA keyword QA — 2026-11-07",
    "",
    `結果: **${pass ? "PASS" : "FAIL"}**`,
    `- 件数: ${results.length}/20`,
    `- 諸見里/Moromizato 出現: ${moromizatoHits}（寄りやすい選択 ${withYori.length} 件中）`,
    `- 不合格: ${allFail.length ? allFail.join(", ") : "なし"}`,
    "",
    "## Samples",
    ...results.map((r) => {
      const head = `### #${r.i} [${r.language}] ${r.keywords?.join(" + ")} / ${r.companion} ${r.gender} ${r.visitType}`;
      if (r.error) return `${head}\n\nERROR: ${r.error}\n`;
      return `${head}\n\nfails: ${r.fails?.join(", ") || "none"}\n\n> ${r.text}\n`;
    }),
  ].join("\n");
  writeFileSync(join(root, "docs/reports/2026-11-07-mimosa-koza-keyword-qa.md"), md);
  console.log(pass ? "\nPASS" : "\nFAIL", "docs/reports/2026-11-07-mimosa-koza-keyword-qa.md");
  process.exit(pass ? 0 : 1);
}

main();
