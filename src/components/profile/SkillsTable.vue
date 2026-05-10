<template>
  <div class="overflow-hidden rounded-2xl border border-white/5 bg-stone-900/30">
    <table class="w-full text-left text-sm">
      <tbody class="divide-y divide-white/5">
        <tr
          v-for="skill in skills"
          :key="skill.id"
          class="transition-colors hover:bg-white/5"
        >
          <td class="px-4 py-4">
            <strong class="font-bold text-amber-100">{{ skill.name }}</strong>
            <span class="mt-0.5 block text-[10px] font-normal italic text-stone-500">{{ skill.category }}</span>
          </td>
          <td class="px-4 py-4 text-right">
            <FormField
              v-if="!readonly"
              type="number"
              :model-value="skill.value"
              min="0"
              max="10"
              class="skills-table__value"
              @update:model-value="onInput(skill.id, $event)"
            />
            <strong
              v-else
              class="font-mono text-lg font-black text-amber-500"
              >{{ skill.value }}</strong
            >
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import type { Skill } from "../../types/character";
import FormField from "../ui/FormField.vue";

defineProps<{
  skills: Skill[];
  readonly?: boolean;
}>();

const emit = defineEmits<{
  update: [id: string, value: number];
}>();

const onInput = (id: string, value: string | number) => {
  emit("update", id, Number(value));
};
</script>

<style scoped>
.skills-table__value :deep(input) {
  width: 4rem;
  border-radius: 0.5rem;
  border-color: rgb(255 255 255 / 0.1);
  background: rgb(0 0 0 / 0.4);
  padding: 0.25rem 0.5rem;
  text-align: right;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  color: rgb(245 158 11 / 1);
}
</style>
