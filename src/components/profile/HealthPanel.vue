<template>
  <AppCard>
    <div class="health-panel grid gap-3.5">
      <div class="health-panel__top flex items-start justify-between gap-3">
        <div>
          <p class="health-panel__label">Blessures</p>
          <strong>{{ usedSlots }} / 8</strong>
        </div>
        <span class="health-panel__pill">{{ Math.round(ratio * 100) }}%</span>
      </div>
      <div class="health-bar">
        <div class="health-bar__fill" :style="{ width: `${ratio * 100}%` }"></div>
      </div>
      <div class="health-panel__inputs grid grid-cols-2 gap-3.5 max-[420px]:grid-cols-1">
        <label v-for="injury in injuries" :key="injury.key" class="field field--small">
          <span>{{ injury.label }}</span>
          <input :value="profile.injuries[injury.key]" type="number" min="0" max="2" @input="onNumber(injury.key, $event)" />
        </label>
      </div>
    </div>
  </AppCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Profile } from '../../types/character'
import AppCard from '../ui/AppCard.vue'

const props = defineProps<{
  profile: Profile
  ratio: number
}>()

const emit = defineEmits<{
  update: [patch: Partial<Profile>]
}>()

const injuries: Array<{ key: keyof Profile['injuries']; label: string }> = [
  { key: 'light', label: 'Légères' },
  { key: 'minor', label: 'Mineures' },
  { key: 'major', label: 'Majeures' },
  { key: 'fatal', label: 'Fatales' }
]

const usedSlots = computed(() =>
  Object.values(props.profile.injuries).reduce((total, value) => total + value, 0)
)

const onNumber = (key: keyof Profile['injuries'], event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update', {
    injuries: {
      ...props.profile.injuries,
      [key]: Math.max(0, Math.min(2, Number(target.value)))
    }
  })
}

  <style scoped>
  .health-bar {
    height: 14px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.07);
    overflow: hidden;
  }

  .health-bar__fill {
    height: 100%;
    border-radius: inherit;
    background: linear-gradient(90deg, #2a8d5b 0%, #4fc080 100%);
  }

  .health-panel__pill {
    align-self: center;
    padding: 7px 11px;
    border-radius: 999px;
    background: var(--gold-soft);
    color: var(--gold);
    font-size: 0.82rem;
  }
  </style>
</script>