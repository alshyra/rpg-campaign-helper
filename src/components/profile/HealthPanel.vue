<template>
  <div class="rounded-3xl border border-white/5 bg-stone-900/60 p-5 shadow-inner">
    <!-- En-tête -->
    <div class="mb-6 flex items-end justify-between px-1">
      <div class="space-y-1">
        <div class="flex items-center gap-2">
          <!-- HeartPulse icon -->
          <svg viewBox="0 0 24 24" class="h-4 w-4" :class="status.color" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
          </svg>
          <h3 class="m-0 text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">État Vital</h3>
        </div>
        <p class="m-0 font-(family-name:--serif) text-sm font-black italic tracking-wider transition-colors duration-500" :class="status.color">
          {{ status.text }}
        </p>
      </div>
      <span class="font-mono text-2xl font-black leading-none text-white/10">{{ usedSlots }}/8</span>
    </div>

    <!-- Tiers de blessures -->
    <div class="grid gap-3">
      <div v-for="tier in tiers" :key="tier.key">
        <span class="mb-2 block px-1 text-[9px] font-bold uppercase tracking-widest text-stone-500">{{ tier.label }}</span>
        <div class="grid grid-cols-2 gap-2">
          <button
            v-for="boxIdx in [0, 1]"
            :key="boxIdx"
            type="button"
            class="relative h-10 overflow-hidden rounded-xl border-2 transition-all duration-300"
            :class="(profile.injuries[tier.key] || 0) > boxIdx
              ? `bg-gradient-to-br ${tier.color} border-transparent scale-[1.02]`
              : 'border-white/5 bg-black/40 hover:border-white/20'"
            @click="handleBoxClick(tier.key, boxIdx)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Profile } from '../../types/character'

const props = defineProps<{
  profile: Profile
}>()

const emit = defineEmits<{
  update: [patch: Partial<Profile>]
}>()

const tiers: Array<{ key: keyof Profile['injuries']; label: string; color: string }> = [
  { key: 'light', label: 'Légère',  color: 'from-emerald-500 to-emerald-700' },
  { key: 'minor', label: 'Moyenne', color: 'from-amber-500 to-amber-700' },
  { key: 'major', label: 'Grave',   color: 'from-orange-600 to-orange-800' },
  { key: 'fatal', label: 'Fatale',  color: 'from-red-700 to-red-900' }
]

const tierOrder = ['light', 'minor', 'major', 'fatal'] as const

const usedSlots = computed(() =>
  Object.values(props.profile.injuries).reduce((total, value) => total + value, 0)
)

const status = computed(() => {
  const inj = props.profile.injuries
  if ((inj.fatal || 0) >= 2) return { text: 'AGONISANT / MORT', color: 'text-red-600' }
  if ((inj.major || 0) >= 1) return { text: 'BLESSURES GRAVES', color: 'text-orange-500' }
  if ((inj.minor || 0) >= 1) return { text: 'MAL EN POINT',     color: 'text-amber-500' }
  if ((inj.light || 0) >= 1) return { text: 'ÉGRATIGNÉ',        color: 'text-emerald-500' }
  return { text: 'INDEMNE', color: 'text-stone-500' }
})

const handleBoxClick = (tierId: keyof Profile['injuries'], boxIdx: number) => {
  const newInjuries = { ...props.profile.injuries }
  const currentVal = newInjuries[tierId] || 0

  if (boxIdx < currentVal) {
    // Case déjà active → décrémenter
    newInjuries[tierId] = Math.max(0, currentVal - 1)
  } else {
    // Case inactive → remplir le premier slot dispo à partir de ce tier
    const startIdx = tierOrder.indexOf(tierId)
    for (let i = startIdx; i < tierOrder.length; i++) {
      const tId = tierOrder[i]
      if ((newInjuries[tId] || 0) < 2) {
        newInjuries[tId] = (newInjuries[tId] || 0) + 1
        break
      }
    }
  }

  emit('update', { injuries: newInjuries })
}
</script>