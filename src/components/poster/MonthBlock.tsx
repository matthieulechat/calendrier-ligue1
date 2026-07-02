import { MatchRow } from "@/components/poster/MatchRow";
import type { MonthGroup } from "@/lib/poster";
import type { Club } from "@/types/match";

interface MonthBlockProps {
  month: MonthGroup;
  club: Club;
  clubsById: Map<string, Club>;
  isFirst: boolean;
}

export const MonthBlock = ({
  month,
  club,
  clubsById,
  isFirst,
}: MonthBlockProps) => (
  <div>
    <h3
      className={`font-['Impact','Arial_Black',Haettenschweiler,sans-serif] italic text-[var(--club-accent)] text-[12pt] uppercase tracking-[0.3pt] mb-[0.8mm] ${isFirst ? "mt-0" : "mt-[2.5mm]"}`}
    >
      {month.label}
    </h3>
    <div role="table" aria-label={`Matchs ${month.label}`}>
      <div role="rowgroup">
        {month.matches.map((match) => {
          const opponentId =
            match.domicile === club.id ? match.exterieur : match.domicile;
          const opponent = clubsById.get(opponentId);
          if (!opponent) return null;
          return (
            <MatchRow
              key={`${match.journee}-${opponentId}`}
              match={match}
              club={club}
              opponent={opponent}
            />
          );
        })}
      </div>
    </div>
  </div>
);
