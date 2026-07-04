import type { CSSProperties } from "react";
import type { Club, ClubColors, Match } from "@/types/match";

export const DEFAULT_CLUB_COLORS: ClubColors = {
  primary: "#a51820",
  primaryVariant: "#6e0b12",
  secondary: "#0c0c0c",
  secondaryVariant: "#8c8c8c",
  accent: "#ffd84d",
};

// Couleurs injectées en CSS custom properties, consommées par les classes
// Tailwind arbitraires (ex: text-[var(--club-accent)]) pour rester personnalisables par club.
export const clubColorVars = (club: Club): CSSProperties => {
  const colors = club.colors ?? DEFAULT_CLUB_COLORS;
  return {
    "--club-primary": colors.primary,
    "--club-primary-variant": colors.primaryVariant,
    "--club-secondary": colors.secondary,
    "--club-secondary-variant": colors.secondaryVariant,
    "--club-accent": colors.accent,
  } as CSSProperties;
};

const MONTH_LABELS = [
  "JAN.",
  "FÉV.",
  "MARS",
  "AVR.",
  "MAI",
  "JUIN",
  "JUIL.",
  "AOÛT",
  "SEPT.",
  "OCT.",
  "NOV.",
  "DÉC.",
];

// Lundi en premier (semaine FR) ; getDay() renvoie 0=dimanche, d'où le décalage +6 mod 7.
const WEEKDAY_ABBR = ["L", "Ma", "Me", "J", "V", "S", "D"];

export interface MonthGroup {
  key: string;
  label: string;
  matches: Match[];
}

export const getClubMatches = (matches: Match[], clubId: string): Match[] =>
  matches
    .filter((match) => match.domicile === clubId || match.exterieur === clubId)
    .toSorted((a, b) => a.date.localeCompare(b.date));

export const groupByMonth = (matches: Match[]): MonthGroup[] => {
  const groups = new Map<string, Match[]>();
  for (const match of matches) {
    const key = match.date.slice(0, 7);
    const group = groups.get(key);
    if (group) {
      group.push(match);
    } else {
      groups.set(key, [match]);
    }
  }
  return Array.from(groups.entries()).map(([key, groupMatches]) => ({
    key,
    label: MONTH_LABELS[Number(key.slice(5, 7)) - 1],
    matches: groupMatches,
  }));
};

export const splitColumns = (
  months: MonthGroup[],
): [MonthGroup[], MonthGroup[]] => {
  const total = months.reduce((sum, m) => sum + m.matches.length, 0);
  let bestSplit = months.length;
  let bestGap = total;
  let leftCount = 0;
  for (let i = 0; i < months.length; i++) {
    leftCount += months[i].matches.length;
    const gap = Math.abs(leftCount - (total - leftCount));
    if (gap < bestGap) {
      bestGap = gap;
      bestSplit = i + 1;
    }
  }
  return [months.slice(0, bestSplit), months.slice(bestSplit)];
};

export const formatMatchDay = (
  isoDate: string,
): { day: string; weekday: string } => {
  const date = new Date(`${isoDate}T00:00:00`);
  return {
    day: String(date.getDate()).padStart(2, "0"),
    weekday: WEEKDAY_ABBR[(date.getDay() + 6) % 7],
  };
};

export const seasonShort = (season: string): string =>
  season
    .split("-")
    .map((y) => y.slice(-2))
    .join("/");

export const scoreOrderLabel = (
  club: Club,
  opponent: Club,
  isHome: boolean,
): string =>
  isHome
    ? `${club.shortName} – ${opponent.shortName}`
    : `${opponent.shortName} – ${club.shortName}`;
