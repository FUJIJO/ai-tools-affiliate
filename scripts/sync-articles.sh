#!/usr/bin/env bash
# Copy new or changed Markdown articles into the Astro content collection.
# Source: /workspace/affiliate/articles/ (or $ARTICLE_SRC)
# Destination: src/content/articles/ (filenames are preserved)
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SITE_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
SRC="${ARTICLE_SRC:-/workspace/affiliate/articles}"
DEST="$SITE_DIR/src/content/articles"

if [[ ! -d "$SRC" ]]; then
  echo "Article source directory not found: $SRC" >&2
  exit 1
fi

mkdir -p "$DEST"

if command -v rsync >/dev/null 2>&1; then
  rsync -a --include='*.md' --include='*.mdx' --exclude='*' "$SRC/" "$DEST/"
else
  shopt -s nullglob
  for file in "$SRC"/*.md "$SRC"/*.mdx; do
    dest_file="$DEST/$(basename "$file")"
    if [[ ! -e "$dest_file" ]] || [[ "$file" -nt "$dest_file" ]]; then
      cp "$file" "$dest_file"
    fi
  done
fi

# Turn [A8_LINK:Name] placeholders into sponsored official links
if command -v node >/dev/null 2>&1; then
  node "$SCRIPT_DIR/expand-a8-links.mjs" "$DEST"
fi

echo "Synced Markdown articles from $SRC to $DEST"
ls -1 "$DEST"/*.md 2>/dev/null || true
exit 0
