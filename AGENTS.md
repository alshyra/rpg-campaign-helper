# RPG Player Helper — Agent guide

## Dev commands

| command | what it does |
|---|---|
| `bun install` | install deps |
| `bun run dev` | dev server on `localhost:5173` |
| `bun run build` | `vue-tsc --noEmit && vite build` — typecheck **before** build |
| `bun run preview` | preview prod build |
| `npx playwright test` | run e2e tests (dir `e2e/`) |
| `npx oxfmt --write src/` | format code (after install); uses `.oxfmtrc.json` (120 cols, sort imports) |

No `bun run test` or `bun run lint` scripts in `package.json`.

## Architecture

**Multi-system registry** — `src/systems/`. Each game system (currently `generic`, `warhammer`) registers via `defineSystem()` in its `index.ts`. Systems are imported in `src/main.ts` for side-effect registration.

Views are thin shells (5-7 lines of logic): check `NoCharacterEmpty`, resolve component from `useSystemComponents(systemId)`, render `<component :is="...">`. **No `if (systemId === ...)` anywhere** — all system-specific code lives in `src/systems/{system}/components/`.

`CharacterState` has `systemData: unknown`. System components type it via `store.getSystemData<T>()` and `store.updateSystemData()`.

## Architecture Vue

### Philosophie

- **Responsabilité unique** : chaque composant/fichier fait une seule chose.
- **Pas de prop-drilling** au-delà de 2 niveaux — préférer le store Pinia.
- **Pas d'emits en cascade** : si plusieurs composants partagent une action, la centraliser dans un store ou composable.
- **Views = orchestration uniquement** : une view monte les composants, branche le store, gère le cycle de vie (`onMounted`/`onUnmounted`). Pas de logique métier inline.

### Règles par couche

**Composants UI (`src/components/ui/`)**
- Props + slots + emit uniquement. Jamais de store, jamais d'appel API.
- Taille cible : **< 100 lignes**.

**Feature components (`src/components/`)**
- Consomment le store via `useXxxStore()`.
- Délèguent toute mutation au store (actions Pinia).
- Logique complexe extraite en composable.
- Taille cible : **< 200 lignes**.

**Views (`src/views/`)**
- Montent les composants + branchent le store + cycle de vie.
- **Pas de logique métier inline** dans `<script setup>`.
- Toute logique modale, filtres, sélection → extraire dans un composable dédié.
- Taille cible : **< 150 lignes** (template inclus).

**Stores Pinia (`src/stores/`)**
- Un store par domaine métier. Dès qu'un store dépasse ~200 lignes, le découper.
- État, getters, actions async.
- Chaque action async : `loading` + `error` **par domaine** (pas de `loading` global).
- Helper privé `_applyXxx()` pour muter l'état depuis plusieurs sources.
- Pas de logique UI, pas d'accès à `$router`.

**Composables (`src/composables/`)**
- Logique réutilisable ou trop volumineuse pour rester dans une view.
- Peuvent consommer un store (`useXxxStore()` autorisé).
- Exposent une API minimale (ne pas tout retourner).

### Arbres de décision

```
La donnée est partagée entre plusieurs composants/views ?
├── OUI → Store Pinia
└── NON → ref locale dans le composant

La logique est trop volumineuse pour la view (> ~20 lignes) ?
├── OUI → Composable dédié (useXxx)
└── NON → Inline dans <script setup>

Le store dépasse ~200 lignes ?
├── OUI → Découper par domaine métier
└── NON → OK tel quel
```

### Anti-patterns à éviter

| ❌ Anti-pattern | ✅ Alternative |
|---|---|
| Store monolithique | Découper par domaine métier |
| Logique modale/trigger dans `<script setup>` d'une view | Composable dédié |
| `loading` global unique pour des domaines distincts | `xxxLoading`, `yyyLoading`… séparés |
| Props drillées sur 3+ niveaux | Store Pinia |
| Logique métier dans le `<template>` | `computed` ou composable |

