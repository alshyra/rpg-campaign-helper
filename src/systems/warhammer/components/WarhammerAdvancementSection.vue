<template>
  <article class="rounded-2xl border border-white/5 bg-stone-900/40 p-4">
    <h2 class="m-0 font-(family-name:--serif) text-xl text-amber-100">Avancement</h2>
    <p class="mt-1 text-xs text-stone-500">{{ data?.career.current }}<span v-if="data?.career.plan"> → {{ data?.career.plan }}</span></p>

    <div class="mt-4 grid gap-6">
      <!-- XP -->
      <div class="rounded-xl border border-amber-500/10 bg-amber-950/20 p-4">
        <div class="flex items-center justify-between gap-4">
          <div>
            <p class="text-[10px] font-bold uppercase tracking-widest text-stone-500">XP total</p>
            <p class="font-(family-name:--serif) text-2xl font-black text-amber-300">{{ data?.xp.total ?? 0 }}</p>
          </div>
          <div class="text-right">
            <p class="text-[10px] font-bold uppercase tracking-widest text-stone-500">Disponible</p>
            <p class="font-(family-name:--serif) text-2xl font-black" :class="xpAvailableClass">{{ data?.xp.available ?? 0 }}</p>
          </div>
        </div>
        <div class="mt-3 flex flex-wrap gap-2">
          <Button variant="ghost" small @click="earnXp(100)">+100 XP</Button>
          <Button variant="ghost" small @click="earnXp(200)">+200 XP</Button>
          <Button variant="ghost" small @click="earnXp(500)">+500 XP</Button>
        </div>
      </div>

      <!-- Statut carrière -->
      <div class="rounded-xl border p-4" :class="isCareerComplete ? 'border-emerald-500/20 bg-emerald-950/20' : 'border-amber-500/10 bg-amber-950/20'">
        <div class="flex items-center justify-between gap-3">
          <div>
            <p class="text-[10px] font-black uppercase tracking-widest text-stone-500">Carrière</p>
            <p class="font-(family-name:--serif) text-lg font-black text-amber-100">{{ data?.career.current }}</p>
          </div>
          <div class="text-right">
            <p class="text-[10px] font-black uppercase tracking-widest" :class="isCareerComplete ? 'text-emerald-400' : 'text-stone-500'">
              {{ isCareerComplete ? 'COMPLÈTE' : 'EN COURS' }}
            </p>
            <p v-if="!isCareerComplete" class="text-[10px] text-stone-500">{{ remainingAdvances }} avancements restants</p>
            <p v-else class="text-[10px] text-emerald-400/70">Tous les avancements achetés</p>
          </div>
        </div>
        <div v-if="!isCareerComplete && careerInfo" class="mt-2 text-[9px] text-stone-600">
          Max : {{ maxCaracLabel }}<span v-if="careerInfo.secondary.wounds > 0">, Blessures +{{ careerInfo.secondary.wounds }}</span><span v-if="careerInfo.secondary.mag > 0">, PM +{{ careerInfo.secondary.mag }}</span>
        </div>
        <div v-if="isCareerComplete && !data?.career.plan" class="mt-3 flex flex-wrap items-center gap-2">
          <span class="text-[10px] text-stone-500">Prochaine carrière :</span>
          <div class="min-w-44">
            <Select
              v-model="planDraft"
              :options="careerExitOptions"
              placeholder="— Choisir —"
              trigger-class="text-xs"
            />
          </div>
          <Button
            v-if="planDraft"
            variant="success" small
            @click="setPlan"
          >
            Définir
          </Button>
        </div>
        <div v-if="isCareerComplete && data?.career.plan" class="mt-2 flex items-center gap-2">
          <span class="text-[10px] text-amber-400">Plan : {{ data.career.plan }}</span>
          <Button variant="ghost" small @click="clearPlan">Changer</Button>
        </div>
      </div>

      <!-- Caractéristiques -->
      <div>
        <h3 class="text-[10px] font-black uppercase tracking-widest text-amber-400">Caractéristiques</h3>
        <p class="text-[9px] text-stone-600">+5 pour 100 XP</p>
        <p class="text-[9px] text-stone-600">Max par carrière : {{ maxCaracLabel }}</p>
        <div class="mt-2 grid gap-2">
          <div
            v-for="stat in CHARACTERISTICS"
            :key="stat.key"
            class="flex items-center justify-between rounded-xl border border-white/5 bg-black/30 px-4 py-3"
          >
            <div class="flex items-center gap-3">
              <span class="w-8 text-[10px] font-black uppercase tracking-wider text-stone-500">{{ stat.label }}</span>
              <span class="font-(family-name:--serif) text-lg font-black text-amber-400">{{ currentCharValue(stat.key) }}</span>
              <span v-if="charAdvancements(stat.key) > 0" class="text-[10px] text-amber-600">({{ charAdvancements(stat.key) }})</span>
              <span v-if="isCareerCharacteristic(stat.key)" class="rounded bg-amber-500/15 px-1.5 py-0.5 text-[8px] font-bold tracking-wider text-amber-500">CARRIÈRE</span>
            </div>
            <div class="flex items-center gap-1.5">
              <Button
                v-if="charAdvancements(stat.key) > 0"
                variant="danger" small
                @click="refundChar(stat.key)"
              >−5</Button>
              <Button
                variant="ghost" small
                class="text-amber-400"
                :class="!canAdvanceChar(stat.key) ? '!text-stone-600' : '!text-amber-400'"
                :disabled="!canAdvanceChar(stat.key)"
                @click="advanceChar(stat.key)"
              >
                +5
              </Button>
            </div>
          </div>
        </div>
      </div>

      <!-- Blessures -->
      <div>
        <h3 class="text-[10px] font-black uppercase tracking-widest text-amber-400">Blessures</h3>
        <p class="text-[9px] text-stone-600">+1 pour 100 XP</p>
        <div class="mt-2 rounded-xl border border-white/5 bg-black/30 px-4 py-4">
          <div class="flex items-center justify-between gap-4">
            <div class="flex items-baseline gap-2">
              <span class="font-(family-name:--serif) text-2xl font-black text-amber-400">{{ data?.wounds.max ?? "?" }}</span>
              <span class="text-[10px] text-stone-500">PV</span>
            </div>
            <div class="flex items-center gap-1.5">
              <Button
                v-if="(data?.woundsAdvancements ?? 0) > 0"
                variant="danger" small
                @click="refundWounds"
              >−1</Button>
              <Button
                variant="ghost" small
                class="text-amber-400"
                :class="!canAdvanceWounds ? '!text-stone-600' : '!text-amber-400'"
                :disabled="!canAdvanceWounds"
                @click="advanceWounds"
              >
                +1
              </Button>
            </div>
          </div>
          <div v-if="careerInfo" class="mt-3">
            <div class="flex items-center justify-between text-[9px] text-stone-600">
              <span>Avancement carrière</span>
              <span>{{ woundsAdvancementsDisplay }} / {{ careerInfo.secondary.wounds }}</span>
            </div>
            <div class="mt-1 h-2 overflow-hidden rounded-full bg-black/40">
              <div
                class="h-full rounded-full transition-all duration-300"
                :class="woundsAdvancementsPct >= 100 ? 'bg-emerald-600' : 'bg-amber-700'"
                :style="{ width: woundsAdvancementsPct + '%' }"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Magie -->
      <div v-if="showMagic">
        <h3 class="text-[10px] font-black uppercase tracking-widest text-amber-400">Magie</h3>
        <p class="text-[9px] text-stone-600">+1 PM pour 100 XP</p>
        <div class="mt-2 flex items-center justify-between rounded-xl border border-white/5 bg-black/30 px-4 py-3">
          <div class="flex items-center gap-3">
            <span class="font-(family-name:--serif) text-lg font-black text-amber-400">{{ data?.mag ?? 0 }}</span>
            <span v-if="(data?.magAdvancements ?? 0) > 0" class="text-[10px] text-amber-600">({{ data?.magAdvancements }})</span>
          </div>
          <div class="flex items-center gap-1.5">
            <Button
              v-if="(data?.magAdvancements ?? 0) > 0"
              variant="danger" small
              @click="refundMag"
            >−1</Button>
            <Button
              variant="ghost" small
              class="text-amber-400"
              :class="!canAdvanceMag ? '!text-stone-600' : '!text-amber-400'"
              :disabled="!canAdvanceMag"
              @click="advanceMag"
            >
              +1
            </Button>
          </div>
        </div>
      </div>

      <!-- Compétences -->
      <div>
        <h3 class="text-[10px] font-black uppercase tracking-widest text-amber-400">Compétences</h3>
        <p class="text-[9px] text-stone-600">+1 pour 100 XP</p>
        <div v-if="skillEntries.length === 0" class="mt-2 py-4 text-center text-xs italic text-stone-600">
          Aucune compétence
        </div>
        <div v-else class="mt-2 grid gap-1">
          <div
            v-for="[name, value] in skillEntries"
            :key="name"
            class="flex items-center justify-between rounded-xl border border-white/5 bg-black/30 px-4 py-2.5"
          >
            <div class="flex items-center gap-3">
              <span class="text-sm text-amber-100">{{ name }}</span>
              <span class="font-mono text-sm font-black text-amber-400">{{ value }}%</span>
            </div>
            <div class="flex items-center gap-1.5">
              <Button
                v-if="value > 0"
                variant="danger" small
                :disabled="(data?.xp.available ?? 0) < 100 && value <= 0"
                @click="refundSkill(name, value)"
              >−1</Button>
              <Button
                variant="ghost" small
                class="text-amber-400"
                :class="(data?.xp.available ?? 0) < 100 ? '!text-stone-600' : '!text-amber-400'"
                :disabled="(data?.xp.available ?? 0) < 100"
                @click="advanceSkill(name)"
              >
                +1
              </Button>
            </div>
          </div>
        </div>
        <div class="mt-3 flex gap-2">
          <FormField v-model="newSkillName" placeholder="Nouvelle compétence" class="flex-1" @keydown.enter="addNewSkill" />
          <Button
            variant="ghost" small
            class="!text-amber-400 shrink-0"
            :disabled="!newSkillName.trim()"
            @click="addNewSkill"
          >
            Ajouter
          </Button>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed, ref } from "vue"
