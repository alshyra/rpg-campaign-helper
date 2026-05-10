<template>
  <AppShell>
    <StartOnboardingView v-if="!hasCharacter && route.name !== 'character-tunnel'" />
    <template v-else>
      <RouterView />
      <OnboardingOverlay v-if="hasCharacter" />
    </template>
  </AppShell>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { RouterView, useRoute } from 'vue-router'
import AppShell from './components/layout/AppShell.vue'
import OnboardingOverlay from './components/onboarding/OnboardingOverlay.vue'
import StartOnboardingView from './views/StartOnboardingView.vue'
import { useCharacterStore } from './stores/character'

const characterStore = useCharacterStore()
const { hasCharacter } = storeToRefs(characterStore)
const route = useRoute()
</script>