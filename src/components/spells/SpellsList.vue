<template>
  <div v-if="spells.length === 0" class="spells-list__empty">
    <AppCard>
      <p class="m-0 text-center text-(--text-soft)">
        Aucun sort. Ajoute ton premier sort pour commencer.
      </p>
    </AppCard>
  </div>

  <div v-else class="spells-list grid gap-3">
    <article
      v-for="spell in spells"
      :key="spell.id"
      class="spell-item group rounded-2xl border border-white/5 bg-stone-900/40 p-5 transition-all hover:border-amber-500/30 hover:bg-stone-800/60"
    >
      <div class="flex items-start justify-between gap-4">
        <div class="flex-1">
          <div class="flex items-baseline gap-2">
            <h4 class="m-0 text-lg font-bold text-amber-100 group-hover:text-amber-400">
              {{ spell.name }}
            </h4>
            <span class="text-xs text-stone-500">{{ spell.school }}</span>
          </div>
          <p class="m-0 mt-2 leading-relaxed text-(--text-soft)">
            {{ spell.description }}
          </p>
        </div>

        <div class="flex gap-2 shrink-0">
          <IconButton
            type="button"
            ghost
            square
            :size="16"
            @click="$emit('edit', spell)"
            aria-label="Modifier le sort"
          >
            <Pencil class="h-4 w-4" :stroke-width="1.8" />
          </IconButton>
          <IconButton
            type="button"
            ghost
            square
            :size="16"
            @click="$emit('delete', spell.id)"
            aria-label="Supprimer le sort"
          >
            <Trash2 class="h-4 w-4" :stroke-width="1.8" />
          </IconButton>
        </div>
      </div>
    </article>
  </div>
</template>

<script setup lang="ts">
import { Pencil, Trash2 } from "@lucide/vue";

import AppCard from "../ui/AppCard.vue";
import IconButton from "../ui/IconButton.vue";
import type { Spell } from "../../types/character";

defineProps<{
  spells: Spell[];
}>();

defineEmits<{
  edit: [spell: Spell];
  delete: [id: string];
}>();
</script>

<style scoped>
.spells-list {
  display: grid;
  grid-auto-rows: max-content;
}
</style>