import { storeToRefs } from "pinia"

import { useCharacterStore } from "../../../stores/character"
import type { CharacteristicKey, WfrpSystemData } from "../types"
import { CHARACTERISTICS, computeBonus } from "../types"
import { CAREER_DATA } from "../careers"
import FormField from "../../../components/ui/FormField.vue"
import Select from "../../../components/ui/Select.vue"
import Button from "../../../components/ui/Button.vue"

const characterStore = useCharacterStore()
const { state } = storeToRefs(characterStore)

const data = computed(() => characterStore.getSystemData<WfrpSystemData>())

const currentCharValue = (key: CharacteristicKey) => {
  if (!data.value) return 0
  const c = data.value.characteristics
  return c.base[key] + c.spent[key] + c.advancements[key]
}

const charAdvancements = (key: CharacteristicKey) => {
  if (!data.value) return 0
  return data.value.characteristics.advancements[key]
}

const xpAvailableClass = computed(() => {
  const av = data.value?.xp.available ?? 0
  if (av <= 0) return "text-stone-600"
  return "text-amber-300"
})

const careerInfo = computed(() => {
  if (!data.value?.career.current) return null
  return CAREER_DATA[data.value.career.current] ?? null
})

const maxCaracLabel = computed(() => {
  if (!careerInfo.value) return "—"
  const list = Object.entries(careerInfo.value.advances)
    .filter(([, v]) => v > 0)
    .map(([k]) => {
      const labelMap: Record<string, string> = { ws: "CC", bs: "CT", s: "F", t: "E", ag: "AG", int: "INT", wp: "FM", fel: "SOC" }
      return labelMap[k as keyof typeof labelMap] ?? k
    })
  return list.join(", ")
})

