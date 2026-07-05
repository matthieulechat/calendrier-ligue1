---
id: ZBLK-006
type: blocker
date: 2026-07-02
tags: [taskkill, dev-server, port, process, agent-browser, postmortem]
---

# ZBLK-006 — Serveur dev de Baptiste tué par erreur en nettoyant des process de test par port

| Friction                                                                                                                                                                                                     | Cause réelle                                                                                                                                                                                                                                | Solution                                                                                                                                                                           | Statut |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| Le `pnpm dev` de Baptiste (port 5173, déjà en cours avant le début de la session) a été tué par erreur en pensant nettoyer les propres instances `vite` lancées pendant la QA visuelle avec `agent-browser`. | Le nettoyage s'est fait par numéro de port (`netstat` → `taskkill //PID`) sans distinguer les process lancés par l'agent pendant la session de ceux déjà présents avant — `netstat` par port ne donne aucune info sur l'origine du process. | Relance immédiate de `pnpm dev` sur le port 5173 libéré (reconnexion automatique du client HMR de Vite côté navigateur) ; erreur signalée explicitement à Baptiste dans la foulée. | résolu |

## Références

- Cf. aussi le pattern extrait pour usage futur : GLRN-183 (mémoire globale, non lié en local — voir `~/.claude/global-memory/learnings/GLRN-183.md`)
