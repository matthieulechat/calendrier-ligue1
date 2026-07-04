full---
id: ZBLK-003
type: blocker
date: 2026-07-02
tags: [css-grid, layout-debugging, print, table, aria, false-lead]
---

# ZBLK-003 — Colonnes de l'affiche plus hautes que prévu, faux suspect (table imbriquée)

| Friction                                                                                                                                                                                                                        | Cause réelle                                                                                                                                                                                                                                                                                                   | Solution                                                                                                                                                                                                                                                                     | Statut |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| La colonne la plus dense de l'affiche (CSS Grid 2 colonnes) mesurait ~10mm de plus que prévu — suspecté un bug lié au `<table>` HTML imbriqué dans le `<tr>` en `display:grid` (pattern connu pour avoir des quirks navigateur) | Pas de bug technique : le calcul manuel du budget vertical avait simplement oublié de compter les marges entre les blocs de mois empilés (`.mb` margin-top), et `align-items:stretch` (comportement par défaut de CSS Grid) étire toutes les colonnes à la hauteur de la plus grande, masquant la vraie source | Migration `<table>` → divs avec rôles ARIA (améliore aussi la maintenabilité) — n'a rien changé à la hauteur mesurée, confirmant l'absence de bug table+grid ; le dépassement réel vient de la densité des données fake, à réévaluer une fois les vraies données substituées | résolu |

## Références

- [LRN-002](../../learnings/LRN-002.md) — pattern extrait de ce blocage
