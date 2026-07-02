import { seasonShort } from "@/lib/poster";
import type { Club, Competition } from "@/types/match";

interface PosterHeaderProps {
  club: Club;
  competition: Competition;
}

export const PosterHeader = ({ club, competition }: PosterHeaderProps) => (
  <header className="flex items-center justify-between bg-[#0c0c0c] px-[5mm] py-[3mm] mb-[3mm]">
    <div>
      <h1 className="font-['Impact','Arial_Black',Haettenschweiler,sans-serif] italic text-[var(--club-accent)] text-[21pt] uppercase tracking-[0.3pt] leading-[1.15]">
        Calendrier {seasonShort(competition.season)}
        <br />— Résultats —
      </h1>
      <div className="text-white/60 text-[6.5pt] tracking-[1.5pt] uppercase mt-[1.5mm]">
        {club.name} &nbsp;·&nbsp; {competition.name} &nbsp;·&nbsp; Saison{" "}
        {competition.season.replace("-", "–")}
      </div>
    </div>
    <div className="flex items-center gap-[4mm]">
      <img className="h-[17mm] w-auto" src={club.logo} alt={club.name} />
      <div className="w-[0.3mm] h-[15mm] bg-white/30 shrink-0" />
      <img
        className="h-[10mm] w-auto"
        src="/logos/ligue1-mcdonalds.svg"
        alt={competition.name}
      />
    </div>
  </header>
);
