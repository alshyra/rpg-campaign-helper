<template>
  <div v-if="!systemData" class="rounded-2xl border border-white/5 bg-stone-900/30 p-4 text-sm text-stone-500">
    Aucun personnage actif.
  </div>

  <div v-else class="grid gap-4">
    <article class="rounded-2xl border border-white/5 bg-stone-900/40 p-4">
      <div class="mb-4 flex items-center gap-4">
        <div class="flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl border border-amber-500/20 bg-amber-950/50 font-(family-name:--serif) text-2xl text-amber-500">
          <span>{{ profile?.characterName?.[0] ?? "?" }}</span>
        </div>
        <div>
          <h2 class="m-0 font-(family-name:--serif) text-2xl text-amber-100">{{ profile?.characterName ?? "Sans nom" }}</h2>
          <p class="m-0 mt-0.5 text-sm text-stone-400">{{ systemData.species }} — {{ systemData.career.current }}</p>
        </div>
      </div>

      <div class="mb-2 flex items-center gap-2 text-xs text-stone-500">
        <span>Plan : {{ systemData.career.plan || "—" }}</span>
        <span class="opacity-30">|</span>
        <span>Statut : {{ systemData.career.status }}</span>
        <span class="opacity-30">|</span>
        <span>Échelons : {{ systemData.career.promotions }}</span>
      </div>

      <div class="mb-3 grid grid-cols-3 gap-2 rounded-xl bg-black/30 p-3 text-xs">
        <div>XP total : <strong class="text-amber-400">{{ systemData.xp.total }}</strong></div>
        <div>XP dispo : <strong class="text-amber-400">{{ systemData.xp.available }}</strong></div>
        <div>Destin : <strong class="text-amber-400">{{ systemData.fate }}</strong></div>
      </div>

      <h3 class="mb-2 text-[10px] font-black uppercase tracking-widest text-amber-500">Profil</h3>
      <div class="grid grid-cols-5 gap-1.5">
        <div
          v-for="stat in CHARACTERISTICS"
          :key="stat.key"
          class="rounded-lg border border-white/5 bg-black/30 p-2 text-center"
        >
          <div class="text-[9px] font-black uppercase tracking-wider text-stone-500">{{ stat.label }}</div>
          <div class="text-lg font-black text-amber-400">{{ getCurrent(stat.key) }}</div>
          <div class="mt-0.5 flex justify-center gap-1 text-[8px] text-stone-600">
            <span>{{ getBase(stat.key) }}</span>
            <span v-if="getSpent(stat.key) > 0" class="text-amber-600/60">+{{ getSpent(stat.key) }}</span>
            <span v-if="getAdvancement(stat.key) > 0" class="text-amber-400/60">+{{ getAdvancement(stat.key) }}</span>
          </div>
        </div>
      </div>
    </article>

    <article class="rounded-2xl border border-white/5 bg-stone-900/40 p-4">
      <h3 class="mb-2 text-[10px] font-black uppercase tracking-widest text-amber-500">Équipement & Argent</h3>
      <div class="mb-2 flex gap-3 text-sm">
        <span class="rounded-lg bg-amber-950/40 px-2 py-1 text-amber-400">{{ systemData.money.gold }} PO</span>
        <span class="rounded-lg bg-stone-800/60 px-2 py-1 text-stone-400">{{ systemData.money.silver }} PA</span>
        <span class="rounded-lg bg-stone-800/60 px-2 py-1 text-stone-400">{{ systemData.money.brass }} PC</span>
      </div>
      <ul v-if="systemData.equipment.length > 0" class="m-0 grid gap-1 pl-4 text-sm text-stone-400">
        <li v-for="item in systemData.equipment" :key="item">{{ item }}</li>
      </ul>
      <p v-else class="m-0 text-xs italic text-stone-600">Aucun équipement</p>
    </article>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia"
import { computed } from "vue"

import { useCharacterStore } from "../../../stores/character"
import type { CharacteristicKey, WfrpSystemData } from "../types"
import { CHARACTERISTICS } from "../types"

const characterStore = useCharacterStore()
const { state } = storeToRefs(characterStore)

const profile = computed(() => state.value?.profile ?? null)
const systemData = computed(() => characterStore.getSystemData<WfrpSystemData>())

const getCurrent = (key: CharacteristicKey) => systemData.value?.characteristics.current[key] ?? 0
const getBase = (key: CharacteristicKey) => systemData.value?.characteristics.base[key] ?? 0
const getSpent = (key: CharacteristicKey) => systemData.value?.characteristics.spent[key] ?? 0
const getAdvancement = (key: CharacteristicKey) => systemData.value?.characteristics.advancements[key] ?? 0
</script>
