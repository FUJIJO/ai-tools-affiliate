# AIツール活用ラボ / AI Tools Lab

日英対応のAIツール比較・アフィリエイトサイトです。Astro の静的サイトとしてビルドし、GitHub の `main` へのプッシュで Vercel が自動デプロイします。

A bilingual (Japanese / English) static site for AI tool comparisons. Built with Astro (`output: "static"`). Pushing to `main` on GitHub triggers an automatic Vercel production deploy.

Node.js 22 is pinned via `.nvmrc` and `package.json#engines`.

## 記事の追加 / Adding articles

新しい Markdown 記事は次のディレクトリに置きます。

Place new Markdown articles here:

```
src/content/articles/
```

ファイル名の推奨パターン / recommended filename pattern:

```
YYYY-MM-DD_slug_ja.md
YYYY-MM-DD_slug_en.md
```

例: `2026-11-15_ai-bunshou-sakusei-tool-hikaku_ja.md`

言語はファイル名末尾の `_ja` / `_en`、または frontmatter の `lang` から判定します。日付が frontmatter に無い場合はファイル名の日付を使います。対訳は `translationKey`、同じ slug、同じ日付（と tags）で対応付けます。

Language is detected from the `_ja` / `_en` filename suffix, or from frontmatter `lang`. If `date` is missing, the filename date is used. Translations are paired by `translationKey`, identical slug, or a shared date / tags.

Frontmatter の例（欠けていてもビルドできます）:

```yaml
---
seo_title: "記事タイトル"
meta_description: "メタディスクリプション"
slug: my-article-slug
translationKey: writing-tools-2026
---
```

`title` / `description` / `date` / `tags` / `lang` / `author` も利用できます。

コンテンツ生成ボットが `/workspace/affiliate/articles/` に保存した記事は、次のスクリプトでコレクションへ同期できます。`[A8_LINK:Tool]` プレースホルダも公式のスポンサーリンクに展開されます。

Articles written to `/workspace/affiliate/articles/` can be copied into the collection with:

```bash
npm run sync-articles
# or
bash scripts/sync-articles.sh
```

## ルート / Routes

- `/` — 日本語トップ（新しい順の記事一覧）
- `/en/` — English home (newest first)
- `/ja/articles/<slug>/` — 日本語記事
- `/en/articles/<slug>/` — English article

Astro の組み込み i18n（`defaultLocale: "ja"`, `locales: ["ja", "en"]`, `routing: "manual"`）を使っています。デフォルト言語のトップを `/` に置きつつ、記事は `/ja/articles/` に置くため manual routing です。

## 開発 / Local development

```bash
npm install
npm run dev
npm run build
```

`vercel.json` は framework を Astro、出力を `dist`、trailing slash を Astro 設定と揃え、`/_astro/*` に長期キャッシュを設定しています。

## アフィリエイト表記 / Affiliate disclosure

フッターに「当サイトはアフィリエイト広告（PR）を利用しています」および英語の同等文言を表示します。各記事ページには PR ラベルを付けます。本文中の `[A8_LINK:Tool Name]` は公式サイトへのスポンサーリンクに変換され、アフィリエイトリンクには `rel="nofollow sponsored noopener"` と `target="_blank"` を付与します。
