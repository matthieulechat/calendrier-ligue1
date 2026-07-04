import { useCallback, useEffect, useMemo, useState } from "react";
import "@/App.css";
import {
  ligue1Clubs,
  ligue1Competition,
  ligue1Matches,
} from "@/adapters/ligue1";
import { AppToolbar } from "@/components/AppToolbar";
import { PosterGrid } from "@/components/poster/PosterGrid";
import { PosterSheet } from "@/components/poster/PosterSheet";
import { useLocalScores } from "@/hooks/useLocalScores";
import { mergeMatches } from "@/lib/scores";

const DEFAULT_CLUB_ID = "lemans";
const UPDATED_AT = "02/07/2026 à 00h00";
const STORAGE_KEY = `scores:${ligue1Competition.id}:${ligue1Competition.season}`;

function App() {
  const [clubId, setClubId] = useState(DEFAULT_CLUB_ID);
  const [printBlank, setPrintBlank] = useState(true);
  const [viewMode, setViewMode] = useState<"single" | "grid">("single");
  const { scores, setScore } = useLocalScores(STORAGE_KEY);

  const club = ligue1Clubs.find((c) => c.id === clubId);
  if (!club) throw new Error(`Club ${clubId} introuvable`);

  const sortedClubs = useMemo(
    () => ligue1Clubs.toSorted((a, b) => a.name.localeCompare(b.name)),
    [],
  );
  const matches = useMemo(() => mergeMatches(ligue1Matches, scores), [scores]);

  const goToClub = useCallback(
    (direction: 1 | -1) => {
      const currentIndex = sortedClubs.findIndex((c) => c.id === clubId);
      const nextIndex =
        (currentIndex + direction + sortedClubs.length) % sortedClubs.length;
      setClubId(sortedClubs[nextIndex].id);
    },
    [clubId, sortedClubs],
  );

  useEffect(() => {
    if (viewMode !== "single") return;

    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, [contenteditable]")) {
        return;
      }
      if (event.key === "ArrowLeft") goToClub(-1);
      if (event.key === "ArrowRight") goToClub(1);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [viewMode, goToClub]);

  return (
    <div className="bg-[#2e2e2e] flex flex-col items-center min-h-screen p-[22px] font-['Arial_Narrow',Arial,Helvetica,sans-serif] [print-color-adjust:exact] [-webkit-print-color-adjust:exact] print:bg-none print:p-0 print:block print:min-h-0">
      <AppToolbar
        club={club}
        sortedClubs={sortedClubs}
        onClubChange={setClubId}
        onPrevClub={() => goToClub(-1)}
        onNextClub={() => goToClub(1)}
        viewMode={viewMode}
        onToggleViewMode={() =>
          setViewMode((mode) => (mode === "single" ? "grid" : "single"))
        }
        printBlank={printBlank}
        onPrintBlankChange={setPrintBlank}
      />

      {viewMode === "single" ? (
        <PosterSheet
          club={club}
          competition={ligue1Competition}
          matches={matches}
          clubs={ligue1Clubs}
          updatedAt={UPDATED_AT}
          onScoreChange={setScore}
          printBlank={printBlank}
        />
      ) : (
        <PosterGrid
          clubs={sortedClubs}
          competition={ligue1Competition}
          matches={matches}
          updatedAt={UPDATED_AT}
          onSelectClub={(id) => {
            setClubId(id);
            setViewMode("single");
          }}
        />
      )}
    </div>
  );
}

export default App;
