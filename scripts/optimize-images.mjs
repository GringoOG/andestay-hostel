/**
 * Pre-compress public/images for faster mobile loads.
 * - Photos: max 1800px wide, high-quality JPEG
 * - Avatars: 160×160 cover crop (they only render ~40–44px)
 * Skips public/images/lena/ (raw originals).
 */
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const DIR = path.join(ROOT, "public/images");
const PHOTO_MAX = 1800;
const PHOTO_QUALITY = 84;
const AVATAR_SIZE = 160;
const AVATAR_QUALITY = 86;

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === "lena") continue;
      files.push(...(await walk(full)));
    } else if (/\.(jpe?g|png)$/i.test(e.name)) {
      files.push(full);
    }
  }
  return files;
}

function isAvatar(file) {
  return /avatar/i.test(path.basename(file));
}

async function optimize(file) {
  const before = (await fs.stat(file)).size;
  const img = sharp(file).rotate();
  const meta = await img.metadata();
  const avatar = isAvatar(file);

  let pipeline = sharp(file).rotate();

  if (avatar) {
    pipeline = pipeline.resize(AVATAR_SIZE, AVATAR_SIZE, {
      fit: "cover",
      position: "centre",
    });
  } else if ((meta.width ?? 0) > PHOTO_MAX) {
    pipeline = pipeline.resize({
      width: PHOTO_MAX,
      withoutEnlargement: true,
    });
  }

  const buf = await pipeline
    .jpeg({ quality: avatar ? AVATAR_QUALITY : PHOTO_QUALITY, mozjpeg: true })
    .toBuffer();

  // Only write if meaningfully smaller, or avatar always (dimensions matter)
  if (avatar || buf.length < before * 0.92) {
    await fs.writeFile(file, buf);
    const after = buf.length;
    const saved = (((before - after) / before) * 100).toFixed(0);
    console.log(
      `${path.relative(ROOT, file)}  ${(before / 1024).toFixed(0)}KB → ${(after / 1024).toFixed(0)}KB  (−${saved}%)`,
    );
    return before - after;
  }

  console.log(`${path.relative(ROOT, file)}  skipped (already lean)`);
  return 0;
}

const files = await walk(DIR);
let saved = 0;
for (const f of files) {
  try {
    saved += await optimize(f);
  } catch (err) {
    console.error(`FAIL ${f}:`, err.message);
  }
}
console.log(`\nDone. Saved ~${(saved / 1024 / 1024).toFixed(1)} MB total.`);
