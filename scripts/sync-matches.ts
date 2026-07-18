import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import type { Match } from "../src/types/match";

// Mapping propre à football-data.org (team ID → slug interne), pas une donnée
// de domaine — reste ici plutôt que dans src/data/ tant qu'une seule source existe.
const TEAM_IDS: Record<string, number> = {
  lemans: 535,
  brest: 512,
  rennes: 529,
  nice: 522,
  lens: 546,
  lorient: 525,
  psg: 524,
  toulouse: 511,
  auxerre: 519,
  troyes: 531,
  monaco: 548,
  marseille: 516,
  lille: 521,
  parisfc: 1045,
  lehavre: 533,
  lyon: 523,
  strasbourg: 576,
  angers: 532,
};

const teamIdToSlug = new Map(
  Object.entries(TEAM_IDS).map(([slug, id]) => [id, slug]),
);

interface FootballDataMatch {
  matchday: number;
  utcDate: string;
  homeTeam: { id: number };
  awayTeam: { id: number };
  score: { fullTime: { home: number | null; away: number | null } };
}

for (const envFile of [".env.local", ".env"]) {
  try {
    process.loadEnvFile(envFile);
  } catch {
    // Optionnel : la variable peut déjà être dans l'environnement (cron futur).
  }
}

const apiKey = process.env.FOOTBALL_DATA_ORG_KEY;
if (!apiKey) {
  throw new Error(
    "FOOTBALL_DATA_ORG_KEY manquante — voir docs/GUIDE-cle-api-football.md",
  );
}

const response = await fetch(
  "https://api.football-data.org/v4/competitions/FL1/matches?season=2026",
  { headers: { "X-Auth-Token": apiKey } },
);

if (!response.ok) {
  throw new Error(
    `football-data.org a répondu ${response.status} ${response.statusText}`,
  );
}

const json = (await response.json()) as { matches?: FootballDataMatch[] };
if (!json.matches || json.matches.length === 0) {
  throw new Error("Réponse football-data.org sans match — arrêt sans écrire");
}

const slugOf = (teamId: number): string => {
  const slug = teamIdToSlug.get(teamId);
  if (!slug) {
    throw new Error(
      `Team ID ${teamId} inconnu — ajouter son mapping dans TEAM_IDS (scripts/sync-matches.ts)`,
    );
  }
  return slug;
};

const root = resolve(".");
const matchesPath = resolve(root, "src/data/ligue1-2627/matches.json");
const currentMatches: Match[] = JSON.parse(readFileSync(matchesPath, "utf-8"));
const currentScoreOf = new Map(
  currentMatches.map((m) => [
    `${m.journee}-${m.domicile}-${m.exterieur}`,
    m.score,
  ]),
);

let preserved = 0;
const matches: Match[] = json.matches.map((m) => {
  const domicile = slugOf(m.homeTeam.id);
  const exterieur = slugOf(m.awayTeam.id);
  const key = `${m.matchday}-${domicile}-${exterieur}`;
  const previous = currentScoreOf.get(key);

  const scoreDomicile = m.score.fullTime.home ?? previous?.domicile ?? null;
  const scoreExterieur = m.score.fullTime.away ?? previous?.exterieur ?? null;
  if (
    (m.score.fullTime.home === null && previous?.domicile != null) ||
    (m.score.fullTime.away === null && previous?.exterieur != null)
  ) {
    preserved++;
  }

  return {
    journee: m.matchday,
    date: m.utcDate.slice(0, 10),
    domicile,
    exterieur,
    score: { domicile: scoreDomicile, exterieur: scoreExterieur },
  };
});

matches.sort((a, b) => a.date.localeCompare(b.date));

writeFileSync(matchesPath, JSON.stringify(matches, null, 2) + "\n");
console.log(
  `${matches.length} matchs écrits dans matches.json (${preserved} score(s) préservé(s) face à un null API).`,
);
