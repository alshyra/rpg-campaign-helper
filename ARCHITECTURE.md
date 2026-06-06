# Architecture multi-systèmes — Plan de refonte

## Objectif

Rendre l'application générique pour supporter plusieurs JDR (maison, Warhammer, D&D 5e, Pathfinder, L5R, etc.)
sans aucun `if (jdr === "x")` dans les composants.

## Principe

Chaque système de jeu enregistre un **module autonome** contenant :
- ses propres **types** (stats, compétences, santé, etc.)
- ses propres **composants Vue** (profil, santé, wizard, etc.)
- son **état initial** (`createBlankState`)
- optionnellement une **fonction de migration**

Un **registry** central résout dynamiquement les bons composants selon `character.systemId`.

---

## Plan d'implémentation

### Phase 1 — Foundation

#### 1.1 Créer `src/systems/types.ts`

```ts
import type { Component, ComputedRef, Ref } from "vue"

export interface SystemComponents {
  CharacterWizard: Component
  ProfileSection: Component
  HealthSection?: Component
  SkillsSection?: Component
  SpellsSection?: Component
  InventorySection?: Component
  NotesSection?: Component
}

export interface SystemDefinition<S = unknown> {
  id: string
  name: string
  description: string
  components: SystemComponents
  createBlankState: () => S
  migrate?: (data: unknown) => S
}
```

#### 1.2 Créer `src/systems/registry.ts`

Fichier central contenant :
- `Map<string, SystemDefinition>` — stockage des systèmes enregistrés
- `defineSystem(def)` — enregistre un système
- `getRegisteredSystems()` — liste des systèmes disponibles (pour le sélecteur)
- **`useSystemComponents(systemId)`** — **le seul composable utilisé par les vues**

```ts
// registry.ts
const systems = new Map<string, SystemDefinition>()

export function defineSystem<S>(def: SystemDefinition<S>) {
  systems.set(def.id, def)
  return def
}

export function getRegisteredSystems() {
  return Array.from(systems.values())
}

export function useSystemComponents(systemId: Ref<string | null> | ComputedRef<string | null>) {
  const id = computed(() => systemId.value)
  const system = computed(() => {
    const found = systems.get(id.value ?? "generic")
    if (!found) throw new Error(`Système inconnu : ${id.value}`)
    return found
  })
  const components = computed(() => system.value.components)
  return components
}
```

Toutes les vues utilisent **exclusivement** `useSystemComponents`. Pas de `useSystem()` à l'extérieur.

#### 1.3 Ajouter `systemId` + `systemData` au modèle

`CharacterState` devient un conteneur générique. Le `profile` commun ne garde que ce qui est universel (nom, avatar).

```ts
interface CharacterState {
  systemId: string
  profile: {
    characterName: string
    role: string
    mood: string
    avatarDataUrl: string
  }
  systemData: unknown       // tout ce qui est propre au système
  updatedAt: string
}

// Le type S est porté par le système :
//   GenericSystemData  →  generic
//   WfrpSystemData     →  warhammer
//   Dnd5eSystemData    →  dnd5e
```

#### 1.4 Mettre à jour `character.helpers.ts`

