<template>
  <button
    :class="['button', `button--${variant}`, { 'button--sm': small }]"
    :type="type"
    v-bind="$attrs"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
withDefaults(
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
  transition: border-color 0.15s, background 0.15s;
}

.button:disabled {
  opacity: 0.3;
  cursor: default;
}

.button--sm {
  padding: 6px 10px;
  border-radius: 10px;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
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

.button--danger {
  border-color: rgba(220, 38, 38, 0.3);
  background: rgba(127, 29, 29, 0.15);
  color: #f87171;
}

.button--danger:hover {
  border-color: rgba(220, 38, 38, 0.5);
  background: rgba(127, 29, 29, 0.25);
}

.button--success {
  border-color: rgba(16, 185, 129, 0.3);
  background: rgba(6, 78, 59, 0.2);
  color: #34d399;
}

.button--success:hover {
  border-color: rgba(16, 185, 129, 0.5);
  background: rgba(6, 78, 59, 0.3);
}

.button--ghost {
  border-color: rgba(255, 255, 255, 0.1);
  background: transparent;
  color: var(--text-soft);
}

.button--ghost:hover {
  border-color: rgba(255, 255, 255, 0.2);
  color: var(--text);
}
</style>
