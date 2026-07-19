import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PrintFabProps {
  onPrinted: () => void;
}

export const PrintFab = ({ onPrinted }: PrintFabProps) => (
  <Button
    type="button"
    size="fab"
    aria-label="Imprimer l'affiche A4"
    className="fixed bottom-6 right-6 z-40 bg-accent text-accent-foreground hover:bg-accent/90 print:hidden"
    onClick={() => {
      window.print();
      onPrinted();
    }}
  >
    <Printer />
  </Button>
);
