---
id: ZBLK-020
type: blocker
date: 2026-07-19
tags:
  [
    vite-pwa-assets-generator,
    pwa-icon,
    padding,
    maskable,
    apple-touch-icon,
    defaults,
    favicon,
  ]
---

# ZBLK-020 — Assets PWA générés avec défauts visuels (fond blanc, filigrane tronqué) — padding/fond par défaut différents par preset

| Friction                                                                                                                                                                                                                                                                                                                                                                                                                    | Cause réelle                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | Solution                                                                                                                                                                                                                                                                                                                                               | Statut |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------ |
| Les 6 assets PWA générés (`public/*.png`, `favicon.ico`) présentaient 3 défauts visuels distincts remontés par Baptiste sur 2 tours de feedback successifs : `apple-touch-icon-180x180.png` en fond blanc sans filigrane, `maskable-icon-512x512.png` avec le filigrane absent/tronqué en bordure malgré un fond vin correct, `pwa-64/192/512.png` avec un vide visible autour de l'icône au lieu de remplir tout le cadre. | `minimalPreset` de `@vite-pwa/assets-generator` applique un padding et un fond par défaut DIFFÉRENTS selon le type de preset — `transparent` (5% padding), `maskable`/`apple` (30% padding + fond blanc forcé) — jamais documentés dans le quickstart, trouvés en lisant directement le code source compilé de la lib (`dist/index.mjs`, `defaultPngOptions`). De plus, le padding réduit la TAILLE ENTIÈRE du SVG source avant de le centrer sur un fond plat — si ce SVG contient lui-même un motif de fond (le filigrane grille), seul le motif à l'intérieur de la zone réduite reste visible, la marge ajoutée autour est unie (couleur de `resizeOptions.background`), pas une continuation du motif. | Configuration explicite de `pwa-assets.config.ts` par preset — `padding: 0` + `resizeOptions.background` adapté pour `transparent` et `apple` (fond vin, plein cadre) ; `padding: 0` également pour `maskable` (accepte de renoncer à la marge de sécurité W3C recommandée, le glyphe calendrier restant déjà bien centré/compact dans le SVG source). | résolu |

## Références

- voir aussi GLRN-206, GLRN-171, GLRN-173 (mémoire globale)
