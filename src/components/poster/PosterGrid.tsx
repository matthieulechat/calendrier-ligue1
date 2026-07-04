import { PosterSheet } from "@/components/poster/PosterSheet";
import type { Club, Competition, Match } from "@/types/match";

interface PosterGridProps {
  clubs: Club[];
  competition: Competition;
  matches: Match[];
  updatedAt: string;
  onSelectClub: (clubId: string) => void;
}

// Échelle des vignettes : assez grande pour repérer un problème de mise en
// page/couleur/logo, assez petite pour tenir 18 affiches A4 à l'écran.
const THUMBNAIL_SCALE = 0.24;
const noopScoreChange = () => {};

export const PosterGrid = ({
  clubs,
  competition,
  matches,
  updatedAt,
  onSelectClub,
}: PosterGridProps) => (
  <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-4 w-[210mm] print:hidden">
    {clubs.map((club) => (
      <button
        key={club.id}
        type="button"
        onClick={() => onSelectClub(club.id)}
        className="flex flex-col items-center gap-1.5 rounded-md border border-white/10 bg-black/20 p-2 transition hover:border-[#ffd84d]/70 focus-visible:outline-2 focus-visible:outline-[#ffd84d]"
      >
        <div
          className="overflow-hidden rounded-[1px] shadow-md"
          style={{ width: `${210 * THUMBNAIL_SCALE}mm` }}
        >
          {/* `zoom` (contrairement à transform:scale) réduit aussi la taille
              de layout : le wrapper épouse la vraie hauteur du contenu, donc
              pas de dépassement même si une affiche déborde légèrement du 297mm nominal. */}
          <div style={{ zoom: THUMBNAIL_SCALE }}>
            <PosterSheet
              club={club}
              competition={competition}
              matches={matches}
              clubs={clubs}
              updatedAt={updatedAt}
              onScoreChange={noopScoreChange}
              printBlank
            />
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <img
            src={club.logo}
            alt=""
            className="size-4 shrink-0 object-contain"
          />
          <span className="text-[11px] font-medium text-white/85 text-center leading-tight">
            {club.name}
          </span>
        </div>
      </button>
    ))}
  </div>
);
