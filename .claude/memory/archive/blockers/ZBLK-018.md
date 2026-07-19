---
id: ZBLK-018
type: blocker
date: 2026-07-19
tags:
  [
    theming,
    shadcn,
    css-vars,
    hardcoded-colors,
    tailwind,
    arbitrary-values,
    ui,
    rebrand,
  ]
---

# ZBLK-018 — Recolorer les CSS vars shadcn n'a rien changé visuellement (composants métier en couleurs hardcodées)

| Friction                                                                                                                                                                                                                        | Cause réelle                                                                                                                                                                                                                                                                                                                                                                                                                  | Solution                                                                                                                                                                                                                                                                                                    | Statut |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| Après recolorage complet des variables CSS shadcn (`:root`/`.dark` avec la palette AC1), l'app affichait toujours "un fond sombre" et ne ressemblait pas du tout à AC1 — feedback surprise de Baptiste après la première passe. | Les composants métier réels (`App.tsx`, `AppToolbar.tsx`) n'utilisaient jamais les classes sémantiques shadcn (`bg-primary`, `text-accent`, etc.) mais des valeurs Tailwind arbitraires codées en dur (`bg-[#2e2e2e]`, `text-[#ffd84d]`...) — seules les primitives `ui/*` jamais éditées à la main (button, select, switch, tooltip) référençaient réellement les CSS vars. Confirmé via un agent Explore avant la 2e passe. | Grep systématique des valeurs hex/arbitraires dans les composants métier, remplacement par les classes sémantiques (`bg-primary`, `text-accent`, `border-accent`...) dans `App.tsx` et l'ancien `AppToolbar.tsx` (depuis éclaté en `AppBrandRibbon`/`ClubSwitcher`/`PrintFab`/`HelpFab`/`PrintHelpDialog`). | résolu |

## Références

- [BDR-016](../../decisions/BDR-016.md) — décision de scope qui a suivi ce diagnostic
- voir aussi GLRN-205 (mémoire globale)
