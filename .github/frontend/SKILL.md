---
name: frontend
description: >
  Règles de codage et d'architecture pour projets Vue.js. USE FOR: créer ou réviser des composants Vue.js,
  structurer des stores Pinia, organiser la logique métier en composables, éviter le prop-drilling,
  séparer UI et logique, refactorer des views ou stores trop volumineux. Déclencher dès que l'utilisateur
  mentionne Vue, Pinia, des composants frontend, ou demande d'architecturer/refactorer une app Vue,
  même sans mot-clé explicite.
---

# Skill — Frontend Vue.js (TypeScript + Pinia)

## Philosophie générale

Produire des composants **courts**, **réutilisables** et **sans logique métier** :

- **Responsabilité unique** : chaque composant/fichier fait une seule chose.
- **Pas de prop-drilling** au-delà de 2 niveaux.
- **Pas d'emits en cascade** : si plusieurs composants partagent une action, la centraliser dans un store ou composable.
- **Composants UI purement présentatifs** : props en entrée, événements UI en sortie, aucun appel API ni logique métier.
- **Views = orchestration uniquement** : une view monte les composants, branche le store, gère le cycle de vie (`onMounted`/`onUnmounted`). Pas de logique métier inline.

---

## Structure de projet

```
src/
├── components/
│   ├── ui/            # Composants génériques présentatifs (UiButton, UiTable…)
│   └── [feature]/     # Composants métier (BackupAppSection, JobStatus…)
├── composables/       # Logique réutilisable (useJobActions, useWs…)
├── stores/            # Pinia stores thématiques — état global + actions async
├── utils/             # Fonctions pures (format, helpers)
└── views/             # Pages/routes — orchestration uniquement
    ├── BackupsView.vue
    └── BackupsView.skeleton.vue   # Skeleton colocalisé avec sa view
```

---

## Règles par couche

### Composants UI (`components/ui/`)

- Props + slots + emit uniquement. Jamais de store, jamais d'appel API.
- Taille cible : **< 100 lignes**.
- Nommage : préfixe `Ui` (ex: `UiButton`, `UiTable`, `UiModal`).

### Composants feature (`components/`)

- Consomment le store via `useXxxStore()`.
- Délèguent toute mutation au store (actions Pinia).
- Logique complexe extraite en composable.
- Taille cible : **< 200 lignes**.

### Views (`views/`)

- **Rôle** : monter les composants + brancher store + cycle de vie.
- **Limite stricte** : pas de logique métier inline dans `<script setup>`.
- Toute logique modale, filtres, sélection → extraire dans un composable dédié (`useBackupTrigger`, `useBackupFilters`…).
- Taille cible : **< 150 lignes** (template inclus).

```vue
<!-- ✅ View allégée -->
<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import { useJobsStore } from "@/stores/jobs";
import { useBackupTrigger } from "@/composables/useBackupTrigger";
import { useJobActions } from "@/composables/useJobActions";

const store = useJobsStore();
const trigger = useBackupTrigger();
const actions = useJobActions();

onMounted(() => {
  store.fetchBackups();
  store.connectBackupsWs();
});
onUnmounted(() => store.disconnectBackupsWs());
</script>
```

### Stores Pinia (`stores/`)

- **Un store par domaine métier**. Dès qu'un store dépasse ~200 lignes, le découper.
- État, getters (computed dérivés), actions async.
- Chaque action async : `loading` + `error` **par domaine** (pas un `loading` global fourre-tout).
- Helper privé `_applyXxx()` pour mutater l'état depuis plusieurs sources (fetch + WebSocket).
- Pas de logique UI, pas d'accès à `$router`.

```ts
// ✅ Pattern loading/error par domaine (issu de jobs.ts)
const backupsLoading = ref(false);
const backupsError = ref<string | null>(null);
const derivationsLoading = ref(false);
const derivationsError = ref<string | null>(null);

// ✅ Helper privé partagé entre fetch HTTP et WebSocket
const _applyBackupsData = (data: JobsResponse) => {
  backupJobs.value = data.jobs;
  backupMetrics.value = {
    total: data.total,
    complete: data.complete,
    failed: data.failed,
    running: data.running,
  };
  backupsLoading.value = false;
  backupsError.value = null;
};
```

**Découpage recommandé pour `jobs.ts`** (trop gros) :

| Nouveau store           | Contenu                                                                                             |
| ----------------------- | --------------------------------------------------------------------------------------------------- |
| `stores/backups.ts`     | `backupJobs`, `backupMetrics`, filtres, `fetchBackups`, `deleteBackup`, `triggerBackup`, WS backups |
| `stores/derivations.ts` | `derivationVmbdds`, `currentDerivation`, `fetchDerivations`, `fetchDerivation`                      |
| `stores/restore.ts`     | `clientBackupPoints`, `currentRestoreJob`, `fetchBackupPoints`, `triggerRestore`, `fetchRestoreJob` |
| `stores/operators.ts`   | `operators`, `fetchOperators`                                                                       |

