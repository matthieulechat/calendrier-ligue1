import type { Club } from "@/types/match";

interface PosterFooterProps {
  club: Club;
  updatedAt: string;
}

export const PosterFooter = ({ club, updatedAt }: PosterFooterProps) => (
  <footer className="mt-[2mm] pt-[1.5mm] border-t-[0.3mm] border-white/[22%] flex items-center justify-between gap-[3mm]">
    <div className="text-[6.5pt] text-white/40 leading-[1.5] flex-1">
      Sous réserve des procédures en cours et d'éventuels recours.
      <br />
      Les jours et horaires définitifs des matchs seront définis ultérieurement.
      <span className="block mt-[1mm] text-white/30">
        Calendrier mis à jour le {updatedAt}
      </span>
    </div>
    <img className="h-[13mm] w-auto" src={club.logo} alt={club.name} />
  </footer>
);
