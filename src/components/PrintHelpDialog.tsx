import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type HelpView = "confirm" | "instructions" | null;

interface PrintHelpDialogProps {
  view: HelpView;
  onViewChange: (view: HelpView) => void;
}

export const PrintHelpDialog = ({
  view,
  onViewChange,
}: PrintHelpDialogProps) => (
  <Dialog
    open={view !== null}
    onOpenChange={(open) => onViewChange(open ? view : null)}
  >
    <DialogContent>
      {view === "confirm" ? (
        <>
          <DialogHeader>
            <DialogTitle>Impression envoyée</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Est-ce que tout s'est bien passé à l'impression ?
          </p>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onViewChange("instructions")}
            >
              Non, un souci
            </Button>
            <Button type="button" onClick={() => onViewChange(null)}>
              Oui, parfait
            </Button>
          </DialogFooter>
        </>
      ) : (
        <>
          <DialogHeader>
            <DialogTitle>
              🖨️ Avant d'imprimer, ouvre "Plus de paramètres"
            </DialogTitle>
          </DialogHeader>
          <ul className="text-sm text-muted-foreground pl-4 list-disc space-y-1">
            <li>
              <em className="text-accent not-italic font-bold">
                Graphismes d'arrière-plan
              </em>{" "}
              → coché (sinon le fond rouge disparaît)
            </li>
            <li>
              <em className="text-accent not-italic font-bold">Marges</em> →{" "}
              <em className="text-accent not-italic font-bold">Aucune</em>{" "}
              (sinon l'affiche ne remplit pas toute la page)
            </li>
            <li>
              <em className="text-accent not-italic font-bold">
                En-têtes et pieds de page
              </em>{" "}
              → décoché (sinon date/URL s'impriment en haut/bas)
            </li>
            <li>
              <em className="text-accent not-italic font-bold">Couleur</em> →{" "}
              <em className="text-accent not-italic font-bold">Couleur</em>, pas
              "Noir et blanc" (sinon le rouge devient gris)
            </li>
            <li>
              <em className="text-accent not-italic font-bold">
                Mise à l'échelle
              </em>{" "}
              → 100% (pas "Ajuster à la page")
            </li>
          </ul>
          <DialogFooter>
            <Button type="button" onClick={() => onViewChange(null)}>
              Compris
            </Button>
          </DialogFooter>
        </>
      )}
    </DialogContent>
  </Dialog>
);
