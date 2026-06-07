<template>
  <div class="grid gap-3">
    <div class="flex items-center justify-between rounded-xl bg-amber-950/30 px-4 py-3">
      <h3 class="m-0 text-[10px] font-black uppercase tracking-widest text-amber-400">Caractéristiques</h3>
      <span
        class="font-mono text-sm"
        :class="budgetClass"
      >{{ budgetRemaining }} / {{ budgetTotal }} pts</span>
    </div>

    <div class="grid grid-cols-2 gap-2">
      <Button
        v-for="stat in characteristics"
        :key="stat.key"
        :variant="activeStatKey === stat.key ? 'secondary' : 'ghost'"
        type="button"
        class="w-full justify-between! rounded-xl! px-3! py-2.5! text-left!"
        :class="statEntryClass(stat.key)"
        @click="emit('update:activeStatKey', stat.key)"
      >
        <div class="flex items-center justify-between gap-2">
          <div>
            <div class="text-[9px] font-black uppercase tracking-wider text-stone-500">
              {{ stat.label }}
            </div>
            <div class="mt-0.5 text-[9px] text-stone-500">+{{ spent[stat.key] }}</div>
          </div>

          <div class="text-right">
            <div class="text-lg font-black text-amber-400">{{ currentValue(stat.key) }}</div>
          </div>
        </div>
      </Button>
    </div>

    <div class="grid gap-2.5 rounded-2xl border border-amber-500/12 bg-[linear-gradient(180deg,rgba(59,41,21,0.48),rgba(13,10,8,0.92))] p-3.5 shadow-[0_18px_40px_rgba(0,0,0,0.25)]">
      <div class="flex items-start justify-between gap-3">
        <div>
          <div class="text-[9px] font-black uppercase tracking-[0.16em] text-amber-400">Stat active</div>
          <div class="mt-0.5 font-(family-name:--serif) text-xl text-amber-100">{{ activeStat.label }}</div>
          <div class="mt-0.5 text-[10px] text-stone-400">Base {{ getBase(activeStat.key) }} · Cap {{ maxValueFor(activeStat.key) }}</div>
        </div>

        <div class="text-right">
          <div class="text-[9px] font-black uppercase tracking-[0.16em] text-stone-500">Total</div>
          <div class="text-2xl font-black text-amber-300">{{ currentValue(activeStat.key) }}</div>
        </div>
      </div>

      <div class="flex items-center justify-between gap-3 text-[10px] uppercase tracking-wider text-stone-500">
        <span>Investi</span>
        <span class="rounded-full border border-amber-500/20 bg-amber-950/20 px-2 py-1 font-mono text-amber-300">
          +{{ spent[activeStat.key] }} / {{ currentSpentMax }}
        </span>
      </div>

      <div class="grid gap-1">
        <div class="h-6 overflow-hidden rounded-full bg-black/40">
          <div
            class="h-full rounded-full bg-linear-to-r from-amber-900 via-amber-700 to-amber-500 transition-all"
            :style="{ width: barPercent(activeStat.key) + '%' }"
          />
        </div>
        <div class="flex items-center justify-between text-[9px] uppercase tracking-wider text-stone-600">
          <span>base {{ getBase(activeStat.key) }}</span>
          <span>{{ currentValue(activeStat.key) }} / {{ maxValueFor(activeStat.key) }}</span>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-2">
        <Button
          variant="ghost"
          type="button"
          :disabled="spent[activeStat.key] < STEP"
          @click="emit('adjust', { key: activeStat.key, delta: -STEP })"
        >
          Retirer 5
        </Button>
        <Button
          variant="secondary"
          type="button"
          :disabled="spent[activeStat.key] >= currentSpentMax || budgetRemaining < STEP"
          @click="emit('adjust', { key: activeStat.key, delta: STEP })"
        >
          Ajouter 5
        </Button>
      </div>

      <div class="flex items-center justify-between text-[10px] text-stone-500">
        <span>{{ isEditing ? `Race : ${species || "Humain"}` : "Base humaine" }}</span>
        <span>Force {{ computeBonus(currentValue("s")) }} · Endurance {{ computeBonus(currentValue("t")) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import Button from "../../../components/ui/Button.vue";
import type { CharacteristicKey, Characteristics } from "../types";

interface Props {
  characteristics: { key: CharacteristicKey; label: string }[];
  spent: Record<string, number>;
  activeStatKey: CharacteristicKey;
  budgetRemaining: number;
  budgetTotal: number;
  budgetClass: string;
  baseCharacteristics: Characteristics;
  currentSpentMax: number;
  species: string;
  isEditing: boolean;
  STEP: number;
  computeBonus: (value: number) => number;
  currentValue: (key: CharacteristicKey) => number;
  maxValueFor: (key: CharacteristicKey) => number;
  barPercent: (key: CharacteristicKey) => number;
  getBase: (key: CharacteristicKey) => number;
  statEntryClass: (key: CharacteristicKey) => string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  "update:activeStatKey": [key: CharacteristicKey];
  adjust: [payload: { key: string; delta: number }];
}>();

const activeStat = computed(() =>
  props.characteristics.find((s) => s.key === props.activeStatKey) ?? props.characteristics[0],
);
</script>
