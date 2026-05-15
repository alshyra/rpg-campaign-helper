<template>
  <div
    class="rounded-3xl border border-white/5 bg-stone-900/60 shadow-inner"
    :class="compact ? 'p-3' : 'p-5'"
  >
    <div
      class="flex items-end justify-between px-1"
      :class="compact ? 'mb-2' : 'mb-6'"
    >
      <div class="space-y-1">
        <div class="flex items-center gap-2">
          <HeartPulse
            :class="[compact ? 'h-3.5 w-3.5' : 'h-4 w-4', status.color]"
            :stroke-width="1.8"
          />
          <h3 class="m-0 text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">État Vital</h3>
        </div>
        <p
          class="m-0 font-(family-name:--serif) font-black italic tracking-wider transition-colors duration-500"
          :class="[compact ? 'text-[0.62rem]' : 'text-sm', status.color]"
        >
          {{ status.text }}
        </p>
      </div>
      <span
        class="font-mono font-black leading-none text-white/10"
        :class="compact ? 'text-lg' : 'text-2xl'"
      >{{ usedSlots }}/8</span>
    </div>

    <div
      class="grid"
      :class="compact ? 'grid-cols-2 gap-2' : 'grid-cols-1 gap-2.5'"
    >
      <div
        v-for="tier in tiers"
        :key="tier.key"
      >
        <span
          class="block px-1 font-bold uppercase tracking-widest text-stone-500"
          :class="compact ? 'mb-1 text-[8px]' : 'mb-2 text-[9px]'"
        >{{
          tier.label
        }}</span>
        <div
          class="flex"
          :class="compact ? 'gap-1.5' : 'gap-2'"
        >
          <button
            v-for="boxIdx in [0, 1]"
            :key="boxIdx"
            type="button"
            class="health-box relative shrink-0 overflow-hidden border-2 p-0 transition-all duration-300"
            :class="[
              compact ? 'h-16 w-16 rounded-lg' : 'h-16 w-16 rounded-lg',
              (injuries[tier.key] || 0) > boxIdx
                ? `bg-linear-to-br ${tier.color} border-transparent scale-[1.02]`
                : 'border-white/5 bg-black/40 hover:border-white/20',
              activeImpact === `${tier.key}-${boxIdx}` ? 'health-box--impact' : '',
            ]"
            @click="handleBoxClick(tier.key, boxIdx)"
          >
            <span class="health-box__flash" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { HeartPulse } from "@lucide/vue"
import { computed, ref } from "vue"

import type { GenericSystemData, Injuries } from "../types"
import { useCharacterStore } from "../../../stores/character"

withDefaults(
  defineProps<{
    compact?: boolean
  }>(),
  {
    compact: false,
  },
)

const characterStore = useCharacterStore()
const systemData = computed(() => characterStore.getSystemData<GenericSystemData>())

const emptyInjuries: Injuries = { light: 0, minor: 0, major: 0, fatal: 0 }
const injuries = computed(() => systemData.value?.injuries ?? emptyInjuries)

const tiers: Array<{ key: keyof Injuries; label: string; color: string }> = [
  { key: "light", label: "Légère", color: "from-emerald-500 to-emerald-700" },
  { key: "minor", label: "Moyenne", color: "from-amber-500 to-amber-700" },
  { key: "major", label: "Grave", color: "from-orange-600 to-orange-800" },
  { key: "fatal", label: "Fatale", color: "from-red-700 to-red-900" },
]

const tierOrder = ["light", "minor", "major", "fatal"] as const
const activeImpact = ref<string | null>(null)
let impactTimeout: ReturnType<typeof setTimeout> | null = null

const usedSlots = computed(() => Object.values(injuries.value).reduce((total, value) => total + value, 0))

const status = computed(() => {
  const inj = injuries.value
  if ((inj.fatal || 0) >= 2) return { text: "AGONISANT / MORT", color: "text-red-600" }
  if ((inj.major || 0) >= 1) return { text: "BLESSURES GRAVES", color: "text-orange-500" }
  if ((inj.minor || 0) >= 1) return { text: "MAL EN POINT", color: "text-amber-500" }
  if ((inj.light || 0) >= 1) return { text: "ÉGRATIGNÉ", color: "text-emerald-500" }
  return { text: "INDEMNE", color: "text-stone-500" }
})

const handleBoxClick = (tierId: keyof Injuries, boxIdx: number) => {
  activeImpact.value = `${tierId}-${boxIdx}`
  if (impactTimeout) clearTimeout(impactTimeout)
  impactTimeout = setTimeout(() => { activeImpact.value = null; impactTimeout = null }, 360)

  const newInjuries = { ...injuries.value }
  const currentVal = newInjuries[tierId] || 0

  if (boxIdx < currentVal) {
    newInjuries[tierId] = Math.max(0, currentVal - 1)
  } else {
    const startIdx = tierOrder.indexOf(tierId)
    for (let i = startIdx; i < tierOrder.length; i++) {
      const tId = tierOrder[i]
      if ((newInjuries[tId] || 0) < 2) {
        newInjuries[tId] = (newInjuries[tId] || 0) + 1
        break
      }
    }
  }

  characterStore.updateSystemData<GenericSystemData>({ injuries: newInjuries })
}
</script>

<style scoped>
.health-box {
  isolation: isolate;
}

.health-box__flash {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
  opacity: 0;
  background:
    radial-gradient(circle at center, rgba(255, 255, 255, 0.34) 0%, rgba(255, 255, 255, 0.18) 38%, transparent 72%),
    linear-gradient(135deg, rgba(255, 255, 255, 0.22), transparent 58%);
}

.health-box--impact {
  animation: health-box-impact 360ms cubic-bezier(0.18, 0.88, 0.32, 1.2);
}

.health-box--impact .health-box__flash {
  animation: health-box-flash 360ms ease-out;
}

@keyframes health-box-impact {
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 rgba(255, 255, 255, 0);
  }

  35% {
    transform: scale(0.92);
    box-shadow: 0 0 0.8rem rgba(255, 255, 255, 0.18);
  }

  68% {
    transform: scale(1.08);
    box-shadow: 0 0 1rem rgba(255, 255, 255, 0.12);
  }

  100% {
    transform: scale(1);
    box-shadow: 0 0 0 rgba(255, 255, 255, 0);
  }
}

@keyframes health-box-flash {
  0% {
    opacity: 0;
  }

  28% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
}
</style>
