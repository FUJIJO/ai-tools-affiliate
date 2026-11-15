import { getCollection, type CollectionEntry } from "astro:content";

export type Lang = "ja" | "en";
export type Article = CollectionEntry<"articles">;

type ParsedId = {
  date?: string;
  slugFromFile: string;
  lang: Lang;
};

export function parseArticleId(id: string): ParsedId {
  const base = (id.replace(/\\/g, "/").split("/").pop() ?? id).replace(
    /\.(md|mdx)$/i,
    "",
  );
  const named = base.match(/^(\d{4}-\d{2}-\d{2})_(.+?)_(ja|en)$/);
  if (named) {
    return { date: named[1], slugFromFile: named[2], lang: named[3] as Lang };
  }
  const langMatch = base.match(/_(ja|en)$/);
  return {
    slugFromFile: base.replace(/_(ja|en)$/, ""),
    lang: (langMatch?.[1] as Lang | undefined) ?? "ja",
  };
}

/** Prefer the source filename so language/date survive when `id` equals frontmatter slug. */
export function sourceName(entry: Article): string {
  return entry.filePath || entry.id;
}

export function getLang(entry: Article): Lang {
  return entry.data.lang ?? parseArticleId(sourceName(entry)).lang;
}

export function getSlug(entry: Article): string {
  return entry.data.slug ?? parseArticleId(sourceName(entry)).slugFromFile;
}

export function getTitle(entry: Article): string {
  return (
    entry.data.seo_title ||
    entry.data.title ||
    entry.data.slug ||
    parseArticleId(sourceName(entry)).slugFromFile
  );
}

export function getDescription(entry: Article): string {
  return entry.data.meta_description || entry.data.description || "";
}

export function getAuthor(entry: Article): string {
  return entry.data.author || "たける";
}

export function getDate(entry: Article): Date | undefined {
  const fromFrontmatter = entry.data.date ?? entry.data.pubDate;
  if (fromFrontmatter) return new Date(fromFrontmatter);
  const fromFile = parseArticleId(sourceName(entry)).date;
  if (fromFile) return new Date(`${fromFile}T00:00:00`);
  return undefined;
}

export function getDateIso(entry: Article): string | undefined {
  const fromFile = parseArticleId(sourceName(entry)).date;
  if (fromFile) return fromFile;
  const date = getDate(entry);
  if (!date || Number.isNaN(date.getTime())) return undefined;
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function formatDate(date: Date | undefined, lang: Lang): string {
  if (!date || Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat(lang === "ja" ? "ja-JP" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export function articlePath(entry: Article): string {
  return `/${getLang(entry)}/articles/${getSlug(entry)}/`;
}

export function homePath(lang: Lang): string {
  return lang === "en" ? "/en/" : "/";
}

export async function getArticlesByLang(lang: Lang): Promise<Article[]> {
  const all = await getCollection("articles");
  return all
    .filter((entry) => getLang(entry) === lang)
    .sort((a, b) => {
      const da = getDate(a)?.getTime() ?? 0;
      const db = getDate(b)?.getTime() ?? 0;
      return db - da;
    });
}

/**
 * Find the translation in the other language.
 * Preference: translationKey, identical slug, shared date + tags, unique shared date.
 */
export async function getCounterpart(entry: Article): Promise<Article | undefined> {
  const other: Lang = getLang(entry) === "ja" ? "en" : "ja";
  const pool = await getArticlesByLang(other);
  const key = entry.data.translationKey;
  if (key) {
    const byKey = pool.find((item) => item.data.translationKey === key);
    if (byKey) return byKey;
  }

  const slug = getSlug(entry);
  const bySlug = pool.find((item) => getSlug(item) === slug);
  if (bySlug) return bySlug;

  const dateKey = getDateIso(entry);
  const tags = new Set(entry.data.tags ?? []);
  const sameDay = dateKey
    ? pool.filter((item) => getDateIso(item) === dateKey)
    : [];

  if (sameDay.length && tags.size) {
    const tagged = sameDay.filter((item) =>
      (item.data.tags ?? []).some((tag) => tags.has(tag)),
    );
    if (tagged.length === 1) return tagged[0];
  }
  if (sameDay.length === 1) return sameDay[0];

  if (tags.size) {
    const tagged = pool.filter((item) =>
      (item.data.tags ?? []).some((tag) => tags.has(tag)),
    );
    if (tagged.length === 1) return tagged[0];
  }
  return undefined;
}

export function buildAlternates(opts: {
  lang: Lang;
  currentPath: string;
  counterpartPath?: string;
}): { ja: string; en: string; xDefault: string; switchHref: string } {
  const { lang, currentPath, counterpartPath } = opts;
  if (lang === "ja") {
    const en = counterpartPath ?? homePath("en");
    return { ja: currentPath, en, xDefault: currentPath, switchHref: en };
  }
  const ja = counterpartPath ?? homePath("ja");
  return { ja, en: currentPath, xDefault: ja, switchHref: ja };
}
