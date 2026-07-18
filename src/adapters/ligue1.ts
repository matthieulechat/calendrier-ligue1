import clubsData from "@/data/ligue1-2627/clubs.json";
import matchesData from "@/data/ligue1-2627/matches.json";
import metaData from "@/data/ligue1-2627/meta.json";
import type { Club, Competition, Match } from "@/types/match";

export const ligue1Competition: Competition = {
  id: "ligue1",
  name: "Ligue 1 McDonald's",
  season: "2026-2027",
};

export const ligue1Clubs: Club[] = clubsData;
export const ligue1Matches: Match[] = matchesData;
export const ligue1UpdatedAt: string = metaData.updatedAt;
