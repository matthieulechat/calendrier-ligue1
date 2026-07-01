---
register: journal
---

## 2026-07-01

Setup de l'infrastructure mémoire agent (`.claude/memory/`) pour le projet calendrier-ligue1. Le projet en est à la fin de la Phase 0 (scaffold Vite + React 19 + TypeScript 6 + Tailwind v4 + shadcn/ui, structure de dossiers en place). Prochaine étape déclarée dans `docs/ROADMAP.md` : Phase 1 (affiche statique Le Mans FC, données fake puis réelles).

Contexte projet capturé dans un nouveau `CLAUDE.md` racine (absent auparavant) : générateur d'affiche calendrier Ligue 1 imprimable, outil perso avant passage public éventuel.

**Entrées clés :**

- [BDR-001](decisions/BDR-001.md) — Pas de `CompetitionAdapter` avant 2e compétition réelle
- [LRN-001](learnings/LRN-001.md) — Escalade impression CSS natif → html2canvas+jsPDF → react-pdf
- [BLK-001](blockers/BLK-001.md) — Licences logos clubs non vérifiées (bloque la mise en public)

---

Exécution effective de la Phase 0 : scaffold manuel Vite + React 19 + TypeScript 6 (dossier non vide, scaffolder interactif inutilisable), Tailwind v4 sans config JS, shadcn/ui (`button`, `select`, `tooltip`), structure de dossiers conforme à la roadmap. Build et dev server validés en conditions réelles via agent-browser.

Deux frictions shadcn rencontrées : le bug Windows connu (`@\components\ui\` au lieu de `src\`) et un nouveau blocage CLI ("Could not load the workspace config") résolu en ajoutant `compilerOptions.paths` directement dans le `tsconfig.json` racine plutôt que seulement dans le `tsconfig.app.json` référencé. Découverte au passage que shadcn génère désormais des composants `@base-ui/react` (style `base-nova`) et non plus Radix.

ESLint (flat config, retiré puis remis à la demande de Baptiste) installé et validé (`pnpm lint` → 0 erreur). Phase 0 revérifiée factuellement item par item (fichiers, build, dossiers) plutôt que sur la seule base de l'état précédent — tout est cohérent avec la roadmap.

**Entrées clés :**

- [BLK-002](blockers/BLK-002.md) — shadcn init : "Could not load the workspace config" (résolu)
