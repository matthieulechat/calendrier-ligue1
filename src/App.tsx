import { useMemo, useState } from "react";
import "@/App.css";
import {
  ligue1Clubs,
  ligue1Competition,
  ligue1Matches,
} from "@/adapters/ligue1";
import { PosterSheet } from "@/components/poster/PosterSheet";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLocalScores } from "@/hooks/useLocalScores";
import { mergeMatches } from "@/lib/scores";

const DEFAULT_CLUB_ID = "lemans";
const UPDATED_AT = "02/07/2026 à 00h00";
const STORAGE_KEY = `scores:${ligue1Competition.id}:${ligue1Competition.season}`;

function App() {
  const [clubId, setClubId] = useState(DEFAULT_CLUB_ID);
  const [printBlank, setPrintBlank] = useState(true);
  const { scores, setScore } = useLocalScores(STORAGE_KEY);

  const club = ligue1Clubs.find((c) => c.id === clubId);
  if (!club) throw new Error(`Club ${clubId} introuvable`);

  const sortedClubs = useMemo(
    () => ligue1Clubs.toSorted((a, b) => a.name.localeCompare(b.name)),
    [],
  );
  const matches = useMemo(() => mergeMatches(ligue1Matches, scores), [scores]);

  return (
    <div className="bg-[#2e2e2e] flex flex-col items-center min-h-screen p-[22px] font-['Arial_Narrow',Arial,Helvetica,sans-serif] [print-color-adjust:exact] [-webkit-print-color-adjust:exact] print:bg-none print:p-0 print:block print:min-h-0">
      <div className="w-[210mm] bg-[#111] text-[#ffd84d] border-l-4 border-[#ffd84d] px-4 py-2.5 mb-3.5 text-xs leading-[1.6] print:hidden">
        <strong className="block mb-[3px] text-[13px]">
          🖨️ Avant d'imprimer, ouvre "Plus de paramètres" dans la boîte de
          dialogue et règle :
        </strong>
        <ul className="text-white/75 pl-4">
          <li>
            <em className="text-[#ffd84d] not-italic font-bold">
              Graphismes d'arrière-plan
            </em>{" "}
            → coché (sinon le fond rouge disparaît)
          </li>
          <li>
            <em className="text-[#ffd84d] not-italic font-bold">Marges</em> →{" "}
            <em className="text-[#ffd84d] not-italic font-bold">Aucune</em>{" "}
            (sinon l'affiche ne remplit pas toute la page)
          </li>
          <li>
            <em className="text-[#ffd84d] not-italic font-bold">
              En-têtes et pieds de page
            </em>{" "}
            → décoché (sinon date/URL s'impriment en haut/bas)
          </li>
          <li>
            <em className="text-[#ffd84d] not-italic font-bold">Couleur</em> →{" "}
            <em className="text-[#ffd84d] not-italic font-bold">Couleur</em>,
            pas "Noir et blanc" (sinon le rouge devient gris)
          </li>
          <li>
            <em className="text-[#ffd84d] not-italic font-bold">
              Mise à l'échelle
            </em>{" "}
            → 100% (pas "Ajuster à la page")
          </li>
        </ul>
        <button
          type="button"
          className="bg-[#ffd84d] text-[#0c0c0c] border-none px-[18px] py-[7px] font-bold text-xs cursor-pointer rounded-[3px] uppercase tracking-[0.5px] mt-2 inline-block hover:bg-[#f5c518]"
          onClick={() => window.print()}
        >
          🖨️ Imprimer l'affiche A4
        </button>

        <div className="flex flex-wrap items-center gap-3 mt-3">
          <Select
            value={clubId}
            onValueChange={(value) => setClubId(value as string)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choisir un club" />
            </SelectTrigger>
            <SelectContent>
              {sortedClubs.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex gap-1.5">
            <Button
              type="button"
              size="sm"
              variant={printBlank ? "default" : "outline"}
              onClick={() => setPrintBlank(true)}
            >
              Imprimer vide
            </Button>
            <Button
              type="button"
              size="sm"
              variant={printBlank ? "outline" : "default"}
              onClick={() => setPrintBlank(false)}
            >
              Imprimer avec scores
            </Button>
          </div>
        </div>
      </div>

      <PosterSheet
        club={club}
        competition={ligue1Competition}
        matches={matches}
        clubs={ligue1Clubs}
        updatedAt={UPDATED_AT}
        onScoreChange={setScore}
        printBlank={printBlank}
      />
    </div>
  );
}

export default App;
