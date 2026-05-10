<template>
  <nav
    class="bottom-nav fixed bottom-3.5 left-1/2 z-10 grid w-[min(92vw,528px)] -translate-x-1/2 md:left-0 md:w-full md:translate-x-0 grid-cols-4 gap-2 rounded-3xl border border-(--line) bg-[rgba(17,12,9,0.94)] p-2.5 shadow-[0_22px_50px_rgba(0,0,0,0.45)] backdrop-blur-[18px]"
    aria-label="Navigation principale"
  >
    <RouterLink
      v-for="item in items"
      :key="item.to"
      :to="item.to"
      class="bottom-nav__item grid justify-items-center gap-1.5 rounded-[18px] px-2 py-2.5 text-(--text-soft) transition-colors"
      :class="route.path === item.to ? 'bottom-nav__item--active bg-[rgba(210,160,51,0.14)] text-(--gold)' : ''"
    >
      <component
        :is="item.icon"
        class="bottom-nav__icon h-5.5 w-5.5"
        :stroke-width="1.8"
        aria-hidden="true"
      />
      <span class="bottom-nav__label text-[0.72rem] uppercase tracking-[0.08em]">{{ item.label }}</span>
    </RouterLink>
  </nav>
</template>

<script setup lang="ts">
import { Backpack, NotebookText, UserRound, Wand2 } from "@lucide/vue";
import { storeToRefs } from "pinia";
import { computed } from "vue";
import { RouterLink, useRoute } from "vue-router";

import { useCharacterStore } from "../../stores/character";

const route = useRoute();
const characterStore = useCharacterStore();
const { activeCampaignId } = storeToRefs(characterStore);

const characterId = computed(() => activeCampaignId.value || (route.params.id as string));

const itemDefs = [
  { name: "profile", label: "Profil", icon: UserRound },
  { name: "inventory", label: "Inventaire", icon: Backpack },
  { name: "spells", label: "Grimoire", icon: Wand2 },
  { name: "notes", label: "Notes", icon: NotebookText },
];

const getItemPath = (name: string) => `/characters/${characterId.value}/${name}`;

const items = computed(() =>
  itemDefs.map((def) => ({
    ...def,
    to: getItemPath(def.name),
  })),
);
</script>
