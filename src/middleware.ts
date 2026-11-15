import { defineMiddleware } from "astro:middleware";

// Manual i18n routing: routes are declared explicitly
// (`/` for Japanese home, `/ja/articles/` and `/en/articles/` for posts).
export const onRequest = defineMiddleware((_context, next) => next());
