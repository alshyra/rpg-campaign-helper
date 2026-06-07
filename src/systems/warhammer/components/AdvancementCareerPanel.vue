<template>
  <div
    class="rounded-xl border p-4"
    :class="isCareerComplete ? 'border-emerald-500/20 bg-emerald-950/20' : 'border-amber-500/10 bg-amber-950/20'"
  >
    <div class="flex items-center justify-between gap-3">
      <div>
        <p class="text-[10px] font-black uppercase tracking-widest text-stone-500">Carrière</p>
        <p class="font-(family-name:--serif) text-lg font-black text-amber-100">{{ data?.career.current }}</p>
      </div>
      <div class="text-right">
        <p
          class="text-[10px] font-black uppercase tracking-widest"
          :class="isCareerComplete ? 'text-emerald-400' : 'text-stone-500'"
        >
          {{ isCareerComplete ? "COMPLÈTE" : "EN COURS" }}
        </p>
        <p
          v-if="!isCareerComplete"
          class="text-[10px] text-stone-500"
        >
          {{ remainingAdvances }} avancements restants
        </p>
        <p
          v-else
          class="text-[10px] text-emerald-400/70"
        >
          Tous les avancements achetés
        </p>
      </div>
    </div>
    <div
      v-if="!isCareerComplete && careerInfo"
      class="mt-2 text-[9px] text-stone-600"
    >
      <p>
        Max : {{ maxCaracLabel
        }}<span v-if="careerInfo.secondary.wounds > 0">, Blessures +{{ careerInfo.secondary.wounds }}</span
        ><span v-if="careerInfo.secondary.mag > 0">, PM +{{ careerInfo.secondary.mag }}</span>
      </p>
      <div class="mt-1.5 flex flex-wrap gap-x-3 gap-y-0.5">
        <span
          v-for="stat in careerAdvancementBreakdown"
          :key="stat.label"
          class="text-stone-500"
        >
          {{ stat.label }}
          <span :class="stat.current >= stat.max ? 'text-emerald-400' : 'text-amber-400'"
            >{{ stat.current }}/{{ stat.max }}</span
          >
        </span>
      </div>
    </div>
    <div
      v-if="careerInfo"
      class="mt-3"
    >
      <div class="flex items-center justify-between text-[9px] text-stone-600">
        <span>Avancement carrière</span>
        <span>{{ careerProgressPct }}%</span>
      </div>
      <div class="mt-1 h-2 overflow-hidden rounded-full bg-black/40">
        <div
          class="h-full rounded-full transition-all duration-300"
          :class="careerProgressPct >= 100 ? 'bg-emerald-600' : 'bg-amber-700'"
          :style="{ width: careerProgressPct + '%' }"
        />
      </div>
    </div>
    <div
      v-if="isCareerComplete && !data?.career.plan"
      class="mt-3 flex flex-wrap items-center gap-2"
    >
      <span class="text-[10px] text-stone-500">Prochaine carrière :</span>
      <div class="min-w-44">
        <Select
          v-model="planDraft"
          :options="careerExitOptions"
          placeholder="— Choisir —"
          trigger-class="text-xs"
        />
      </div>
      <Button
        v-if="planDraft"
        variant="success"
        small
        @click="setPlan"
      >
        Définir
      </Button>
    </div>
    <div
      v-if="isCareerComplete && data?.career.plan"
      class="mt-2 flex items-center gap-2"
    >
      <span class="text-[10px] text-amber-400">Plan : {{ data.career.plan }}</span>
      <Button
        variant="ghost"
        small
        @click="clearPlan"
        >Changer</Button
      >
    </div>
  </div>
  <div
    v-if="careerHistory.length > 0"
    class="mt-3 border-t border-white/5 pt-3"
  >
    <p class="text-[10px] font-bold uppercase tracking-widest text-stone-600">Carrières complétées</p>
    <div class="mt-1 flex flex-wrap gap-1.5">
      <span
        v-for="(c, i) in careerHistory"
        :key="i"
        class="rounded bg-stone-800 px-2 py-0.5 text-[10px] text-stone-400"
        >{{ c }}</span
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";

import Button from "../../../components/ui/Button.vue";
import Select from "../../../components/ui/Select.vue";
import { useCharacterStore } from "../../../stores/character";
import { CAREER_DATA } from "../careers";
import type { CharacteristicKey, WfrpSystemData } from "../types";

const characterStore = useCharacterStore();
const data = computed(() => characterStore.getSystemData<WfrpSystemData>());

