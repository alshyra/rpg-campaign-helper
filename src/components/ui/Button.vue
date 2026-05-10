<template>
  <button
    :class="['button', `button--${variant}`]"
    :type="type"
    v-bind="$attrs"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: "primary" | "secondary";
    type?: "button" | "submit" | "reset";
  }>(),
  {
    variant: "secondary",
    type: "button",
  },
);
</script>

<style scoped>
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: 14px;
  border: 1px solid var(--line-strong);
  padding: 12px 16px;
  cursor: pointer;
  font: inherit;
  color: inherit;
}

.button--primary {
  background: linear-gradient(180deg, #c6932c, #a6751f);
  color: #1d130c;
  font-weight: 700;
}

.button--secondary {
  background: rgba(27, 20, 16, 0.84);
  color: var(--text);
}
</style>
