<template>
  <div
    v-if="!systemData"
    class="rounded-2xl border border-white/5 bg-stone-900/30 p-4 text-sm text-stone-500"
  >
    Aucun personnage actif.
  </div>

  <div
    v-else
    class="grid gap-4"
  >
    <article class="rounded-2xl border border-white/5 bg-stone-900/40 p-4">
      <div class="mb-4 flex items-center gap-4">
        <div
          class="flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl border border-amber-500/20 bg-amber-950/50 font-(family-name:--serif) text-2xl text-amber-500"
        >
          <span>{{ profile?.characterName?.[0] ?? "?" }}</span>
        </div>
        <div>
          <h2 class="m-0 font-(family-name:--serif) text-2xl text-amber-100">
            {{ profile?.characterName ?? "Sans nom" }}
          </h2>
          <p class="m-0 mt-0.5 text-sm text-stone-400">{{ systemData.species }} — {{ systemData.career.current }}</p>
        </div>
      </div>

      <div class="mb-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-stone-500">
        <span v-if="systemData.career.plan">Plan : {{ systemData.career.plan }}</span>
        <span
          v-if="systemData.career.plan"
          class="opacity-30"
          >|</span
        >
        <span>Statut : {{ systemData.career.status }}</span>
        <span class="opacity-30">|</span>
        <span>Échelons : {{ systemData.career.promotions }}</span>
        <span
          v-if="careerHistory.length > 0"
          class="opacity-30"
          >|</span
        >
        <span
          v-if="careerHistory.length > 0"
          class="text-stone-500"
        >
          Anciennes carrières :
          <span
            v-for="(c, i) in careerHistory"
            :key="i"
            class="text-stone-400"
          >
            {{ c }}<span v-if="i < careerHistory.length - 1">, </span>
          </span>
        </span>
      </div>

      <div class="mb-3">
        <Button
          variant="ghost"
          small
          @click="goToAdvancement"
        >
          Gain de niveau →
        </Button>
      </div>

      <div class="mb-3 grid grid-cols-4 gap-2 rounded-xl bg-black/30 p-3 text-xs">
        <div>
          XP total : <strong class="text-amber-400">{{ systemData.xp.total }}</strong>
        </div>
        <div>
          XP dispo : <strong class="text-amber-400">{{ systemData.xp.available }}</strong>
        </div>
        <div>
          Destin : <strong class="text-amber-400">{{ systemData.fate }}</strong>
        </div>
        <div>
          Folie : <strong class="text-amber-400">{{ systemData.insanity }}</strong>
        </div>
      </div>

      <h3 class="mb-2 text-[10px] font-black uppercase tracking-widest text-amber-500">Profil</h3>
      <div class="grid grid-cols-4 gap-1.5">
        <div
          v-for="stat in CHARACTERISTICS"
          :key="stat.key"
          class="relative rounded-lg border border-white/5 bg-black/30 p-2 text-center"
        >
          <div class="text-[9px] font-black uppercase tracking-wider text-stone-500">{{ stat.label }}</div>
          <div class="text-lg font-black text-amber-400">{{ getCurrent(stat.key) }}</div>
          <div class="mt-0.5 flex justify-center gap-1 text-[8px] text-stone-600">
            <span>{{ getBase(stat.key) }}</span>
            <span
              v-if="getSpent(stat.key) > 0"
              class="text-amber-600/60"
              >+{{ getSpent(stat.key) }}</span
            >
            <span
              v-if="getAdvancement(stat.key) > 0"
              class="text-amber-400/60"
              >+{{ getAdvancement(stat.key) }}</span
            >
          </div>
          <span
            v-if="isCareerCharacteristic(stat.key)"
            class="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[8px] font-black text-stone-950 shadow-sm"
            title="Caractéristique de carrière"
            >C</span
          >
        </div>
      </div>

      <h4 class="mb-1 mt-3 text-[9px] font-black uppercase tracking-widest text-stone-500">Sous-stats</h4>
      <div class="grid grid-cols-4 gap-1.5">
        <div class="rounded-lg border border-white/5 bg-black/30 p-2 text-center">
          <div class="text-[9px] font-black uppercase tracking-wider text-stone-500">A</div>
          <div class="text-lg font-black text-amber-400">{{ systemData.attacks ?? 1 }}</div>
        </div>
        <div class="rounded-lg border border-white/5 bg-black/30 p-2 text-center">
          <div class="text-[9px] font-black uppercase tracking-wider text-stone-500">B</div>
          <div class="text-lg font-black text-amber-400">
            {{ systemData.strengthBonus ?? computeBonus(getCurrent("s")) }}
          </div>
        </div>
        <div class="rounded-lg border border-white/5 bg-black/30 p-2 text-center">
          <div class="text-[9px] font-black uppercase tracking-wider text-stone-500">BE</div>
          <div class="text-lg font-black text-amber-400">
            {{ systemData.toughnessBonus ?? computeBonus(getCurrent("t")) }}
          </div>
        </div>
        <div class="rounded-lg border border-white/5 bg-black/30 p-2 text-center">
          <div class="text-[9px] font-black uppercase tracking-wider text-stone-500">M</div>
          <div class="text-lg font-black text-amber-400">{{ systemData.movement ?? 4 }}</div>
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
      <ul
        v-if="systemData.equipment.length > 0"
        class="m-0 grid gap-1 pl-4 text-sm text-stone-400"
      >
        <li
          v-for="item in systemData.equipment"
          :key="item"
        >
          {{ item }}
        </li>
      </ul>
      <p
        v-else
        class="m-0 text-xs italic text-stone-600"
      >
        Aucun équipement
      </p>
    </article>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { computed } from "vue";
import { useRouter } from "vue-router";

import Button from "../../../components/ui/Button.vue";
import { useCharacterStore } from "../../../stores/character";
import { CAREER_DATA } from "../careers";
import type { CharacteristicKey, WfrpSystemData } from "../types";
import { CHARACTERISTICS, computeBonus } from "../types";

const characterStore = useCharacterStore();
const router = useRouter();
const { state, activeCampaignId } = storeToRefs(characterStore);

const characterId = computed(() => activeCampaignId.value || (router.currentRoute.value.params.id as string));

const goToAdvancement = () => {
  router.push(`/characters/${characterId.value}/advancement`);
};

const profile = computed(() => state.value?.profile ?? null);
const systemData = computed(() => characterStore.getSystemData<WfrpSystemData>());

const careerInfo = computed(() => {
  if (!systemData.value?.career.current) return null;
  return CAREER_DATA[systemData.value.career.current] ?? null;
});

const isCareerCharacteristic = (key: CharacteristicKey): boolean => {
  if (!careerInfo.value) return false;
  return (careerInfo.value.advances[key] ?? 0) > 0;
};

const careerHistory = computed(() => {
  return systemData.value?.career.history ?? [];
});
const getCurrent = (key: CharacteristicKey) => systemData.value?.characteristics.current[key] ?? 0;
const getBase = (key: CharacteristicKey) => systemData.value?.characteristics.base[key] ?? 0;
const getSpent = (key: CharacteristicKey) => systemData.value?.characteristics.spent[key] ?? 0;
const getAdvancement = (key: CharacteristicKey) => systemData.value?.characteristics.advancements[key] ?? 0;
</script>
