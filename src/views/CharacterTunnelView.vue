<template>
  <template v-if="resolvedSystemId">
    <component :is="components.CharacterWizard" />
  </template>

  <template v-else-if="isCreating">
    <AppCard>
      <div class="grid gap-4 p-2">
        <h2 class="m-0 font-(family-name:--serif) text-2xl text-amber-100">Nouveau personnage</h2>
        <p class="m-0 text-sm text-(--text-soft)">Choisis ton système de jeu</p>

        <div class="grid gap-2.5">
          <button
            v-for="system in availableSystems"
            :key="system.id"
            type="button"
            class="system-card flex items-center gap-4 rounded-2xl border border-white/5 bg-stone-900/40 p-5 text-left transition-all hover:border-amber-500/30 hover:bg-stone-800/60"
            @click="chooseSystem(system.id)"
          >
            <div class="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-amber-500/20 bg-amber-950/50 font-(family-name:--serif) text-xl font-black text-amber-500">
              {{ system.name[0] }}
            </div>
            <div>
              <h4 class="m-0 text-lg font-bold text-amber-100">{{ system.name }}</h4>
              <p class="m-0 mt-0.5 text-xs text-stone-500">{{ system.description }}</p>
            </div>
            <ChevronRight class="ml-auto h-5 w-5 shrink-0 text-stone-700" :stroke-width="1.8" />
          </button>
        </div>
      </div>
    </AppCard>
  </template>
</template>

<script setup lang="ts">
import { ChevronRight } from "@lucide/vue"
import { storeToRefs } from "pinia"
import { computed, ref } from "vue"
import { useRoute } from "vue-router"

import AppCard from "../components/ui/AppCard.vue"
import { useCharacterStore } from "../stores/character"
import { getRegisteredSystems, useSystemComponents } from "../systems/registry"

const availableSystems = getRegisteredSystems()
const route = useRoute()
const { state } = storeToRefs(useCharacterStore())

const isCreating = computed(() => route.name === "character-create")
const chosenSystem = ref<string | null>(null)

const chooseSystem = (id: string) => {
  chosenSystem.value = id
}

const resolvedSystemId = computed(() => {
  // Creating: use chosen system
  if (isCreating.value) return chosenSystem.value
  // Editing: resolve from existing character
  if (state.value) return state.value.systemId
  return null
})

const components = useSystemComponents(resolvedSystemId)
</script>
