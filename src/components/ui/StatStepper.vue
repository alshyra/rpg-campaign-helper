<template>
  <div class="flex justify-start">
    <div class="inline-flex items-center rounded-xl border border-[rgba(221,187,123,0.16)] bg-[rgba(13,10,8,0.82)]">
      <button
        type="button"
        class="flex size-[34px] shrink-0 items-center justify-center bg-transparent border-none text-(--text-soft) text-[1.05rem] cursor-pointer font-inherit transition-[background,color] duration-150 hover:not-disabled:bg-[rgba(221,187,123,0.1)] hover:not-disabled:text-(--gold) disabled:opacity-30 disabled:cursor-not-allowed"
        :disabled="modelValue <= min"
        :aria-label="`Diminuer ${label}`"
        @click="decrement"
      >
        –
      </button>
      <span
        class="min-w-[46px] text-center font-(family-name:--serif) text-[0.98rem] font-bold leading-[34px] px-1.5 border-x border-[rgba(221,187,123,0.1)]"
        :class="{
          'text-(--gold)': modelValue > 0,
          'text-[#c0a080]': modelValue < 0,
          'text-(--text-soft)': modelValue === 0,
        }"
        >{{ formatted }}</span
      >
      <button
        type="button"
        class="flex size-[34px] shrink-0 items-center justify-center bg-transparent border-none text-(--text-soft) text-[1.05rem] cursor-pointer font-inherit transition-[background,color] duration-150 hover:not-disabled:bg-[rgba(221,187,123,0.1)] hover:not-disabled:text-(--gold) disabled:opacity-30 disabled:cursor-not-allowed"
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
    noPrefix?: boolean;
  }>(),
  {
    min: -5,
    max: 5,
    noPrefix: false,
  },
);

const emit = defineEmits<{
  "update:modelValue": [value: number];
}>();

const decrement = () => emit("update:modelValue", Math.max(props.min, props.modelValue - 1));
const increment = () => emit("update:modelValue", Math.min(props.max, props.modelValue + 1));

const formatted = computed(() => {
  if (!props.noPrefix && props.modelValue > 0) return `+${props.modelValue}`;
  return String(props.modelValue);
});

</script>

<style scoped></style>
