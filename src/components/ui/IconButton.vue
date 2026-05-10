<template>
  <button
    :class="['icon-button', { 'icon-button--square': square, 'icon-button--ghost': ghost }]"
    :type="type"
    v-bind="$attrs"
  >
    <component
      :is="resolvedIcon"
      v-if="resolvedIcon"
      :size="size"
      :stroke-width="strokeWidth"
    />
    <slot v-else />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import * as LucideIcons from '@lucide/vue'

const props = withDefaults(defineProps<{
  square?: boolean
  ghost?: boolean
  type?: 'button' | 'submit' | 'reset'
  icon?: string
  size?: number
  strokeWidth?: number
}>(), {
  square: false,
  ghost: false,
  type: 'button',
  size: 18,
  strokeWidth: 1.8,
})

const resolvedIcon = computed(() =>
  props.icon ? ((LucideIcons as Record<string, unknown>)[props.icon] ?? null) : null
)
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

.icon-button--ghost {
  border-color: transparent;
  background: transparent;
}

.icon-button--square :deep(svg) {
  width: 18px;
  height: 18px;
}
</style>