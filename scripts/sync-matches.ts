import { execFileSync } from "node:child_process";
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

// 18 clubs, aller-retour : 18 * 17 = 306 matchs pour toute la saison.
const EXPECTED_MATCH_COUNT = 306;
const DATA_DIR = "src/data/ligue1-2627";

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

class NetworkError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = "NetworkError";
  }
}

class HttpError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "HttpError";
  }
}

class StructureError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "StructureError";
  }
}

class GitPushError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = "GitPushError";
  }
}

const pushHeartbeat = async (status: "up" | "down", msg: string) => {
  const url = process.env.UPTIME_PUSH_URL;
  if (!url) return;
  try {
    await fetch(`${url}?status=${status}&msg=${encodeURIComponent(msg)}`);
  } catch {
    // best-effort : le heartbeat ne doit jamais faire échouer le script.
  }
};

const formatUpdatedAt = (date: Date): string => {
  const datePart = new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
  const timePart = new Intl.DateTimeFormat("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  })
    .format(date)
    .replace(":", "h");
  return `${datePart} à ${timePart}`;
};

const pushToGit = (root: string) => {
  try {
    const status = execFileSync(
      "git",
      ["status", "--porcelain", "--", DATA_DIR],
      { cwd: root, encoding: "utf-8" },
    );
    if (!status.trim()) {
      console.log("Aucun changement à commiter.");
      return;
    }
    execFileSync("git", ["add", DATA_DIR], { cwd: root });
    execFileSync(
      "git",
      [
        "commit",
        "-m",
        "🔄 (Data sync) - Mise a jour automatique du calendrier",
      ],
      { cwd: root },
    );
    execFileSync("git", ["push"], { cwd: root });
    console.log("Changements commités et pushés.");
  } catch (error) {
    throw new GitPushError(
      `Échec du commit/push git : ${(error as Error).message}`,
      { cause: error },
    );
  }
};

const slugOf = (teamId: number): string => {
  const slug = teamIdToSlug.get(teamId);
  if (!slug) {
    throw new StructureError(
      `Team ID ${teamId} inconnu — ajouter son mapping dans TEAM_IDS (scripts/sync-matches.ts)`,
    );
  }
  return slug;
};

const main = async () => {
  for (const envFile of [".env.local", ".env"]) {
    try {
      process.loadEnvFile(envFile);
    } catch {
      // Optionnel : la variable peut déjà être dans l'environnement (cron PM2).
    }
  }

  const apiKey = process.env.FOOTBALL_DATA_ORG_KEY;
  if (!apiKey) {
    throw new StructureError(
      "FOOTBALL_DATA_ORG_KEY manquante — voir docs/GUIDE-cle-api-football.md",
    );
  }

  let response: Response;
  try {
    response = await fetch(
      "https://api.football-data.org/v4/competitions/FL1/matches?season=2026",
      { headers: { "X-Auth-Token": apiKey } },
    );
  } catch (error) {
    throw new NetworkError(
      `Échec réseau vers football-data.org : ${(error as Error).message}`,
      { cause: error },
    );
  }

  if (!response.ok) {
    throw new HttpError(
      `football-data.org a répondu ${response.status} ${response.statusText}`,
    );
  }

  const json = (await response.json()) as { matches?: FootballDataMatch[] };
  if (!json.matches || json.matches.length !== EXPECTED_MATCH_COUNT) {
    throw new StructureError(
      `Réponse football-data.org inattendue : ${json.matches?.length ?? 0} match(s), ${EXPECTED_MATCH_COUNT} attendu(s) — arrêt sans écrire`,
    );
  }

  const root = resolve(".");
  const matchesPath = resolve(root, `${DATA_DIR}/matches.json`);
  const metaPath = resolve(root, `${DATA_DIR}/meta.json`);
  const currentMatches: Match[] = JSON.parse(
    readFileSync(matchesPath, "utf-8"),
  );
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
  writeFileSync(
    metaPath,
    JSON.stringify({ updatedAt: formatUpdatedAt(new Date()) }, null, 2) + "\n",
  );
  console.log(
    `${matches.length} matchs écrits dans matches.json (${preserved} score(s) préservé(s) face à un null API).`,
  );

  if (process.argv.includes("--push")) {
    pushToGit(root);
  }
};

try {
  await main();
  await pushHeartbeat("up", "OK");
} catch (error) {
  const category = error instanceof Error ? error.name : "UnknownError";
  const message = error instanceof Error ? error.message : String(error);
  console.error(`[${category}] ${message}`);
  await pushHeartbeat("down", `${category}: ${message}`);
  process.exitCode = 1;
}
