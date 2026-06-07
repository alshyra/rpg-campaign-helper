<template>
  <article class="rounded-2xl border border-white/5 bg-stone-900/40 p-4">
    <h2 class="m-0 font-(family-name:--serif) text-xl text-amber-100">Avancement</h2>
    <p class="mt-1 text-xs text-stone-500">
      {{ data?.career.current }}<span v-if="data?.career.plan"> → {{ data?.career.plan }}</span>
    </p>

    <div class="mt-4 grid gap-6">
      <AdvancementXpPanel />
      <AdvancementCareerPanel />
      <AdvancementCharacteristicsPanel />
      <AdvancementWoundsMagicPanel />
      <AdvancementSkillsPanel />
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from "vue";

import { useCharacterStore } from "../../../stores/character";
import type { WfrpSystemData } from "../types";

import AdvancementXpPanel from "./AdvancementXpPanel.vue";
import AdvancementCareerPanel from "./AdvancementCareerPanel.vue";
import AdvancementCharacteristicsPanel from "./AdvancementCharacteristicsPanel.vue";
import AdvancementWoundsMagicPanel from "./AdvancementWoundsMagicPanel.vue";
import AdvancementSkillsPanel from "./AdvancementSkillsPanel.vue";

const characterStore = useCharacterStore();
const data = computed(() => characterStore.getSystemData<WfrpSystemData>());
</script>