const isCareerCharacteristic = (key: CharacteristicKey): boolean => {
  if (!careerInfo.value) return false
  return (careerInfo.value.advances[key] ?? 0) > 0
}

const showMagic = computed(() => {
  if (!careerInfo.value) return false
  return (careerInfo.value.secondary.mag ?? 0) > 0
})

const canAdvanceChar = (key: CharacteristicKey) => {
  if (!data.value || !careerInfo.value) return false
  if (data.value.xp.available < 100) return false
  const maxAdv = careerInfo.value.advances[key] ?? 0
  return (data.value.characteristics.advancements[key] ?? 0) < maxAdv
}

const canAdvanceWounds = computed(() => {
  if (!data.value || !careerInfo.value) return false
  if (data.value.xp.available < 100) return false
  return (data.value.woundsAdvancements ?? 0) < careerInfo.value.secondary.wounds
})

const woundsAdvancementsDisplay = computed(() => {
  if (!data.value) return 0
  return data.value.woundsAdvancements ?? 0
})

const woundsAdvancementsPct = computed(() => {
  if (!careerInfo.value) return 0
  const maxW = careerInfo.value.secondary.wounds
  if (maxW <= 0) return 100
  return Math.min(100, ((data.value?.woundsAdvancements ?? 0) / maxW) * 100)
})

