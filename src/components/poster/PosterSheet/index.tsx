import { MonthBlock } from "@/components/poster/MonthBlock";
import { PosterFooter } from "@/components/poster/PosterFooter";
import { PosterHeader } from "@/components/poster/PosterHeader";
import { PosterLegend } from "@/components/poster/PosterLegend";
import {
  clubColorVars,
  getClubMatches,
  groupByMonth,
  splitColumns,
} from "@/lib/poster";
import type { Club, Competition, Match } from "@/types/match";

interface PosterSheetProps {
  club: Club;
  competition: Competition;
  matches: Match[];
  clubs: Club[];
  updatedAt: string;
}

export const PosterSheet = ({
  club,
  competition,
  matches,
  clubs,
  updatedAt,
}: PosterSheetProps) => {
  const clubsById = new Map(clubs.map((c) => [c.id, c]));
  const clubMatches = getClubMatches(matches, club.id);
  const months = groupByMonth(clubMatches);
  const [leftMonths, rightMonths] = splitColumns(months);

  return (
    <div
      className="w-[210mm] min-h-[297mm] p-[8mm] text-white font-['Arial_Narrow',Arial,Helvetica,sans-serif] [print-color-adjust:exact] [-webkit-print-color-adjust:exact] bg-[linear-gradient(148deg,var(--club-secondary)_0%,var(--club-primary)_100%)]"
      style={clubColorVars(club)}
    >
      <PosterHeader club={club} competition={competition} />
      <PosterLegend />
      <div className="grid grid-cols-[1fr_0.3mm_1fr] gap-[2.5mm]">
        <div>
          {leftMonths.map((month, i) => (
            <MonthBlock
              key={month.key}
              month={month}
              club={club}
              clubsById={clubsById}
              isFirst={i === 0}
            />
          ))}
        </div>
        <div className="bg-white/25" />
        <div>
          {rightMonths.map((month, i) => (
            <MonthBlock
              key={month.key}
              month={month}
              club={club}
              clubsById={clubsById}
              isFirst={i === 0}
            />
          ))}
        </div>
      </div>
      <PosterFooter club={club} updatedAt={updatedAt} />
    </div>
  );
};
