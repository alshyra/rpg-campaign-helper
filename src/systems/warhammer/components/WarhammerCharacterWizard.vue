<template>
  <AppCard>
    <form class="grid gap-4" @submit.prevent="submit">
      <h2 class="m-0 font-(family-name:--serif) text-xl text-amber-100">Nouveau personnage Warhammer</h2>

      <div class="grid grid-cols-2 gap-3 max-[420px]:grid-cols-1">
        <FormField v-model="name" label="Nom" required />
        <FormField v-model="species" label="Espèce" required />
        <FormField v-model="career" label="Carrière actuelle" placeholder="Ex: Sorcier de village" required />
        <FormField v-model="careerPlan" label="Plan de carrière" placeholder="Ex: Sorcier" />
      </div>

      <div class="flex items-center justify-between rounded-xl bg-amber-950/30 px-4 py-3">
        <h3 class="m-0 text-[10px] font-black uppercase tracking-widest text-amber-400">Caractéristiques</h3>
        <span class="font-mono text-sm" :class="budgetClass">{{ budgetRemaining }} / {{ BUDGET_TOTAL }} pts</span>
      </div>

      <p class="-mt-2 text-[10px] text-stone-500">Race : {{ species || "Humain" }} — base raciale + points d'achat</p>

      <div class="grid gap-2">
        <div
          v-for="stat in CHARACTERISTICS"
          :key="stat.key"
          class="flex items-center gap-3 rounded-xl border border-white/5 bg-black/30 px-4 py-3"
        >
          <div class="min-w-10 text-center">
            <div class="text-[9px] font-black uppercase tracking-wider text-stone-500">{{ stat.label }}</div>
            <div class="text-lg font-black text-amber-400">{{ currentValue(stat.key) }}</div>
          </div>

          <div class="flex flex-1 items-center gap-2">
            <div class="flex flex-col items-center">
              <IconButton
                ghost
                class="h-7 w-7 rounded-lg border-white/10 text-xs text-stone-400 hover:border-amber-500/40 hover:text-amber-400 disabled:opacity-20"
                :disabled="spent[stat.key] < STEP"
                @click="adjust(stat.key, -STEP)"
              >−5</IconButton>
              <div class="pt-0.5 text-[9px] text-stone-600">dép.</div>
              <IconButton
                ghost
                class="h-7 w-7 rounded-lg border-white/10 text-xs text-stone-400 hover:border-amber-500/40 hover:text-amber-400 disabled:opacity-20"
                :disabled="spent[stat.key] >= SPENT_MAX || budgetRemaining < STEP"
                @click="adjust(stat.key, STEP)"
              >+5</IconButton>
            </div>

            <div class="h-6 flex-1 overflow-hidden rounded-full bg-black/40">
              <div
                class="h-full rounded-full bg-gradient-to-r from-amber-900 to-amber-600 transition-all"
                :style="{ width: barPercent(stat.key) + '%' }"
              />
            </div>
          </div>

          <div class="text-right text-[10px] leading-tight text-stone-600">
            <div>base {{ getBase(stat.key) }}</div>
            <div v-if="spent[stat.key] > 0" class="text-amber-500/70">+{{ spent[stat.key] }}</div>
          </div>
        </div>
      </div>

      <Button variant="primary" type="submit" class="w-full">Créer le personnage</Button>
    </form>
  </AppCard>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from "vue"
import { useRouter } from "vue-router"
import { storeToRefs } from "pinia"

import { useCharacterStore } from "../../../stores/character"
import type { CharacterState } from "../../../types/character"
import type { CharacteristicKey, WfrpSystemData } from "../types"
import {
  CHARACTERISTICS,
  HUMAN_BASE,
  SPENT_MAX,
  BUDGET_TOTAL,
  STEP,
  makeBlankCharacteristics,
  cloneCharacteristics,
  computeCurrent,
} from "../types"
import AppCard from "../../../components/ui/AppCard.vue"
import Button from "../../../components/ui/Button.vue"
import FormField from "../../../components/ui/FormField.vue"
import IconButton from "../../../components/ui/IconButton.vue"

const router = useRouter()
const characterStore = useCharacterStore()
const { activeCampaignId } = storeToRefs(characterStore)

const name = ref("")
const species = ref("Humain")
const career = ref("")
const careerPlan = ref("")

const charKeys: CharacteristicKey[] = ["ws", "bs", "s", "t", "i", "ag", "dex", "int", "wp", "fel"]
const spent = reactive<Record<string, number>>(
  Object.fromEntries(charKeys.map((k) => [k, 0]))
)
const totalSpent = computed(() => charKeys.reduce((sum, k) => sum + spent[k], 0))
const budgetRemaining = computed(() => BUDGET_TOTAL - totalSpent.value)

const budgetClass = computed(() => {
  if (budgetRemaining.value < 0) return "text-red-500 font-bold"
  if (budgetRemaining.value === 0) return "text-amber-400 font-bold"
  return "text-stone-400"
})

const getBase = (key: CharacteristicKey) => HUMAN_BASE[key]

const currentValue = (key: CharacteristicKey) => getBase(key) + spent[key]

const barPercent = (key: CharacteristicKey) => {
  return Math.min(100, (currentValue(key) / 35) * 100)
}

const adjust = (key: string, delta: number) => {
  const current = spent[key] ?? 0
  const next = current + delta
  if (next < 0) return
  if (next > SPENT_MAX) return
  if (budgetRemaining.value - delta < 0) return
  spent[key] = next
}

const submit = () => {
  const s = makeBlankCharacteristics()
  for (const k of charKeys) s[k] = spent[k]

  const systemData: WfrpSystemData = {
    species: species.value || "Humain",
    characteristics: {
      base: cloneCharacteristics(HUMAN_BASE),
      spent: s,
      advancements: makeBlankCharacteristics(),
      current: computeCurrent(HUMAN_BASE, s, makeBlankCharacteristics()),
    },
    wounds: { current: 12, max: 12 },
    fate: 2,
    resolve: 2,
    xp: { total: 0, available: 0 },
    career: { current: career.value, plan: careerPlan.value, status: "Argent 1", promotions: 1 },
    skills: {},
    talents: [],
    spells: [],
    weapons: [],
    armor: { head: 0, leftArm: 0, rightArm: 0, body: 0, leftLeg: 0, rightLeg: 0 },
    equipment: [],
    money: { gold: 0, silver: 0, brass: 0 },
  }

  const payload: Partial<CharacterState> = {
    systemId: "warhammer",
    profile: {
      characterName: name.value,
      role: career.value,
      mood: "",
      avatarDataUrl: "",
      injuries: { light: 0, minor: 0, major: 0, fatal: 0 },
    },
    systemData,
  }

  characterStore.createNewCharacter(payload)
  const id = activeCampaignId.value
  router.replace(id ? `/characters/${id}/profile` : "/characters")
}
</script>