const canAdvanceMag = computed(() => {
  if (!data.value || !careerInfo.value) return false
  if (data.value.xp.available < 100) return false
  return (data.value.magAdvancements ?? 0) < careerInfo.value.secondary.mag
})

const isCareerComplete = computed(() => {
  if (!careerInfo.value || !data.value) return false
  const cinfo = careerInfo.value
  for (const key of ["ws", "bs", "s", "t", "ag", "int", "wp", "fel"] as CharacteristicKey[]) {
    const maxAdv = cinfo.advances[key] ?? 0
    const curAdv = data.value.characteristics.advancements[key] ?? 0
    if (curAdv < maxAdv) return false
  }
  if ((data.value.woundsAdvancements ?? 0) < cinfo.secondary.wounds) return false
  if ((data.value.magAdvancements ?? 0) < cinfo.secondary.mag) return false
  return true
})

const remainingAdvances = computed(() => {
  if (!careerInfo.value || !data.value) return 0
  const cinfo = careerInfo.value
  let remaining = 0
  for (const key of ["ws", "bs", "s", "t", "ag", "int", "wp", "fel"] as CharacteristicKey[]) {
    const maxAdv = cinfo.advances[key] ?? 0
    const curAdv = data.value.characteristics.advancements[key] ?? 0
    remaining += Math.max(0, maxAdv - curAdv) / 5
  }
  remaining += Math.max(0, cinfo.secondary.wounds - (data.value.woundsAdvancements ?? 0))
  remaining += Math.max(0, cinfo.secondary.mag - (data.value.magAdvancements ?? 0))
  return remaining
})

const careerExits = computed(() => {
  if (!careerInfo.value) return []
  return careerInfo.value.exits
})

const careerExitOptions = computed(() => {
  return careerExits.value.map(name => ({ value: name, label: name }))
})

const planDraft = ref("")

const setPlan = () => {
  if (!planDraft.value) return
  const current = characterStore.getSystemData<WfrpSystemData>()
  if (!current) return
  characterStore.updateSystemData<WfrpSystemData>({
    career: { ...current.career, plan: planDraft.value },
  })
}

const clearPlan = () => {
  const current = characterStore.getSystemData<WfrpSystemData>()
  if (!current) return
  characterStore.updateSystemData<WfrpSystemData>({
    career: { ...current.career, plan: "" },
  })
  planDraft.value = ""
}

const skillEntries = computed(() => {
  if (!data.value?.skills) return []
  return Object.entries(data.value.skills)
})

const newSkillName = ref("")

const addNewSkill = () => {
  const name = newSkillName.value.trim()
  if (!name) return
  const current = data.value?.skills ?? {}
  characterStore.updateSystemData<WfrpSystemData>({
    skills: { ...current, [name]: 0 },
  })
  newSkillName.value = ""
}

const earnXp = (amount: number) => {
  const current = characterStore.getSystemData<WfrpSystemData>()
  if (!current) return
  characterStore.updateSystemData<WfrpSystemData>({
    xp: {
      total: current.xp.total + amount,
      available: current.xp.available + amount,
    },
  })
}

const advanceChar = (key: CharacteristicKey) => {
  const current = characterStore.getSystemData<WfrpSystemData>()
  if (!current) return
  if (current.xp.available < 100) return
  if (!careerInfo.value) return
  const maxAdv = careerInfo.value.advances[key] ?? 0
  if ((current.characteristics.advancements[key] ?? 0) >= maxAdv) return
  const adv = { ...current.characteristics.advancements }
  adv[key] = (adv[key] ?? 0) + 5
  const c = current.characteristics
  const newCurrent = { ...c.current }
  newCurrent[key] = c.base[key] + c.spent[key] + adv[key]
  const patch: Partial<WfrpSystemData> = {
    characteristics: {
      ...c,
      advancements: adv,
      current: newCurrent,
    },
    xp: {
      total: current.xp.total,
      available: current.xp.available - 100,
    },
  }
  if (key === "s") {
    patch.strengthBonus = computeBonus(newCurrent[key])
  }
  if (key === "t") {
    patch.toughnessBonus = computeBonus(newCurrent[key])
  }
  characterStore.updateSystemData<WfrpSystemData>(patch)
}

