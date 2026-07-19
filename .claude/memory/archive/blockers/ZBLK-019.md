---
id: ZBLK-019
type: blocker
date: 2026-07-19
tags:
  [
    sharp,
    native-binding,
    windows,
    pnpm,
    vite-pwa-assets-generator,
    dlopen-failed,
    dependency-conflict,
  ]
---

# ZBLK-019 — `sharp` DLOPEN_FAILED sur Windows après ajout de `@vite-pwa/assets-generator`

| Friction                                                                                                                                                                                                                                                                              | Cause réelle                                                                                                                                                                                                                                                                                                                                                                                                           | Solution                                                                                                                                                       | Statut |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| `pnpm generate-pwa-assets` (via `@vite-pwa/assets-generator` fraîchement installé) plantait avec `Error: Could not load the "sharp" module using the win32-x64 runtime — ERR_DLOPEN_FAILED`, alors que `node -e "require('sharp')"` fonctionnait sans problème à la racine du projet. | `@vite-pwa/assets-generator` tire une version transitive DIFFÉRENTE de `sharp` (0.33.5) que celle déjà installée et fonctionnelle en top-level (0.35.3, utilisée par `scripts/extract-club-colors.ts`) — son binaire natif `@img/sharp-win32-x64@0.33.5` n'était pas couvert par `pnpm.onlyBuiltDependencies` malgré l'ajout de `sharp` au tableau (qui ne couvre pas automatiquement toutes les versions imbriquées). | Ajout de `pnpm.overrides: { "sharp": "^0.35.3" }` dans `package.json` pour forcer la dédupe vers la version déjà approuvée/fonctionnelle, puis `pnpm install`. | résolu |

## Références

- voir aussi GLRN-207 (mémoire globale)
