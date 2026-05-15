<template>
  <div class="grid gap-6">
    <div class="flex items-center justify-between px-2">
      <h2 class="m-0 font-(family-name:--serif) text-2xl italic text-amber-100">Sac à dos</h2>
      <IconButton
        square
        class="rounded-full p-2 transition-all"
        :class="showAddForm ? 'bg-red-500/20 text-red-500 rotate-45' : 'bg-amber-500/10 text-amber-500'"
        @click="showAddForm = !showAddForm"
      >
        <Plus class="h-6 w-6" :stroke-width="2.2" />
      </IconButton>
    </div>

    <section
      v-if="showAddForm"
      class="grid gap-4 rounded-3xl border border-amber-500/30 bg-stone-900/80 p-6"
    >
      <div class="flex items-center justify-between">
        <h3 class="m-0 text-[10px] font-black uppercase tracking-widest text-amber-400">Nouvel Objet</h3>
        <IconButton
          ghost
          square
          class="h-8 w-8 p-0 text-stone-500 hover:text-white"
          @click="showAddForm = false"
        >
          <X class="h-4 w-4" :stroke-width="2" />
        </IconButton>
      </div>
      <FormField
        v-model="draft.name"
        placeholder="Nom..."
        class="inventory-field"
      />
      <FormField
        v-model="draft.details"
        placeholder="Détails (poids, effet...)"
        class="inventory-field"
      />
      <Button
        variant="primary"
        class="w-full gap-2 py-3 font-black text-black transition-all hover:bg-amber-500 active:scale-[0.98]"
        @click="submitItem"
      >
        <Package class="h-5 w-5" :stroke-width="2.2" />
        AJOUTER AU SAC
      </Button>
    </section>

    <div
      v-if="inventory.length === 0"
      class="rounded-3xl border-2 border-dashed border-white/5 py-12 text-center text-stone-600"
    >
      <Backpack class="mx-auto mb-2 h-12 w-12 opacity-20" :stroke-width="1.2" />
      <p class="text-sm italic">Le sac est vide...</p>
    </div>

    <section class="grid gap-3">
      <div
        v-for="item in inventory"
        :key="item.id"
        class="flex items-center justify-between rounded-2xl border border-white/5 bg-stone-900/40 p-4"
      >
        <div class="flex-1">
          <h4 class="m-0 font-bold text-amber-100">{{ item.name }}</h4>
          <p
            v-if="item.details"
            class="m-0 mt-0.5 text-[10px] uppercase tracking-tighter text-stone-500"
          >
            {{ item.details }}
          </p>
        </div>
        <div class="flex items-center gap-1 rounded-xl border border-white/5 bg-black/40 p-1">
          <IconButton
            square
            class="h-8 w-8 rounded-lg border-transparent bg-transparent p-0 text-stone-400 transition-all hover:bg-white/5"
            :class="item.quantity === 1 ? 'hover:text-red-500' : 'hover:text-red-400'"
            @click="decrement(item)"
          >
            <Trash2
              v-if="item.quantity === 1"
              class="h-3.5 w-3.5"
              :stroke-width="1.8"
            />
            <Minus
              v-else
              class="h-4 w-4"
              :stroke-width="2.2"
            />
          </IconButton>
          <span class="w-8 text-center font-mono font-black text-amber-500">{{ item.quantity }}</span>
          <IconButton
            square
            class="h-8 w-8 rounded-lg border-transparent bg-transparent p-0 text-stone-400 transition-all hover:bg-white/5 hover:text-emerald-500"
            @click="increment(item)"
          >
            <Plus class="h-4 w-4" :stroke-width="2.2" />
          </IconButton>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { Backpack, Minus, Package, Plus, Trash2, X } from "@lucide/vue"
import { computed, reactive, ref } from "vue"

import type { InventoryItem } from "../../../types/character"
import type { GenericSystemData } from "../types"
import { useCharacterStore } from "../../../stores/character"
import Button from "../../../components/ui/Button.vue"
import FormField from "../../../components/ui/FormField.vue"
import IconButton from "../../../components/ui/IconButton.vue"

const characterStore = useCharacterStore()
const systemData = computed(() => characterStore.getSystemData<GenericSystemData>())

const inventory = computed(() => systemData.value?.inventory ?? [])

const showAddForm = ref(false)

const draft = reactive({
  name: "",
  details: "",
  quantity: 1,
})

const makeId = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 10)}`

const submitItem = () => {
  if (!draft.name.trim()) return

  const current = systemData.value?.inventory ?? []
  characterStore.updateSystemData<GenericSystemData>({
    inventory: [
      { id: makeId("item"), name: draft.name.trim(), details: draft.details.trim(), quantity: Math.max(1, draft.quantity) },
      ...current,
    ],
  })

  draft.name = ""
  draft.details = ""
  showAddForm.value = false
}

const decrement = (item: InventoryItem) => {
  const current = systemData.value?.inventory ?? []
  if (item.quantity <= 1) {
    characterStore.updateSystemData<GenericSystemData>({
      inventory: current.filter((i) => i.id !== item.id),
    })
  } else {
    characterStore.updateSystemData<GenericSystemData>({
      inventory: current.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity - 1 } : i)),
    })
  }
}

const increment = (item: InventoryItem) => {
  const current = systemData.value?.inventory ?? []
  characterStore.updateSystemData<GenericSystemData>({
    inventory: current.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i)),
  })
}
</script>

<style scoped>
.inventory-field :deep(input) {
  border-color: rgb(255 255 255 / 0.1);
  background: rgb(0 0 0 / 0.6);
  color: rgb(254 243 199 / 1);
  padding: 0.75rem 1rem;
}

.inventory-field :deep(input)::placeholder {
  color: rgb(87 83 78 / 1);
}

.inventory-field :deep(input:focus) {
  border-color: rgb(245 158 11 / 1);
  outline: none;
}
</style>
