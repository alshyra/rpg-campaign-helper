# RPG Player Helper

Une application web mobile-first pour gérer tes personnages de jeu de rôle — stats, inventaire, compétences et notes de campagne, le tout stocké localement dans le navigateur.

## Fonctionnalités

- **Persos** — gestion multi-personnages avec création guidée (tunnel d'onboarding)
- **Profil** — stats (DEX, FOR, CON, INT, SAG, CHA), radar visuel, état de santé (blessures légères / mineures / majeures / fatales)
- **Compétences** — tableau de compétences par catégorie avec valeurs
- **Inventaire** — liste d'objets avec quantité et détails
- **Notes** — journal de campagne en frise chronologique
- **Sauvegarde** — import / export JSON du personnage
- **PWA** — installable sur mobile comme une app native

## Stack technique

- [Vue 3](https://vuejs.org/) + Composition API
- [TypeScript](https://www.typescriptlang.org/)
- [Pinia](https://pinia.vuejs.org/) pour le state management
- [Vue Router](https://router.vuejs.org/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Vite](https://vitejs.dev/) + plugin PWA

## Lancer le projet

### Prérequis

- Node.js ≥ 18
- npm

### Installation

```bash
npm install
```

### Développement

```bash
npm run dev
```

L'application est accessible sur [http://localhost:5173](http://localhost:5173).

### Build de production

```bash
npm run build
```

### Prévisualiser le build

```bash
npm run preview
```
