import { CircleHelp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HelpFabProps {
  onClick: () => void;
}

export const HelpFab = ({ onClick }: HelpFabProps) => (
  <Button
    type="button"
    variant="outline"
    size="fab"
    aria-label="Aide impression"
    className="fixed bottom-20 right-6 z-40 bg-card print:hidden"
    onClick={onClick}
  >
    <CircleHelp />
  </Button>
);
