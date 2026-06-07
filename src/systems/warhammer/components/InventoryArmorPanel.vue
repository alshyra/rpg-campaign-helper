<template>
  <article class="rounded-2xl border border-white/5 bg-stone-900/40 p-4">
    <h3 class="mb-3 text-[10px] font-black uppercase tracking-widest text-amber-500">Armure (PA)</h3>
    <div
      v-if="armor"
      class="grid grid-cols-2 gap-3"
      data-testid="armor-grid"
    >
      <div
        v-for="slot in armorSlots"
        :key="slot.key"
        class="rounded-lg border border-white/5 bg-black/30 p-3 text-center"
      >
        <div class="mb-1 text-[9px] font-bold uppercase tracking-wider text-stone-500">{{ slot.label }}</div>
        <div class="flex items-center justify-center gap-2">
          <IconButton
            square
            ghost
            class="h-7 w-7 rounded-lg p-0 text-stone-400 hover:text-red-400 disabled:opacity-20 disabled:hover:text-stone-400"
            :disabled="armor[slot.key] <= 0"
            data-testid="armor-dec"
            @click="adjust(slot.key, -1)"
            >–</IconButton
          >
          <span
            class="w-8 text-center font-mono font-black text-amber-400"
            data-testid="armor-value"
            >{{ armor[slot.key] }}</span
          >
          <IconButton
            square
            ghost
            class="h-7 w-7 rounded-lg p-0 text-stone-400 hover:text-amber-400 disabled:opacity-20 disabled:hover:text-stone-400"
            :disabled="armor[slot.key] >= 10"
            data-testid="armor-inc"
            @click="adjust(slot.key, 1)"
            >+</IconButton
          >
        </div>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from "vue";
import IconButton from "../../../components/ui/IconButton.vue";
import { useCharacterStore } from "../../../stores/character";
import type { WfrpSystemData, WfrpArmor } from "../types";

interface ArmorSlot {
  key: keyof WfrpArmor;
  label: string;
}

const armorSlots: ArmorSlot[] = [
  { key: "head", label: "Tête" },
  { key: "leftArm", label: "Bras G" },
  { key: "rightArm", label: "Bras D" },
  { key: "body", label: "Corps" },
  { key: "leftLeg", label: "Jambe G" },
  { key: "rightLeg", label: "Jambe D" },
];

const characterStore = useCharacterStore();
const systemData = computed(() => characterStore.getSystemData<WfrpSystemData>());

const armor = computed(() => systemData.value?.armor ?? null);

const adjust = (slot: keyof WfrpArmor, delta: number) => {
  const current = systemData.value?.armor;
  if (!current) return;
  const next = current[slot] + delta;
  if (next < 0 || next > 10) return;
  characterStore.updateSystemData<WfrpSystemData>({
    armor: { ...current, [slot]: next },
  });
};
</script>
