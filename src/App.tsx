import { useCallback, useEffect, useMemo, useState } from "react";
import "@/App.css";
import {
  ligue1Clubs,
  ligue1Competition,
  ligue1Matches,
  ligue1UpdatedAt,
} from "@/adapters/ligue1";
import { AppBrandRibbon } from "@/components/AppBrandRibbon";
import { AppLogo } from "@/components/AppLogo";
import { ClubSwitcher } from "@/components/ClubSwitcher";
import { HelpFab } from "@/components/HelpFab";
import { InstallFab } from "@/components/InstallFab";
import { PrintFab } from "@/components/PrintFab";
import { PrintHelpDialog } from "@/components/PrintHelpDialog";
import { PosterGrid } from "@/components/poster/PosterGrid";
import { PosterSheet } from "@/components/poster/PosterSheet";
import { useLocalScores } from "@/hooks/useLocalScores";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { mergeMatches } from "@/lib/scores";

const DEFAULT_CLUB_ID = "lemans";
const STORAGE_KEY = `scores:${ligue1Competition.id}:${ligue1Competition.season}`;

function getInitialClubId() {
  const fromUrl = new URLSearchParams(window.location.search).get("club");
  return ligue1Clubs.some((c) => c.id === fromUrl)
    ? (fromUrl as string)
    : DEFAULT_CLUB_ID;
}

function App() {
  const [clubId, setClubId] = useState(getInitialClubId);
  const [printBlank, setPrintBlank] = useState(true);
  const [viewMode, setViewMode] = useState<"single" | "grid">("single");
  const [helpView, setHelpView] = useState<"confirm" | "instructions" | null>(
    null,
  );
  const { scores, setScore } = useLocalScores(STORAGE_KEY);
  const isCompact = useMediaQuery("(max-width: 1023px)");
  const effectiveViewMode = isCompact ? "single" : viewMode;
  const effectivePrintBlank = isCompact ? false : printBlank;

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
    if (effectiveViewMode !== "single") return;

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
  }, [effectiveViewMode, goToClub]);

  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set("club", clubId);
    window.history.replaceState(null, "", url);
  }, [clubId]);

  return (
    <div className="bg-background flex flex-col items-center min-h-screen px-[22px] pb-[22px] pt-20 font-sans [print-color-adjust:exact] [-webkit-print-color-adjust:exact] print:bg-none print:p-0 print:block print:min-h-0">
      <AppBrandRibbon />
      <AppLogo />
      <ClubSwitcher
        club={club}
        sortedClubs={sortedClubs}
        onClubChange={setClubId}
        onPrevClub={() => goToClub(-1)}
        onNextClub={() => goToClub(1)}
        viewMode={effectiveViewMode}
        onToggleViewMode={() =>
          setViewMode((mode) => (mode === "single" ? "grid" : "single"))
        }
        printBlank={effectivePrintBlank}
        onPrintBlankChange={setPrintBlank}
      />
      <HelpFab onClick={() => setHelpView("instructions")} />
      <InstallFab />
      <PrintFab onPrinted={() => setHelpView("confirm")} />
      <PrintHelpDialog view={helpView} onViewChange={setHelpView} />

      {effectiveViewMode === "single" ? (
        <PosterSheet
          club={club}
          competition={ligue1Competition}
          matches={matches}
          clubs={ligue1Clubs}
          updatedAt={ligue1UpdatedAt}
          onScoreChange={setScore}
          printBlank={effectivePrintBlank}
        />
      ) : (
        <PosterGrid
          clubs={sortedClubs}
          competition={ligue1Competition}
          matches={matches}
          updatedAt={ligue1UpdatedAt}
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
