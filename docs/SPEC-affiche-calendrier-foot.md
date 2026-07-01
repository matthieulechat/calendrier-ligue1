# 🏟️ Spec — Affiche calendrier Ligue 1 (imprimable A4)

## 1. Contexte & objectif

Générer une **affiche A4 imprimable** reprenant le calendrier d'une équipe de Ligue 1 (point de départ : **Le Mans FC, saison 2026/27**), à punaiser au mur d'un bureau, **remplie à la main** au fil de la saison (scores).

**V1 (terminée)** : fichier HTML statique généré pour Le Mans FC, logos embarqués en base64, prêt à imprimer.

**V2 (objectif de cette reprise sur Claude Code)** : transformer ça en **app web** permettant de choisir n'importe quelle équipe de Ligue 1 (et à terme Ligue 2), avec génération dynamique de l'affiche + export PDF/impression.

---

## 2. Design — apparence souhaitée

### 2.1 Palette & ambiance
- **Fond** : dégradé rouge type maillot club (`#6e0b12` → `#8e1318` → `#a51820`, diagonal ~148deg), **plein cadre**, pas de zones blanches.
- **Texte principal** : blanc.
- **Accents / titres / dates** : jaune (`#ffd84d`).
- **Bandeau header** : fond noir (`#0c0c0c`) avec titre en jaune.

### 2.2 Typographie
- Titres et noms de mois : police façon **Impact / Arial Black**, **italique**, majuscules, condensée.
- Corps (adversaires, dates) : `Arial Narrow` / sans-serif condensé, gras pour les noms d'équipes.

### 2.3 Header
- Bandeau noir en haut, sur toute la largeur.
- Titre "CALENDRIER 26/27 — RÉSULTATS" à gauche, en jaune italique.
- Sous-titre discret : nom du club · nom de la ligue (ex: "Ligue 1 McDonald's") · saison.
- **À droite du header** : logo du club **+ séparateur vertical + logo de la ligue**, côte à côte.

### 2.4 Légende
- Sous le header : 2 pictos **Lucide** (`house` = domicile, `plane` = extérieur) avec libellés "Domicile" / "Extérieur".
- ⚠️ Pas de texte redondant type "Domicile — Extérieur" en plus des pictos (retiré en V1, à ne pas remettre).

### 2.5 Corps — liste des matchs
- **Disposition en 2 colonnes** (répartition équilibrée des mois, ex. Août→Janvier à gauche, Février→Mai à droite), séparées par un filet vertical fin.
- Regroupement **par mois**, titre du mois en jaune italique.
- Chaque ligne de match affiche :
  1. **Date** : jour (gros, jaune, italique) + **jour de la semaine abrégé en français** (`M`/`Ma`/`Me`/`J`/`V`/`S`/`D`) — calculé dynamiquement, **pas de format JJ/MM**.
  2. **Logo du club adverse** (rond, petit, fond blanc translucide) + **nom du club** en majuscules à côté.
  3. **Cases de score à remplir à la main** : 2 petites cases blanches vides + tiret séparateur. Sous les cases, un petit libellé précisant l'ordre d'écriture du score, dans le **sens réel du match** :
     - Si le club recevait : `Le Mans – Adversaire`
     - Si le club jouait à l'extérieur : `Adversaire – Le Mans`
     (⚠️ ne pas mettre un ordre fixe "Le Mans - Adversaire" partout, ça a été corrigé en V1)
  4. **Picto Lucide** (maison ou avion) à droite indiquant domicile/extérieur.

### 2.6 Footer
- Petit texte légal ("Sous réserve des procédures en cours...") + logo club en petit, aligné à droite.

