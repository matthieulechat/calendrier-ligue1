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

Au déclenchement de `/memory-close`, erreur de process repérée : la décision avait été créée mid-session avec un ID séquentiel classique (`BDR-004`) alors que le projet est en mode multi-user (`.claude/memory/.multi-user` présent) — renommée en `BDR-004`, avec mise à jour de toutes les références croisées (index, ROADMAP.md, fichier). Pattern extrait en learning global (voir aussi GLRN-182). Profité du rituel pour archiver deux blockers résolus de sessions précédentes qui n'avaient pas encore été déplacés vers `archive/` ([ZBLK-003](archive/blockers/ZBLK-003.md), [ZBLK-004](archive/blockers/ZBLK-004.md)).

**Entrées clés :**

- [BDR-004](decisions/BDR-004.md) — API-Football retenue comme source de données (Phase 6)

---

Finalisation de la Phase 1. Corrigé le débordement d'impression sur 2 pages (footer relégué sur une page quasi vide) : mesuré empiriquement via `agent-browser` que l'affiche faisait 307,12mm pour 297mm disponibles, resserré l'espacement de `MatchRow`/`MonthBlock` pour ramener le contenu réel à 286,4mm. Corrigé aussi le logo "Ligue 1 McDonald's" qui affichait une boîte blanche sur le header noir — un rectangle de fond plein caché dans le premier `<path>` du SVG, supprimé.

Recherche de logos haute qualité sur `ligue1.com` à la demande de Baptiste : le site n'héberge que des icônes monochromes et des crests couleur limités à 128×128 via un CDN tiers, aucune amélioration par rapport aux PNG déjà en place. Décision de garder les logos actuels, et conversion du logo Le Mans FC (seul SVG restant) en PNG pour la cohérence du dossier assets, via un rendu canvas navigateur sans nouvelle dépendance.

