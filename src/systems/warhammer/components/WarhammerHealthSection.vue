<template>
  <article class="rounded-2xl border border-white/5 bg-stone-900/40 p-4">
    <div class="mb-3 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <HeartPulse
          class="h-4 w-4 text-red-400"
          :stroke-width="1.8"
        />
        <h3 class="m-0 text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">Blessures</h3>
      </div>
      <span class="font-mono font-black text-white/10"
        >{{ systemData?.wounds.current ?? "?" }}/{{ systemData?.wounds.max ?? "?" }}</span
      >
    </div>

    <div class="mt-3 grid grid-cols-2 gap-3">
      <div>
        <label class="mb-1 block text-[9px] font-bold uppercase tracking-widest text-stone-500">Actuelles</label>
        <StatsStepper
          :model-value="systemData?.wounds.current ?? 0"
          label="Actuelles"
          :min="0"
          :max="systemData?.wounds.max ?? 20"
          no-prefix
          @update:model-value="setWounds('current', $event)"
        />
      </div>
      <div>
        <label class="mb-1 block text-[9px] font-bold uppercase tracking-widest text-stone-500">Mag</label>
        <StatsStepper
          :model-value="systemData?.mag ?? 0"
          label="Mag"
          :min="0"
          :max="20"
          no-prefix
          @update:model-value="setStat('mag', $event)"
        />
      </div>
      <div>
        <label class="mb-1 block text-[9px] font-bold uppercase tracking-widest text-stone-500">Destin</label>
        <StatsStepper
          :model-value="systemData?.fate ?? 0"
          label="Destin"
          :min="0"
          :max="10"
          no-prefix
          @update:model-value="setStat('fate', $event)"
        />
      </div>
      <div>
        <label class="mb-1 block text-[9px] font-bold uppercase tracking-widest text-stone-500">Folie</label>
        <StatsStepper
          :model-value="systemData?.insanity ?? 0"
          label="Folie"
          :min="0"
          :max="20"
          no-prefix
          @update:model-value="setStat('insanity', $event)"
        />
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { HeartPulse } from "@lucide/vue";
import { computed } from "vue";

import StatsStepper from "../../../components/ui/StatStepper.vue";
import { useCharacterStore } from "../../../stores/character";
import type { WfrpSystemData } from "../types";

const characterStore = useCharacterStore();
const systemData = computed(() => characterStore.getSystemData<WfrpSystemData>());

const setWounds = (field: "current", val: number | string) => {
  const current = characterStore.getSystemData<WfrpSystemData>();
  if (!current) return;
  characterStore.updateSystemData<WfrpSystemData>({
    wounds: { ...current.wounds, [field]: Number(val) },
  });
};

const setStat = (field: "mag" | "fate" | "insanity", val: number | string) => {
  const current = characterStore.getSystemData<WfrpSystemData>();
  if (!current) return;
  characterStore.updateSystemData<WfrpSystemData>({
    [field]: Number(val),
  });
};
</script>
