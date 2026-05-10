<template>
  <div class="stack-xl grid gap-6">
    <NoCharacterEmpty v-if="!character" />
    <template v-else>
      <SectionHeading eyebrow="Inventaire" title="Équipement et trouvailles" />
      <InventoryList
        :items="inventory"
        @add="characterStore.addInventoryItem"
        @remove="characterStore.removeInventoryItem"
        @quantity="updateQuantity"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import NoCharacterEmpty from '../components/character/NoCharacterEmpty.vue'
import InventoryList from '../components/inventory/InventoryList.vue'
import SectionHeading from '../components/ui/SectionHeading.vue'
import { useCharacterStore } from '../stores/character'

const characterStore = useCharacterStore()
const { state } = storeToRefs(characterStore)

const character = computed(() => state.value)
const inventory = computed(() => state.value?.inventory ?? [])

const updateQuantity = (id: string, quantity: number) => {
  characterStore.updateInventoryItem(id, { quantity })
}
</script>