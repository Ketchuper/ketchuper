/**
 * kinmaq-yokodai keyword QA — ~20 samples.
 * Usage: node --env-file=.env.local scripts/qa-kinmaq-yokodai-keywords.mjs
 */
import { readFileSync, writeFileSync, mkdirSync, unlinkSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { spawnSync } from "child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const KEYWORDS = [
  "洋光台駅前",
  "理学療法士の施術",
  "筋膜整体",
  "肩こり・腰痛の相談",
  "姿勢・動きの相談",
  "長く続く不調の相談",
];

const CASES = [
  { language: "ja", keywords: [KEYWORDS[0]], companion: "一人", gender: "男性", visitType: "地元" },
  { language: "ja", keywords: [KEYWORDS[1]], companion: "友達", gender: "女性", visitType: "地元" },
  { language: "ja", keywords: [KEYWORDS[2]], companion: "恋人", gender: "男性", visitType: "観光" },
  { language: "ja", keywords: [KEYWORDS[3]], companion: "家族", gender: "女性", visitType: "地元" },
  { language: "ja", keywords: [KEYWORDS[4]], companion: "一人", gender: "男性", visitType: "観光" },
  { language: "ja", keywords: [KEYWORDS[5]], companion: "友達", gender: "女性", visitType: "地元" },
  { language: "ja", keywords: [KEYWORDS[0], KEYWORDS[1]], companion: "一人", gender: "女性", visitType: "地元" },
  { language: "ja", keywords: [KEYWORDS[2], KEYWORDS[3]], companion: "恋人", gender: "男性", visitType: "地元" },
  { language: "ja", keywords: [KEYWORDS[1], KEYWORDS[4]], companion: "家族", gender: "女性", visitType: "観光" },
  { language: "ja", keywords: [KEYWORDS[5], KEYWORDS[2]], companion: "一人", gender: "男性", visitType: "地元" },
  { language: "ja", keywords: [KEYWORDS[0], KEYWORDS[3], KEYWORDS[1]], companion: "友達", gender: "女性", visitType: "地元" },
  { language: "ja", keywords: [KEYWORDS[4], KEYWORDS[5]], companion: "一人", gender: "男性", visitType: "観光" },
  { language: "ja", keywords: [KEYWORDS[2], KEYWORDS[1], KEYWORDS[0]], companion: "恋人", gender: "女性", visitType: "地元" },
  { language: "ja", keywords: [KEYWORDS[3], KEYWORDS[5]], companion: "家族", gender: "男性", visitType: "地元" },
  { language: "en", keywords: [KEYWORDS[0]], companion: "一人", gender: "男性", visitType: "地元" },
  { language: "en", keywords: [KEYWORDS[1]], companion: "友達", gender: "女性", visitType: "観光" },
  { language: "en", keywords: [KEYWORDS[2], KEYWORDS[3]], companion: "恋人", gender: "男性", visitType: "地元" },
  { language: "en", keywords: [KEYWORDS[4]], companion: "一人", gender: "女性", visitType: "地元" },
  { language: "en", keywords: [KEYWORDS[5], KEYWORDS[1]], companion: "家族", gender: "男性", visitType: "観光" },
  { language: "en", keywords: [KEYWORDS[0], KEYWORDS[2]], companion: "友達", gender: "女性", visitType: "地元" },
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
    p.keywords, p.staffName || "", p.rating || 5, p.companion, p.gender, p.visitType, p.language, p.clientId, "kinmaq-yokodai"
  );
  process.stdout.write(t);
  process.exit(0);
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
    if (r.stdout.length > 40) r.status = 0;
  }
  return r;
}

