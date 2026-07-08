// One-off: optimize photos for the website.
// Reads every .jpg/.jpeg in img/sourceImg/ and writes:
//   img/photos/<name>.jpg        (thumbnail,  long-edge 900px)
//   img/photos/full/<name>.jpg   (lightbox,   long-edge 2000px)
// Originals are left untouched.
import sharp from "sharp";
import { readdir, mkdir } from "node:fs/promises";
import { join, basename, extname } from "node:path";

const SRC = "img/sourceImg";
const OUT_THUMB = "img/photos";
const OUT_FULL = "img/photos/full";

await mkdir(OUT_THUMB, { recursive: true });
await mkdir(OUT_FULL, { recursive: true });

const files = (await readdir(SRC)).filter((f) =>
  /\.(jpe?g)$/i.test(f) && !/^\.|icon|logo|favicon/i.test(f)
);

const jobs = files.flatMap((f) => {
  const src = join(SRC, f);
  const name = basename(f, extname(f))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")   // friendlier filenames
    .replace(/^-|-$/g, "") + ".jpg";
  return [
    sharp(src)
      .rotate()
      .resize({ width: 900, height: 900, fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 80, mozjpeg: true, progressive: true })
      .toFile(join(OUT_THUMB, name)),
    sharp(src)
      .rotate()
      .resize({ width: 2000, height: 2000, fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 84, mozjpeg: true, progressive: true })
      .toFile(join(OUT_FULL, name)),
  ];
});

const results = await Promise.allSettled(jobs);
const ok = results.filter((r) => r.status === "fulfilled").length;
const fail = results.filter((r) => r.status === "rejected");
console.log(`Done: ${ok}/${results.length} files written from ${files.length} sources.`);
fail.forEach((r) => console.error("FAILED:", r.reason?.message || r.reason));
