<template>
  <div>
    <h3 class="text-[10px] font-black uppercase tracking-widest text-amber-400">Caractéristiques</h3>
    <p class="text-[9px] text-stone-600">+5 pour 100 XP</p>
    <p class="text-[9px] text-stone-600">Max par carrière : {{ maxCaracLabel }}</p>
    <div class="mt-2 grid gap-2">
      <div
        v-for="stat in CHARACTERISTICS"
        :key="stat.key"
        class="flex items-center justify-between rounded-xl border border-white/5 bg-black/30 px-4 py-3"
      >
        <div class="flex items-center gap-3">
          <span class="w-8 text-[10px] font-black uppercase tracking-wider text-stone-500">{{ stat.label }}</span>
          <span class="font-(family-name:--serif) text-lg font-black text-amber-400">{{
            currentCharValue(stat.key)
          }}</span>
          <span
            v-if="charAdvancements(stat.key) > 0"
            class="text-[10px] text-amber-600"
            >({{ charAdvancements(stat.key) }})</span
          >
          <span
            v-if="isCareerCharacteristic(stat.key)"
            class="rounded bg-amber-500/15 px-1.5 py-0.5 text-[8px] font-bold tracking-wider text-amber-500"
            >CARRIÈRE</span
          >
        </div>
        <div class="flex items-center gap-1.5">
          <Button
            v-if="charAdvancements(stat.key) > 0"
            variant="danger"
            small
            @click="refundChar(stat.key)"
            >−5</Button
          >
          <Button
            variant="ghost"
            small
            class="text-amber-400"
            :class="!canAdvanceChar(stat.key) ? '!text-stone-600' : '!text-amber-400'"
            :disabled="!canAdvanceChar(stat.key)"
            @click="advanceChar(stat.key)"
          >
            +5
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

import Button from "../../../components/ui/Button.vue";
import { useCharacterStore } from "../../../stores/character";
import { CAREER_DATA } from "../careers";
import type { CharacteristicKey, WfrpSystemData } from "../types";
import { CHARACTERISTICS, computeBonus } from "../types";

const characterStore = useCharacterStore();
const data = computed(() => characterStore.getSystemData<WfrpSystemData>());

const careerInfo = computed(() => {
  if (!data.value?.career.current) return null;
  return CAREER_DATA[data.value.career.current] ?? null;
});

const maxCaracLabel = computed(() => {
  if (!careerInfo.value) return "—";
  const list = Object.entries(careerInfo.value.advances)
    .filter(([, v]) => v > 0)
    .map(([k]) => {
      const labelMap: Record<string, string> = {
        ws: "CC",
        bs: "CT",
        s: "F",
        t: "E",
        ag: "AG",
        int: "INT",
        wp: "FM",
        fel: "SOC",
      };
      return labelMap[k as keyof typeof labelMap] ?? k;
    });
  return list.join(", ");
});

const currentCharValue = (key: CharacteristicKey) => {
  if (!data.value) return 0;
  const c = data.value.characteristics;
  return c.base[key] + c.spent[key] + c.advancements[key];
};

const charAdvancements = (key: CharacteristicKey) => {
  if (!data.value) return 0;
  return data.value.characteristics.advancements[key];
};

const isCareerCharacteristic = (key: CharacteristicKey): boolean => {
  if (!careerInfo.value) return false;
  return (careerInfo.value.advances[key] ?? 0) > 0;
};

const canAdvanceChar = (key: CharacteristicKey) => {
  if (!data.value || !careerInfo.value) return false;
  if (data.value.xp.available < 100) return false;
  const maxAdv = careerInfo.value.advances[key] ?? 0;
  return (data.value.characteristics.advancements[key] ?? 0) < maxAdv;
};

const advanceChar = (key: CharacteristicKey) => {
  const current = characterStore.getSystemData<WfrpSystemData>();
  if (!current) return;
  if (current.xp.available < 100) return;
  if (!careerInfo.value) return;
  const maxAdv = careerInfo.value.advances[key] ?? 0;
  if ((current.characteristics.advancements[key] ?? 0) >= maxAdv) return;
  const adv = { ...current.characteristics.advancements };
  adv[key] = (adv[key] ?? 0) + 5;
  const c = current.characteristics;
  const newCurrent = { ...c.current };
  newCurrent[key] = c.base[key] + c.spent[key] + adv[key];
  const patch: Partial<WfrpSystemData> = {
    characteristics: {
      ...c,
      advancements: adv,
      current: newCurrent,
    },
    xp: {
      total: current.xp.total,
      available: current.xp.available - 100,
    },
  };
  if (key === "s") {
    patch.strengthBonus = computeBonus(newCurrent[key]);
  }
  if (key === "t") {
    patch.toughnessBonus = computeBonus(newCurrent[key]);
  }
  characterStore.updateSystemData<WfrpSystemData>(patch);
};

const refundChar = (key: CharacteristicKey) => {
  const current = characterStore.getSystemData<WfrpSystemData>();
  if (!current) return;
  const adv = { ...current.characteristics.advancements };
  if ((adv[key] ?? 0) < 5) return;
  adv[key] = adv[key] - 5;
  const c = current.characteristics;
  const newCurrent = { ...c.current };
  newCurrent[key] = c.base[key] + c.spent[key] + adv[key];
  const patch: Partial<WfrpSystemData> = {
    characteristics: {
      ...c,
      advancements: adv,
      current: newCurrent,
    },
    xp: {
      total: current.xp.total,
      available: current.xp.available + 100,
    },
  };
  if (key === "s") {
    patch.strengthBonus = computeBonus(newCurrent[key]);
  }
  if (key === "t") {
    patch.toughnessBonus = computeBonus(newCurrent[key]);
  }
  characterStore.updateSystemData<WfrpSystemData>(patch);
};
</script>
