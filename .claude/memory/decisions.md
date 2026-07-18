---
register: decisions
---

## Index

| ID                              | Date       | Titre                                                                        | Tags                                                                                    | Statut |
| ------------------------------- | ---------- | ---------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | ------ |
| [BDR-001](decisions/BDR-001.md) | 2026-07-01 | Pas de `CompetitionAdapter` avant 2e compétition réelle                      | #architecture #adapter-pattern #yagni #ligue1 #generalisation                           | actif  |
| [BDR-002](decisions/BDR-002.md) | 2026-07-02 | Couleurs de club via CSS vars + Tailwind, pas de CSS monolithique            | #tailwind #css-vars #theming #poster #couleurs #architecture                            | actif  |
| [BDR-003](decisions/BDR-003.md) | 2026-07-02 | Logos officiels via Wikipédia plutôt que ré-extraction V1                    | #logos #wikipedia #assets #qualite #le-mans-fc #ligue1                                  | actif  |
| [BDR-004](decisions/BDR-004.md) | 2026-07-02 | API-Football invalidée à l'usage, pivot vers football-data.org (Phase 6)     | #api-football #football-data-org #api #phase2 #phase6 #spike #ligue1 #pipeline #donnees | actif  |
| [BDR-005](decisions/BDR-005.md) | 2026-07-02 | Phase 5 : localStorage par compétition/saison + prop-drilling                | #localstorage #prop-drilling #react-context #zustand #architecture #phase5 #scores      | actif  |
| [BDR-006](decisions/BDR-006.md) | 2026-07-03 | Phase 4 : couleurs clubs via colorthief + seuil WCAG 3.0                     | #colorthief #sharp #wcag #couleurs #theming #phase4 #script #codegen #ligue1            | actif  |
| [BDR-007](decisions/BDR-007.md) | 2026-07-04 | Données réelles différées après la phase de scraping                         | #roadmap #data-pipeline #scraping #sequencing #ligue1 #phase-1                          | actif  |
| [BDR-008](decisions/BDR-008.md) | 2026-07-04 | Espacement statique ajusté empiriquement plutôt que flex élastique           | #print-layout #css #fixed-content #yagni #tuning #poster #matchrow                      | actif  |
| [BDR-010](decisions/BDR-010.md) | 2026-07-04 | Dégradé : `primaryVariant`/`secondaryVariant` dérivés, `secondary` → bandeau | #couleurs #wcag #gradient #primaryVariant #secondaryVariant #theming #script #ligue1    | actif  |
| [BDR-009](decisions/BDR-009.md) | 2026-07-04 | Grille QA clubs : miniatures fidèles vs cartes simplifiées                   | #poster-grid #thumbnail #qa-tooling #ux #fidelity #ligue1                               | actif  |
| [BDR-011](decisions/BDR-011.md) | 2026-07-05 | Fix débordement A4 via espacements non-textuels, pas taille de police        | #print-layout #css #page-overflow #readability #poster #agent-browser                   | actif  |
| [BDR-012](decisions/BDR-012.md) | 2026-07-18 | `sync-matches.ts` : mapping team ID inline, garde anti-null, scope manuel    | #football-data-org #sync-matches #phase6 #script #mapping #null-guard #ligue1           | actif  |
| [BDR-013](decisions/BDR-013.md) | 2026-07-18 | Deploy key GitHub (repo unique) plutôt que PAT pour le push cron Pi          | #github #deploy-key #security #pm2 #ci-cd #phase6                                       | actif  |
