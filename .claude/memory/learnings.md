---
register: learnings
---

## Index

| ID                              | Date       | Pattern observé                                                                          | Tags                                                                                             |
| ------------------------------- | ---------- | ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| [LRN-001](learnings/LRN-001.md) | 2026-07-01 | Escalade impression : CSS natif → html2canvas+jsPDF → react-pdf                          | #impression #print-css #html2canvas #jspdf #react-pdf #escalation-strategy                       |
| [LRN-002](learnings/LRN-002.md) | 2026-07-02 | CSS Grid `align-items:stretch` gonfle tous les items à la hauteur du plus grand          | #css #css-grid #align-items-stretch #print-layout #layout-debugging #margins                     |
| [LRN-003](learnings/LRN-003.md) | 2026-07-02 | Logos de clubs souvent hébergés localement par wiki, pas sur Commons                     | #wikipedia #wikimedia-commons #api #logos #assets #fair-use                                      |
| [LRN-004](learnings/LRN-004.md) | 2026-07-02 | Tailwind v4 : opacité arbitraire hors du pas de 5 nécessite `/[N%]`                      | #tailwind #tailwind-v4 #opacity #arbitrary-values #css                                           |
| [LRN-005](learnings/LRN-005.md) | 2026-07-02 | Calendrier fake réaliste : intervalle dérivé de la vraie saison, pas hebdo fixe          | #data-generation #round-robin #fake-data #calendrier #ligue1                                     |
| [LRN-006](learnings/LRN-006.md) | 2026-07-02 | openligadb : couverture ligue ≠ données disponibles                                      | #openligadb #api-football #feasibility-spike #sports-data #community-api #verification #ligue1   |
| [LRN-007](learnings/LRN-007.md) | 2026-07-02 | Spike multi-API : agents parallèles + verdict GO/NO-GO identique                         | #parallel-agents #feasibility-spike #api-evaluation #go-no-go #decision-making #research-pattern |
| [LRN-008](learnings/LRN-008.md) | 2026-07-02 | ligue1.com sans crests HD ; conversion SVG→PNG via canvas navigateur                     | #ligue1-com #logos #svg-to-png #canvas #no-dependency                                            |
| [LRN-009](learnings/LRN-009.md) | 2026-07-02 | Toggle écran/impression sans JS : `print:text-transparent`                               | #css #print #tailwind #media-print #screen-vs-print #react #form-input                           |
| [LRN-010](learnings/LRN-010.md) | 2026-07-02 | pnpm lint JSON parse EOF via rtk → ESLint global masque le local                         | #eslint #pnpm #rtk #path #global-vs-local #debugging #tooling                                    |
| [LRN-011](learnings/LRN-011.md) | 2026-07-03 | `@base-ui/react` Select.Value : valeur brute, pas le texte de l'item                     | #shadcn #base-ui #select #select-value #gotcha #base-nova #radix                                 |
| [LRN-012](learnings/LRN-012.md) | 2026-07-03 | `w-(--anchor-width)` base-nova : popup clampée à la largeur du trigger                   | #shadcn #base-ui #select #select-content #overflow #base-nova #tailwind                          |
| [LRN-013](learnings/LRN-013.md) | 2026-07-03 | Override couleur shadcn via data-attribute Tailwind                                      | #shadcn #base-ui #switch #tailwind #data-attribute #theming #override #css-vars                  |
| [LRN-014](learnings/LRN-014.md) | 2026-07-04 | Contraste WCAG multi-fonds → convergence forcée vers le blanc                            | #wcag #contrast-ratio #color-generation #accessibility #luminance #algorithm                     |
| [LRN-015](learnings/LRN-015.md) | 2026-07-04 | Distance RGB euclidienne > écart de teinte HSL pour détecter 2 couleurs proches          | #color-distance #hsl #rgb #perceptual-difference #algorithm #ui                                  |
| [LRN-016](learnings/LRN-016.md) | 2026-07-05 | Merge "côté entier" risque de réintroduire un choix abandonné                            | #git #merge-conflict #rebase #code-review #regression                                            |
| [LRN-017](learnings/LRN-017.md) | 2026-07-05 | Validation empirique print valide seulement pour le contenu testé                        | #print-layout #css #page-overflow #agent-browser #empirical-verification                         |
| [LRN-018](learnings/LRN-018.md) | 2026-07-05 | TaskStop peu fiable sur job Bash + robocopy /MIR pour node_modules Windows               | #taskstop #windows #pnpm #node_modules #robocopy #long-path                                      |
| [LRN-019](learnings/LRN-019.md) | 2026-07-18 | Spike doc-only ≠ spike validé — restrictions de plan invisibles sans clé réelle          | #api-football #feasibility-spike #free-tier #season-restriction #empirical-verification #ligue1  |
| [LRN-020](learnings/LRN-020.md) | 2026-07-18 | football-data.org : date/heure placeholder identique tant que journée non resynchronisée | #football-data-org #fixture-date #placeholder #free-tier #sync-matches #ligue1                   |
| [LRN-021](learnings/LRN-021.md) | 2026-07-18 | Guider ajout de clé API : vérifier que `.env.example` reste un placeholder               | #env-vars #secrets #dotenv #security #api-key-setup #guide                                       |
| [LRN-022](learnings/LRN-022.md) | 2026-07-18 | `min-height` CSS clampe `scrollHeight`, mesure DOM trompeuse                             | #css #min-height #dom-measurement #agent-browser #print-layout #getBoundingClientRect            |
| [LRN-023](learnings/LRN-023.md) | 2026-07-18 | `flex-1` sans parent `display:flex` = no-op silencieux                                   | #css #flexbox #flex-1 #display-flex #silent-failure #layout-debugging                            |
| [LRN-024](learnings/LRN-024.md) | 2026-07-18 | `break-inside:avoid` empêche la fragmentation print                                      | #css #break-inside #print #page-break #pagination #fragmentation                                 |
