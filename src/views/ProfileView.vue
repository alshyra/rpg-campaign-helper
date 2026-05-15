<template>
  <NoCharacterEmpty v-if="!character" />
  <template v-else>
    <component :is="components.ProfileSection" />
    <component :is="components.HealthSection" />
  </template>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia"
import { computed } from "vue"

import NoCharacterEmpty from "../components/character/NoCharacterEmpty.vue"
import { useCharacterStore } from "../stores/character"
import { useSystemComponents } from "../systems/registry"

const { state } = storeToRefs(useCharacterStore())
const character = computed(() => state.value)
const systemId = computed(() => character.value?.systemId ?? null)
const components = useSystemComponents(systemId)
</script>

<style scoped>
.profile-view {
  min-height: calc(100dvh - 12.5rem);
}
</style>
