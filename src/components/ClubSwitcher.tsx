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

interface ClubSwitcherProps {
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

export const ClubSwitcher = ({
  club,
  sortedClubs,
  onClubChange,
  onPrevClub,
  onNextClub,
  viewMode,
  onToggleViewMode,
  printBlank,
  onPrintBlankChange,
}: ClubSwitcherProps) => (
  <div className="fixed top-4 left-1/2 -translate-x-1/2 z-40 flex flex-wrap items-center gap-3 rounded-full border border-border bg-card px-3 py-1.5 shadow-sm print:hidden">
    {viewMode === "single" && (
      <div className="flex items-center gap-1">
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          aria-label="Club précédent"
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
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span>Imprimer vide</span>
        <Switch
          checked={!printBlank}
          onCheckedChange={(checked) => onPrintBlankChange(!checked)}
        />
        <span>Imprimer avec scores</span>
      </div>
    )}
  </div>
);
