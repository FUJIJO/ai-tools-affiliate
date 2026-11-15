import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { externalLinks } from "./src/integrations/external-links.mjs";

export default defineConfig({
  site: "https://ai-tools-affiliate.vercel.app",
  trailingSlash: "always",
  output: "static",
  integrations: [
    externalLinks(),
    sitemap({
      i18n: {
        defaultLocale: "ja",
        locales: {
          ja: "ja-JP",
          en: "en-US",
        },
      },
    }),
  ],
  // Custom routes: `/` for Japanese home, `/ja/articles/` and `/en/articles/`
  // for posts. Manual routing keeps those paths while still using Astro i18n.
  i18n: {
    defaultLocale: "ja",
    locales: ["ja", "en"],
    routing: "manual",
  },
});
