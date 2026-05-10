<template>
  <nav
    class="bottom-nav fixed bottom-3.5 left-1/2 z-10 grid w-[min(92vw,528px)] -translate-x-1/2 grid-cols-3 gap-2 rounded-3xl border border-(--line) bg-[rgba(17,12,9,0.94)] p-2.5 shadow-[0_22px_50px_rgba(0,0,0,0.45)] backdrop-blur-[18px]"
    aria-label="Navigation principale"
  >
    <RouterLink
      v-for="item in items"
      :key="item.to"
      :to="item.to"
      class="bottom-nav__item grid justify-items-center gap-1.5 rounded-[18px] px-2 py-2.5 text-(--text-soft) transition-colors"
      :class="route.path === item.to ? 'bottom-nav__item--active bg-[rgba(210,160,51,0.14)] text-(--gold)' : ''"
    >
      <span
        class="bottom-nav__icon h-5.5 w-5.5"
        aria-hidden="true"
        v-html="item.icon"
      ></span>
      <span class="bottom-nav__label text-[0.72rem] uppercase tracking-[0.08em]">{{ item.label }}</span>
    </RouterLink>
  </nav>
</template>

<script setup lang="ts">
import { RouterLink, useRoute } from "vue-router";

const route = useRoute();

const items = [
  {
    to: "/profil",
    label: "Profil",
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"/><path d="M5 20a7 7 0 0 1 14 0"/></svg>',
  },
  {
    to: "/inventaire",
    label: "Inventaire",
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8h12"/><path d="M8 4h8l1 4H7l1-4Z"/><path d="M6 8v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V8"/></svg>',
  },
  {
    to: "/notes",
    label: "Notes",
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M8 6h10"/><path d="M8 10h10"/><path d="M8 14h6"/><path d="M5 4h14a1 1 0 0 1 1 1v14l-4-3H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Z"/></svg>',
  },
];
</script>
