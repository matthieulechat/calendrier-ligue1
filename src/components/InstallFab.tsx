import { Download, Share, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useInstallPrompt } from "@/hooks/useInstallPrompt";

export const InstallFab = () => {
  const { canInstall, isIos, isStandalone, install } = useInstallPrompt();
  const [showHint, setShowHint] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showHint) return;
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setShowHint(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showHint]);

  if (isStandalone || (!canInstall && !isIos)) return null;

  const handleClick = async () => {
    if (isIos) {
      setShowHint((prev) => !prev);
      return;
    }
    await install();
  };

  return (
    <div
      className="fixed bottom-[136px] right-6 z-40 print:hidden"
      ref={containerRef}
    >
      <Button
        type="button"
        variant="outline"
        size="fab"
        aria-label="Installer l'application sur l'écran d'accueil"
        aria-expanded={isIos ? showHint : undefined}
        className="bg-card"
        onClick={handleClick}
      >
        {isIos ? <Share /> : <Download />}
      </Button>

      {isIos && showHint && (
        <div className="absolute bottom-full right-0 z-50 mb-2 w-56 rounded-xl border border-border bg-card p-3 shadow-lg">
          <button
            type="button"
            onClick={() => setShowHint(false)}
            aria-label="Fermer"
            className="absolute right-2 top-2 text-muted-foreground transition-colors hover:text-foreground"
          >
            <X className="size-3.5" />
          </button>
          <p className="pr-4 text-xs leading-relaxed text-foreground">
            Dans Safari, appuyez sur{" "}
            <Share className="mx-0.5 inline size-3.5 align-text-bottom" /> puis{" "}
            <strong>« Sur l'écran d'accueil »</strong>.
          </p>
        </div>
      )}
    </div>
  );
};
