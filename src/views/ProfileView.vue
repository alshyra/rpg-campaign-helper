<template>
  <div class="grid gap-8">
    <NoCharacterEmpty v-if="!character" />

    <template v-else>
      <!-- Section Aptitudes -->
      <section class="grid gap-4">
        <div class="flex items-center justify-between px-2">
          <h2 class="m-0 font-(family-name:--serif) text-2xl text-amber-100">Aptitudes</h2>
        </div>
        <StatsRadar :stats="stats" />
      </section>
      <!-- Section Compétences -->
      <section class="grid gap-4">
        <h3 class="px-2 text-[10px] font-black uppercase tracking-[0.2em] text-amber-600">Compétences spéciales</h3>
        <SkillsTable />
      </section>
      <!-- Section État Vital -->
      <HealthPanel />
    </template>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { computed } from "vue";

import NoCharacterEmpty from "../components/character/NoCharacterEmpty.vue";
import HealthPanel from "../components/profile/HealthPanel.vue";
import SkillsTable from "../components/profile/SkillsTable.vue";
import StatsRadar from "../components/profile/StatsRadar.vue";
import { useCharacterStore } from "../stores/character";

const characterStore = useCharacterStore();
const { state } = storeToRefs(characterStore);

const character = computed(() => state.value);
const stats = computed(() => state.value?.stats ?? []);
</script>
