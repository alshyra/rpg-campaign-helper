<template>
  <article
    class="campaign-item group flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-white/5 bg-stone-900/40 p-5 transition-all hover:border-amber-500/30 hover:bg-stone-800/60"
    :class="{ 'campaign-item--active border-amber-500/40 bg-[rgba(210,160,51,0.08)]': isActive }"
    role="button"
    tabindex="0"
    @click="emit('select')"
    @keydown.enter.prevent="emit('select')"
    @keydown.space.prevent="emit('select')"
  >
    <div class="flex items-center gap-4">
      <!-- Avatar initiale -->
      <div
        class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-950/50 font-(family-name:--serif) text-xl text-amber-500"
      >
        {{ characterName[0] }}
      </div>
      <div>
        <h4 class="m-0 text-lg font-bold text-amber-100 transition-colors group-hover:text-amber-400">
          {{ characterName }}
        </h4>
        <p class="m-0 text-xs italic text-stone-500">{{ role }}</p>
      </div>
    </div>
    <!-- Chevron droit -->
    <svg
      viewBox="0 0 24 24"
      class="h-5 w-5 shrink-0 text-stone-700 transition-all group-hover:text-amber-500"
      fill="none"
      stroke="currentColor"
      stroke-width="1.8"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <path d="M9 6l6 6-6 6" />
    </svg>
  </article>
</template>

<script setup lang="ts">
defineProps<{
  characterName: string;
  role: string;
  isActive?: boolean;
}>();

const emit = defineEmits<{
  select: [];
  delete: [];
}>();
</script>

<style scoped></style>
