---
id: ZBLK-013
type: blocker
date: 2026-07-18
tags: [env-vars, secrets, dotenv, security, git, api-key-setup]
---

# ZBLK-013 — Clé API réelle collée dans `.env.example` au lieu de `.env.local`

| Friction                                                                                                                                                                                                                        | Cause réelle                                                                                                                                                                                                                               | Solution                                                                                                                                   | Statut |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------ | ------ |
| En suivant le guide de configuration de la clé `FOOTBALL_DATA_ORG_KEY`, la vraie valeur est apparue dans `.env.example` — fichier non listé dans `.gitignore` (contrairement à `.env`/`.env.local`), donc committable en clair. | Confusion utilisateur/autofill IDE : la clé attendue dans `.env.local` a été saisie (ou complétée automatiquement) dans `.env.example` à la place, probablement par habitude de remplir tous les fichiers `.env*` visibles dans l'éditeur. | Repéré via `git status` avant tout commit (fichier encore untracked) — remis un placeholder vide dans `.env.example`, aucune fuite réelle. | résolu |

## Références

- [LRN-021](../../learnings/LRN-021.md) — pattern extrait de ce blocage
