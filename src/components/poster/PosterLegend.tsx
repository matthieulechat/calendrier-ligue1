import { House, Plane } from "lucide-react";

export const PosterLegend = () => (
  <div className="flex items-center justify-center gap-[4mm] text-[7pt] uppercase tracking-[0.8pt] text-white/85 py-[1.5mm] mb-[2.5mm] border-t-[0.3mm] border-b-[0.3mm] border-white/25">
    <div className="flex items-center gap-[1.5mm]">
      <House
        className="w-[3.5mm] h-[3.5mm] shrink-0 text-[var(--club-accent)]"
        strokeWidth={2.5}
      />
      Domicile
    </div>
    <span className="text-white/30 text-[8pt]">|</span>
    <div className="flex items-center gap-[1.5mm]">
      <Plane
        className="w-[3.5mm] h-[3.5mm] shrink-0 text-white/[88%]"
        strokeWidth={2.5}
      />
      Extérieur
    </div>
  </div>
);