function score(text, keywords, language) {
  const fail = [];
  const bannedJa = ["完治", "治った", "再発しない", "保険", "整骨院", "接骨院", "病院", "医師", "飲み放題", "ダーツ", "カラオケ", "ハシゴ酒"];
  const bannedEn = ["cured", "healed completely", "insurance", "hospital", "seikotsu", "all-you-can-drink", "darts", "karaoke"];
  for (const b of bannedJa) if (text.includes(b)) fail.push(`banned:${b}`);
  for (const b of bannedEn) if (new RegExp(b, "i").test(text)) fail.push(`banned:${b}`);
  if (/¥|円\d|\d円|2980|価格|料金/.test(text)) fail.push("price");
  if (language === "ja") {
    if (!text.includes("洋光台")) fail.push("missing:洋光台");
    if (!text.includes("整体")) fail.push("missing:整体");
  } else {
    if (!/yokodai/i.test(text)) fail.push("missing:Yokodai");
    if (!/seitai|bodywork|clinic|整体/i.test(text)) fail.push("missing:seitai");
  }
  // soft presence check for selected themes
  const themeHints = {
    "洋光台駅前": [/駅/, /Yokodai Station|near Yokodai/i],
    "理学療法士の施術": [/理学療法|PT|physical therap/i],
    "筋膜整体": [/筋膜|fascia/i],
    "肩こり・腰痛の相談": [/肩|腰|shoulder|back/i],
    "姿勢・動きの相談": [/姿勢|動き|posture|movement/i],
    "長く続く不調の相談": [/長引|長く|慢性|ずっと|気になって|不調|lingering|long[- ]?last|discomfort/i],
  };
  for (const kw of keywords) {
    const hints = themeHints[kw];
    if (!hints) continue;
    if (!hints.some((re) => re.test(text))) fail.push(`theme:${kw}`);
  }
  // unselected distinctive themes should not be invented
  const inventChecks = [
    ["理学療法士の施術", /理学療法士|\bPT\b|physical therap/i],
    ["筋膜整体", /筋膜|\bfascia\b/i],
    ["肩こり・腰痛の相談", /肩こり|腰痛|stiff shoulders?|lower back pain/i],
  ];
  for (const [kw, re] of inventChecks) {
    if (!keywords.includes(kw) && re.test(text)) fail.push(`invented:${kw}`);
  }
  const tail = text.replace(/[\s\p{Extended_Pictographic}\uFE0F]+$/gu, "");
  if (!/[。！？.!?]$/.test(tail) && !/[.!?]$/.test(text.trim())) fail.push("truncated");
  return fail;
}

async function main() {
  const tmp = prepareTempActions();
  const rows = [];
  let pass = 0;
  for (let i = 0; i < CASES.length; i++) {
    const c = CASES[i];
    const payload = {
      ...c,
      rating: 5,
      staffName: "",
      clientId: `qa-kinmaq-${i}`,
    };
    process.stderr.write(`#${i + 1}/${CASES.length} ${c.language} ${c.keywords.join("+")}\n`);
    const r = generateOnce(tmp, payload);
    const text = (r.stdout || "").trim();
    const fails = r.status !== 0 || !text ? ["generate-fail"] : score(text, c.keywords, c.language);
    if (fails.length === 0) pass += 1;
    rows.push({ i: i + 1, ...c, text, fails, ok: fails.length === 0 });
  }
  try {
    unlinkSync(tmp);
  } catch {}

  const outDir = join(root, "docs/reports");
  mkdirSync(outDir, { recursive: true });
  const mdPath = join(outDir, "2026-11-25-kinmaq-yokodai-keyword-qa.md");
  const jsonPath = join(outDir, "2026-11-25-kinmaq-yokodai-keyword-qa.json");
  writeFileSync(jsonPath, JSON.stringify({ pass, total: CASES.length, rows }, null, 2));
  const lines = [
    `# kinmaq-yokodai keyword QA`,
    ``,
    `Date: 2026-11-25`,
    `Result: **${pass}/${CASES.length}** pass`,
    ``,
    `| # | lang | keywords | ok | fails | sample |`,
    `|---|------|----------|----|-------|--------|`,
  ];
  for (const row of rows) {
    lines.push(
      `| ${row.i} | ${row.language} | ${row.keywords.join(" / ")} | ${row.ok ? "PASS" : "FAIL"} | ${row.fails.join(", ") || "-"} | ${String(row.text).replace(/\|/g, "/").slice(0, 80)} |`
    );
  }
  writeFileSync(mdPath, lines.join("\n") + "\n");
  console.log(`Wrote ${mdPath}`);
  console.log(`Pass ${pass}/${CASES.length}`);
  process.exit(pass === CASES.length ? 0 : 1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
