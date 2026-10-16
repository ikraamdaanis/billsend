import { readdir } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";

// Writes an AVIF beside every homepage WebP in public/home. The homepage
// offers the AVIF first and keeps the WebP for browsers without AVIF; at this
// quality the AVIFs are about 40% smaller with no difference you can see at
// the size they display. Run `bun run encode:home` after replacing a picture
// or re-rendering the invoices.

const HOME_DIR = join(import.meta.dir, "..", "public", "home");

const files = (await readdir(HOME_DIR)).filter(file => file.endsWith(".webp"));

for (const file of files) {
  await sharp(join(HOME_DIR, file))
    .avif({ quality: 50, effort: 6 })
    .toFile(join(HOME_DIR, file.replace(/\.webp$/, ".avif")));
}
