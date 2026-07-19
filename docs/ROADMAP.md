# 🗺️ Roadmap — Affiche Calendrier (app web)

## Décisions techniques

| Sujet                          | Décision                                                                                                                                      |
| ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------- |
| Stack                          | Vite + React + TypeScript + Tailwind v4 + shadcn/ui                                                                                           |
| Portée                         | Outil perso d'abord (V1-V2) → public éventuellement (V3+), avec mention **"application non officielle"**                                      |
| Données calendrier             | JSON statique avec données fake (V1 dev) → données réelles saisies par Baptiste (V1 finale) → scraping/API (V2+)                              |
| Structure des données          | **1 fichier par {compétition}+{saison}** (ex. `ligue1-2627/matches.json`) — jamais un fichier par club, pour éviter la duplication des matchs |
| Cases de score                 | Saisissables dans l'app **ET** imprimables vides (mode "brouillon")                                                                           |
| Conflit score manuel / auto    | L'auto-fetch écrase toujours la saisie manuelle **si et seulement si il retourne une valeur non-vide** (jamais écraser avec un résultat null) |
| Couleurs                       | Le Mans FC en dur (V1) → couleurs dynamiques par club (V2+)                                                                                   |
| Logos clubs                    | Assets statiques `/public/logos/{competition}/{club}.png` (repo luukhopman) — licences à vérifier avant diffusion publique                    |
| Architecture compétitions      | Pas d'abstraction généraliste tant qu'une seule compétition est implémentée (cf. Backlog)                                                     |
| Impression                     | CSS print natif testé en conditions réelles d'abord → fallback `html2canvas`+`jsPDF` → `react-pdf` en tout dernier recours                    |
| Fraîcheur des données          | Timestamp affiché sur l'affiche : "Calendrier mis à jour le JJ/MM/AAAA à 00h00"                                                               |
| Monitoring pipeline de données | Heartbeat Uptime Kuma sur le cron RPi (détection de silent failure)                                                                           |

---

## Phase 0 — Setup projet

- [x] Init Vite + React + TypeScript
- [x] Tailwind CSS v4
- [x] shadcn/ui (select, button, tooltip…)
- [x] Structure de dossiers

```
src/
  adapters/        ← ligue1.ts pour l'instant, pas d'interface généraliste avant une 2e compétition
  components/
    poster/        ← composants de l'affiche (Header, MatchRow, MonthBlock…)
    ui/            ← shadcn
  data/
    ligue1-2627/    ← JSON statique, calendrier complet (tous clubs, toutes journées)
  hooks/
  lib/
  types/
public/
  logos/
    ligue1/        ← PNG 139×181 (repo luukhopman)
```

---

## Phase 1 — Affiche statique Le Mans FC (fidélité V1)

**Objectif** : reproduire l'affiche V1 HTML en React, pixel-perfect, en travaillant d'abord avec des données fake (structurellement identiques aux vraies), puis en substituant les vraies données transmises par Baptiste.

### 1.1 Données

- [x] Créer `src/data/ligue1-2627/matches.json` avec des données **fake** (34 journées × calendrier complet, pas seulement Le Mans FC) pour ne pas bloquer le développement UI — round-robin généré (18 clubs, aller-retour), dates étalées août→mai comme une vraie saison
- [x] Créer `src/types/match.ts` (interface `Match`, `Competition`, `Club`) — le type `Match` inclut dès le départ `journee`, `date`, `domicile`, `exterieur`, `score: { domicile: number | null; exterieur: number | null }`
- [x] Substituer les données fake par les vraies données — fait le 2026-07-18 via `scripts/sync-matches.ts` (Phase 6), fetch football-data.org (306 matchs, saison 2026-08-22 → 2027-05-29)

### 1.2 Composants affiche

- [x] `PosterSheet` — conteneur A4 (210×297mm, dégradé rouge)
- [x] `PosterHeader` — bandeau noir, titre, logos club + ligue
- [x] `PosterLegend` — pictos maison/avion (via `lucide-react`, déjà une dépendance)
- [x] `MonthBlock` — titre mois + liste matchs
- [x] `MatchRow` — date, logo adverse, cases score, picto D/E — structure `role="row"`/`role="cell"` (ARIA) plutôt que `<table>` littéral : un vrai `<table>` imbriqué dans le CSS Grid `.match-row` n'apportait aucun bug au final (vérifié), mais les divs + rôles ARIA restent plus simples à maintenir pour la même sémantique d'accessibilité
- [x] `ScoreBox` — 2 cases + tiret + libellé ordre score (dynamique selon D/E)
- [x] `PosterFooter` — texte légal + logo + timestamp de fraîcheur des données

