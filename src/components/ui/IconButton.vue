<template>
  <button
    :class="buttonClass"
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
import * as LucideIcons from "@lucide/vue";
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    square?: boolean;
    ghost?: boolean;
    type?: "button" | "submit" | "reset";
    icon?: string;
    size?: number;
    strokeWidth?: number;
  }>(),
  {
    square: false,
    ghost: false,
    type: "button",
    size: 18,
    strokeWidth: 1.8,
  },
);

const resolvedIcon = computed(() =>
  props.icon ? ((LucideIcons as Record<string, unknown>)[props.icon] ?? null) : null,
);

const buttonClass = computed(() => {
  const classes = [
    "inline-flex items-center justify-center gap-2 rounded-xl border-(--line-strong) p-3",
    "cursor-pointer bg-[rgba(27,20,16,0.84)] text-(--text) font-inherit",
  ];
  if (props.square) {
    classes.push("!size-10 !p-0 !rounded-xl [&_svg]:size-[18px]");
  }
  if (props.ghost) {
    classes.push("border-transparent bg-transparent");
  }
  return classes.join(" ");
});
</script>

<style scoped></style>
