#!/usr/bin/env node
/**
 * Replace [A8_LINK:Tool Name] placeholders with official sponsored links.
 * Safe to run repeatedly. Used by scripts/sync-articles.sh.
 */
import fs from "node:fs/promises";
import path from "node:path";

const CATALOG = {
  "value ai writer": "https://www.value-domain.com/value-aiwriter/",
  catchy: "https://lp.ai-copywriter.jp/",
};

const PATTERN = /\[A8_LINK:([^\]]+)\]/g;

export function expandA8Links(markdown) {
  return markdown.replace(PATTERN, (_, rawName) => {
    const name = String(rawName).trim();
    const href = CATALOG[name.toLowerCase()] ?? "https://www.a8.net/";
    const escaped = name
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");
    return `<a href="${href}" data-affiliate="true" rel="nofollow sponsored noopener" target="_blank">${escaped}</a>`;
  });
}

async function main() {
  const targetDir =
    process.argv[2] ??
    path.resolve(path.dirname(new URL(import.meta.url).pathname), "../src/content/articles");
  const entries = await fs.readdir(targetDir).catch(() => []);
  let changed = 0;
  for (const file of entries) {
    if (!/\.(md|mdx)$/i.test(file)) continue;
    const full = path.join(targetDir, file);
    const original = await fs.readFile(full, "utf8");
    const next = expandA8Links(original);
    if (next !== original) {
      await fs.writeFile(full, next);
      changed += 1;
      console.log(`expanded A8 placeholders in ${file}`);
    }
  }
  console.log(`A8 link expansion complete (${changed} file(s) updated)`);
}

const isDirect = process.argv[1] && path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname);
if (isDirect) {
  await main();
}
