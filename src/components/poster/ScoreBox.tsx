interface ScoreBoxProps {
  label: string;
}

export const ScoreBox = ({ label }: ScoreBoxProps) => (
  <div className="flex flex-col items-center gap-[0.5mm] shrink-0" role="cell">
    <span className="flex items-center gap-[0.8mm]">
      <span className="inline-block w-[7mm] h-[5.5mm] bg-white/[93%] rounded-[0.8mm] border-[0.3mm] border-white/35 shrink-0" />
      <span className="text-[var(--club-accent)] font-bold text-[9pt] leading-none">
        –
      </span>
      <span className="inline-block w-[7mm] h-[5.5mm] bg-white/[93%] rounded-[0.8mm] border-[0.3mm] border-white/35 shrink-0" />
    </span>
    <span className="text-[4.2pt] text-white/[45%] tracking-[0.2pt] whitespace-nowrap text-center">
      {label}
    </span>
  </div>
);
