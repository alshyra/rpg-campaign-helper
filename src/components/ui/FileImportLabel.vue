<template>
  <label
    :class="labelClass"
    v-bind="$attrs"
  >
    <slot>{{ label }}</slot>
    <input
      type="file"
      accept=".json"
      class="absolute inset-0 opacity-0 cursor-pointer"
      @change="$emit('file-selected', $event)"
    />
  </label>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    label?: string;
    variant?: "button" | "icon-button";
  }>(),
  {
    variant: "button",
    label: "Importer",
  },
);

defineEmits<{
  "file-selected": [event: Event];
}>();

const labelClass = computed(() => {
  const base = "relative overflow-hidden";
  if (props.variant === "icon-button") {
    return `${base} inline-flex items-center justify-center size-10 rounded-xl border border-(--line-strong) bg-[rgba(27,20,16,0.84)] text-(--text) cursor-pointer [&_svg]:size-[18px]`;
  }
  return `${base} flex w-full items-center justify-center gap-2.5 rounded-2xl border border-white/10 p-4 bg-[rgba(28,20,15,0.5)] text-(--text) font-bold cursor-pointer transition-colors duration-200 hover:border-amber-500/50`;
});
</script>

<style scoped></style>