### 1.3 Impression / export

- [x] `@page { size: A4 portrait; margin: 0 }`
- [x] Fond plein via `print-color-adjust: exact`
- [ ] **Test empirique réel** : impression physique (pas preview) sur Chrome + Firefox + Edge, sur au moins 2 imprimantes différentes — vérifier marge non-imprimable, rendu couleur, débordements (à faire par Baptiste, pas automatisable)
- [ ] Si le CSS print s'avère insuffisant → fallback `html2canvas` + `jsPDF` (réutilise le DOM/design existant, pas de réimplémentation)
- [ ] `react-pdf` uniquement si les deux options précédentes échouent réellement (coût : réimplémentation complète du design dans un moteur de rendu séparé)
- [x] Bouton "Imprimer"

> ✅ Dépassement mesuré empiriquement (`agent-browser`) à 307,12mm pour 297mm dispo (colonne la plus dense : 18 lignes/5 mois avec les données fake). Résolu en resserrant `MatchRow` (`py-[0.9mm]`→`py-[0.6mm]`) et `MonthBlock` (`mt-[2.5mm]`→`mt-[2mm]`) — contenu réel désormais à 286,4mm, soit 10,6mm de marge sous 297mm, ce qui couvre aussi le cas réel V1 (18 matchs/6 mois). Cf. [ZBLK-005](../.claude/memory/archive/blockers/ZBLK-005.md).
>
> ✅ Re-vérifié empiriquement (`agent-browser`) le 2026-07-04 après suppression du libellé sous `ScoreBox`, agrandissement des lignes (`py-[1.5mm]`) et des polices (date/match/header/footer) : la feuille reste calée à 297mm exacts, footer à ~3,5mm du bord bas (colonne la plus dense : 18 lignes/5 mois). Toujours sans marge de rechange excessive mais aucun débordement constaté.

### 1.4 Logos

- [x] Télécharger logos Ligue 1 26/27 depuis repo luukhopman → `/public/logos/ligue1/` (16 clubs saison courante + Troyes depuis `history/2022-23/`)
- [x] Logo LMFC + logo Ligue 1 McDonald's en `/public/logos/` — extraits directement des data URI base64 déjà embarquées dans `docs/affiche_lemans_A4_v8.html` (V1), pas besoin de redemander l'asset à Baptiste
- [x] Icônes Lucide `house` et `plane` intégrées via `lucide-react` (déjà une dépendance du projet, préféré au SVG `symbol`/`use` inline de la V1)
- [x] Vérifier les conditions d'usage des logos/marques avant toute diffusion publique (cf. Phase 7) — vérifié 2026-07-02, aucune autorisation trouvée, reste un blocker ouvert [BLK-001](../.claude/memory/blockers/BLK-001.md) tant que la mise en public n'est pas décidée

---

## Phase 2 — Spike de faisabilité données ✅

**Objectif** : valider une source de données fiable AVANT d'investir dans un scraping maison.

- [x] Tester des APIs foot gratuites/officielles pour Ligue 1 : openligadb, football-data.org, API-Football
- [x] Vérifier pour chaque candidate : fixtures **ET** résultats disponibles (pas juste le calendrier), délai de mise à jour des résultats, limites de requêtes/coût
- [x] Décision go/no-go : **football-data.org retenue** (code compétition `FL1`, endpoint `/matches`, plan gratuit 10 req/min) — voir [BDR-004](../.claude/memory/decisions/BDR-004.md)

