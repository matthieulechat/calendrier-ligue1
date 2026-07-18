# 🔑 Guide — Obtenir et valider une clé API football-data.org

> ⚠️ **Mise à jour 2026-07-18** : ce guide visait initialement API-Football, retenue en Phase 2 ([BDR-004](../.claude/memory/decisions/BDR-004.md)). Test empirique fait une fois la clé obtenue : le plan gratuit **refuse l'accès à la saison en cours** (`errors.plan: "Free plans do not have access to this season, try from 2022 to 2024"`). Invalidé pour ce projet, décision corrigée (cf. [LRN-019](../.claude/memory/learnings/LRN-019.md)). Pivot vers **football-data.org**, alternative déjà notée GO en Phase 2. La section API-Football est conservée plus bas pour référence/historique.

## 1. Inscription football-data.org

1. Va sur https://www.football-data.org/client/register
2. Crée un compte (email + mot de passe), valide l'email de confirmation
3. La clé API ("Auth Token") est envoyée par email et visible dans ton espace client
4. Plan gratuit : 10 req/min, pas de CB requise

## 2. Stocker la clé (jamais en dur dans le code)

Dans `.env.local` (jamais committé, cf. `.gitignore`) :

```
FOOTBALL_DATA_ORG_KEY=ta_cle_ici
```

`.env.example` contient le placeholder correspondant — à garder synchronisé si d'autres variables s'ajoutent.

## 3. Valider empiriquement AVANT de coder le script

⚠️ **PowerShell** : `curl` y est un alias vers `Invoke-WebRequest`, qui ne comprend pas la syntaxe `-H` façon Unix — utilise une des deux commandes ci-dessous, pas le `curl` Unix classique.

**Option A — vrai curl (`curl.exe`, présent nativement sur Windows 10/11) :**

```powershell
curl.exe -s "https://api.football-data.org/v4/competitions/FL1/matches?season=2026" -H "X-Auth-Token: ta_cle_ici"
```

**Option B — natif PowerShell :**

```powershell
Invoke-RestMethod -Uri "https://api.football-data.org/v4/competitions/FL1/matches?season=2026" -Headers @{ "X-Auth-Token" = "ta_cle_ici" }
```

Points à vérifier dans la réponse :

- `matches` n'est pas un tableau vide
- Chaque match contient `homeTeam.name` / `awayTeam.name` et `utcDate`
- `score.fullTime.home` / `score.fullTime.away` sont bien `null` avant un match et remplis après
- `status` (`SCHEDULED`/`FINISHED`/etc.) est cohérent avec le type `Match` du projet (`score.domicile`/`score.exterieur`)

Si `matches` est vide ou l'endpoint renvoie une erreur d'auth/quota → NO-GO réel à documenter, revoir les options (scraping maison en dernier recours, cf. `docs/ROADMAP.md` Phase 6).

## 4. Limites à garder en tête (plan gratuit)

- 10 requêtes/minute — largement suffisant pour un cron hebdomadaire (Phase 6)
- Scores légèrement différés (pas de temps réel) — sans impact pour une affiche mise à jour de façon planifiée
- Pas de lineups/stats détaillées (non utilisées par ce projet)
- Pas de garantie de SLA — le pipeline doit prévoir un fallback sur les données précédentes en cas d'échec ponctuel (déjà noté dans `docs/ROADMAP.md` Phase 6)

## Prochaine étape

Une fois la clé obtenue et le test concluant, retour au script `scripts/sync-matches.ts` (Phase 6) — fetch + mapping club → team ID + merge dans `matches.json`, lancé manuellement dans un premier temps.

---

## Annexe — API-Football (invalidée, conservée pour référence)

Deux voies existaient pour l'obtenir, au cas où un besoin futur justifierait un plan payant :

| Voie                     | Où                                                                                           | Header d'auth                        |
| ------------------------ | -------------------------------------------------------------------------------------------- | ------------------------------------ |
| **Directe (API-Sports)** | [dashboard.api-football.com](https://dashboard.api-football.com/register)                    | `x-apisports-key`                    |
| **Via RapidAPI**         | [rapidapi.com/api-sports/api/api-football](https://rapidapi.com/api-sports/api/api-football) | `x-rapidapi-key` + `x-rapidapi-host` |

Test de validation qui a révélé l'invalidation (league ID `61` = Ligue 1) :

```powershell
curl.exe -s "https://v3.football.api-sports.io/fixtures?league=61&season=2026" -H "x-apisports-key: ta_cle_ici"
```

Plan gratuit : 100 req/jour, 10 req/min, mais **saison en cours non accessible** (uniquement 2022-2024 au moment du test).
