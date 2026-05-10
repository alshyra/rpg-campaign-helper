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
            <label
              v-if="!readonly"
              class="skills-table__value"
            >
              <input
                :value="skill.value"
                type="number"
                min="0"
                max="10"
                class="w-16 rounded-lg border border-white/10 bg-black/40 px-2 py-1 text-right font-mono text-amber-500"
                @input="onInput(skill.id, $event)"
              />
            </label>
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

defineProps<{
  skills: Skill[];
  readonly?: boolean;
}>();

const emit = defineEmits<{
  update: [id: string, value: number];
}>();

const onInput = (id: string, event: Event) => {
  const target = event.target as HTMLInputElement;
  emit("update", id, Number(target.value));
};
</script>
