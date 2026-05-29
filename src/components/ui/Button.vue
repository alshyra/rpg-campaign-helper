<template>
  <button
    :class="buttonClass"
    :type="type"
    v-bind="$attrs"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    variant?: "primary" | "secondary" | "danger" | "success" | "ghost";
    type?: "button" | "submit" | "reset";
    small?: boolean;
  }>(),
  {
    variant: "secondary",
    type: "button",
    small: false,
  },
);

const buttonClass = computed(() => {
  const base = [
    "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3",
    "cursor-pointer transition-colors duration-150",
    "disabled:opacity-30 disabled:cursor-default",
  ];

  if (props.small) {
    base.push("!rounded-lg !px-2.5 !py-1.5", "text-[0.65rem] font-bold tracking-wider uppercase");
  }

  switch (props.variant) {
    case "primary":
      base.push("border-(--line-strong)", "bg-linear-to-b from-[#c6932c] to-[#a6751f] text-[#1d130c] font-bold");
      break;
    case "secondary":
      base.push("border-(--line-strong)", "bg-[rgba(27,20,16,0.84)] text-(--text)");
      break;
    case "danger":
      base.push("border-red-600/30 bg-red-900/15 text-red-400", "hover:border-red-600/50 hover:bg-red-900/25");
      break;
    case "success":
      base.push("border-emerald-500/30 bg-emerald-900/20 text-emerald-400", "hover:border-emerald-500/50 hover:bg-emerald-900/30");
      break;
    case "ghost":
      base.push("border-white/10 bg-transparent text-(--text-soft)", "hover:border-white/20 hover:text-(--text)");
      break;
  }

  return base.join(" ");
});
</script>

<style scoped></style>