- `sanitizeState` utilise `system.createBlankState()` via `systemId` (le registry lookup se fait au moment de l'appel)
- Migration auto : un `CharacterState` sans `systemId` = `"generic"`
- Le store appelle `sanitizeState` avec le `systemId` du payload

---

### Phase 2 — Résolution dynamique dans les vues

Chaque vue devient une coquille de 10-15 lignes :

```vue
<!-- ProfileView.vue -->
<template>
  <NoCharacterEmpty v-if="!character" />
  <component :is="components.ProfileSection" v-else />
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia"
import { computed } from "vue"
import { useSystemComponents } from "../systems/registry"
import { useCharacterStore } from "../stores/character"

const { state } = storeToRefs(useCharacterStore())
const character = computed(() => state.value)
const systemId = computed(() => character.value?.systemId ?? null)
const components = useSystemComponents(systemId)
</script>
```

C'est le seul pattern. Toutes les vues se ressemblent. Le `shallowRef` + `watch` est éliminé — `computed` dans le registry suffit.

Chaque composant système reçoit les props dont il a besoin (typiquement `character` et les méthodes `store`).

---

### Phase 3 — Extraction du système actuel

#### 3.1 Créer `src/systems/generic/types.ts`

```ts
export interface GenericSystemData {
  stats: Stat[]                // dex, for, con, int, sag, cha (-5..+5)
  skills: Skill[]              // nom + catégorie + valeur (0..10)
  inventory: InventoryItem[]   // nom + détails + quantité
  notes: NoteEntry[]           // titre + contenu + date
  spells: Spell[]              // nom + école + description
  injuries: Injuries           // light/minor/major/fatal (0..2 chacun)
}
```

#### 3.2 Créer `src/systems/generic/index.ts`

```ts
import { defineSystem } from "../registry"
import GenericCharacterWizard from "./components/GenericCharacterWizard.vue"
import GenericProfileSection from "./components/GenericProfileSection.vue"
// ...
import type { GenericSystemData } from "./types"

export default defineSystem<GenericSystemData>({
  id: "generic",
  name: "Générique",
  description: "Système JDR maison (caracs D6, blessures 8 slots)",
  components: {
    CharacterWizard: GenericCharacterWizard,
    ProfileSection: GenericProfileSection,
    HealthSection: GenericHealthSection,
    SkillsSection: GenericSkillsSection,
    SpellsSection: GenericSpellsSection,
    InventorySection: GenericInventorySection,
    NotesSection: GenericNotesSection,
  },
  createBlankState: () => ({
    stats: [
      { key: "dex", label: "DEX", value: 0 },
      { key: "for", label: "FOR", value: 0 },
      { key: "con", label: "CON", value: 0 },
      { key: "int", label: "INT", value: 0 },
      { key: "sag", label: "SAG", value: 0 },
      { key: "cha", label: "CHA", value: 0 },
    ],
    skills: [],
    inventory: [],
    notes: [],
    spells: [],
    injuries: { light: 0, minor: 0, major: 0, fatal: 0 },
  }),
})
```

#### 3.3 Créer les 7 composants dans `src/systems/generic/components/`

Chaque composant reçoit `character` (de type `CharacterState`) en prop et utilise `getSystemData<GenericSystemData>()` pour accéder aux données typées.

| Composant | Reprend le code de |
|---|---|
| `GenericCharacterWizard.vue` | `CharacterEditor.vue` — étapes : Identité → Stats |
| `GenericProfileSection.vue` | `ProfileView.vue` — avatar, radar, mobile stats |
| `GenericHealthSection.vue` | `HealthPanel.vue` — blessures 8 slots |
| `GenericSkillsSection.vue` | `SkillsView.vue` — CRUD compétences |
| `GenericSpellsSection.vue` | `GrimoireView.vue` — CRUD sorts |
| `GenericInventorySection.vue` | `InventoryView.vue` — CRUD inventaire |
| `GenericNotesSection.vue` | `NotesView.vue` — timeline de notes |

#### 3.4 Supprimer les fichiers devenus redondants

- `src/components/character/CharacterEditor.vue`
- `src/components/character/CharacterEntryGate.vue` (remplacé par le système)
- `src/components/profile/HealthPanel.vue` (dans generic)
- etc.

---

### Phase 4 — Adapter le store

#### 4.1 Méthodes génériques dans `useCharacterStore`

Le store ne connaît plus les types spécifiques. Il expose :

```ts
// store
const getSystemData = <T>(): T | null => {
  if (!state.value) return null
  return state.value.systemData as T
}

const updateSystemData = (patch: Partial<unknown>) => {
  updateActiveCharacter((char) => ({
    ...char,
    systemData: { ...(char.systemData as object), ...patch },
    updatedAt: new Date().toISOString(),
  }))
}
```

#### 4.2 Les composants système accèdent à leurs données

Chaque composant système récupère ses données typées :

```ts
// Dans GenericSkillsSection.vue
const systemData = characterStore.getSystemData<GenericSystemData>()
const skills = computed(() => systemData.value?.skills ?? [])

const addSkill = (skill: Skill) => {
  characterStore.updateSystemData({
    skills: [...(systemData.value?.skills ?? []), skill]
  } satisfies Partial<GenericSystemData>)
}
```

---

### Phase 5 — Enregistrement et sélecteur

#### 5.1 Dans `main.ts`

```ts
import { createApp } from "vue"
// ...
import genericSystem from "./systems/generic"
// import wfrpSystem from "./systems/warhammer"   // plus tard

// Les systèmes s'enregistrent automatiquement via defineSystem()
// Aucune autre action nécessaire

createApp(App).use(pinia).use(router).mount("#app")
```

#### 5.2 Sélecteur de système dans le wizard

- Première étape du wizard : choisir un système parmi `getRegisteredSystems()`
- Stocké dans `draft.systemId`
- Les étapes suivantes sont render via `<component :is="components.CharacterWizard" />`

#### 5.3 Badge système dans la liste des personnages

Dans `CampaignManager`, un badge à côté du nom indique le système (couleur ou icône).

---

## Conception guidée par Warhammer (WFRP 4e)

Pour valider l'architecture, voici le genre de données qu'un module `warhammer` porterait :

```ts
// src/systems/warhammer/types.ts

// Les profils WFRP ont 10 caractéristiques de base
interface WfrpProfile {
  ws: number     // Capacité de combat  (Weapon Skill)
  bs: number     // Capacité de tir     (Ballistic Skill)
  s: number      // Force               (Strength)
  t: number      // Endurance           (Toughness)
  i: number      // Initiative
  ag: number     // Agilité             (Agility)
  dex: number    // Dextérité           (Dexterity)
  int: number    // Intelligence
  wp: number     // Force mentale       (Will Power)
  fel: number    // Sociabilité         (Fellowship)
}

export interface WfrpSystemData {
  profile: {
    base: WfrpProfile           // valeurs de base (espèce)
    talents: WfrpProfile        // bonus des talents
    career: WfrpProfile         // bonus du plan de carrière
    current: WfrpProfile        // profil actuel calculé = base + talents + career
  }
  career: {
    currentName: string          // ex: "Sorcier de village"
    plan: string                 // ex: "Sorcier"
    promotions: number           // échelons (1-4)
    status: string               // ex: "Argent 3"
  }
  fortune: number                // points de destinée / chance
  resolve: number                // points de résolution
  xp: { total: number, available: number }
  skills: Record<string, number> // ex: { "Focalisation": 50, "Discrétion": 30 }
  talents: string[]              // ex: ["Sang-froid", "Sixième sens"]
  spells: WfrpSpell[]            // sorts avec difficulté, ingrédient, incantation
  weapons: Weapon[]              // armes
  armor: { head: number, body: number, leftArm: number, rightArm: number, leftLeg: number, rightLeg: number }
  equipment: string[]
  money: { gold: number, silver: number, brass: number }
}

// defineSystem<WfrpSystemData>({
//   id: "warhammer",
//   name: "Warhammer Fantasy (4e)",
//   ...
//   components: {
//     CharacterWizard:   WarhammerWizard,      // étapes : Espèce → Carrières → Talents
//     ProfileSection:    WarhammerProfile,      // profil complet avec WS/BS/S/T/I/AG/DEX/INT/WP/FEL
//     SkillsSection:     WarhammerSkills,       // compétences en %
//     HealthSection:     WarhammerHealth,       // wounds + critical damage
//     SpellsSection:     WarhammerSpells,       // grimoire avec ingrédients
//     InventorySection:  WarhammerInventory,    // équipement + armes + armure
//     NotesSection:      GenericNotesSection,   // on peut réutiliser le composant d'un autre système
//   },
// })
```

Ce qui est intéressant pour l'architecture :

1. **WFRP a 10 stats (pas 6)** — `GenericProfileSection` ne peut pas marcher, `WarhammerProfile` est complètement différent. L'architecture le gère : chaque système fournit son propre composant.

2. **Calcul dérivé** `current = base + talents + career` — le wizard WFRP calcule `current` automatiquement à chaque modification. Ce calcul vit dans le composant système, pas dans le store.

3. **`NotesSection` réutilisable** — rien n'empêche `warhammer` de réutiliser `GenericNotesSection` si le format est compatible.

4. **Types forts** — chaque système a ses propres types, le `systemData` est casté via `getSystemData<T>()`.

---

## Résumé des fichiers

**Nouveaux fichiers :**

| Fichier | Rôle |
|---|---|
| `src/systems/types.ts` | Interfaces génériques (SystemDefinition, SystemComponents) |
| `src/systems/registry.ts` | `defineSystem()`, `getRegisteredSystems()`, **`useSystemComponents()`** |
| `src/systems/generic/types.ts` | Types du système maison (`GenericSystemData`) |
| `src/systems/generic/index.ts` | Définition du système générique |
| `src/systems/generic/components/GenericCharacterWizard.vue` | Wizard création |
| `src/systems/generic/components/GenericProfileSection.vue` | Profil + radar |
| `src/systems/generic/components/GenericHealthSection.vue` | Blessures |
| `src/systems/generic/components/GenericSkillsSection.vue` | Compétences |
| `src/systems/generic/components/GenericSpellsSection.vue` | Grimoire |
| `src/systems/generic/components/GenericInventorySection.vue` | Inventaire |
| `src/systems/generic/components/GenericNotesSection.vue` | Notes |

**Fichiers modifiés :**

| Fichier | Changement |
|---|---|
| `src/types/character.ts` | `CharacterState` : `systemId` + `systemData` |
| `src/stores/character.ts` | `getSystemData<T>()`, `updateSystemData()`, suppression CRUD spécifique |
| `src/stores/character.helpers.ts` | `sanitizeState` utilise `systems.createBlankState()` |
| `src/views/ProfileView.vue` | Coquille → `<component :is="components.ProfileSection" />` |
| `src/views/SkillsView.vue` | Coquille |
| `src/views/GrimoireView.vue` | Coquille |
| `src/views/InventoryView.vue` | Coquille |
| `src/views/NotesView.vue` | Coquille |
| `src/views/CharacterTunnelView.vue` | Coquille → `<component :is="components.CharacterWizard" />` |
| `src/main.ts` | Import des systèmes |

**Fichiers supprimés :**

| Fichier | Remplacé par |
|---|---|
| `src/components/character/CharacterEditor.vue` | `GenericCharacterWizard.vue` |
| `src/components/character/CharacterEntryGate.vue` | redondant |
| `src/components/character/CampaignManager.vue` | sa logique va dans `generic` ou reste si suffisament générique |
| `src/components/profile/HealthPanel.vue` | `GenericHealthSection.vue` |
| `src/components/profile/StatsRadar.vue` | `GenericProfileSection.vue` (intégré) |
| `src/components/inventory/InventoryList.vue` | `GenericInventorySection.vue` |
| `src/components/notes/NotesTimeline.vue` | `GenericNotesSection.vue` |
| `src/components/spells/SpellForm.vue` | `GenericSpellsSection.vue` (intégré) |
| `src/components/spells/SpellsList.vue` | `GenericSpellsSection.vue` (intégré) |

---

## Ordre des phases

```
Phase 1 — Foundation
  ├── systems/types.ts
  ├── systems/registry.ts + useSystemComponents()
  ├── CharacterState → systemId + systemData
  └── character.helpers.ts adapté

Phase 2 — Résolution dans les vues
  └── Toutes les vues deviennent des coquilles avec useSystemComponents()

Phase 3 — Extraction du système actuel
  ├── types génériques extraits
  ├── defineSystem("generic")
  └── 7 composants créés dans systems/generic/components/

Phase 4 — Store adapté
  ├── getSystemData<T>() / updateSystemData()
  └── CRUD spécifique supprimé du store central

Phase 5 — UI sélecteur
  ├── Choix du système dans le wizard
  └── Badge système dans la liste
```

L'ordre garantit que **chaque phase est fonctionnelle** : après la Phase 1 + 2, l'app marche déjà avec `systemId`, après la Phase 3 tout le code maison bouge sans changer le comportement.

---

## Contrat : pas de `if (jdr === ...)`

```ts
// ❌ Interdit
if (character.systemId === "generic") { ... }

// ✅ Autorisé — le seul point de résolution
const components = useSystemComponents(systemId)
```

Si un comportement diffère, c'est **le composant du système** qui l'implémente. Le reste de l'application ne connaît pas les noms de systèmes.