### Checklist de revue

- [ ] View < 150 lignes — toute logique non-orchestration est dans un composable
- [ ] Store < 200 lignes — ou découpé par domaine
- [ ] `loading` + `error` présents **par domaine** dans chaque store
- [ ] Aucun appel API dans un composant UI
- [ ] Pas de prop-drilling au-delà de 2 niveaux
- [ ] Les composables n'exposent que ce dont la view a besoin

## Build & typecheck quirks

- `bun run build` fails if `vue-tsc` finds type errors. Use `bun x vue-tsc --noEmit` for a fast typecheck without building.
- `tsconfig.json` uses `moduleResolution: "Bundler"`, `strict: true`, `noEmit: true`.
- `@types/google.accounts` is for the GSI client script loaded at runtime — not bundled.

## E2E tests

- Run on port **5174** (not 5173), configured in `playwright.config.ts` with its own `webServer`.
- Seeds localStorage via `page.addInitScript(seedInitScript(...))` using helpers from `e2e/utils.ts`.
- Two test suites: `character-creation.spec.ts` (Generic + Warhammer) and `warhammer-inventory.spec.ts`.
- **Page Object Model obligatoire** : toute interaction avec une page/view passe par une classe dans `e2e/pages/`. Les tests ne contiennent que des `page.goto()`, `page.addInitScript()`, assertions et appels de méthodes POM. Pas de locators inline dans les specs.
- Les POM exposent des **getters `Locator`** pour les assertions (ex: `ip.moneyGold`, `ip.armorValue`) et des **méthodes d'action** pour les interactions (ex: `wizard.fillIdentity(...)`, `ip.addEquipmentItem(...)`).
- `e2e/utils.ts` fournit `buildWarhammerSeed()` et `seedInitScript()` pour l'injection de données fixtures.

## Known gaps

- `sanitizeState()` in `character.helpers.ts` does **not** call the system registry's `createBlankState()` — it manually picks fields via `pickSystemFields()`. The ARCHITECTURE.md plan says it should delegate to the system, but this hasn't been implemented yet.
- `src/types/character.ts` still has `stats`, `skills`, `inventory`, `notes`, `spells` at the `CharacterState` top level in addition to `systemData` — the migration to fully system-owned data is incomplete. Both the legacy top-level fields AND `systemData` are populated on create.

## Google Drive OAuth2

Env var `VITE_GOOGLE_CLIENT_ID` is required at build time for the Drive sync feature. In CI it's a GitHub Actions secret. Missing it shows "Google Client ID manquant" at runtime and Drive login fails.

## CI/CD

GitHub Actions deploys to Netlify on push/PR to `main`: `bun install` → `bun run build` → deploy `dist/`. Secrets needed: `VITE_GOOGLE_CLIENT_ID`, `NETLIFY_AUTH_TOKEN`, `NETLIFY_SITE_ID`.

## Conventions

- Vue files: `<script setup lang="ts">`, PascalCase component names, kebab-case file names.
- Tailwind CSS v4 — no `@apply` directives, no legacy `tailwind.config.*` file. Theme vars in `src/tailwind.css`.
- Formatter: `oxfmt` with `arrowParens: "always"`, `bracketSpacing: true`, `singleAttributePerLine: true`, `sortImports: true`, `printWidth: 120`.
- `index.html` is in French (`lang="fr"`).

### UI rules

**Prefer UI components over native HTML.** Do not use bare `<button>` / `<input>` / `<label>` — use `<Button>`, `<FormField>`, `<FileImportLabel>`, `<IconButton>`, `<AppCard>`, `<StatStepper>`, `<SectionHeading>` from `src/components/ui/`.

**Components must be autonomous.** Avoid parent→child props drilling. Prefer consuming the Pinia store directly inside the component. When splitting a component, move all associated code (template, logic, styles) into the new component so it stands alone — no shared reactive state via props.
