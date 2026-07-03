import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { getPalette } from "colorthief";

// Seuils WCAG AA "large text" (3:1) — texte blanc sur fond dégradé primary/secondary,
// et texte accent sur ces mêmes fonds sombres.
const MIN_BG = 3.0;
const MIN_ACC = 3.0;

interface ClubColors {
  primary: string;
  secondary: string;
  accent: string;
}

interface Club {
  id: string;
  colors?: ClubColors;
}

// --- Helpers contraste WCAG ---

const luminance = (hex: string): number => {
  const toLinear = (c: number) =>
    c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  return (
    0.2126 * toLinear(parseInt(hex.slice(1, 3), 16) / 255) +
    0.7152 * toLinear(parseInt(hex.slice(3, 5), 16) / 255) +
    0.0722 * toLinear(parseInt(hex.slice(5, 7), 16) / 255)
  );
};

const contrast = (a: string, b: string): number => {
  const la = luminance(a),
    lb = luminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
};

const toHex = (r: number, g: number, b: number): string =>
  `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;

const parse = (hex: string): [number, number, number] => [
  parseInt(hex.slice(1, 3), 16),
  parseInt(hex.slice(3, 5), 16),
  parseInt(hex.slice(5, 7), 16),
];

// Assombrit jusqu'à ce que le texte blanc ait un ratio >= min
const ensureDark = (hex: string, min = MIN_BG): string => {
  let [r, g, b] = parse(hex);
  for (let i = 0; i < 30 && contrast("#ffffff", toHex(r, g, b)) < min; i++) {
    r = Math.max(0, Math.round(r * 0.85));
    g = Math.max(0, Math.round(g * 0.85));
    b = Math.max(0, Math.round(b * 0.85));
  }
  return toHex(r, g, b);
};

// Éclaircit l'accent jusqu'à ce qu'il ait un ratio >= min contre les deux fonds
const ensureAccent = (
  hex: string,
  bg1: string,
  bg2: string,
  min = MIN_ACC,
): string => {
  let [r, g, b] = parse(hex);
  for (
    let i = 0;
    i < 30 &&
    Math.min(contrast(toHex(r, g, b), bg1), contrast(toHex(r, g, b), bg2)) <
      min;
    i++
  ) {
    r = Math.min(255, Math.round(r + (255 - r) * 0.2));
    g = Math.min(255, Math.round(g + (255 - g) * 0.2));
    b = Math.min(255, Math.round(b + (255 - b) * 0.2));
  }
  return toHex(r, g, b);
};

// --- Script principal ---

const root = resolve(".");
const clubsPath = resolve(root, "src/data/ligue1-2627/clubs.json");
const logosDir = resolve(root, "public/logos/ligue1");

const clubs: Club[] = JSON.parse(readFileSync(clubsPath, "utf-8"));

for (const club of clubs) {
  const imgPath = `${logosDir}/${club.id}.png`;
  try {
    const palette = await getPalette(imgPath, { colorCount: 3 });
    if (!palette || palette.length < 3) {
      console.warn(`${club.id}: pas assez de couleurs extraites`);
      continue;
    }

    const raw: ClubColors = {
      primary: palette[0].hex(),
      secondary: palette[1].hex(),
      accent: palette[2].hex(),
    };
    const primary = ensureDark(raw.primary);
    const secondary = ensureDark(raw.secondary);
    const accent = ensureAccent(raw.accent, primary, secondary);

    club.colors = { primary, secondary, accent };

    const diff = (Object.keys(raw) as (keyof ClubColors)[])
      .filter((k) => club.colors![k] !== raw[k])
      .map((k) => `${k}: ${raw[k]}→${club.colors![k]}`);
    console.log(
      `${club.id}: ${primary} / ${secondary} / ${accent}${diff.length ? `  ← [${diff.join(", ")}]` : ""}`,
    );
  } catch {
    console.warn(`${club.id}: IGNORÉ — pas de PNG ou extraction impossible`);
  }
}

writeFileSync(clubsPath, JSON.stringify(clubs, null, 2) + "\n");
console.log("\nTerminé — clubs.json mis à jour.");