const refundChar = (key: CharacteristicKey) => {
  const current = characterStore.getSystemData<WfrpSystemData>()
  if (!current) return
  const adv = { ...current.characteristics.advancements }
  if ((adv[key] ?? 0) < 5) return
  adv[key] = adv[key] - 5
  const c = current.characteristics
  const newCurrent = { ...c.current }
  newCurrent[key] = c.base[key] + c.spent[key] + adv[key]
  const patch: Partial<WfrpSystemData> = {
    characteristics: {
      ...c,
      advancements: adv,
      current: newCurrent,
    },
    xp: {
      total: current.xp.total,
      available: current.xp.available + 100,
    },
  }
  if (key === "s") {
    patch.strengthBonus = computeBonus(newCurrent[key])
  }
  if (key === "t") {
    patch.toughnessBonus = computeBonus(newCurrent[key])
  }
  characterStore.updateSystemData<WfrpSystemData>(patch)
}

const advanceWounds = () => {
  const current = characterStore.getSystemData<WfrpSystemData>()
  if (!current) return
  if (current.xp.available < 100) return
  if (!careerInfo.value) return
  if ((current.woundsAdvancements ?? 0) >= careerInfo.value.secondary.wounds) return
  characterStore.updateSystemData<WfrpSystemData>({
    wounds: { ...current.wounds, max: current.wounds.max + 1 },
    woundsAdvancements: (current.woundsAdvancements ?? 0) + 1,
    xp: {
      total: current.xp.total,
      available: current.xp.available - 100,
    },
  })
}

const refundWounds = () => {
  const current = characterStore.getSystemData<WfrpSystemData>()
  if (!current) return
  if ((current.woundsAdvancements ?? 0) < 1) return
  characterStore.updateSystemData<WfrpSystemData>({
    wounds: { ...current.wounds, max: current.wounds.max - 1 },
    woundsAdvancements: (current.woundsAdvancements ?? 0) - 1,
    xp: {
      total: current.xp.total,
      available: current.xp.available + 100,
    },
  })
}

const advanceMag = () => {
  const current = characterStore.getSystemData<WfrpSystemData>()
  if (!current) return
  if (current.xp.available < 100) return
  if (!careerInfo.value) return
  if ((current.magAdvancements ?? 0) >= careerInfo.value.secondary.mag) return
  characterStore.updateSystemData<WfrpSystemData>({
    mag: (current.mag ?? 0) + 1,
    magAdvancements: (current.magAdvancements ?? 0) + 1,
    xp: {
      total: current.xp.total,
      available: current.xp.available - 100,
    },
  })
}

const refundMag = () => {
  const current = characterStore.getSystemData<WfrpSystemData>()
  if (!current) return
  if ((current.magAdvancements ?? 0) < 1) return
  characterStore.updateSystemData<WfrpSystemData>({
    mag: (current.mag ?? 0) - 1,
    magAdvancements: (current.magAdvancements ?? 0) - 1,
    xp: {
      total: current.xp.total,
      available: current.xp.available + 100,
    },
  })
}

const advanceSkill = (name: string) => {
  const current = characterStore.getSystemData<WfrpSystemData>()
  if (!current) return
  if (current.xp.available < 100) return
  const skills = { ...(current.skills ?? {}) }
  skills[name] = (skills[name] ?? 0) + 1
  characterStore.updateSystemData<WfrpSystemData>({
    skills,
    xp: {
      total: current.xp.total,
      available: current.xp.available - 100,
    },
  })
}

const refundSkill = (name: string, currentValue: number) => {
  if (currentValue < 1) return
  const current = characterStore.getSystemData<WfrpSystemData>()
  if (!current) return
  const skills = { ...(current.skills ?? {}) }
  skills[name] = currentValue - 1
  characterStore.updateSystemData<WfrpSystemData>({
    skills,
    xp: {
      total: current.xp.total,
      available: current.xp.available + 100,
    },
  })
}
</script>