### 2.7 Format & impression
- **A4 portrait strict**, `@page { size: A4; margin: 0 }`.
- Fond plein → nécessite d'informer l'utilisateur des réglages navigateur (voir §5).
- Cases de score = **rectangles vides** (pas d'`<input>`), pensées pour écriture au stylo — c'est une affiche papier, pas un formulaire numérique.
- Tailles de police pensées pour lecture à distance (affichage mural), pas pour un écran proche.

---

## 3. Assets & sources

| Élément | Source | Notes |
|---|---|---|
| Logo Le Mans FC | Cropé depuis une photo Instagram fournie par l'utilisateur | PNG transparisé (fond rouge retiré par seuillage RGB) |
| Logo Ligue 1 McDonald's | Cropé depuis la **même photo** (zone existait mais c'était en fait un visuel Ligue 2 au départ → à vérifier à chaque saison) | Upscale x6 via `cv2.INTER_LANCZOS4` + `bilateralFilter` (débruitage) + `UnsharpMask` (netteté) car source basse résolution (~144×40px) |
| Logos des 17 autres clubs Ligue 1 | Repo GitHub **[luukhopman/football-logos](https://github.com/luukhopman/football-logos)** — PNG 139×181px, organisés par saison/ligue (`logos/France - Ligue 1/`, historique par saison dans `history/{saison}/France - Ligue 1/`) | ✅ Fiable, à jour, licence libre. Pour un club fraîchement promu (ex: Troyes 26/27), remonter dans `history/` à sa dernière saison en Ligue 1. |
| Icônes maison/avion | **Lucide icons**, récupérées en SVG brut depuis `raw.githubusercontent.com/lucide-icons/lucide/main/icons/{house,plane}.svg` | Intégrées en `<symbol>` SVG inline, réutilisées via `<use>` |

### ⚠️ Piège identifié : logos via API tierce (ne pas refaire)
Tentative initiale de charger les logos clubs **en live côté client** via TheSportsDB (gratuit) + API-Football (CDN images) :
- `strTeamBadge` de TheSportsDB est **verrouillé derrière Patreon** depuis 2023-24 → toujours vide sur la clé gratuite.
- Le fallback par `idAPIfootball` + `media.api-sports.io` fonctionnait globalement, MAIS la recherche par nom texte (`searchteams.php?t=...`) peut **matcher un homonyme** (ex: mauvais logo pour le PSG).
- **Conclusion retenue** : pour une affiche figée à imprimer, **mieux vaut embarquer les logos en dur** (téléchargés une fois, stockés en asset local ou base64) que de dépendre d'un fetch runtime fragile. Pour la V2 web app, un **cache local des logos par club** (téléchargés une fois depuis le repo GitHub ci-dessus, stockés en `/public/logos/`) est la bonne approche — pas de fetch API tierce à chaque génération.

---

## 4. Fonctionnalités V1 (déjà faites, à reprendre telles quelles)
- [x] Génération HTML statique avec toutes les infos embarquées en base64 (logos club, ligue, LMFC)
- [x] Calcul du jour de semaine (FR abrégé) depuis date + mois + année via `date.weekday()`
- [x] Répartition en 2 colonnes équilibrées par mois
- [x] Bouton "Imprimer" (`window.print()`) + notice des réglages navigateur nécessaires
- [x] Ordre du score dynamique selon domicile/extérieur

## 5. Notice réglages impression (à garder visible dans l'UI, hors zone imprimée)
Avant impression, l'utilisateur doit vérifier dans "Plus de paramètres" du navigateur :

| Réglage | Valeur requise | Sinon... |
|---|---|---|
| Graphismes d'arrière-plan | ✅ Coché | Le fond rouge disparaît |
| Marges | Aucune | L'affiche ne remplit pas toute la page |
| En-têtes et pieds de page | ❌ Décoché | Date/URL s'impriment en haut/bas |
| Couleur | Couleur (pas N&B) | Le rouge devient gris |
| Mise à l'échelle | 100% | Pas de "Ajuster à la page" |

---

## 6. V2 — Objectif app web

### 6.1 Besoin fonctionnel
- Sélecteur d'équipe (dropdown ou recherche) parmi les clubs de **Ligue 1**, puis à terme **Ligue 2**.
- Génération dynamique du calendrier de l'équipe sélectionnée (matchs, dates, domicile/extérieur, adversaires).
- Rendu de l'affiche selon le design décrit en §2, avec le bon jeu de logos.
- Export / impression A4 (même logique CSS `@page`).

### 6.2 Données du calendrier
À déterminer/discuter : source du calendrier des matchs (API foot, scraping site LFP, saisie manuelle JSON). Pas encore tranché — **question ouverte pour la suite**.

### 6.3 Stack technique suggérée (cohérente avec préférences existantes)
- **Next.js** (App Router) + **React** + **TypeScript**
- **Tailwind CSS** + **shadcn/ui** pour les composants (sélecteur d'équipe, etc.)
- **pnpm** comme gestionnaire de paquets
- Génération PDF/impression : soit CSS print natif (comme en V1), soit lib type `react-to-print` si besoin d'un rendu plus contrôlé
- Stockage des logos clubs : assets statiques dans `/public/logos/{ligue}/{club}.png`, récupérés une fois depuis le repo GitHub cité en §3 (script de seed à faire, pas de fetch runtime)
- Stockage du calendrier : à trancher — un simple JSON par club/saison serait cohérent avec les habitudes de test actuelles, avant d'envisager une solution plus durable si besoin de mise à jour dynamique (résultats en cours de saison par ex.)

### 6.4 Points ouverts à clarifier avec l'utilisateur au démarrage du chantier Claude Code
1. Source des données de calendrier (API ? JSON statique maintenu à la main ? scraping ?)
2. Faut-il conserver les cases de score "vides à remplir à la main" en V2, ou passer à un mode où l'utilisateur peut aussi *saisir* les scores dans l'app (et donc régénérer une affiche "à jour") ?
3. Portée exacte de la V2 : juste Ligue 1, ou Ligue 1 + Ligue 2 dès le départ ?
4. Un seul type de gabarit d'affiche, ou prévoir des variantes (couleurs par club, par ex. si un jour on sort du seul Le Mans FC) ?
