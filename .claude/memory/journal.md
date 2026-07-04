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

Finalisation de la Phase 1. Corrigé le débordement d'impression sur 2 pages (footer relégué sur une page quasi vide) : mesuré empiriquement via `agent-browser` que l'affiche faisait 307,12mm pour 297mm disponibles, resserré l'espacement de `MatchRow`/`MonthBlock` pour ramener le contenu réel à 286,4mm. Corrigé aussi le logo "Ligue 1 McDonald's" qui affichait une boîte blanche sur le header noir — un rectangle de fond plein caché dans le premier `<path>` du SVG, supprimé.

Recherche de logos haute qualité sur `ligue1.com` à la demande de Baptiste : le site n'héberge que des icônes monochromes et des crests couleur limités à 128×128 via un CDN tiers, aucune amélioration par rapport aux PNG déjà en place. Décision de garder les logos actuels, et conversion du logo Le Mans FC (seul SVG restant) en PNG pour la cohérence du dossier assets, via un rendu canvas navigateur sans nouvelle dépendance.

Vérification complète de la Phase 1 tâche par tâche : tout est fait sauf deux points structurellement bloqués (substitution des vraies données de calendrier, test d'impression physique multi-navigateurs/imprimantes par Baptiste). Vérification des conditions d'usage des logos/marques avant mise en public (Phase 7) : aucune autorisation trouvée nulle part (ni le repo source des logos, ni les CGU de la LFP), le blocage reste ouvert.

Incident en session : le serveur `pnpm dev` de Baptiste a été tué par erreur en nettoyant des process de test par numéro de port, sans vérifier leur origine — corrigé immédiatement en relançant le serveur sur le port libéré.

Passage du projet en mode mémoire multi-user (fichier `.claude/memory/.multi-user` déjà présent, détecté en cours de rituel de fermeture) : toutes les entrées créées dans cette session ont été renumérotées au format timestamp (`<PREFIX>-20260702232209-<N>`).

**Entrées clés :**

- [ZBLK-20260702232209-1](archive/blockers/ZBLK-20260702232209-1.md) — Impression sur 2 pages, affiche dépassait 297mm (résolu)
- [LRN-20260702232209-2](learnings/LRN-20260702232209-2.md) — ligue1.com sans crests HD ; conversion SVG→PNG via canvas
- [ZBLK-20260702232209-3](archive/blockers/ZBLK-20260702232209-3.md) — Serveur dev de Baptiste tué par erreur (résolu)
- [BLK-001](blockers/BLK-001.md) — Licences des logos clubs : vérifiées, aucune autorisation trouvée

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

## 2026-07-04

Retrait du libellé "Le Mans - adversaire" sous `ScoreBox` (n'apportait rien visuellement), avec réadaptation de la hauteur au contenu. Ce changement a fait apparaître un grand vide en bas de page (poster A4 à 297mm fixes) : diagnostiqué via `agent-browser` (mesures `getBoundingClientRect`), la cause était `PosterSheet` à hauteur fixe sans que son contenu ne remplisse plus l'espace disponible après la réduction de hauteur des lignes.

Premier fix (`flex flex-col justify-between` sur les colonnes de mois) a comblé le vide mais introduit un nouveau problème signalé par Baptiste : des espacements disproportionnés et incohérents entre mois, les deux colonnes n'ayant pas le même nombre de matchs (16 vs 18). Changement de direction : retrait de la distribution élastique, augmentation à la place de la hauteur fixe des lignes (`MatchRow` `py-[0.6mm]`→`py-[1.5mm]`) pour absorber l'espace libre directement dans le contenu — vérifié empiriquement, page toujours calée à 297mm avec ~3,5mm de marge de sécurité sous le footer.

Augmentation ensuite des tailles de police pour la lisibilité (date, nom d'adversaire dans `MatchRow`, sous-titre `PosterHeader`, mentions légales `PosterFooter`), revérifiées à chaque étape pour ne pas faire déborder la page.

Baptiste a validé la Phase 1. Revue complète de `docs/ROADMAP.md` tâche par tâche : tout vérifié dans le code (composants, données fake, impression CSS, logos), note empirique de dépassement mise à jour avec les valeurs actuelles, et clarification que la substitution des données réelles est volontairement différée après la phase de scraping (Phase 2/6) plutôt qu'une tâche bloquante immédiate. Seul le test d'impression physique (Baptiste, non automatisable) reste ouvert.

**Entrées clés :**

- [BDR-20260704192350-2](decisions/BDR-20260704192350-2.md) — Espacement statique plutôt que distribution flex élastique pour l'affiche imprimable
- [BLK-20260704192350-4](blockers/BLK-20260704192350-4.md) — Fix élastique a réglé le vide de page mais créé des espaces incohérents entre mois (résolu)
- [BDR-20260704192350-1](decisions/BDR-20260704192350-1.md) — Données réelles différées après la phase de scraping

---

Ajout d'une navigation clavier/boutons entre clubs (flèches gauche/droite + chevrons dans la toolbar, cycle alphabétique, garde pour ne pas interférer avec les champs de saisie de score) et d'une vue grille QA (`PosterGrid`) affichant les 18 affiches complètes en miniature pour repérer d'un coup d'œil toute incohérence visuelle entre clubs — demande explicite de Baptiste pour ses tests fréquents de changement de club. `App.tsx` allégé via extraction de la toolbar dans `AppToolbar.tsx`.

Bug remonté par Baptiste sur un premier jet de la grille : le logo du club en pied de page débordait/semblait tronqué au bord de chaque miniature. Cause : les miniatures utilisaient `transform: scale()` dans un wrapper à hauteur fixe calculée nominalement (297mm × échelle), alors que le contenu réel de `PosterSheet` dépasse légèrement cette valeur — le footer se retrouvait coupé pile à la limite de clip. Remplacé par `zoom`, qui affecte aussi la taille de mise en page : le conteneur épouse désormais la vraie hauteur du contenu, sans jamais tronquer. Logo du club ajouté au passage dans le bandeau de nom sous chaque miniature.

Diagnostic secondaire pendant les tests agent-browser : le club sélectionné revenait au club par défaut sans action explicite entre deux commandes. Cause trouvée via `git status --short` — des captures d'écran passées sans chemin absolu atterrissaient à la racine du projet, surveillée par le dev server Vite en cours d'exécution, déclenchant un reload complet qui réinitialisait l'état React. Résolu en redirigeant systématiquement les captures vers le scratchpad de session ; pattern généralisé en learning global.

**Entrées clés :**

- [BDR-20260704194656-1](decisions/BDR-20260704194656-1.md) — Grille QA clubs : miniatures fidèles vs cartes simplifiées
- [ZBLK-20260704194656-5](archive/blockers/ZBLK-20260704194656-5.md) — Club revient au défaut sans action pendant tests agent-browser (résolu)

---

Ajout du logo du club dans le `Select` (trigger + items) pour retrouver son club plus vite dans la liste. Puis question de Baptiste sur l'absence de dégradé visible pour Le Mans FC comparé aux autres clubs : diagnostiqué comme un manque de contraste entre `primary`/`secondary` (deux rouges trop proches, saisis à la main) plutôt qu'un dégradé absent.

Ça a enclenché une refonte complète du script `extract-club-colors.ts` sur trois itérations successives, chacune révélée par un test visuel réel (agent-browser + screenshots comparatifs) plutôt que par le calcul seul :

1. Introduction de `primaryVariant` (2e stop du dégradé, dérivé du `primary`) et `secondaryVariant` (icône Extérieur, dérivé du `secondary` libéré pour le bandeau titre). Bug trouvé au passage : la branche "primary déjà très sombre" de `deriveVariantColor` éclaircissait systématiquement de +40%, sans marge de contraste restante pour les couleurs dérivées suivantes — plafonné à +16%.
2. Persistance du problème sur PSG/Lille/Angers/Monaco : cause réelle isolée par le calcul (luminance de `primary` lui-même, pas `secondary`, trop proche du plafond WCAG). Seuil `MIN_BG` resserré de 3:1 à 6:1.
3. FC Lorient (puis OGC Nice) restaient des cas cassés malgré tout : `secondary` et `accent` bruts sont deux gris déjà quasi identiques dans la palette extraite par colorthief — aucun seuil de contraste ne peut inventer une différence de teinte absente de la source. Fallback ajouté : si la distance RGB entre `secondaryVariant` et `accent` tombe sous 25, `secondaryVariant` est recalculé depuis le `primary` brut (plus saturé, couleur dominante du logo) à la place.

Deux patterns génériques (contrainte WCAG multi-fonds qui force vers le blanc ; distance RGB plus fiable que l'écart de teinte HSL pour détecter une collision perceptuelle) extraits en learnings pour réutilisation future, y compris hors de ce projet.

**Entrées clés :**

- [BDR-20260704-1](decisions/BDR-20260704-1.md) — Dégradé/icônes : `primaryVariant`/`secondaryVariant` dérivés, 3 itérations de correction
- [LRN-20260704201837-1](learnings/LRN-20260704201837-1.md) — Contraste WCAG multi-fonds → convergence forcée vers le blanc
- [LRN-20260704201837-2](learnings/LRN-20260704201837-2.md) — Distance RGB euclidienne > écart de teinte HSL
