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
- [ZBLK-003](archive/blockers/ZBLK-003.md) — Colonnes affiche plus hautes que prévu, faux suspect table imbriquée (résolu)
- [ZBLK-004](archive/blockers/ZBLK-004.md) — Téléchargement logo Le Mans FC échoue silencieusement (résolu)

---

Intégration de la Phase 2 (spike de faisabilité données) : 3 agents lancés en parallèle pour évaluer openligadb, football-data.org et API-Football sur les mêmes 5 critères (couverture Ligue 1, fixtures+résultats, délai de mise à jour, quota/coût, fiabilité). openligadb écarté (couverture Ligue 1 abandonnée depuis la saison 2017/2018) ; football-data.org et API-Football tous deux GO. Baptiste a tranché pour **API-Football** (league ID `61`, endpoint `/fixtures`, quota gratuit 100 req/jour). `docs/ROADMAP.md` mis à jour (Phase 2 cochée, résumé du spike consigné).

Au déclenchement de `/memory-close`, erreur de process repérée : la décision avait été créée mid-session avec un ID séquentiel classique (`BDR-004`) alors que le projet est en mode multi-user (`.claude/memory/.multi-user` présent) — renommée en `BDR-20260702223842-1`, avec mise à jour de toutes les références croisées (index, ROADMAP.md, fichier). Pattern extrait en learning global (voir aussi GLRN-20260702223842-3). Profité du rituel pour archiver deux blockers résolus de sessions précédentes qui n'avaient pas encore été déplacés vers `archive/` ([ZBLK-003](archive/blockers/ZBLK-003.md), [ZBLK-004](archive/blockers/ZBLK-004.md)).

**Entrées clés :**

- [BDR-20260702223842-1](decisions/BDR-20260702223842-1.md) — API-Football retenue comme source de données (Phase 6)

---

Intégration de la Phase 3 (sélection club dynamique) et Phase 5 (saisie de scores) ensemble sur la branche `phase-2_3_5` (renommée depuis `phase-2`). Exploration a montré que la logique de filtrage/répartition par club (`getClubMatches`, `splitColumns`) était déjà générique depuis la Phase 1 — Phase 3 s'est réduite à brancher un `Select` shadcn dans `App.tsx`. Phase 5 a nécessité plus de travail : `src/lib/scores.ts` (fusion canonique/local), `src/hooks/useLocalScores.ts` (persistance), `ScoreBox` rendu interactif (inputs contrôlés + labels accessibles), toggle "Imprimer vide"/"Imprimer avec scores" piloté en CSS pur (`print:text-transparent`). Un agent de planification a validé/corrigé l'architecture proposée (clé `localStorage` non scopée par club, prop-drilling cohérent avec le pattern existant plutôt que Context/Zustand).

Vérification bout en bout via agent-browser : score saisi persiste après rechargement et après changement de club (preuve que la clé n'est pas scopée par club), classe `print:text-transparent` bascule correctement selon le toggle, aucune erreur console. `pnpm lint` (via `rtk`) a planté avec une erreur JSON illisible — diagnostiqué comme un ESLint global (9.9.0) masquant le binaire local du projet (10.6.0) ; contourné en invoquant les binaires locaux directement, `tsc -b` et `vite build` passent à 0 erreur. `docs/ROADMAP.md` mis à jour : Phase 3 et Phase 5 cochées.

**Entrées clés :**

- [BDR-20260702232918-1](decisions/BDR-20260702232918-1.md) — Phase 5 : architecture localStorage + prop-drilling
- [BLK-20260702232918-2](blockers/BLK-20260702232918-2.md) — pnpm lint (rtk) masqué par ESLint global (ouvert)

## 2026-07-03

Session courte de polish UI. Trois bugs remontés visuellement : le toggle "Imprimer vide / Imprimer avec scores" utilisait deux boutons shadcn au lieu d'un Switch ; le Select de club affichait l'id brut (`lemans`) au lieu du nom propre (`Le Mans FC`) ; les noms de clubs étaient tronqués dans le dropdown. Les trois ont été corrigés en séquence : installation du composant `Switch` via la CLI shadcn (base-nova), passage de `{club.name}` en children de `SelectValue` (base-ui ne résout pas l'ItemText automatiquement contrairement à Radix), et remplacement de `w-(--anchor-width)` par `min-w-(--anchor-width)` dans `select.tsx` pour que le popup puisse s'élargir. Ajout du style jaune app sur le Switch via `data-checked:bg-[#ffd84d]` en className, sans toucher aux CSS vars globales.

---

Phase 4 implémentée : extraction automatique des couleurs de clubs via `colorthief` + `sharp`. Création du script `scripts/extract-club-colors.ts` (migré de `.mjs` après la session, lancé via `pnpm colors`, `tsx` installé comme devDep). Les gardes-fous WCAG 3.0:1 (`ensureDark` pour les fonds, `ensureAccent` pour les accents) ont corrigé plusieurs cas illisibles détectés sur les screenshots : Auxerre (secondary `#cbdaec` → `#7d8591`), Angers (primary `#cab8a5` → `#928577`), Monaco (primary `#c58f4c` → `#a77a41`), Nice/Lorient (accents quasi-noirs → quasi-blancs). Le Mans FC (SVG) ignoré silencieusement par le `catch`, garde ses couleurs manuelles.

**Entrées clés :**

- [BDR-20260703115848-1](decisions/BDR-20260703115848-1.md) — Phase 4 : couleurs clubs via colorthief + seuil WCAG 3.0
