<template>
  <nav
    class="bottom-nav fixed bottom-3.5 left-1/2 z-10 grid w-[min(96vw,620px)] -translate-x-1/2 md:left-0 md:w-full md:translate-x-0 gap-1.5 rounded-3xl border border-(--line) bg-[rgba(17,12,9,0.94)] p-2 shadow-[0_22px_50px_rgba(0,0,0,0.45)] backdrop-blur-[18px]"
    :class="colsClass"
    aria-label="Navigation principale"
  >
    <RouterLink
      v-for="item in items"
      :key="item.to"
      :to="item.to"
      class="bottom-nav__item grid justify-items-center gap-1 rounded-[18px] px-1 py-2 text-(--text-soft) transition-colors"
      :class="route.path === item.to ? 'bottom-nav__item--active bg-[rgba(210,160,51,0.14)] text-(--gold)' : ''"
    >
      <component
        :is="item.icon"
        class="bottom-nav__icon h-5 w-5"
        :stroke-width="1.8"
        aria-hidden="true"
      />
      <span class="bottom-nav__label max-[420px]:hidden whitespace-nowrap text-[0.64rem] uppercase tracking-[0.04em]">{{ item.label }}</span>
    </RouterLink>
  </nav>
</template>

<script setup lang="ts">
import { Backpack, NotebookText, Sword, TrendingUp, UserRound, Wand2 } from "@lucide/vue";
import { storeToRefs } from "pinia";
import { computed } from "vue";
import { RouterLink, useRoute } from "vue-router";

import { useCharacterStore } from "../../stores/character";

const route = useRoute();
const characterStore = useCharacterStore();
const { state, activeCampaignId } = storeToRefs(characterStore);

const characterId = computed(() => activeCampaignId.value || (route.params.id as string));

const isWarhammer = computed(() => state.value?.systemId === "warhammer")
const colsClass = computed(() => isWarhammer.value ? "grid-cols-6" : "grid-cols-5")

const itemDefs = [
  { name: "profile", label: "Profil", icon: UserRound },
  { name: "inventory", label: "Inventaire", icon: Backpack },
  { name: "spells", label: "Grimoire", icon: Wand2 },
  { name: "skills", label: "Compétences", icon: Sword },
  { name: "advancement", label: "Avancement", icon: TrendingUp, condition: isWarhammer },
  { name: "notes", label: "Notes", icon: NotebookText },
];

const getItemPath = (name: string) => `/characters/${characterId.value}/${name}`;

const items = computed(() =>
  itemDefs
    .filter((def) => def.condition === undefined || def.condition.value)
    .map(({ condition: _c, ...def }) => ({
      ...def,
      to: getItemPath(def.name),
    })),
);
</script>
