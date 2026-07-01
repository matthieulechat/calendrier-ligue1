## 💻 calendrier-ligue1

Générateur d'affiche calendrier de football imprimable (Ligue 1, saison 26/27), pour un club sélectionné (Le Mans FC en V1). Outil perso d'abord, avec passage éventuel en public une fois stabilisé (mention "application non officielle").

### Stack technique

- **Langage** : TypeScript 6
- **Framework** : Vite 8 + React 19
- **Runtime / Package manager** : Node.js + pnpm
- **Styling** : Tailwind CSS v4 + shadcn/ui (style `base-nova`, base color `neutral`)
- **Lint** : ESLint 10 + typescript-eslint + eslint-plugin-react-hooks/react-refresh
- **Déploiement** : Vercel (déduit de la stratégie de pipeline de données décrite dans `docs/ROADMAP.md`)

### Architecture

Alias `@/*` → `./src/*`. Dossiers : `src/adapters/` (un seul adapter `ligue1.ts` pour l'instant, pas d'interface généraliste avant une 2e compétition), `src/components/poster/` (composants de l'affiche), `src/components/ui/` (shadcn), `src/data/ligue1-2627/` (JSON statique par `{compétition}+{saison}`), `src/hooks/`, `src/lib/`, `src/types/`. Logos clubs en assets statiques sous `public/logos/{competition}/`.

### Conventions importantes

- Pas d'abstraction `CompetitionAdapter` généraliste tant qu'une seule compétition réelle est implémentée (cf. Backlog `docs/ROADMAP.md`) — attendre une 2e implémentation concrète avant de concevoir l'interface.
- Un fichier JSON par `{compétition}+{saison}` (jamais un fichier par club) pour éviter la duplication des matchs.
- Priorité de données : score canonique (JSON committé par le pipeline) > saisie locale (`localStorage`) — ne jamais écraser un score existant avec une valeur `null`.
- Stratégie d'impression par escalade : CSS print natif testé en conditions réelles d'abord → fallback `html2canvas`+`jsPDF` → `react-pdf` en tout dernier recours seulement.

Roadmap détaillée et décisions techniques complètes : `docs/ROADMAP.md`.
