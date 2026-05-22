<template>
  <div class="profile-view" v-if="character">
    <div class="profile-view__layout grid gap-4">
      <component :is="components.ProfileSection" />
      <component :is="components.HealthSection" />
    </div>
  </div>
  <NoCharacterEmpty v-else />
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

@media (max-width: 640px) {
  .profile-view__layout {
    gap: 0;
  }
}
</style>
