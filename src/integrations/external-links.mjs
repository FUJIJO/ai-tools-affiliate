import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

async function walkHtml(dir) {
  const out = [];
  for (const ent of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, ent.name);
    if (ent.isDirectory()) out.push(...(await walkHtml(full)));
    else if (ent.name.endsWith(".html")) out.push(full);
  }
  return out;
}

function enhanceAnchors(html) {
  return html.replace(/<a\b([^>]*?)>/gi, (full, attrs) => {
    const href = /href="([^"]*)"/.exec(attrs)?.[1] ?? "";
    if (!/^https?:\/\//i.test(href)) return full;
    const isAffiliate =
      /data-affiliate(?:="true")?/i.test(attrs) || /a8\.net/i.test(href);
    let next = attrs;
    if (!/\btarget=/i.test(next)) next += ' target="_blank"';
    if (!/\brel=/i.test(next)) {
      next += isAffiliate
        ? ' rel="nofollow sponsored noopener"'
        : ' rel="noopener noreferrer"';
    }
    return `<a${next}>`;
  });
}

/** Add target/rel on external anchors after the static build (no extra Markdown deps). */
export function externalLinks() {
  return {
    name: "external-links",
    hooks: {
      "astro:build:done": async ({ dir }) => {
        const root = fileURLToPath(dir);
        for (const file of await walkHtml(root)) {
          const html = await readFile(file, "utf8");
          const next = enhanceAnchors(html);
          if (next !== html) await writeFile(file, next);
        }
      },
    },
  };
}
