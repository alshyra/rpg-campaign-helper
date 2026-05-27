<template>
  <template v-if="character && components.AdvancementSection">
    <component :is="components.AdvancementSection" />
  </template>
  <NoCharacterEmpty v-else-if="!character" />
  <p
    v-else
    class="p-8 text-center text-sm text-stone-500"
  >
    Aucun système d'avancement pour ce personnage.
  </p>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { computed } from "vue";

import NoCharacterEmpty from "../components/character/NoCharacterEmpty.vue";
import { useCharacterStore } from "../stores/character";
import { useSystemComponents } from "../systems/registry";

const { state } = storeToRefs(useCharacterStore());
const character = computed(() => state.value);
const systemId = computed(() => character.value?.systemId ?? null);
const components = useSystemComponents(systemId);
</script>
