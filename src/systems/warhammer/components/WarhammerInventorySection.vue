<template>
  <section class="grid gap-6">
    <div class="flex items-center justify-between px-2">
      <h2 class="m-0 font-(family-name:--serif) text-2xl italic text-amber-100">Inventaire</h2>
    </div>

    <article class="rounded-2xl border border-white/5 bg-stone-900/40 p-4">
      <h3 class="mb-3 text-[10px] font-black uppercase tracking-widest text-amber-500">Argent</h3>
      <div class="flex flex-wrap gap-3">
        <FormField v-model="moneyGold" label="PO" type="number" min="0" class="money-field" />
        <FormField v-model="moneySilver" label="PA" type="number" min="0" class="money-field" />
        <FormField v-model="moneyBrass" label="PC" type="number" min="0" class="money-field" />
      </div>
    </article>

    <article class="rounded-2xl border border-white/5 bg-stone-900/40 p-4">
      <div class="mb-3 flex items-center justify-between">
        <h3 class="m-0 text-[10px] font-black uppercase tracking-widest text-amber-500">Équipement</h3>
        <IconButton
          square
          class="rounded-full p-2"
          :class="eqShowForm ? 'bg-red-500/20 text-red-500 rotate-45' : 'bg-amber-500/10 text-amber-500'"
          @click="eqShowForm = !eqShowForm"
        >
          <Plus class="h-5 w-5" :stroke-width="2.2" />
        </IconButton>
      </div>

      <div v-if="eqShowForm" class="mb-4">
        <FormField
          v-model="eqDraft"
          placeholder="Ex: Dague, Rations..."
          @keydown.enter="addEquipmentItem"
        />
      </div>

      <div v-if="equipment.length === 0" class="py-4 text-center text-xs italic text-stone-600" data-testid="no-equipment">
        Aucun équipement
      </div>

      <div v-else class="grid gap-1" data-testid="equipment-list">
        <div
          v-for="(item, idx) in equipment"
          :key="idx"
          class="group flex items-center justify-between rounded-xl px-3 py-2 transition-colors hover:bg-white/5"
        >
          <span class="text-sm text-amber-100" data-testid="equipment-item">{{ item }}</span>
          <IconButton square ghost class="h-6 w-6 p-0 text-stone-600 opacity-0 transition-all group-hover:opacity-100 hover:text-red-500!" @click="removeEquipmentItem(idx)">
            <X class="h-3.5 w-3.5" />
          </IconButton>
        </div>
      </div>
    </article>

    <article class="rounded-2xl border border-white/5 bg-stone-900/40 p-4">
      <div class="mb-3 flex items-center justify-between">
        <h3 class="m-0 text-[10px] font-black uppercase tracking-widest text-amber-500">Armes</h3>
        <IconButton
          square
          class="rounded-full p-2"
          :class="wpShowForm ? 'bg-red-500/20 text-red-500 rotate-45' : 'bg-amber-500/10 text-amber-500'"
          @click="wpShowForm = !wpShowForm"
        >
          <Plus class="h-5 w-5" :stroke-width="2.2" />
        </IconButton>
      </div>

      <div v-if="wpShowForm" class="mb-4 grid grid-cols-2 gap-2">
        <FormField v-model="wpDraft.name" placeholder="Nom de l'arme" class="col-span-2 !mb-0" />
        <FormField v-model="wpDraft.damage" placeholder="Dégâts (ex: F+4)" class="!mb-0" />
        <FormField v-model="wpDraft.qualities" placeholder="Qualités (ex: Tranchant)" class="!mb-0" />
        <Button variant="primary" class="col-span-2 py-2 text-sm" @click="addWeapon">Ajouter</Button>
      </div>

      <div v-if="weapons.length === 0" class="py-4 text-center text-xs italic text-stone-600" data-testid="no-weapons">
        Aucune arme
      </div>

      <div v-else class="grid gap-2" data-testid="weapons-list">
        <div v-for="wp in weapons" :key="wp.id" class="group flex items-center justify-between rounded-xl border border-white/5 bg-black/30 p-3">
          <div>
            <span class="text-sm font-bold text-amber-100" data-testid="weapon-name">{{ wp.name }}</span>
            <span class="ml-2 text-xs text-stone-500" data-testid="weapon-damage">{{ wp.damage }} · {{ wp.qualities }}</span>
          </div>
          <IconButton square ghost class="h-6 w-6 p-0 text-stone-600 opacity-0 transition-all group-hover:opacity-100 hover:text-red-500!" @click="removeWeapon(wp.id)">
            <X class="h-3.5 w-3.5" />
          </IconButton>
        </div>
      </div>
    </article>

    <article class="rounded-2xl border border-white/5 bg-stone-900/40 p-4">
      <h3 class="mb-3 text-[10px] font-black uppercase tracking-widest text-amber-500">Armure (PA)</h3>
      <div v-if="armor" class="grid grid-cols-2 gap-3" data-testid="armor-grid">
        <div v-for="slot in armorSlots" :key="slot.key" class="rounded-lg border border-white/5 bg-black/30 p-3 text-center">
          <div class="mb-1 text-[9px] font-bold uppercase tracking-wider text-stone-500">{{ slot.label }}</div>
          <div class="flex items-center justify-center gap-2">
            <IconButton square ghost class="h-7 w-7 rounded-lg p-0 text-stone-400 hover:text-red-400 disabled:opacity-20 disabled:hover:text-stone-400" :disabled="armor[slot.key] <= 0" data-testid="armor-dec" @click="adjustArmor(slot.key, -1)">–</IconButton>
            <span class="w-8 text-center font-mono font-black text-amber-400" data-testid="armor-value">{{ armor[slot.key] }}</span>
            <IconButton square ghost class="h-7 w-7 rounded-lg p-0 text-stone-400 hover:text-amber-400 disabled:opacity-20 disabled:hover:text-stone-400" :disabled="armor[slot.key] >= 10" data-testid="armor-inc" @click="adjustArmor(slot.key, 1)">+</IconButton>
          </div>
        </div>
      </div>
    </article>
  </section>
