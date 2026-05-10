<template>
  <div class="section-heading grid gap-1">
    <p class="section-heading__eyebrow m-0 text-[0.76rem] uppercase tracking-[0.18em] text-(--gold)">{{ eyebrow }}</p>
    <h2 class="section-heading__title m-0 font-(family-name:--serif) text-[1.28rem] font-semibold">{{ title }}</h2>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  eyebrow: string
  title: string
}>()
</script>