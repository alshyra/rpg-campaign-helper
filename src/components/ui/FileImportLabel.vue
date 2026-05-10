<template>
  <label :class="['file-import-label', `file-import-label--${variant}`]" v-bind="$attrs">
    <slot>{{ label }}</slot>
    <input 
      type="file" 
      accept=".json"
      @change="$emit('file-selected', $event)"
    />
  </label>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  label?: string
  variant?: 'button' | 'icon-button'
}>(), {
  variant: 'button',
  label: 'Importer',
})

defineEmits<{
  'file-selected': [event: Event]
}>()
</script>

<style scoped>
.file-import-label {
  position: relative;
  overflow: hidden;
}

.file-import-label input {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
}

.file-import-label--button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: 14px;
  border: 1px solid var(--line-strong);
  padding: 12px 16px;
  background: rgba(27, 20, 16, 0.84);
  color: var(--text);
  cursor: pointer;
}

.file-import-label--icon-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  border: 1px solid var(--line-strong);
  background: rgba(27, 20, 16, 0.84);
  color: var(--text);
  cursor: pointer;
}

.file-import-label--icon-button :deep(svg) {
  width: 18px;
  height: 18px;
}
</style>