### Composables (`composables/`)

- Logique réutilisable ou **trop volumineuse pour rester dans une view**.
- Peuvent consommer un store (`useJobsStore()` est ok dans un composable).
- Exposent une API minimale (ne pas tout retourner).

```ts
// ✅ Pattern issu de useJobActions.ts — logique d'action extraite de la view
export const useJobActions = () => {
  const store = useJobsStore();
  const router = useRouter();
  const deleteTarget = ref<string | null>(null);
  // ... état local de l'action

  return { deleteTarget, confirmDelete, executeDelete, goToLogs };
  // Seuls les éléments utiles à la view sont exposés
};
```

**Composables à créer lors du refacto de `BackupsView`** :

| Composable         | Responsabilité extraite                                                                                                                      |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `useBackupTrigger` | État modal trigger : `selectedCronJob`, `availableClients`, `selectedClientKeys`, `loadTriggerClients`, `executeTrigger`, `openReplayModal`… |
| `useBackupFilters` | `applyFilters`, `resetFilters`, binding des filtres store                                                                                    |

### Skeletons

Deux niveaux distincts, qui ne se mélangent pas :

**Niveau UI (`components/ui/`)** — briques atomiques sans contexte métier :

- `UiSkeleton` : bloc générique (width/height configurables)
- `UiMetricCardSkeleton`, `UiTableSkeleton` : formes fixes réutilisables dans n'importe quel contexte

**Niveau métier (`views/`)** — skeleton colocalisé avec sa view :

- `BackupsView.skeleton.vue` vit à côté de `BackupsView.vue`
- Il assemble les `UiXxxSkeleton` pour reproduire fidèlement la mise en page de la view
- Il ne connaît pas le store, ne reçoit aucune prop — pur présentatif

```
views/
├── BackupsView.vue               # v-if="!store.backupsLoading"
├── BackupsView.skeleton.vue      # colocalisé, assemble UiSkeleton/UiTableSkeleton
├── ClientsView.vue
└── ClientsView.skeleton.vue
```

**Montage dans la view** — `v-if` sur le loading du store, pattern fixe :

```vue
<template>
  <div>
    <BackupsViewSkeleton v-if="store.backupsLoading" />
    <UiAlert v-else-if="store.backupsError">{{ store.backupsError }}</UiAlert>
    <template v-else>
      <!-- contenu réel -->
    </template>
  </div>
</template>
```

Règles :

- Toujours 3 états : `loading` → skeleton / `error` → `UiAlert` / nominal → contenu
- Le skeleton métier n'importe jamais le store
- Un skeleton métier par view (pas de skeleton sur les composants feature isolés)
- Nommage : `[NomDeLaView].skeleton.vue` obligatoire pour la colocalisation

### WebSocket (`connectXxxWs` / `disconnectXxxWs`)

- Pattern actuel (dans le store) : acceptable pour l'instant.
- Si le pattern se répète sur 3+ stores → extraire un composable `useWs(url, onMessage)`.
- Toujours coupler `connectXxxWs` dans `onMounted` et `disconnectXxxWs` dans `onUnmounted` de la view.

---

## Arbres de décision

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

---

## Anti-patterns à éviter

| ❌ Anti-pattern                                         | ✅ Alternative                                          |
| ------------------------------------------------------- | ------------------------------------------------------- |
| Store monolithique (ex: `jobs.ts` ~400 lignes)          | Découper : `backups.ts`, `derivations.ts`, `restore.ts` |
| Logique modale/trigger dans `<script setup>` d'une view | Composable `useXxxTrigger`                              |
| `loading` global unique pour des domaines distincts     | `backupsLoading`, `derivationsLoading`… séparés         |
| Props drillées sur 3+ niveaux                           | Store Pinia                                             |
| Skeleton métier qui importe le store                    | Skeleton purement présentatif, sans props               |
| Skeleton dans `components/` sans lien à une view        | Colocalisé dans `views/` à côté de sa view              |
| Logique métier dans le `<template>`                     | `computed` ou composable                                |

---

## Checklist de revue

- [ ] View < 150 lignes — toute logique non-orchestration est dans un composable
- [ ] Store < 200 lignes — ou découpé par domaine
- [ ] `loading` + `error` présents **par domaine** dans chaque store
- [ ] Aucun appel API dans un composant UI
- [ ] Pas de prop-drilling au-delà de 2 niveaux
- [ ] Les composables n'exposent que ce dont la view a besoin
- [ ] Chaque view a son `XxxView.skeleton.vue` colocalisé
- [ ] Pattern 3 états respecté : skeleton → alert erreur → contenu
- [ ] Le skeleton métier n'importe pas le store