> **Résultats du spike** (2026-07-02) :
>
> - **openligadb** → NO-GO : couverture Ligue 1 abandonnée depuis la saison 2017/2018, aucune donnée disponible pour 2026/2027.
> - **football-data.org** → **GO, retenue** : code compétition `FL1`, endpoint `/matches` unique (fixtures + scores), plan gratuit 10 req/min, scores non temps réel sur ce plan, mais **saison en cours accessible**.
> - **API-Football** → GO sur la doc lue... **invalidé empiriquement le 2026-07-18** : le plan gratuit refuse l'accès à la saison en cours (`errors.plan`), la doc publique consultée lors du spike ne mentionnait pas cette restriction (cf. [LRN-019](../.claude/memory/learnings/LRN-019.md)). Écarté pour un outil perso (nécessiterait un plan payant).
> - Aucune des deux options GO n'offre de garantie de SLA/uptime — le pipeline (Phase 6) doit prévoir un fallback sur les données précédentes en cas d'échec ponctuel (déjà planifié).

---

## Phase 3 — Sélection de club dynamique ✅

**Objectif** : choisir n'importe quel club Ligue 1, générer l'affiche avec les bonnes données.

- [x] Dropdown de sélection club (shadcn/ui `Select` ou `Combobox`)
- [x] Filtrage côté client du fichier `ligue1-2627/matches.json` selon le club sélectionné (`domicile === clubId || exterieur === clubId`) — pas d'abstraction `CompetitionAdapter` nécessaire pour ça
- [x] Affichage du bon logo adverse pour chaque match
- [x] Répartition automatique des mois en 2 colonnes équilibrées

---

## Phase 4 — Couleurs dynamiques par club ✅

**Objectif** : adapter la palette de l'affiche aux couleurs du club sélectionné.

- [x] Créer un champ `colors: { primary, secondary, accent }` dans l'interface `Club`
- [x] Alimenter les couleurs via colorthief (extraction automatique depuis les logos PNG) pour chaque club Ligue 1 26/27 — données baked dans `clubs.json`, script one-shot supprimé après usage
- [x] Injecter les couleurs via CSS variables (`--club-primary`, `--club-secondary`, `--club-accent`) sur le conteneur racine de l'affiche via `clubColorVars()` dans `lib/poster.ts`
- [ ] Tester le rendu impression avec plusieurs clubs (test physique à faire par Baptiste)

---

## Phase 5 — Saisie de scores dans l'app ✅

**Objectif** : permettre à l'utilisateur qui le souhaite de saisir les scores directement dans l'app, en comblant le délai entre la fin d'un match et le prochain passage du pipeline de données (Phase 6).

