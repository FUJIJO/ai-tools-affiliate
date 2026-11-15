import type { Lang } from "./articles";

export const SITE_NAME = {
  ja: "AIツール活用ラボ",
  en: "AI Tools Lab",
} as const;

export const SITE_NAME_FULL = "AIツール活用ラボ / AI Tools Lab";
export const SITE_AUTHOR = "たける";
export const SITE_PUBLISHER = "AIツール活用ラボ / AI Tools Lab";

export const COPY = {
  ja: {
    tagline: "副業や日常に役立つAIツールを、わかりやすく比較します。",
    latest: "最新の記事",
    empty: "まだ記事がありません。",
    readMore: "記事を読む",
    back: "記事一覧へ戻る",
    pr: "PR",
    prNote: "この記事にはアフィリエイト広告（PR）が含まれます。",
    footerDisclosure:
      "当サイトはアフィリエイト広告（PR）を利用しています。This site uses affiliate advertising (PR).",
    langLabel: "日本語",
    otherLang: "English",
    home: "ホーム",
  },
  en: {
    tagline: "Practical comparisons of AI tools for side hustles and everyday work.",
    latest: "Latest articles",
    empty: "No articles yet.",
    readMore: "Read article",
    back: "Back to articles",
    pr: "PR",
    prNote: "This article contains affiliate advertising (PR).",
    footerDisclosure:
      "This site uses affiliate advertising (PR). 当サイトはアフィリエイト広告（PR）を利用しています。",
    langLabel: "English",
    otherLang: "日本語",
    home: "Home",
  },
} as const;

export function t(lang: Lang) {
  return COPY[lang];
}
