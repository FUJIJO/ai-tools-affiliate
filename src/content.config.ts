import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const articles = defineCollection({
  loader: glob({
    pattern: "**/*.{md,mdx}",
    base: "./src/content/articles",
    // Keep the filename (including `_ja` / `_en` and the date prefix) as the id.
    // The default loader would otherwise replace it with frontmatter `slug`.
    generateId: ({ entry }) => {
      const base = entry.replace(/\\/g, "/").split("/").pop() ?? entry;
      return base.replace(/\.(md|mdx)$/i, "");
    },
  }),
  schema: z
    .object({
      title: z.string().optional(),
      seo_title: z.string().optional(),
      description: z.string().optional(),
      meta_description: z.string().optional(),
      slug: z.string().optional(),
      date: z.coerce.date().optional(),
      pubDate: z.coerce.date().optional(),
      tags: z.array(z.string()).optional(),
      lang: z.enum(["ja", "en"]).optional(),
      author: z.string().optional(),
      translationKey: z.string().optional(),
    })
    .passthrough(),
});

export const collections = { articles };
