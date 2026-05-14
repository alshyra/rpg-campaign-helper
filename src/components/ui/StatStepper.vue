<template>
  <div class="stat-stepper">
    <span class="stat-stepper__label">{{ label }}</span>
    <div class="stat-stepper__controls">
      <button
        type="button"
        class="stat-stepper__btn"
        :disabled="modelValue <= min"
        :aria-label="`Diminuer ${label}`"
        @click="decrement"
      >
        –
      </button>
      <span
        class="stat-stepper__value"
        :class="valueClass"
        >{{ formatted }}</span
      >
      <button
        type="button"
        class="stat-stepper__btn"
        :disabled="modelValue >= max"
        :aria-label="`Augmenter ${label}`"
        @click="increment"
      >
        +
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    label: string;
    modelValue: number;
    min?: number;
    max?: number;
  }>(),
  {
    min: -5,
    max: 5,
  },
);

const emit = defineEmits<{
  "update:modelValue": [value: number];
}>();

const decrement = () => emit("update:modelValue", Math.max(props.min, props.modelValue - 1));
const increment = () => emit("update:modelValue", Math.min(props.max, props.modelValue + 1));

const formatted = computed(() => {
  if (props.modelValue > 0) return `+${props.modelValue}`;
  return String(props.modelValue);
});

const valueClass = computed(() => {
  if (props.modelValue > 0) return "stat-stepper__value--positive";
  if (props.modelValue < 0) return "stat-stepper__value--negative";
  return "";
});
</script>

<style scoped>
.stat-stepper {
  display: grid;
  gap: 4px;
}

.stat-stepper__label {
  color: var(--text-soft);
  font-size: 0.78rem;
}

.stat-stepper__controls {
  display: flex;
  align-items: center;
  border: 1px solid rgba(221, 187, 123, 0.16);
  border-radius: 10px;
  background: rgba(13, 10, 8, 0.82);
  overflow: hidden;
}

.stat-stepper__btn {
  flex: 0 0 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: var(--text-soft);
  font-size: 1.05rem;
  cursor: pointer;
  transition:
    background 0.15s,
    color 0.15s;
  font: inherit;
}

.stat-stepper__btn:hover:not(:disabled) {
  background: rgba(221, 187, 123, 0.1);
  color: var(--gold);
}

.stat-stepper__btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.stat-stepper__value {
  min-width: 46px;
  text-align: center;
  font-family: var(--serif);
  font-size: 0.98rem;
  font-weight: 700;
  color: var(--text-soft);
  border-left: 1px solid rgba(221, 187, 123, 0.1);
  border-right: 1px solid rgba(221, 187, 123, 0.1);
  line-height: 34px;
  padding: 0 6px;
}

.stat-stepper__value--positive {
  color: var(--gold);
}

.stat-stepper__value--negative {
  color: #c0a080;
}
</style>
