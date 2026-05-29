<template>
  <div :class="['grid gap-2', { 'col-span-full': full }]">
    <label
      v-if="label"
      :for="id"
      class="text-(--text-soft) text-sm"
    >
      {{ label }}
    </label>
    <slot>
      <input
        v-if="type !== 'textarea'"
        :id="id"
        :type="type"
        :value="modelValue"
        class="w-full rounded-xl border border-[rgba(221,187,123,0.16)] bg-[rgba(13,10,8,0.82)] px-3 py-[10px] text-(--text) font-inherit"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        v-bind="$attrs"
      />
      <textarea
        v-else
        :id="id"
        :value="modelValue"
        class="w-full resize-y rounded-xl border border-[rgba(221,187,123,0.16)] bg-[rgba(13,10,8,0.82)] px-3 py-[10px] text-(--text) font-inherit"
        @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
        v-bind="$attrs"
      />
    </slot>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

defineOptions({ inheritAttrs: false });

interface Props {
  id?: string;
  label?: string;
  type?: string;
  modelValue?: string | number;
  full?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  type: "text",
  modelValue: "",
  full: false,
});

defineEmits<{
  "update:modelValue": [value: string | number];
}>();

const id = computed(() => props.id || `field-${Math.random().toString(36).slice(2, 9)}`);
</script>

<style scoped></style>
