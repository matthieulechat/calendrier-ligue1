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

- [ ] Créer `src/data/ligue1-2627/matches.json` avec des données **fake** (34 journées × calendrier complet, pas seulement Le Mans FC) pour ne pas bloquer le développement UI
- [ ] Créer `src/types/match.ts` (interface `Match`, `Competition`, `Club`) — le type `Match` inclut dès le départ `journee`, `date`, `domicile`, `exterieur`, `score: { domicile: number | null; exterieur: number | null }`
- [ ] Substituer les données fake par les vraies données (transmises par Baptiste dans une prochaine étape)

### 1.2 Composants affiche

- [ ] `PosterSheet` — conteneur A4 (210×297mm, dégradé rouge)
- [ ] `PosterHeader` — bandeau noir, titre, logos club + ligue
- [ ] `PosterLegend` — pictos maison/avion
- [ ] `MonthBlock` — titre mois + liste matchs
- [ ] `MatchRow` — date, logo adverse, cases score, picto D/E — structure sémantique `<table>`/`<tr>` plutôt que divs (accessibilité + sens)
- [ ] `ScoreBox` — 2 cases + tiret + libellé ordre score (dynamique selon D/E)
- [ ] `PosterFooter` — texte légal + logo + timestamp de fraîcheur des données

### 1.3 Impression / export

- [ ] `@page { size: A4 portrait; margin: 0 }`
- [ ] Fond plein via `print-color-adjust: exact`
- [ ] **Test empirique réel** : impression physique (pas preview) sur Chrome + Firefox + Edge, sur au moins 2 imprimantes différentes — vérifier marge non-imprimable, rendu couleur, débordements
- [ ] Si le CSS print s'avère insuffisant → fallback `html2canvas` + `jsPDF` (réutilise le DOM/design existant, pas de réimplémentation)
- [ ] `react-pdf` uniquement si les deux options précédentes échouent réellement (coût : réimplémentation complète du design dans un moteur de rendu séparé)
- [ ] Bouton "Imprimer"

### 1.4 Logos

- [ ] Télécharger logos Ligue 1 26/27 depuis repo luukhopman → `/public/logos/ligue1/`
- [ ] Logo LMFC + logo Ligue 1 McDonald's en `/public/logos/`
- [ ] Icônes Lucide `house` et `plane` intégrées en SVG inline (symbol/use)
- [ ] Vérifier les conditions d'usage des logos/marques avant toute diffusion publique (cf. Phase 7)

---

## Phase 2 — Spike de faisabilité données

**Objectif** : valider une source de données fiable AVANT d'investir dans un scraping maison.

- [ ] Tester des APIs foot gratuites/officielles pour Ligue 1 : openligadb, football-data.org, API-Football
- [ ] Vérifier pour chaque candidate : fixtures **ET** résultats disponibles (pas juste le calendrier), délai de mise à jour des résultats, limites de requêtes/coût
- [ ] Décision go/no-go : API retenue, ou scraping nécessaire (→ Phase 6)

---

## Phase 3 — Sélection de club dynamique

**Objectif** : choisir n'importe quel club Ligue 1, générer l'affiche avec les bonnes données.

- [ ] Dropdown de sélection club (shadcn/ui `Select` ou `Combobox`)
- [ ] Filtrage côté client du fichier `ligue1-2627/matches.json` selon le club sélectionné (`domicile === clubId || exterieur === clubId`) — pas d'abstraction `CompetitionAdapter` nécessaire pour ça
- [ ] Affichage du bon logo adverse pour chaque match
- [ ] Répartition automatique des mois en 2 colonnes équilibrées

---

## Phase 4 — Couleurs dynamiques par club

**Objectif** : adapter la palette de l'affiche aux couleurs du club sélectionné.

- [ ] Créer un champ `colors: { primary, secondary, accent }` dans l'interface `Club`
- [ ] Alimenter les couleurs manuellement (JSON) pour chaque club Ligue 1 26/27
- [ ] Injecter les couleurs via CSS variables (`--color-primary`, `--color-accent`…)
- [ ] Tester le rendu impression avec plusieurs clubs

---

## Phase 5 — Saisie de scores dans l'app

**Objectif** : permettre à l'utilisateur qui le souhaite de saisir les scores directement dans l'app, en comblant le délai entre la fin d'un match et le prochain passage du pipeline de données (Phase 6).

