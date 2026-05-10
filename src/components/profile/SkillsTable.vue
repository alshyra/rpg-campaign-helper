<template>
  <div class="overflow-hidden rounded-2xl border border-white/5 bg-stone-900/30">
    <table class="w-full text-left text-sm">
      <tbody class="divide-y divide-white/5">
        <tr
          v-for="skill in skills"
          :key="skill.id"
          class="transition-colors hover:bg-white/5"
        >
          <td class="px-4 py-4">
            <strong class="font-bold text-amber-100">{{ skill.name }}</strong>
            <span class="mt-0.5 block text-[10px] font-normal italic text-stone-500">{{ skill.category }}</span>
          </td>
          <td class="px-4 py-4 text-right">
            <strong class="font-mono text-lg font-black text-amber-500">{{ skill.value }}</strong>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { computed } from "vue";

import { useCharacterStore } from "../../stores/character";

const characterStore = useCharacterStore();
const { state } = storeToRefs(characterStore);

const skills = computed(() => state.value?.skills ?? []);
</script>
