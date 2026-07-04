import { ChevronLeft, ChevronRight, LayoutGrid, Rows3 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import type { Club } from "@/types/match";

const navButtonClassName =
  "border-white/20 bg-white/5 text-[#ffd84d] hover:bg-white/15 hover:text-[#ffd84d]";

interface AppToolbarProps {
  club: Club;
  sortedClubs: Club[];
  onClubChange: (clubId: string) => void;
  onPrevClub: () => void;
  onNextClub: () => void;
  viewMode: "single" | "grid";
  onToggleViewMode: () => void;
  printBlank: boolean;
  onPrintBlankChange: (printBlank: boolean) => void;
}

export const AppToolbar = ({
  club,
  sortedClubs,
  onClubChange,
  onPrevClub,
  onNextClub,
  viewMode,
  onToggleViewMode,
  printBlank,
  onPrintBlankChange,
}: AppToolbarProps) => (
  <div className="w-[210mm] bg-[#111] text-[#ffd84d] border-l-4 border-[#ffd84d] px-4 py-2.5 mb-3.5 text-xs leading-[1.6] print:hidden">
    <strong className="block mb-[3px] text-[13px]">
      🖨️ Avant d'imprimer, ouvre "Plus de paramètres" dans la boîte de dialogue
      et règle :
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
        <em className="text-[#ffd84d] not-italic font-bold">Aucune</em> (sinon
        l'affiche ne remplit pas toute la page)
      </li>
      <li>
        <em className="text-[#ffd84d] not-italic font-bold">
          En-têtes et pieds de page
        </em>{" "}
        → décoché (sinon date/URL s'impriment en haut/bas)
      </li>
      <li>
        <em className="text-[#ffd84d] not-italic font-bold">Couleur</em> →{" "}
        <em className="text-[#ffd84d] not-italic font-bold">Couleur</em>, pas
        "Noir et blanc" (sinon le rouge devient gris)
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
      {viewMode === "single" && (
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            aria-label="Club précédent"
            className={navButtonClassName}
            onClick={onPrevClub}
          >
            <ChevronLeft />
          </Button>
          <Select
            value={club.id}
            onValueChange={(value) => onClubChange(value as string)}
          >
            <SelectTrigger>
              <SelectValue>
                <img src={club.logo} alt="" className="size-4 object-contain" />
                {club.name}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {sortedClubs.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  <img src={c.logo} alt="" className="size-4 object-contain" />
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            aria-label="Club suivant"
            className={navButtonClassName}
            onClick={onNextClub}
          >
            <ChevronRight />
          </Button>
        </div>
      )}

      <Button
        type="button"
        variant="outline"
        size="sm"
        className={navButtonClassName}
        onClick={onToggleViewMode}
      >
        {viewMode === "single" ? (
          <>
            <LayoutGrid /> Vue tous les clubs
          </>
        ) : (
          <>
            <Rows3 /> Vue détaillée
          </>
        )}
      </Button>

      {viewMode === "single" && (
        <div className="flex items-center gap-2 text-xs text-white/75">
          <span>Imprimer vide</span>
          <Switch
            checked={!printBlank}
            onCheckedChange={(checked) => onPrintBlankChange(!checked)}
            className="data-checked:bg-[#ffd84d]"
          />
          <span>Imprimer avec scores</span>
        </div>
      )}
    </div>
  </div>
);