const careerInfo = computed(() => {
  if (!data.value?.career.current) return null;
  return CAREER_DATA[data.value.career.current] ?? null;
});

const careerHistory = computed(() => {
  return data.value?.career.history ?? [];
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

const careerProgressPct = computed(() => {
  if (!careerInfo.value || !data.value) return 0;
  const cinfo = careerInfo.value;
  let maxSteps = 0;
  let curSteps = 0;
  for (const key of ["ws", "bs", "s", "t", "ag", "int", "wp", "fel"] as CharacteristicKey[]) {
    const maxAdv = cinfo.advances[key] ?? 0;
    maxSteps += maxAdv / 5;
    curSteps += Math.min(data.value.characteristics.advancements[key] ?? 0, maxAdv) / 5;
  }
  maxSteps += cinfo.secondary.wounds;
  curSteps += Math.min(data.value.woundsAdvancements ?? 0, cinfo.secondary.wounds);
  maxSteps += cinfo.secondary.mag;
  curSteps += Math.min(data.value.magAdvancements ?? 0, cinfo.secondary.mag);
  if (maxSteps <= 0) return 100;
  return Math.round((curSteps / maxSteps) * 100);
});

const isCareerComplete = computed(() => {
  if (!careerInfo.value || !data.value) return false;
  const cinfo = careerInfo.value;
  for (const key of ["ws", "bs", "s", "t", "ag", "int", "wp", "fel"] as CharacteristicKey[]) {
    const maxAdv = cinfo.advances[key] ?? 0;
    const curAdv = data.value.characteristics.advancements[key] ?? 0;
    if (curAdv < maxAdv) return false;
  }
  if ((data.value.woundsAdvancements ?? 0) < cinfo.secondary.wounds) return false;
  if ((data.value.magAdvancements ?? 0) < cinfo.secondary.mag) return false;
  return true;
});

const remainingAdvances = computed(() => {
  if (!careerInfo.value || !data.value) return 0;
  const cinfo = careerInfo.value;
  let remaining = 0;
  for (const key of ["ws", "bs", "s", "t", "ag", "int", "wp", "fel"] as CharacteristicKey[]) {
    const maxAdv = cinfo.advances[key] ?? 0;
    const curAdv = data.value.characteristics.advancements[key] ?? 0;
    remaining += Math.max(0, maxAdv - curAdv) / 5;
  }
  remaining += Math.max(0, cinfo.secondary.wounds - (data.value.woundsAdvancements ?? 0));
  remaining += Math.max(0, cinfo.secondary.mag - (data.value.magAdvancements ?? 0));
  return remaining;
});

const careerAdvancementBreakdown = computed(() => {
  if (!careerInfo.value || !data.value) return [];
  const cinfo = careerInfo.value;
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
  const result: { label: string; current: number; max: number }[] = [];
  for (const key of ["ws", "bs", "s", "t", "ag", "int", "wp", "fel"] as CharacteristicKey[]) {
    const max = cinfo.advances[key] ?? 0;
    if (max > 0) {
      result.push({ label: labelMap[key], current: data.value.characteristics.advancements[key] ?? 0, max });
    }
  }
  if (cinfo.secondary.wounds > 0) {
    result.push({ label: "PV", current: data.value.woundsAdvancements ?? 0, max: cinfo.secondary.wounds });
  }
  if (cinfo.secondary.mag > 0) {
    result.push({ label: "PM", current: data.value.magAdvancements ?? 0, max: cinfo.secondary.mag });
  }
  return result;
});

const careerExits = computed(() => {
  if (!careerInfo.value) return [];
  return careerInfo.value.exits;
});

const careerExitOptions = computed(() => {
  return careerExits.value.map((name) => ({ value: name, label: name }));
});

const planDraft = ref("");

const setPlan = () => {
  if (!planDraft.value) return;
  const current = characterStore.getSystemData<WfrpSystemData>();
  if (!current) return;
  characterStore.updateSystemData<WfrpSystemData>({
    career: {
      current: planDraft.value,
      plan: "",
      status: current.career.status,
      promotions: (current.career.promotions ?? 0) + 1,
      history: [...(current.career.history ?? []), current.career.current],
    },
  });
  planDraft.value = "";
};

const clearPlan = () => {
  const current = characterStore.getSystemData<WfrpSystemData>();
  if (!current) return;
  characterStore.updateSystemData<WfrpSystemData>({
    career: { ...current.career, plan: "" },
  });
  planDraft.value = "";
};
</script>
