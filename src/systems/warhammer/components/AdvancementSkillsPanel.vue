<template>
  <div>
    <h3 class="text-[10px] font-black uppercase tracking-widest text-amber-400">Compétences</h3>
    <p class="text-[9px] text-stone-600">+1 pour 100 XP</p>
    <div
      v-if="skillEntries.length === 0"
      class="mt-2 py-4 text-center text-xs italic text-stone-600"
    >
      Aucune compétence
    </div>
    <div
      v-else
      class="mt-2 grid gap-1"
    >
      <div
        v-for="[name, value] in skillEntries"
        :key="name"
        class="flex items-center justify-between rounded-xl border border-white/5 bg-black/30 px-4 py-2.5"
      >
        <div class="flex items-center gap-3">
          <span class="text-sm text-amber-100">{{ name }}</span>
          <span class="font-mono text-sm font-black text-amber-400">{{ value }}%</span>
        </div>
        <div class="flex items-center gap-1.5">
          <Button
            v-if="value > 0"
            variant="danger"
            small
            :disabled="(data?.xp.available ?? 0) < 100 && value <= 0"
            @click="refundSkill(name, value)"
            >−1</Button
          >
          <Button
            variant="ghost"
            small
            class="text-amber-400"
            :class="(data?.xp.available ?? 0) < 100 ? '!text-stone-600' : '!text-amber-400'"
            :disabled="(data?.xp.available ?? 0) < 100"
            @click="advanceSkill(name)"
          >
            +1
          </Button>
        </div>
      </div>
    </div>
    <div class="mt-3 flex gap-2">
      <FormField
        v-model="newSkillName"
        placeholder="Nouvelle compétence"
        class="flex-1"
        @keydown.enter="addNewSkill"
      />
      <Button
        variant="ghost"
        small
        class="!text-amber-400 shrink-0"
        :disabled="!newSkillName.trim()"
        @click="addNewSkill"
      >
        Ajouter
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";

import Button from "../../../components/ui/Button.vue";
import FormField from "../../../components/ui/FormField.vue";
import { useCharacterStore } from "../../../stores/character";
import type { WfrpSystemData } from "../types";

const characterStore = useCharacterStore();
const data = computed(() => characterStore.getSystemData<WfrpSystemData>());

const skillEntries = computed(() => {
  if (!data.value?.skills) return [];
  return Object.entries(data.value.skills);
});

const newSkillName = ref("");

const addNewSkill = () => {
  const name = newSkillName.value.trim();
  if (!name) return;
  const current = data.value?.skills ?? {};
  characterStore.updateSystemData<WfrpSystemData>({
    skills: { ...current, [name]: 0 },
  });
  newSkillName.value = "";
};

const advanceSkill = (name: string) => {
  const current = characterStore.getSystemData<WfrpSystemData>();
  if (!current) return;
  if (current.xp.available < 100) return;
  const skills = { ...(current.skills ?? {}) };
  skills[name] = (skills[name] ?? 0) + 1;
  characterStore.updateSystemData<WfrpSystemData>({
    skills,
    xp: {
      total: current.xp.total,
      available: current.xp.available - 100,
    },
  });
};

const refundSkill = (name: string, currentValue: number) => {
  if (currentValue < 1) return;
  const current = characterStore.getSystemData<WfrpSystemData>();
  if (!current) return;
  const skills = { ...(current.skills ?? {}) };
  skills[name] = currentValue - 1;
  characterStore.updateSystemData<WfrpSystemData>({
    skills,
    xp: {
      total: current.xp.total,
      available: current.xp.available + 100,
    },
  });
};
</script>
