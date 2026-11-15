import type { Article, Lang } from "./articles";
import {
  getAuthor,
  getDateIso,
  getDescription,
  getTitle,
  homePath,
} from "./articles";
import { SITE_NAME_FULL, SITE_PUBLISHER, t } from "./i18n";

export function websiteJsonLd(lang: Lang, site: URL) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME_FULL,
    url: new URL(homePath(lang), site).href,
    inLanguage: lang === "ja" ? "ja-JP" : "en-US",
    description: t(lang).tagline,
    publisher: {
      "@type": "Organization",
      name: SITE_PUBLISHER,
      url: site.href,
    },
  };
}

export function articleJsonLd(opts: {
  entry: Article;
  lang: Lang;
  canonical: URL;
  site: URL;
  image: string;
  articlePath: string;
}) {
  const { entry, lang, canonical, site, image, articlePath } = opts;
  const date = getDateIso(entry);
  const homepage = new URL(homePath(lang), site).href;
  const posting = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: getTitle(entry),
    description: getDescription(entry),
    inLanguage: lang === "ja" ? "ja-JP" : "en-US",
    mainEntityOfPage: canonical.href,
    url: canonical.href,
    image,
    datePublished: date,
    dateModified: date,
    author: {
      "@type": "Person",
      name: getAuthor(entry),
    },
    publisher: {
      "@type": "Organization",
      name: SITE_PUBLISHER,
      logo: {
        "@type": "ImageObject",
        url: image,
      },
    },
  };
  const crumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: lang === "ja" ? "ホーム" : "Home",
        item: homepage,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: getTitle(entry),
        item: new URL(articlePath, site).href,
      },
    ],
  };
  return [posting, crumbs];
}
