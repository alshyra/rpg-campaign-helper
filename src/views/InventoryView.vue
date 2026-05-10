<template>
  <div class="stack-xl grid gap-6">
    <NoCharacterEmpty v-if="!character" />
    <template v-else>
      <InventoryList />
    </template>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { computed } from "vue";

import NoCharacterEmpty from "../components/character/NoCharacterEmpty.vue";
import InventoryList from "../components/inventory/InventoryList.vue";
import { useCharacterStore } from "../stores/character";

const characterStore = useCharacterStore();
const { state } = storeToRefs(characterStore);

const character = computed(() => state.value);
</script>
