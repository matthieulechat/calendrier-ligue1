import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { getPalette } from "colorthief";

// Seuil de fond volontairement plus strict que le minimum WCAG (3:1) : à 3:1, primary/secondary
// peuvent rester à luminance ~0.30 (encore "assez sombre" pour du texte blanc), ce qui ne laisse
// quasi aucune marge à accent/secondaryVariant pour être colorés sans converger vers le blanc.
const MIN_BG = 6.0;
const MIN_ACC = 3.0;
// En dessous de cette luminance, le primary est déjà quasi noir : on éclaircit
// pour le second stop du dégradé au lieu de l'assombrir (sinon plus de différence visible).
const DARK_LUMINANCE_THRESHOLD = 0.08;

interface ClubColors {
  primary: string;
  primaryVariant: string;
  secondary: string;
  secondaryVariant: string;
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

const rgbToHsl = (
  r: number,
  g: number,
  b: number,
): [number, number, number] => {
  const rn = r / 255,
    gn = g / 255,
    bn = b / 255;
  const max = Math.max(rn, gn, bn),
    min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h: number;
  if (max === rn) h = (gn - bn) / d + (gn < bn ? 6 : 0);
  else if (max === gn) h = (bn - rn) / d + 2;
  else h = (rn - gn) / d + 4;
  return [h / 6, s, l];
};

const hslToRgb = (
  h: number,
  s: number,
  l: number,
): [number, number, number] => {
  if (s === 0) {
    const v = Math.round(l * 255);
    return [v, v, v];
  }
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  return [
    Math.round(hue2rgb(p, q, h + 1 / 3) * 255),
    Math.round(hue2rgb(p, q, h) * 255),
    Math.round(hue2rgb(p, q, h - 1 / 3) * 255),
  ];
};

// Éclaircit une couleur (en HSL, teinte/saturation préservées — pas de mélange
// RGB vers le blanc qui désature) jusqu'à un ratio >= min contre tous les fonds donnés.
const ensureLegible = (hex: string, bgs: string[], min = MIN_ACC): string => {
  const [h, s, l0] = rgbToHsl(...parse(hex));
  let l = l0;
  for (let i = 0; i < 30; i++) {
    const candidate = toHex(...hslToRgb(h, s, l));
    if (Math.min(...bgs.map((bg) => contrast(candidate, bg))) >= min) break;
    l = Math.min(1, l + 0.05);
  }
  return toHex(...hslToRgb(h, s, l));
};

// Distance RGB euclidienne — sert à détecter deux couleurs "qui se confondent"
// (ex. accent et secondaryVariant tous deux gris quasi neutres : la teinte seule
// ne suffit pas à les distinguer si la saturation des deux est déjà très faible).
const colorDistance = (a: string, b: string): number => {
  const [r1, g1, b1] = parse(a);
  const [r2, g2, b2] = parse(b);
  return Math.sqrt((r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2);
};
const MIN_ICON_DISTANCE = 25;

// Dérive le 2e stop du dégradé à partir du primary : une teinte plus foncée
// (cas standard, ex. Le Mans #a51820 → #6e0b12), ou plus claire si le primary
// est déjà quasi noir. Éclaircissement plafonné à 16% (pas jusqu'au seuil de
// contraste texte blanc, qui laisserait trop peu de marge pour accent/secondaryVariant).
const deriveVariantColor = (primaryHex: string): string => {
  const [r0, g0, b0] = parse(primaryHex);

  if (luminance(primaryHex) >= DARK_LUMINANCE_THRESHOLD) {
    return toHex(
      Math.round(r0 * 0.62),
      Math.round(g0 * 0.62),
      Math.round(b0 * 0.62),
    );
  }

  const amt = 0.16;
  return toHex(
    ...([r0, g0, b0].map((c) =>
      Math.min(255, Math.round(c + (255 - c) * amt)),
    ) as [number, number, number]),
  );
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

    const raw = {
      primary: palette[0].hex(),
      secondary: palette[1].hex(),
      accent: palette[2].hex(),
    };
    const primary = ensureDark(raw.primary);
    const primaryVariant = deriveVariantColor(primary);
    const secondary = ensureDark(raw.secondary);
    // secondaryVariant : le secondary (sombre, pensé pour le bandeau) éclairci
    // juste assez pour rester lisible en icône sur le dégradé primary/primaryVariant.
    let secondaryVariant = ensureLegible(secondary, [primary, primaryVariant]);
    const accent = ensureLegible(raw.accent, [
      primary,
      primaryVariant,
      secondary,
    ]);

    // Si secondary et accent brut sont déjà deux gris quasi identiques dans la
    // palette d'origine (ex. FC Lorient), leurs versions éclaircies se confondent
    // aussi — on dérive alors secondaryVariant du primary brut à la place, plus
    // saturé/distinctif (couleur dominante du logo).
    if (colorDistance(secondaryVariant, accent) < MIN_ICON_DISTANCE) {
      secondaryVariant = ensureLegible(raw.primary, [primary, primaryVariant]);
    }

    club.colors = {
      primary,
      primaryVariant,
      secondary,
      secondaryVariant,
      accent,
    };

    const diff = (Object.keys(raw) as (keyof typeof raw)[])
      .filter((k) => club.colors![k] !== raw[k])
      .map((k) => `${k}: ${raw[k]}→${club.colors![k]}`);
    console.log(
      `${club.id}: primary ${primary} / variant ${primaryVariant} / secondary ${secondary} / secondaryVariant ${secondaryVariant} / accent ${accent}${diff.length ? `  ← [${diff.join(", ")}]` : ""}`,
    );
  } catch {
    console.warn(`${club.id}: IGNORÉ — pas de PNG ou extraction impossible`);
  }
}

writeFileSync(clubsPath, JSON.stringify(clubs, null, 2) + "\n");
console.log("\nTerminé — clubs.json mis à jour.");
