<template>
  <div>
    <!-- Blessures -->
    <div>
      <h3 class="text-[10px] font-black uppercase tracking-widest text-amber-400">Blessures</h3>
      <p class="text-[9px] text-stone-600">+1 pour 100 XP</p>
      <div class="mt-2 rounded-xl border border-white/5 bg-black/30 px-4 py-4">
        <div class="flex items-center justify-between gap-4">
          <div class="flex items-baseline gap-2">
            <span class="font-(family-name:--serif) text-2xl font-black text-amber-400">{{
              data?.wounds.max ?? "?"
            }}</span>
            <span class="text-[10px] text-stone-500">PV</span>
          </div>
          <div class="flex items-center gap-1.5">
            <Button
              v-if="(data?.woundsAdvancements ?? 0) > 0"
              variant="danger"
              small
              @click="refundWounds"
              >−1</Button
            >
            <Button
              variant="ghost"
              small
              class="text-amber-400"
              :class="!canAdvanceWounds ? '!text-stone-600' : '!text-amber-400'"
              :disabled="!canAdvanceWounds"
              @click="advanceWounds"
            >
              +1
            </Button>
          </div>
        </div>
      </div>
    </div>

    <!-- Magie -->
    <div
      v-if="showMagic"
      class="mt-6"
    >
      <h3 class="text-[10px] font-black uppercase tracking-widest text-amber-400">Magie</h3>
      <p class="text-[9px] text-stone-600">+1 PM pour 100 XP</p>
      <div class="mt-2 flex items-center justify-between rounded-xl border border-white/5 bg-black/30 px-4 py-3">
        <div class="flex items-center gap-3">
          <span class="font-(family-name:--serif) text-lg font-black text-amber-400">{{ data?.mag ?? 0 }}</span>
          <span
            v-if="(data?.magAdvancements ?? 0) > 0"
            class="text-[10px] text-amber-600"
            >({{ data?.magAdvancements }})</span
          >
        </div>
        <div class="flex items-center gap-1.5">
          <Button
            v-if="(data?.magAdvancements ?? 0) > 0"
            variant="danger"
            small
            @click="refundMag"
            >−1</Button
          >
          <Button
            variant="ghost"
            small
            class="text-amber-400"
            :class="!canAdvanceMag ? '!text-stone-600' : '!text-amber-400'"
            :disabled="!canAdvanceMag"
            @click="advanceMag"
          >
            +1
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
import type { WfrpSystemData } from "../types";

const characterStore = useCharacterStore();
const data = computed(() => characterStore.getSystemData<WfrpSystemData>());

const careerInfo = computed(() => {
  if (!data.value?.career.current) return null;
  return CAREER_DATA[data.value.career.current] ?? null;
});

const showMagic = computed(() => {
  if (!careerInfo.value) return false;
  return (careerInfo.value.secondary.mag ?? 0) > 0;
});

const canAdvanceWounds = computed(() => {
  if (!data.value || !careerInfo.value) return false;
  if (data.value.xp.available < 100) return false;
  return (data.value.woundsAdvancements ?? 0) < careerInfo.value.secondary.wounds;
});

const canAdvanceMag = computed(() => {
  if (!data.value || !careerInfo.value) return false;
  if (data.value.xp.available < 100) return false;
  return (data.value.magAdvancements ?? 0) < careerInfo.value.secondary.mag;
});

const advanceWounds = () => {
  const current = characterStore.getSystemData<WfrpSystemData>();
  if (!current) return;
  if (current.xp.available < 100) return;
  if (!careerInfo.value) return;
  if ((current.woundsAdvancements ?? 0) >= careerInfo.value.secondary.wounds) return;
  characterStore.updateSystemData<WfrpSystemData>({
    wounds: { ...current.wounds, max: current.wounds.max + 1 },
    woundsAdvancements: (current.woundsAdvancements ?? 0) + 1,
    xp: {
      total: current.xp.total,
      available: current.xp.available - 100,
    },
  });
};

const refundWounds = () => {
  const current = characterStore.getSystemData<WfrpSystemData>();
  if (!current) return;
  if ((current.woundsAdvancements ?? 0) < 1) return;
  characterStore.updateSystemData<WfrpSystemData>({
    wounds: { ...current.wounds, max: current.wounds.max - 1 },
    woundsAdvancements: (current.woundsAdvancements ?? 0) - 1,
    xp: {
      total: current.xp.total,
      available: current.xp.available + 100,
    },
  });
};

const advanceMag = () => {
  const current = characterStore.getSystemData<WfrpSystemData>();
  if (!current) return;
  if (current.xp.available < 100) return;
  if (!careerInfo.value) return;
  if ((current.magAdvancements ?? 0) >= careerInfo.value.secondary.mag) return;
  characterStore.updateSystemData<WfrpSystemData>({
    mag: (current.mag ?? 0) + 1,
    magAdvancements: (current.magAdvancements ?? 0) + 1,
    xp: {
      total: current.xp.total,
      available: current.xp.available - 100,
    },
  });
};

const refundMag = () => {
  const current = characterStore.getSystemData<WfrpSystemData>();
  if (!current) return;
  if ((current.magAdvancements ?? 0) < 1) return;
  characterStore.updateSystemData<WfrpSystemData>({
    mag: (current.mag ?? 0) - 1,
    magAdvancements: (current.magAdvancements ?? 0) - 1,
    xp: {
      total: current.xp.total,
      available: current.xp.available + 100,
    },
  });
};
</script>
