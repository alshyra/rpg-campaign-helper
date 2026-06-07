<template>
  <div class="rounded-xl border border-amber-500/10 bg-amber-950/20 p-4">
    <div class="flex items-center justify-between gap-4">
      <div>
        <p class="text-[10px] font-bold uppercase tracking-widest text-stone-500">XP total</p>
        <p class="font-(family-name:--serif) text-2xl font-black text-amber-300">{{ data?.xp.total ?? 0 }}</p>
      </div>
      <div class="text-right">
        <p class="text-[10px] font-bold uppercase tracking-widest text-stone-500">Disponible</p>
        <p
          class="font-(family-name:--serif) text-2xl font-black"
          :class="xpAvailableClass"
        >
          {{ data?.xp.available ?? 0 }}
        </p>
      </div>
    </div>
    <div class="mt-3 flex flex-wrap gap-2">
      <Button
        variant="ghost"
        small
        @click="earnXp(25)"
        >+25 XP</Button
      >
      <Button
        variant="ghost"
        small
        @click="earnXp(50)"
        >+50 XP</Button
      >
      <Button
        variant="ghost"
        small
        @click="earnXp(100)"
        >+100 XP</Button
      >
      <Button
        variant="ghost"
        small
        @click="earnXp(200)"
        >+200 XP</Button
      >
      <Button
        variant="ghost"
        small
        @click="earnXp(500)"
        >+500 XP</Button
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

import Button from "../../../components/ui/Button.vue";
import { useCharacterStore } from "../../../stores/character";
import type { WfrpSystemData } from "../types";

const characterStore = useCharacterStore();
const data = computed(() => characterStore.getSystemData<WfrpSystemData>());

const xpAvailableClass = computed(() => {
  const av = data.value?.xp.available ?? 0;
  if (av <= 0) return "text-stone-600";
  return "text-amber-300";
});

const earnXp = (amount: number) => {
  const current = characterStore.getSystemData<WfrpSystemData>();
  if (!current) return;
  characterStore.updateSystemData<WfrpSystemData>({
    xp: {
      total: current.xp.total + amount,
      available: current.xp.available + amount,
    },
  });
};
</script>
