import { readdirSync } from "node:fs";
import { resolve } from "node:path";
import sharp from "sharp";

// Rogne la marge transparente autour de chaque logo club pour maximiser leur
// rendu à taille de conteneur égale (object-contain remplit alors la boîte
// au lieu de laisser un vide variable d'un club à l'autre).

const logosDir = resolve(".", "public/logos/ligue1");

for (const file of readdirSync(logosDir)) {
  if (!file.endsWith(".png")) continue;
  const path = `${logosDir}/${file}`;
  const before = await sharp(path).metadata();
  await sharp(path)
    .trim()
    .toBuffer()
    .then((buf) => sharp(buf).toFile(path));
  const after = await sharp(path).metadata();
  console.log(
    `${file}: ${before.width}x${before.height} → ${after.width}x${after.height}`,
  );
}

console.log("\nTerminé.");
