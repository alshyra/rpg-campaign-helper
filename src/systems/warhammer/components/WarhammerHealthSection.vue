<template>
  <article class="rounded-2xl border border-white/5 bg-stone-900/40 p-4">
    <div class="mb-3 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <HeartPulse class="h-4 w-4 text-red-400" :stroke-width="1.8" />
        <h3 class="m-0 text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">Blessures</h3>
      </div>
      <span class="font-mono font-black text-white/10">{{ systemData?.wounds.current ?? "?" }}/{{ systemData?.wounds.max ?? "?" }}</span>
    </div>

    <div class="grid grid-cols-2 gap-3">
      <div>
        <label class="mb-1 block text-[9px] font-bold uppercase tracking-widest text-stone-500">Actuelles</label>
        <StatsStepper
          :model-value="systemData?.wounds.current ?? 0"
          label="Actuelles"
          :min="0"
          :max="systemData?.wounds.max ?? 20"
          @update:model-value="setWounds('current', $event)"
        />
      </div>
      <div>
        <label class="mb-1 block text-[9px] font-bold uppercase tracking-widest text-stone-500">Maximum</label>
        <StatsStepper
          :model-value="systemData?.wounds.max ?? 12"
          label="Maximum"
          :min="1"
          :max="50"
          @update:model-value="setWounds('max', $event)"
        />
      </div>
    </div>

    <div class="mt-3 flex gap-4 text-xs text-stone-500">
      <span>Destin : <strong class="text-amber-400">{{ systemData?.fate ?? 0 }}</strong></span>
      <span>Résolution : <strong class="text-amber-400">{{ systemData?.resolve ?? 0 }}</strong></span>
    </div>
  </article>
</template>

<script setup lang="ts">
import { HeartPulse } from "@lucide/vue"
import { computed } from "vue"

import { useCharacterStore } from "../../../stores/character"
import type { WfrpSystemData } from "../types"
import StatsStepper from "../../../components/ui/StatStepper.vue"

const characterStore = useCharacterStore()
const systemData = computed(() => characterStore.getSystemData<WfrpSystemData>())

const setWounds = (field: "current" | "max", val: number | string) => {
  const current = characterStore.getSystemData<WfrpSystemData>()
  if (!current) return
  characterStore.updateSystemData<WfrpSystemData>({
    wounds: { ...current.wounds, [field]: Number(val) },
  })
}
</script>
