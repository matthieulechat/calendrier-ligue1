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

- [ZBLK-002](archive/blockers/ZBLK-002.md) — shadcn init : "Could not load the workspace config" (résolu)

## 2026-07-02

Implémentation complète de la Phase 1 (affiche statique Le Mans FC) : types `Match`/`Club`/`Competition`, 7 composants poster (`PosterSheet`, `PosterHeader`, `PosterLegend`, `MonthBlock`, `MatchRow`, `ScoreBox`, `PosterFooter`), données fake (round-robin 18 clubs × 34 journées), 18 logos clubs (luukhopman + history/2022-23 pour Troyes), CSS print (`@page`, `print-color-adjust`), bouton Imprimer. Lint/build/rendu navigateur validés à chaque étape.

Retour de Baptiste sur cette première passe, avec 4 corrections : logos LMFC/Ligue1 de piètre qualité (extraits en base64 depuis le V1) → remplacés par des assets vectoriels officiels trouvés sur Wikipédia ; ordre des jours de la semaine incorrect (le lundi doit être premier) ; anticiper les couleurs personnalisables par club (Phase 4) ; CSS monolithique au lieu de classes Tailwind. Les 4 points ont été corrigés dans la foulée : migration complète `poster.css` → Tailwind (valeurs arbitraires pour les mm/pt), couleurs de club en CSS custom properties, `WEEKDAY_ABBR` réordonné lundi-first, nouveaux logos vectoriels.

Deux diagnostics ont nécessité plusieurs tentatives pendant cette session : un dépassement de hauteur de l'affiche imprimée initialement attribué à tort à un `<table>` imbriqué dans du CSS Grid (cause réelle : marges inter-siblings oubliées dans le calcul manuel, `align-items:stretch` masquant la vraie source) ; et l'échec silencieux du téléchargement du logo Le Mans FC via Wikimedia Commons (le fichier est en réalité hébergé localement sur fr.wikipedia.org, pas sur Commons).

Point encore ouvert, documenté dans `docs/ROADMAP.md` : avec les données fake actuelles, la colonne la plus dense de l'affiche dépasse légèrement la hauteur A4 — à réévaluer une fois les vraies données de calendrier substituées.

**Entrées clés :**

- [BDR-002](decisions/BDR-002.md) — Couleurs de club via CSS vars + Tailwind, pas de CSS monolithique
- [BDR-003](decisions/BDR-003.md) — Logos officiels via Wikipédia plutôt que ré-extraction V1
- [BLK-003](blockers/BLK-003.md) — Colonnes affiche plus hautes que prévu, faux suspect table imbriquée (résolu)
- [BLK-004](blockers/BLK-004.md) — Téléchargement logo Le Mans FC échoue silencieusement (résolu)
