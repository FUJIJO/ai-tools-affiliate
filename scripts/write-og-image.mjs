#!/usr/bin/env node
/** Recreate src/assets/og-default.png from the committed base64 so the binary
 *  does not have to be pushed as a GitHub text blob. */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const dest = path.resolve(here, "../src/assets/og-default.png");
const src = path.join(here, "og-default.png.b64");
if (fs.existsSync(dest) && fs.statSync(dest).size > 0) {
  process.exit(0);
}
const b64 = fs.readFileSync(src, "utf8").replace(/\s+/g, "");
fs.mkdirSync(path.dirname(dest), { recursive: true });
fs.writeFileSync(dest, Buffer.from(b64, "base64"));
console.log("wrote", dest);
