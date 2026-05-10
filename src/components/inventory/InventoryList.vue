<template>
  <div class="grid gap-8">
    <!-- Formulaire ajout (fond ambré) -->
    <section class="grid gap-4 rounded-3xl border border-amber-900/20 bg-amber-900/10 p-6">
      <h2 class="m-0 font-(family-name:--serif) text-2xl text-amber-100">Ajout</h2>
      <form class="grid gap-3" @submit.prevent="submitItem">
        <input
          v-model="draft.name"
          type="text"
          placeholder="Nom de l'objet..."
          class="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-amber-100 outline-none placeholder:text-stone-600 focus:border-amber-500"
        />
        <input
          v-model="draft.details"
          type="text"
          placeholder="Détails (effet, provenance...)"
          class="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-amber-100 outline-none placeholder:text-stone-600 focus:border-amber-500"
        />
        <div class="flex gap-3">
          <input
            v-model.number="draft.quantity"
            type="number"
            min="1"
            class="w-24 rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-amber-100 outline-none focus:border-amber-500"
          />
          <button
            class="flex flex-1 items-center justify-center gap-2 rounded-xl bg-amber-600 py-3 font-black text-black transition-all hover:bg-amber-500 active:scale-[0.98]"
            type="submit"
          >
            <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true">
              <path d="M12 5v14M5 12h14" />
            </svg>
            AJOUTER
          </button>
        </div>
      </form>
    </section>

    <!-- Liste des objets -->
    <section class="grid gap-3">
      <div
        v-for="item in items"
        :key="item.id"
        class="group flex items-center justify-between rounded-2xl border border-white/5 bg-stone-900/40 p-4"
      >
        <div>
          <h4 class="m-0 font-bold text-amber-100">{{ item.name }}</h4>
          <p v-if="item.details" class="m-0 mt-0.5 text-xs text-stone-500">{{ item.details }}</p>
        </div>
        <div class="flex items-center gap-3">
          <input
            :value="item.quantity"
            type="number"
            min="1"
            class="w-16 rounded-lg border border-white/10 bg-black/40 px-2 py-1 text-center font-mono text-lg font-bold text-amber-500 outline-none focus:border-amber-500"
            @input="emitQuantity(item.id, $event)"
          />
          <button
            class="flex h-8 w-8 items-center justify-center rounded-lg text-stone-600 opacity-0 transition-all group-hover:opacity-100 hover:text-red-500"
            type="button"
            aria-label="Retirer l'objet"
            @click="emit('remove', item.id)"
          >
            <svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import type { InventoryItem } from '../../types/character'

defineProps<{
  items: InventoryItem[]
}>()

const emit = defineEmits<{
  add: [item: Omit<InventoryItem, 'id'>]
  remove: [id: string]
  quantity: [id: string, quantity: number]
}>()

const draft = reactive<Omit<InventoryItem, 'id'>>({
  name: '',
  details: '',
  quantity: 1
})

const submitItem = () => {
  if (!draft.name.trim()) {
    return
  }

  emit('add', {
    name: draft.name.trim(),
    details: draft.details.trim(),
    quantity: Math.max(1, draft.quantity)
  })

  draft.name = ''
  draft.details = ''
  draft.quantity = 1
}

const emitQuantity = (id: string, event: Event) => {
  const target = event.target as HTMLInputElement
  emit('quantity', id, Math.max(1, Number(target.value)))
}
</script>