import { House, Plane } from "lucide-react";
import { ScoreBox } from "@/components/poster/ScoreBox";
import { formatMatchDay, scoreOrderLabel } from "@/lib/poster";
import { matchKey, type ScoreField } from "@/lib/scores";
import type { Club, Match } from "@/types/match";

interface MatchRowProps {
  match: Match;
  club: Club;
  opponent: Club;
  onScoreChange: (key: string, field: ScoreField, value: number | null) => void;
  printBlank: boolean;
}

export const MatchRow = ({
  match,
  club,
  opponent,
  onScoreChange,
  printBlank,
}: MatchRowProps) => {
  const isHome = match.domicile === club.id;
  const { day, weekday } = formatMatchDay(match.date);
  const key = matchKey(match);

  return (
    <div
      className="grid grid-cols-[9mm_1fr_auto_5mm] items-center gap-[1.5mm] py-[1.25mm] border-b-[0.3mm] border-dashed border-white/[18%] break-inside-avoid"
      role="row"
    >
      <div
        className="text-center flex flex-col items-center leading-[1.1]"
        role="cell"
      >
        <b className="text-[var(--club-accent)] italic text-[10.5pt] font-extrabold">
          {day}
        </b>
        <i className="text-white/50 not-italic text-[7pt] font-bold tracking-[0.3pt]">
          {weekday}
        </i>
      </div>
      <div
        className="flex items-center gap-[1.5mm] min-w-0 overflow-hidden"
        role="cell"
      >
        <img
          className="w-[5mm] h-[5mm] object-contain shrink-0 rounded-full bg-white/[92%] p-[0.4mm] [print-color-adjust:exact] [-webkit-print-color-adjust:exact]"
          src={opponent.logo}
          alt={opponent.name}
        />
        <span className="text-[9.5pt] font-bold uppercase tracking-[0.2pt] whitespace-nowrap overflow-hidden text-ellipsis">
          {opponent.shortName}
        </span>
      </div>
      <ScoreBox
        label={scoreOrderLabel(club, opponent, isHome)}
        home={match.score.domicile}
        away={match.score.exterieur}
        onChange={(field, value) => onScoreChange(key, field, value)}
        printBlank={printBlank}
      />
      <div role="cell">
        {isHome ? (
          <House className="w-[5mm] h-[5mm] shrink-0 text-[var(--club-accent)]" />
        ) : (
          <Plane className="w-[5mm] h-[5mm] shrink-0 text-[var(--club-secondary-variant)]" />
        )}
      </div>
    </div>
  );
};
