<template>
  <div class="stack-lg grid gap-4.5">
    <AppCard>
      <form class="inventory-form grid gap-3.5" @submit.prevent="submitItem">
        <label class="field field--full">
          <span>Objet</span>
          <input v-model="draft.name" type="text" placeholder="Ex. carte pliée, torche, amulette..." />
        </label>
        <label class="field field--full">
          <span>Détails</span>
          <input v-model="draft.details" type="text" placeholder="Effet, provenance, dégâts..." />
        </label>
        <label class="field field--small">
          <span>Quantité</span>
          <input v-model.number="draft.quantity" type="number" min="1" />
        </label>
        <button class="primary-button" type="submit">Ajouter</button>
      </form>
    </AppCard>

    <AppCard v-for="item in items" :key="item.id">
      <div class="inventory-item grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 max-[420px]:grid-cols-1">
        <div>
          <h3 class="m-0 font-(family-name:--serif) text-lg">{{ item.name }}</h3>
          <p class="mt-1 text-(--text-soft)">{{ item.details || 'Aucun détail renseigné.' }}</p>
        </div>
        <div class="inventory-item__actions grid justify-items-end gap-2.5">
          <label class="field field--mini">
            <span>Qté</span>
            <input
              :value="item.quantity"
              type="number"
              min="1"
              @input="emitQuantity(item.id, $event)"
            />
          </label>
          <button class="icon-button" type="button" @click="emit('remove', item.id)">Retirer</button>
        </div>
      </div>
    </AppCard>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import type { InventoryItem } from '../../types/character'
import AppCard from '../ui/AppCard.vue'

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