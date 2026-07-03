import type { Match } from "@/types/match";

export type ScoreField = "domicile" | "exterieur";
export type LocalScores = Record<string, Match["score"]>;

export const matchKey = (
  m: Pick<Match, "journee" | "domicile" | "exterieur">,
): string => `${m.journee}-${m.domicile}-${m.exterieur}`;

export const mergeScore = (
  canonical: Match["score"],
  local: Match["score"] | undefined,
): Match["score"] => ({
  domicile: canonical.domicile ?? local?.domicile ?? null,
  exterieur: canonical.exterieur ?? local?.exterieur ?? null,
});

export const mergeMatches = (matches: Match[], local: LocalScores): Match[] =>
  matches.map((m) => ({
    ...m,
    score: mergeScore(m.score, local[matchKey(m)]),
  }));
