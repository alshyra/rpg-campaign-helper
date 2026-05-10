<template>
  <AppCard>
    <div class="skills-table grid gap-2.5">
      <div class="skills-table__head grid grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_70px] items-center gap-3 border-b border-(--line) pb-2 text-(--text-soft) max-[420px]:grid-cols-1">
        <span>Compétence</span>
        <span>Catégorie</span>
        <span>Val.</span>
      </div>
      <div v-for="skill in skills" :key="skill.id" class="skills-table__row grid grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_70px] items-center gap-3 max-[420px]:grid-cols-1">
        <div>
          <strong class="font-(family-name:--serif) font-semibold">{{ skill.name }}</strong>
        </div>
        <em class="text-(--text-soft)">{{ skill.category }}</em>
        <label v-if="!readonly" class="skills-table__value">
          <input
            :value="skill.value"
            type="number"
            min="0"
            max="10"
            @input="onInput(skill.id, $event)"
          />
        </label>
        <strong v-else class="skills-table__readonly">{{ skill.value }}</strong>
      </div>
    </div>
  </AppCard>
</template>

<script setup lang="ts">
import type { Skill } from '../../types/character'
import AppCard from '../ui/AppCard.vue'

defineProps<{
  skills: Skill[]
  readonly?: boolean
}>()

const emit = defineEmits<{
  update: [id: string, value: number]
}>()

const onInput = (id: string, event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update', id, Number(target.value))
}
</script>