</template>

<script setup lang="ts">
import { Plus, X } from "@lucide/vue"
import { computed, reactive, ref } from "vue"

import { useCharacterStore } from "../../../stores/character"
import type { WfrpSystemData, WfrpArmor } from "../types"
import Button from "../../../components/ui/Button.vue"
import FormField from "../../../components/ui/FormField.vue"
import IconButton from "../../../components/ui/IconButton.vue"

interface ArmorSlot { key: keyof WfrpArmor; label: string }

const armorSlots: ArmorSlot[] = [
  { key: "head", label: "Tête" },
  { key: "leftArm", label: "Bras G" },
  { key: "rightArm", label: "Bras D" },
  { key: "body", label: "Corps" },
  { key: "leftLeg", label: "Jambe G" },
  { key: "rightLeg", label: "Jambe D" },
]

const characterStore = useCharacterStore()
const systemData = computed(() => characterStore.getSystemData<WfrpSystemData>())

const equipment = computed(() => systemData.value?.equipment ?? [])
const weapons = computed(() => systemData.value?.weapons ?? [])
const armor = computed(() => systemData.value?.armor ?? null)

// Money — writable computeds that sync to store
const moneyGold = computed({
  get: () => systemData.value?.money.gold ?? 0,
  set: (v) => setMoney("gold", String(v)),
})
const moneySilver = computed({
  get: () => systemData.value?.money.silver ?? 0,
  set: (v) => setMoney("silver", String(v)),
})
const moneyBrass = computed({
  get: () => systemData.value?.money.brass ?? 0,
  set: (v) => setMoney("brass", String(v)),
})

const setMoney = (field: keyof WfrpSystemData["money"], val: string) => {
  const current = systemData.value?.money ?? { gold: 0, silver: 0, brass: 0 }
  characterStore.updateSystemData<WfrpSystemData>({
    money: { ...current, [field]: Math.max(0, parseInt(val) || 0) },
  })
}

// Equipment
const eqShowForm = ref(false)
const eqDraft = ref("")

const addEquipmentItem = () => {
  if (!eqDraft.value.trim()) return
  const current = systemData.value?.equipment ?? []
  characterStore.updateSystemData<WfrpSystemData>({
    equipment: [eqDraft.value.trim(), ...current],
  })
  eqDraft.value = ""
  eqShowForm.value = false
}

const removeEquipmentItem = (idx: number) => {
  const current = [...(systemData.value?.equipment ?? [])]
  current.splice(idx, 1)
  characterStore.updateSystemData<WfrpSystemData>({ equipment: current })
}

// Weapons
const wpShowForm = ref(false)
const wpDraft = reactive({ name: "", damage: "", qualities: "" })

const makeWpId = () => `wp-${Math.random().toString(36).slice(2, 10)}`

const addWeapon = () => {
  if (!wpDraft.name.trim()) return
  const current = systemData.value?.weapons ?? []
  characterStore.updateSystemData<WfrpSystemData>({
    weapons: [...current, {
      id: makeWpId(),
      name: wpDraft.name.trim(),
      damage: wpDraft.damage.trim(),
      qualities: wpDraft.qualities.trim(),
    }],
  })
  wpDraft.name = ""; wpDraft.damage = ""; wpDraft.qualities = ""
  wpShowForm.value = false
}

const removeWeapon = (id: string) => {
  const current = systemData.value?.weapons ?? []
  characterStore.updateSystemData<WfrpSystemData>({
    weapons: current.filter((w) => w.id !== id),
  })
}

// Armor
const adjustArmor = (slot: keyof WfrpArmor, delta: number) => {
  const current = systemData.value?.armor
  if (!current) return
  const next = current[slot] + delta
  if (next < 0 || next > 10) return
  characterStore.updateSystemData<WfrpSystemData>({
    armor: { ...current, [slot]: next },
  })
}
</script>

<style scoped>
.money-field {
  width: 5.5rem;
}
.money-field :deep(input) {
  text-align: center;
}
</style>