- [ ] `ScoreBox` devient cliquable → `<input type="number" min="0" max="99" />` avec `<label>` associé
- [ ] Persistance locale des scores saisis (`localStorage` par club/saison)
- [ ] **Règle de priorité** : si le JSON canonique (committé par le pipeline Phase 6) a un score non-null pour un match, il est toujours affiché en priorité et écrase la valeur locale — le `localStorage` ne sert que tant que le score canonique est `null`
- [ ] Mode "impression vide" (cases vides, pour remplir au stylo) vs "impression remplie" (scores saisis/récupérés)
- [ ] Toggle dans l'UI : "Imprimer vide" / "Imprimer avec scores"

---

## Phase 6 — Pipeline de données réelles

**Objectif** : maintenir `ligue1-2627/matches.json` à jour, dates et scores compris, tout au long de la saison.

- [ ] Si une API viable a été retenue en Phase 2 : intégration directe (pas de scraping custom)
- [ ] Si aucune API viable : scraping unique en début de saison de la structure du calendrier (34 journées, appariements, dates encore provisoires — les droits TV ne sont pas tous attribués à ce stade)
- [ ] Script planifié via PM2 (`cron_restart`) sur le Raspberry Pi 5 (`scripts/scrape-ligue1.ts`), en réutilisant l'infra PM2 déjà en place pour d'autres tâches planifiées — récupère **scores ET dates mises à jour**, fréquence à définir par compétition (ex. lundi pour Ligue 1)
- [ ] Le script commit + push automatiquement le JSON mis à jour (clé de déploiement dédiée, accès limité à ce repo) → redéploiement Vercel automatique
- [ ] Mise à jour du timestamp affiché sur l'affiche ("mis à jour le...")
- [ ] **Distinguer les erreurs par catégorie dans les try/catch**, pas juste attraper globalement — `NetworkError` (réseau/DNS/timeout), `HttpError` (status 4xx/5xx), `StructureError` (assertion explicite post-parsing : ex. `matches.length !== 380`, un changement de structure HTML ne lève souvent aucune exception, il faut valider activement la forme des données extraites), `GitPushError` (échec du commit/push, distinct du scraping lui-même)
- [ ] Heartbeat Uptime Kuma sur ce cron : push actif d'un état "down" avec la catégorie d'erreur dans le message dès le `catch` (pas seulement déduit par timeout d'absence de heartbeat) — permet de savoir immédiatement où chercher sans fouiller les logs du Pi
- [ ] `maxRestarts`/backoff sur la config PM2 : un restart automatique n'aide qu'en cas d'échec réseau transitoire ; en cas de `StructureError` (site changé), relancer immédiatement échoue à l'identique — l'alerte doit être traitée comme "aller corriger le scraper", pas "ça va se réparer tout seul"
- [ ] Fallback sur données précédentes si une exécution échoue (ne jamais écraser avec un résultat vide)

---

## Phase 7 — Mise en public

**Objectif** : passer du statut outil perso à outil partageable, une fois les phases précédentes stabilisées.

- [ ] Ajouter le disclaimer "Application non officielle — projet de fan, tous droits réservés à leurs propriétaires respectifs"
- [ ] Vérifier les conditions d'usage des logos clubs/ligue (cf. Phase 1.4)
- [ ] Confirmer l'hébergement définitif (Vercel) et le domaine
- [ ] Partage direct de l'affiche via URL paramétrique (`?club=lemans&saison=2627`) — les scores affichés viennent du JSON canonique, pas d'un état à embarquer dans l'URL

---

## Backlog / idées futures

- **Généralisation multi-compétitions** (`CompetitionAdapter`, Ligue 2, Ligue 3, Basket Pro A, Pro B, Top 14…) — à concevoir **seulement** au moment d'implémenter une 2e compétition réelle, jamais à partir d'un seul cas (Ligue 1). Ne pas anticiper la forme de l'interface avant d'avoir au moins deux implémentations concrètes sous les yeux.
- Variantes d'affiche (portrait/paysage, format A3)
- Export PNG (déjà couvert si `html2canvas` est retenu en Phase 1.3)

---

## En cours

> Phase 0 terminée (2026-07-01) — prochaine étape : Phase 1 (affiche statique Le Mans FC).
