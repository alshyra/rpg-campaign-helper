<template>
  <div :class="['field', { 'field--full': full }]">
    <label v-if="label" :for="id">
      <span>{{ label }}</span>
    </label>
    <input 
      v-if="type !== 'textarea'"
      :id="id"
      :type="type"
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      v-bind="$attrs"
    />
    <textarea 
      v-else
      :id="id"
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
      v-bind="$attrs"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  id?: string
  label?: string
  type?: string
  modelValue?: string | number
  full?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  modelValue: '',
  full: false,
})

defineEmits<{
  'update:modelValue': [value: string | number]
}>()

const id = computed(() => props.id || `field-${Math.random().toString(36).slice(2, 9)}`)
</script>

<style scoped>
.field {
  display: grid;
  gap: 8px;
}

.field--full {
  grid-column: 1 / -1;
}

.field span {
  color: var(--text-soft);
  font-size: 0.85rem;
}

.field input,
.field textarea {
  width: 100%;
  border: 1px solid rgba(221, 187, 123, 0.16);
  border-radius: 12px;
  background: rgba(13, 10, 8, 0.82);
  color: var(--text);
  padding: 10px 12px;
  font: inherit;
}

.field textarea {
  resize: vertical;
}
</style>
