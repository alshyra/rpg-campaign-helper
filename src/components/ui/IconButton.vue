<template>
  <button 
    :class="['icon-button', { 'icon-button--square': square }]"
    :type="type"
    v-bind="$attrs"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  square?: boolean
  type?: 'button' | 'submit' | 'reset'
}>(), {
  square: false,
  type: 'button',
})
</script>

<style scoped>
.icon-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: 14px;
  border: 1px solid var(--line-strong);
  padding: 12px 16px;
  cursor: pointer;
  background: rgba(27, 20, 16, 0.84);
  color: var(--text);
  font: inherit;
}

.icon-button--square {
  width: 40px;
  height: 40px;
  padding: 0;
  border-radius: 12px;
}

.icon-button--square :deep(svg) {
  width: 18px;
  height: 18px;
}
</style>