- [x] `ScoreBox` devient cliquable → `<input type="number" min="0" max="99" />` avec `<label>` associé
- [x] Persistance locale des scores saisis (`localStorage` par **compétition/saison**, pas par club — un match a un seul score peu importe l'affiche depuis laquelle on le consulte)
- [x] **Règle de priorité** : si le JSON canonique (committé par le pipeline Phase 6) a un score non-null pour un match, il est toujours affiché en priorité et écrase la valeur locale — le `localStorage` ne sert que tant que le score canonique est `null`
- [x] Mode "impression vide" (cases vides, pour remplir au stylo) vs "impression remplie" (scores saisis/récupérés)
- [x] Toggle dans l'UI : "Imprimer vide" / "Imprimer avec scores"

---

## Phase 6 — Pipeline de données réelles

**Objectif** : maintenir `ligue1-2627/matches.json` à jour, dates et scores compris, tout au long de la saison.

- [x] Si une API viable a été retenue en Phase 2 : intégration directe (pas de scraping custom) — fait le 2026-07-18 : `scripts/sync-matches.ts` (`pnpm sync-matches`), fetch football-data.org, mapping team ID → slug club inline, garde anti-null (ne jamais écraser un score existant par un `null` API). Lancé manuellement pour l'instant (scope choisi : script manuel d'abord, avant d'automatiser).
- [x] Si aucune API viable : scraping unique en début de saison de la structure du calendrier (34 journées, appariements, dates encore provisoires — les droits TV ne sont pas tous attribués à ce stade) — **sans objet**, football-data.org retenu
- [x] Script planifié via PM2 (`cron_restart`) sur le Raspberry Pi 5, en réutilisant l'infra PM2 déjà en place pour d'autres tâches planifiées — récupère **scores ET dates mises à jour**, fréquence à définir par compétition (ex. lundi pour Ligue 1) — `ecosystem.config.cjs` écrit (cron lundi 6h, `--push`), reste à déployer sur le Pi (clé de déploiement SSH, `.env.local`, `pm2 start`)
- [x] Le script commit + push automatiquement le JSON mis à jour → redéploiement Vercel automatique — code fait le 2026-07-18 (`pushToGit()`, flag `--push`, `execFileSync` git add/commit/push, no-op si aucun diff), **pas encore exercé en conditions réelles** : nécessite la clé de déploiement dédiée sur le Pi (cf. item PM2 ci-dessus)
- [x] Mise à jour du timestamp affiché sur l'affiche ("mis à jour le...") — fait le 2026-07-18 : le script écrit `src/data/ligue1-2627/meta.json` (`updatedAt` formaté fr-FR), exposé via `ligue1UpdatedAt` dans l'adapter, remplace la constante hardcodée dans `App.tsx`
- [x] **Distinguer les erreurs par catégorie dans les try/catch**, pas juste attraper globalement — fait le 2026-07-18 : `NetworkError` (échec `fetch`), `HttpError` (status non-ok), `StructureError` (réponse vide/count ≠ 306, team ID inconnu, clé API manquante), `GitPushError` (échec commit/push) — catch top-level, log `[Catégorie] message`, `process.exitCode = 1`
- [x] Heartbeat Uptime Kuma sur ce cron : push actif d'un état "down" avec la catégorie d'erreur dans le message dès le `catch` — fait le 2026-07-18 : `pushHeartbeat()` best-effort vers `UPTIME_KUMA_PUSH_URL` (no-op si var absente), appelé en succès (`up`) et en échec (`down` + catégorie), **URL réelle à configurer** une fois l'instance Uptime Kuma du Pi identifiée
- [x] `maxRestarts`/backoff sur la config PM2 — fait le 2026-07-18 : `ecosystem.config.cjs` (`max_restarts: 3`, `restart_delay: 60000`, `exp_backoff_restart_delay: 100`), pas encore déployé
- [x] Fallback sur données précédentes si une exécution échoue (ne jamais écraser avec un résultat vide) — déjà garanti structurellement : `writeFileSync` n'intervient qu'après validation complète (aucune écriture si une erreur catégorisée est levée avant), renforcé le 2026-07-18 par la validation stricte `matches.length === 306`

> ⚠️ Constaté le 2026-07-18 : football-data.org renvoie une date/heure **placeholder identique pour tous les matchs d'une même journée** tant que le calendrier officiel n'est pas resynchronisé côté fournisseur (vérifié sur la journée 1, 5 semaines à l'avance — ligue1.com avait déjà les vraies dates). Décision : pas de scraping complémentaire pour corriger ça, on relance `pnpm sync-matches` plus près de chaque journée pour récupérer les dates au fur et à mesure qu'elles se confirment. Le poster n'affiche que la date/jour (pas d'heure de coup d'envoi), donc l'impact reste limité. Cf. [LRN-020](../.claude/memory/learnings/LRN-020.md).

---

## Phase 7 — Mise en public

**Objectif** : passer du statut outil perso à outil partageable, une fois les phases précédentes stabilisées.

- [x] Ajouter le disclaimer "Application non officielle — projet de fan, tous droits réservés à leurs propriétaires respectifs" — fait dans `PosterFooter.tsx`
- [x] Vérifier les conditions d'usage des logos clubs/ligue (cf. Phase 1.4) — vérifié, aucune autorisation trouvée (ni sur le repo source, ni via la LFP) : cf. [BLK-001](../.claude/memory/blockers/BLK-001.md), risque accepté pour procéder à la Phase 7 ([BDR-014](../.claude/memory/decisions/BDR-014.md))
- [ ] Confirmer l'hébergement définitif (Vercel) et le domaine
- [x] Partage direct de l'affiche via URL paramétrique (`?club=lemans`) — les scores affichés viennent du JSON canonique, pas d'un état à embarquer dans l'URL. Paramètre `saison` non ajouté : une seule saison existe en données pour l'instant, à ajouter seulement si une 2e saison est un jour supportée

---

## Dépendances entre phases (travail à 2)

**Objectif** : permettre à 2 devs (2 PC) de bosser en parallèle sans se marcher dessus. Une branche courte par phase/tâche + PR vers `main`, pas de workflow git plus lourd que ça pour un projet à 2.

| Phase                                                     | Bloquée par                          | Peut tourner en parallèle avec | Fichiers principaux touchés                                                                     |
| --------------------------------------------------------- | ------------------------------------ | ------------------------------ | ----------------------------------------------------------------------------------------------- |
| **1 (reste)** — vraies données + test impression physique | —                                    | 2, 3, 5                        | `data/ligue1-2627/matches.json`, impression physique (non parallélisable en soi, solo Baptiste) |
| **2** — spike API foot                                    | —                                    | 1, 3, 5                        | Aucun fichier du repo (recherche/tests externes)                                                |
| **3** — sélection club dynamique                          | Structure JSON déjà figée (1.1 fait) | 1 (reste), 2, 5                | `adapters/ligue1.ts`, nouveau composant `Select`                                                |
| **5** — saisie de scores dans l'app                       | `ScoreBox` existant (fait)           | 1 (reste), 2, 3                | `components/poster/ScoreBox.tsx`, nouveau hook `localStorage`                                   |
| **4** — couleurs dynamiques                               | 3 (besoin du club sélectionné)       | —                              | `types/match.ts` (`Club.colors`), CSS variables                                                 |
| **6** — pipeline de données réelles                       | 2 (décision go/no-go API)            | —                              | `scripts/scrape-ligue1.ts`, `data/ligue1-2627/matches.json`                                     |
| **7** — mise en public                                    | Toutes les précédentes stabilisées   | —                              | —                                                                                               |

⚠️ **Point de friction** : `matches.json`/`clubs.json` sont des fichiers uniques partagés — éviter que les 2 devs les éditent en même temps (conflits Git sur du JSON). Se coordonner avant d'y toucher, même entre phases "parallèles".

---

## Backlog / idées futures

- **Généralisation multi-compétitions** (`CompetitionAdapter`, Ligue 2, Ligue 3, Basket Pro A, Pro B, Top 14…) — à concevoir **seulement** au moment d'implémenter une 2e compétition réelle, jamais à partir d'un seul cas (Ligue 1). Ne pas anticiper la forme de l'interface avant d'avoir au moins deux implémentations concrètes sous les yeux.
- Variantes d'affiche (portrait/paysage, format A3)
- Export PNG (déjà couvert si `html2canvas` est retenu en Phase 1.3)

---

## En cours

> Phases 0 à 5 terminées et mergées sur `main`. **Phase 1.1 close le 2026-07-18** : `scripts/sync-matches.ts` (`pnpm sync-matches`) a remplacé le round-robin fake par les 306 vrais matchs 2026-2027 (fetch football-data.org), clôturant du même coup le 1er point de la Phase 6 (intégration API directe). Source retenue en Phase 2 corrigée le même jour : API-Football invalidée à l'usage (plan gratuit sans accès à la saison en cours, cf. [LRN-019](../.claude/memory/learnings/LRN-019.md)), pivot vers football-data.org — voir [BDR-004](../.claude/memory/decisions/BDR-004.md) mis à jour et [BDR-012](../.claude/memory/decisions/BDR-012.md) pour les choix du script (mapping team ID inline, garde anti-null, scope manuel assumé). Limitation connue et acceptée : dates placeholder pour les journées lointaines tant que football-data.org ne les a pas resynchronisées (cf. note Phase 6 ci-dessus, [LRN-020](../.claude/memory/learnings/LRN-020.md)).
>
> **Reste à faire** : (1) test d'impression physique multi-navigateurs/imprimantes par Baptiste (1.3/4, toujours différé — décision du 2026-07-18 : après mise en place du script de données réelles, ce qui est maintenant fait, donc prochain jalon naturel) ; (2) automatisation Phase 6 — cron PM2 RPi, commit+push auto, timestamp affiché, catégorisation fine des erreurs, heartbeat Uptime Kuma (`sync-matches.ts` existe déjà et sera réutilisé tel quel, scope manuel choisi pour l'instant) ; (3) Phase 7 (mise en public), bloquée par [BLK-001](../.claude/memory/blockers/BLK-001.md) (licences logos, non résolu).
