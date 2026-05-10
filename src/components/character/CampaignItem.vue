<template>
  <article
    class="campaign-item grid cursor-pointer grid-cols-[minmax(0,1fr)_auto] items-center gap-3"
    :class="{ 'campaign-item--active': isActive }"
    role="button"
    tabindex="0"
    @click="emit('select')"
    @keydown.enter.prevent="emit('select')"
    @keydown.space.prevent="emit('select')"
  >
    <div>
      <strong>{{ characterName }}</strong>
      <p>{{ role }}</p>
    </div>
    <button
      class="icon-button icon-button--square campaign-item__delete"
      type="button"
      aria-label="Supprimer ce personnage"
      @click.stop="emit('delete')"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 7h14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
        <path d="M9 7V5h6v2" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
        <path d="M8 7v11h8V7" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
        <path d="M10.5 10.5v5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
        <path d="M13.5 10.5v5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
      </svg>
    </button>
  </article>
</template>

<script setup lang="ts">
defineProps<{
  characterName: string
  role: string
  isActive?: boolean
}>()

defineEmits<{
  select: []
  delete: []
}>()
</script>

<style scoped>
.campaign-item {
  padding: 10px 12px;
  border-radius: 14px;
  border: 1px solid rgba(221, 187, 123, 0.12);
  background: rgba(13, 10, 8, 0.72);
}

.campaign-item--active {
  border-color: rgba(221, 187, 123, 0.4);
  background: rgba(210, 160, 51, 0.08);
}

.campaign-item__delete {
  color: var(--danger);
}
</style>
