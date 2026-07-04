import { useId } from "react";
import type { ScoreField } from "@/lib/scores";

interface ScoreBoxProps {
  label: string;
  home: number | null;
  away: number | null;
  onChange: (field: ScoreField, value: number | null) => void;
  printBlank: boolean;
}

const clampScore = (raw: string): number | null => {
  if (raw === "") return null;
  return Math.min(99, Math.max(0, Number(raw)));
};

export const ScoreBox = ({
  label,
  home,
  away,
  onChange,
  printBlank,
}: ScoreBoxProps) => {
  const id = useId();
  const inputClassName = `inline-block w-[7mm] h-[5.5mm] bg-white/[93%] rounded-[0.8mm] border-[0.3mm] border-white/35 shrink-0 text-center text-[8pt] font-bold text-[#111] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${printBlank ? "print:text-transparent" : ""}`;

  return (
    <span className="flex items-center gap-[0.8mm] shrink-0" role="cell">
      <label htmlFor={`${id}-domicile`} className="sr-only">
        {label} — score domicile
      </label>
      <input
        id={`${id}-domicile`}
        type="number"
        min={0}
        max={99}
        value={home ?? ""}
        onChange={(e) => onChange("domicile", clampScore(e.target.value))}
        className={inputClassName}
      />
      <span
        aria-hidden="true"
        className="text-[var(--club-accent)] font-bold text-[9pt] leading-none"
      >
        –
      </span>
      <label htmlFor={`${id}-exterieur`} className="sr-only">
        {label} — score extérieur
      </label>
      <input
        id={`${id}-exterieur`}
        type="number"
        min={0}
        max={99}
        value={away ?? ""}
        onChange={(e) => onChange("exterieur", clampScore(e.target.value))}
        className={inputClassName}
      />
    </span>
  );
};