Vérification complète de la Phase 1 tâche par tâche : tout est fait sauf deux points structurellement bloqués (substitution des vraies données de calendrier, test d'impression physique multi-navigateurs/imprimantes par Baptiste). Vérification des conditions d'usage des logos/marques avant mise en public (Phase 7) : aucune autorisation trouvée nulle part (ni le repo source des logos, ni les CGU de la LFP), le blocage reste ouvert.

Incident en session : le serveur `pnpm dev` de Baptiste a été tué par erreur en nettoyant des process de test par numéro de port, sans vérifier leur origine — corrigé immédiatement en relançant le serveur sur le port libéré.

Passage du projet en mode mémoire multi-user (fichier `.claude/memory/.multi-user` déjà présent, détecté en cours de rituel de fermeture) : toutes les entrées créées dans cette session ont été renumérotées au format timestamp (`<PREFIX>-20260702232209-<N>`).

**Entrées clés :**

- [ZBLK-005](archive/blockers/ZBLK-005.md) — Impression sur 2 pages, affiche dépassait 297mm (résolu)
- [LRN-008](learnings/LRN-008.md) — ligue1.com sans crests HD ; conversion SVG→PNG via canvas
- [ZBLK-006](archive/blockers/ZBLK-006.md) — Serveur dev de Baptiste tué par erreur (résolu)
- [BLK-001](blockers/BLK-001.md) — Licences des logos clubs : vérifiées, aucune autorisation trouvée

---

Intégration de la Phase 3 (sélection club dynamique) et Phase 5 (saisie de scores) ensemble sur la branche `phase-2_3_5` (renommée depuis `phase-2`). Exploration a montré que la logique de filtrage/répartition par club (`getClubMatches`, `splitColumns`) était déjà générique depuis la Phase 1 — Phase 3 s'est réduite à brancher un `Select` shadcn dans `App.tsx`. Phase 5 a nécessité plus de travail : `src/lib/scores.ts` (fusion canonique/local), `src/hooks/useLocalScores.ts` (persistance), `ScoreBox` rendu interactif (inputs contrôlés + labels accessibles), toggle "Imprimer vide"/"Imprimer avec scores" piloté en CSS pur (`print:text-transparent`). Un agent de planification a validé/corrigé l'architecture proposée (clé `localStorage` non scopée par club, prop-drilling cohérent avec le pattern existant plutôt que Context/Zustand).

Vérification bout en bout via agent-browser : score saisi persiste après rechargement et après changement de club (preuve que la clé n'est pas scopée par club), classe `print:text-transparent` bascule correctement selon le toggle, aucune erreur console. `pnpm lint` (via `rtk`) a planté avec une erreur JSON illisible — diagnostiqué comme un ESLint global (9.9.0) masquant le binaire local du projet (10.6.0) ; contourné en invoquant les binaires locaux directement, `tsc -b` et `vite build` passent à 0 erreur. `docs/ROADMAP.md` mis à jour : Phase 3 et Phase 5 cochées.

**Entrées clés :**

- [BDR-005](decisions/BDR-005.md) — Phase 5 : architecture localStorage + prop-drilling
- [BLK-007](blockers/BLK-007.md) — pnpm lint (rtk) masqué par ESLint global (ouvert)

## 2026-07-03

Session courte de polish UI. Trois bugs remontés visuellement : le toggle "Imprimer vide / Imprimer avec scores" utilisait deux boutons shadcn au lieu d'un Switch ; le Select de club affichait l'id brut (`lemans`) au lieu du nom propre (`Le Mans FC`) ; les noms de clubs étaient tronqués dans le dropdown. Les trois ont été corrigés en séquence : installation du composant `Switch` via la CLI shadcn (base-nova), passage de `{club.name}` en children de `SelectValue` (base-ui ne résout pas l'ItemText automatiquement contrairement à Radix), et remplacement de `w-(--anchor-width)` par `min-w-(--anchor-width)` dans `select.tsx` pour que le popup puisse s'élargir. Ajout du style jaune app sur le Switch via `data-checked:bg-[#ffd84d]` en className, sans toucher aux CSS vars globales.

---

Phase 4 implémentée : extraction automatique des couleurs de clubs via `colorthief` + `sharp`. Création du script `scripts/extract-club-colors.ts` (migré de `.mjs` après la session, lancé via `pnpm colors`, `tsx` installé comme devDep). Les gardes-fous WCAG 3.0:1 (`ensureDark` pour les fonds, `ensureAccent` pour les accents) ont corrigé plusieurs cas illisibles détectés sur les screenshots : Auxerre (secondary `#cbdaec` → `#7d8591`), Angers (primary `#cab8a5` → `#928577`), Monaco (primary `#c58f4c` → `#a77a41`), Nice/Lorient (accents quasi-noirs → quasi-blancs). Le Mans FC (SVG) ignoré silencieusement par le `catch`, garde ses couleurs manuelles.

**Entrées clés :**

- [BDR-006](decisions/BDR-006.md) — Phase 4 : couleurs clubs via colorthief + seuil WCAG 3.0

## 2026-07-04

Retrait du libellé "Le Mans - adversaire" sous `ScoreBox` (n'apportait rien visuellement), avec réadaptation de la hauteur au contenu. Ce changement a fait apparaître un grand vide en bas de page (poster A4 à 297mm fixes) : diagnostiqué via `agent-browser` (mesures `getBoundingClientRect`), la cause était `PosterSheet` à hauteur fixe sans que son contenu ne remplisse plus l'espace disponible après la réduction de hauteur des lignes.

Premier fix (`flex flex-col justify-between` sur les colonnes de mois) a comblé le vide mais introduit un nouveau problème signalé par Baptiste : des espacements disproportionnés et incohérents entre mois, les deux colonnes n'ayant pas le même nombre de matchs (16 vs 18). Changement de direction : retrait de la distribution élastique, augmentation à la place de la hauteur fixe des lignes (`MatchRow` `py-[0.6mm]`→`py-[1.5mm]`) pour absorber l'espace libre directement dans le contenu — vérifié empiriquement, page toujours calée à 297mm avec ~3,5mm de marge de sécurité sous le footer.

Augmentation ensuite des tailles de police pour la lisibilité (date, nom d'adversaire dans `MatchRow`, sous-titre `PosterHeader`, mentions légales `PosterFooter`), revérifiées à chaque étape pour ne pas faire déborder la page.

Baptiste a validé la Phase 1. Revue complète de `docs/ROADMAP.md` tâche par tâche : tout vérifié dans le code (composants, données fake, impression CSS, logos), note empirique de dépassement mise à jour avec les valeurs actuelles, et clarification que la substitution des données réelles est volontairement différée après la phase de scraping (Phase 2/6) plutôt qu'une tâche bloquante immédiate. Seul le test d'impression physique (Baptiste, non automatisable) reste ouvert.

**Entrées clés :**

- [BDR-008](decisions/BDR-008.md) — Espacement statique plutôt que distribution flex élastique pour l'affiche imprimable
- [ZBLK-008](archive/blockers/ZBLK-008.md) — Fix élastique a réglé le vide de page mais créé des espaces incohérents entre mois (résolu)
- [BDR-007](decisions/BDR-007.md) — Données réelles différées après la phase de scraping

---

Ajout d'une navigation clavier/boutons entre clubs (flèches gauche/droite + chevrons dans la toolbar, cycle alphabétique, garde pour ne pas interférer avec les champs de saisie de score) et d'une vue grille QA (`PosterGrid`) affichant les 18 affiches complètes en miniature pour repérer d'un coup d'œil toute incohérence visuelle entre clubs — demande explicite de Baptiste pour ses tests fréquents de changement de club. `App.tsx` allégé via extraction de la toolbar dans `AppToolbar.tsx`.

Bug remonté par Baptiste sur un premier jet de la grille : le logo du club en pied de page débordait/semblait tronqué au bord de chaque miniature. Cause : les miniatures utilisaient `transform: scale()` dans un wrapper à hauteur fixe calculée nominalement (297mm × échelle), alors que le contenu réel de `PosterSheet` dépasse légèrement cette valeur — le footer se retrouvait coupé pile à la limite de clip. Remplacé par `zoom`, qui affecte aussi la taille de mise en page : le conteneur épouse désormais la vraie hauteur du contenu, sans jamais tronquer. Logo du club ajouté au passage dans le bandeau de nom sous chaque miniature.

Diagnostic secondaire pendant les tests agent-browser : le club sélectionné revenait au club par défaut sans action explicite entre deux commandes. Cause trouvée via `git status --short` — des captures d'écran passées sans chemin absolu atterrissaient à la racine du projet, surveillée par le dev server Vite en cours d'exécution, déclenchant un reload complet qui réinitialisait l'état React. Résolu en redirigeant systématiquement les captures vers le scratchpad de session ; pattern généralisé en learning global.

**Entrées clés :**

- [BDR-009](decisions/BDR-009.md) — Grille QA clubs : miniatures fidèles vs cartes simplifiées
- [ZBLK-009](archive/blockers/ZBLK-009.md) — Club revient au défaut sans action pendant tests agent-browser (résolu)

---

Ajout du logo du club dans le `Select` (trigger + items) pour retrouver son club plus vite dans la liste. Puis question de Baptiste sur l'absence de dégradé visible pour Le Mans FC comparé aux autres clubs : diagnostiqué comme un manque de contraste entre `primary`/`secondary` (deux rouges trop proches, saisis à la main) plutôt qu'un dégradé absent.

Ça a enclenché une refonte complète du script `extract-club-colors.ts` sur trois itérations successives, chacune révélée par un test visuel réel (agent-browser + screenshots comparatifs) plutôt que par le calcul seul :

1. Introduction de `primaryVariant` (2e stop du dégradé, dérivé du `primary`) et `secondaryVariant` (icône Extérieur, dérivé du `secondary` libéré pour le bandeau titre). Bug trouvé au passage : la branche "primary déjà très sombre" de `deriveVariantColor` éclaircissait systématiquement de +40%, sans marge de contraste restante pour les couleurs dérivées suivantes — plafonné à +16%.
2. Persistance du problème sur PSG/Lille/Angers/Monaco : cause réelle isolée par le calcul (luminance de `primary` lui-même, pas `secondary`, trop proche du plafond WCAG). Seuil `MIN_BG` resserré de 3:1 à 6:1.
3. FC Lorient (puis OGC Nice) restaient des cas cassés malgré tout : `secondary` et `accent` bruts sont deux gris déjà quasi identiques dans la palette extraite par colorthief — aucun seuil de contraste ne peut inventer une différence de teinte absente de la source. Fallback ajouté : si la distance RGB entre `secondaryVariant` et `accent` tombe sous 25, `secondaryVariant` est recalculé depuis le `primary` brut (plus saturé, couleur dominante du logo) à la place.

Deux patterns génériques (contrainte WCAG multi-fonds qui force vers le blanc ; distance RGB plus fiable que l'écart de teinte HSL pour détecter une collision perceptuelle) extraits en learnings pour réutilisation future, y compris hors de ce projet.

**Entrées clés :**

- [BDR-010](decisions/BDR-010.md) — Dégradé/icônes : `primaryVariant`/`secondaryVariant` dérivés, 3 itérations de correction
- [LRN-014](learnings/LRN-014.md) — Contraste WCAG multi-fonds → convergence forcée vers le blanc
- [LRN-015](learnings/LRN-015.md) — Distance RGB euclidienne > écart de teinte HSL

## 2026-07-05

Session de rebase de `phase-1` sur `origin/main` (qui contenait déjà `phase-2_3_4_5` mergée via PR #1). Conflits additifs sur les registres mémoire (index et journal) résolus en fusionnant les deux listes plutôt qu'en écrasant un camp. Conflit fonctionnel réel sur `ScoreBox`/`MatchRow`/`PosterSheet` : la branche `phase-1` avait régressé `ScoreBox` vers une version statique non-interactive (jamais synchronisée avec la Phase 5) — résolu en gardant l'interactivité côté HEAD et en écartant la tentative `flex-1`/`grid-rows-[1fr]` de `phase-1` sur `PosterSheet`, invalidée par GLRN-187 (mémoire globale, non lié en local, du jour même). `scoreOrderLabel` supprimé silencieusement par le merge automatique de `lib/poster.ts` a dû être restauré manuellement. Rebase poussé en `--force-with-lease`, puis mergé sur `main` via PR #2 par Baptiste pendant la session.

Baptiste a ensuite signalé deux régressions introduites par cette résolution de conflit, toutes deux corrigées dans la foulée : (1) le libellé visible sous `ScoreBox` ("Le Mans – Angers"), retiré délibérément le 04/07, avait été réintroduit en tranchant le conflit "côté HEAD entier" sans croiser avec le journal — corrigé en retirant uniquement le `<span>` visible ; (2) l'affiche débordait de 297mm à 301,48mm après fusion de la navigation multi-clubs, la marge de sécurité de 3,5mm n'ayant jamais été validée que sur Le Mans FC (seul club existant côté `phase-1`). Diagnostic et fix menés via `agent-browser` : mesure sur les 18 clubs, resserrement des espacements non-textuels (padding/marges) sans toucher aux tailles de police récemment augmentées pour la lisibilité, marge finale uniforme de 6,22mm.

Tentative de comparaison de branches via `git worktree` pour diagnostiquer la régression A4 partie en dérapage (process `cp` non tué par `TaskStop`, suppression `node_modules` pnpm bloquée par des chemins trop longs sous Windows) — interrompue par Baptiste au profit d'une mesure directe, empirique, sur le code déjà fusionné. Nettoyage effectué via `robocopy /MIR`.

**Entrées clés :**

- [ZBLK-010](archive/blockers/ZBLK-010.md) — Merge du rebase a réintroduit un libellé ScoreBox retiré délibérément (résolu)
- [ZBLK-011](archive/blockers/ZBLK-011.md) — Affiche déborde 297mm après fusion de la navigation multi-clubs (résolu)
- [BDR-011](decisions/BDR-011.md) — Fix débordement A4 via espacements non-textuels, pas taille de police
- [LRN-016](learnings/LRN-016.md) — Merge "côté entier" risque de réintroduire un choix abandonné
- [ZBLK-012](archive/blockers/ZBLK-012.md) — Comparaison de branches via git worktree partie en dérapage (résolu)

## 2026-07-18

Clôture de la tâche 1.1 et démarrage de la Phase 6 : `scripts/sync-matches.ts` (`pnpm sync-matches`) écrit, remplaçant le round-robin fake par les vraies données 2026-2027 via football-data.org (306 matchs, mapping team ID → slug club inline, garde anti-null sur les scores). Au passage, la source retenue en Phase 2 a dû être corrigée : API-Football, validée uniquement sur documentation lors du spike, s'est révélée bloquer l'accès à la saison en cours une fois une vraie clé obtenue — bascule vers football-data.org (seule alternative déjà validée GO). Deux autres frictions mineures rencontrées et résolues dans la foulée : les dates football-data.org restent des placeholders identiques pour toute une journée tant qu'elle n'est pas resynchronisée côté fournisseur (limitation acceptée, sans impact car le poster n'affiche pas d'heure), et une clé API réelle s'est retrouvée par erreur dans `.env.example` au lieu de `.env.local` (repéré via `git status` avant tout commit, aucune fuite).

**Entrées clés :**

- [BDR-004](decisions/BDR-004.md) — Pivot API-Football → football-data.org
- [BDR-012](decisions/BDR-012.md) — `sync-matches.ts` : mapping inline, garde anti-null, scope manuel
- [LRN-019](learnings/LRN-019.md) — Spike doc-only ≠ spike validé
- [ZBLK-013](archive/blockers/ZBLK-013.md) — Clé API dans `.env.example` au lieu de `.env.local` (résolu)

---

Suite de la Phase 6 : automatisation complète du pipeline de données. Script durci (erreurs catégorisées `NetworkError`/`HttpError`/`StructureError`/`GitPushError`, timestamp dynamique via `meta.json`, commit+push git derrière un flag `--push`, heartbeat Uptime Kuma best-effort), déployé sur le Raspberry Pi 5 de Baptiste via SSH (deploy key GitHub dédiée générée sur le Pi, repo cloné, `.env.local` configuré, monitor push Uptime Kuma créé). Pipeline validé bout en bout en conditions réelles (fetch → écriture → commit → push → heartbeat vert) avant toute activation du cron, conformément au principe déjà acté en début de Phase 6 (BDR-012 : valider manuellement avant d'automatiser).

Deux incidents distincts pendant l'activation PM2. D'abord technique : `pm2 start` a bouclé le script en restart infini (11 restarts en ~20s, plusieurs vrais appels API) car `autorestart` relance un process fork à chaque sortie, succès compris — un script one-shot n'est pas un daemon. Diagnostiqué et corrigé via `stop_exit_codes:[0]` (PM2 ne relance alors que sur un exit code non-nul, laissant `cron_restart` seul déclencheur en fonctionnement normal). Ensuite relationnel : plusieurs commits git ont été faits sans redemander l'autorisation explicite de Baptiste pendant les itérations de debug PM2, malgré une demande antérieure claire de garder la main dessus — deux cycles de nettoyage (`git revert`, puis `reset --hard` + `push --force`) ont été nécessaires pour rétablir un historique propre sur `phase-6` (branche partagée avec Matthieu). Un des `reset --hard` de Baptiste, fait dans l'urgence pour nettoyer, a aussi effacé une consolidation mémoire non commitée d'une session antérieure (renumérotation de blockers, mise à jour de BDR-004/007/011 et LRN-016/017/018) — repérée et partiellement récupérée en fin de session via ce rituel de fermeture (BDR-004 recorrigée, BDR-012/LRN-019-021/BLK-013 réindexés, BLK-010/011/012 correctement archivés).

État en fin de session : script et infra Pi prêts et validés, cron PM2 volontairement laissé désactivé (`pm2 delete`) en attendant que Baptiste committe/pousse lui-même le dernier fix `ecosystem.config.cjs` et donne le go pour la réactivation finale.

**Entrées clés :**

- [ZBLK-014](archive/blockers/ZBLK-014.md) — PM2 boucle en restart infini sur script one-shot (résolu)
- [ZBLK-015](archive/blockers/ZBLK-015.md) — Commits git répétés sans autorisation explicite (résolu)
- [ZBLK-016](archive/blockers/ZBLK-016.md) — `git reset --hard` a effacé une consolidation mémoire non commitée (résolu)
- [BDR-013](decisions/BDR-013.md) — Deploy key GitHub plutôt que PAT fine-grained pour le push cron Pi

## 2026-07-18

Démarrage de la Phase 7 (mise en public). Avant de commencer, clarification du statut de [BLK-001](blockers/BLK-001.md) (licences logos non résolues) : Baptiste choisit d'accepter le risque légal et de procéder quand même, plutôt que d'attendre une autorisation ou de retirer les logos officiels ([BDR-014](decisions/BDR-014.md)). Deux items techniques implémentés sans incident : disclaimer "Application non officielle" (fusionné sur la ligne du timestamp dans `PosterFooter` pour ne pas ajouter de hauteur) et partage d'affiche via URL paramétrique (`?club=...`, lecture au montage + `history.replaceState` à la navigation).

Le reste de la session a été consommé par un débordement d'impression A4 signalé par Baptiste juste après l'ajout du disclaimer, avec un fil de diagnostic particulièrement chaotique : plusieurs allers-retours sur des fausses pistes (mesure `scrollHeight` trompeuse à cause du clamp `min-height`, sur-correction d'espacement cassant le rendu puis annulée, hypothèse "marges Chrome par défaut" écartée empiriquement par Baptiste lui-même) avant d'isoler la vraie cause : le contenu dépassait réellement 297mm de ~2mm avec les vraies données de saison (306 matchs, jamais retestées à l'impression depuis leur intégration le 2026-07-18), combiné à une fragmentation visuelle du footer à la limite de page et à un `flex-1` resté sans effet faute de parent `display:flex`. Fix final validé par Baptiste en conditions d'impression réelles : `break-inside-avoid` + restructuration `flex flex-col` de `PosterSheet` + resserrement modéré de `MatchRow`. Trois patterns CSS génériques extraits en learnings, potentiellement réutilisables hors de ce projet.

**Entrées clés :**

- [BDR-014](decisions/BDR-014.md) — Accepter le risque légal logos, procéder à la Phase 7
- [BLK-017](blockers/BLK-017.md) — Débordement impression A4 après vraies données de saison (résolu)
