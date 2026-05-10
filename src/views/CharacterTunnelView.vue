<template>
  <div class="stack-xl grid gap-6">
    <SectionHeading eyebrow="Tunnel" :title="hasCharacter ? 'Édition du personnage' : 'Création du personnage'" />

    <CharacterEditor
      :character="workingCharacter"
      :submit-label="hasCharacter ? 'Enregistrer les modifications' : 'Créer le personnage'"
      :include-injuries="hasCharacter && !isNewMode"
      @submit="saveCharacter"
    />

    <Button type="button" @click="goBack">
      {{ hasCharacter ? 'Retour au profil' : 'Retour' }}
    </Button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'
import CharacterEditor from '../components/character/CharacterEditor.vue'
import SectionHeading from '../components/ui/SectionHeading.vue'
import Button from '../components/ui/Button.vue'
import { useCharacterStore } from '../stores/character'
import type { CharacterState } from '../types/character'

const characterStore = useCharacterStore()
const { hasCharacter, state } = storeToRefs(characterStore)
const route = useRoute()
const router = useRouter()

const emptyCharacter = (): CharacterState => ({
  profile: {
    characterName: '',
    role: '',
    mood: '',
    injuries: {
      light: 0,
      minor: 0,
      major: 0,
      fatal: 0
    }
  },
  stats: [
    { key: 'dex', label: 'DEX', value: 0 },
    { key: 'for', label: 'FOR', value: 0 },
    { key: 'con', label: 'CON', value: 0 },
    { key: 'int', label: 'INT', value: 0 },
    { key: 'sag', label: 'SAG', value: 0 },
    { key: 'cha', label: 'CHA', value: 0 }
  ],
  skills: [],
  inventory: [],
  notes: [],
  updatedAt: new Date().toISOString()
})

const isNewMode = computed(() => route.query.new === '1')

const workingCharacter = computed(() =>
  isNewMode.value || !state.value ? emptyCharacter() : state.value
)

const saveCharacter = (character: CharacterState) => {
  if (isNewMode.value || !hasCharacter.value) {
    characterStore.createNewCharacter(character)
  } else {
    characterStore.saveActiveCharacter(character)
  }
  router.replace('/profil')
}

const goBack = () => {
  if (hasCharacter.value) {
    router.push('/profil')
    return
  }
  router.push('/')
}
</script>
