# Fonctionnalités — RPG Player Helper

## Gestion des personnages
- Création guidée avec tunnel wizard (identité → caractéristiques)
- Modification complète d'un personnage existant
- Suppression d'un personnage
- Gestion de plusieurs personnages (campagnes)
- Sélection / changement de personnage actif

## Profil
- Fiche d'identité (nom, rôle/classe, ambiance)
- Avatar avec upload photo + recadrage carré redimensionné en base64 (data URL)
- Radar chart des stats (DEX, FOR, CON, INT, SAG, CHA)
- Caractéristiques (stats -5 à +5) modifiables
- État vital / blessures (système à 8 slots : légère, moyenne, grave, fatale) avec animations
- Synoptique de l'état de santé (Indemne → Agonisant)

## Inventaire
- Liste des objets possédés
- Ajout / modification / suppression d'objets avec nom, description, quantité

## Grimoire (sorts)
- Liste des sorts connus
- Ajout / modification / suppression avec nom, école, description

## Compétences
- Liste des compétences avec nom, catégorie, valeur
- Ajout / modification / suppression

## Notes de session
- Timeline de notes avec titre, contenu, date de création
- Ajout / suppression

## Sauvegarde et persistance
- Stockage local (localStorage) avec persistence automatique
- Export JSON (téléchargement d'un fichier)
- Import JSON (restauration depuis un fichier)

## Synchronisation cloud
- Connexion Google Drive (OAuth2)
- Sauvegarde automatique sur Drive (espace appData, invisible pour l'utilisateur)
- Restauration depuis Drive au démarrage (last-write-wins)
- Déconnexion / révocation du token

## Interface
- Application mobile-first responsive
- Navigation bottom nav (Profil, Inventaire, Grimoire, Compétences, Notes)
- Header sticky avec titre, bouton retour, bouton paramètres
- Thème sombre (dark fantasy)
- Icônes Lucide
- Animations CSS (blessures, transitions)

## Progressive Web App
- Service Worker avec mise à jour automatique
- Installation possible sur l'écran d'accueil
- Icônes PWA (192, 512, apple-touch-icon)
- Mode standalone

## Onboarding
- Écran de bienvenue au premier lancement
- Création ou import au premier pas
- Connexion Drive depuis l'écran d'accueil
