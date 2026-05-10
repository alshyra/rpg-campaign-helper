<template>
  <div class="stack-xl grid gap-6">
    <NoCharacterEmpty v-if="!character" />

    <template v-else>
      <SectionHeading eyebrow="Paramètres" title="Sauvegarde" />
      <BackupPanel :updated-at-label="formattedUpdatedAt" @export="exportJson" @import="importJson" />
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import NoCharacterEmpty from '../components/character/NoCharacterEmpty.vue'
import BackupPanel from '../components/profile/BackupPanel.vue'
import SectionHeading from '../components/ui/SectionHeading.vue'
import { useCharacterStore } from '../stores/character'

const characterStore = useCharacterStore()
const { state } = storeToRefs(characterStore)

const character = computed(() => state.value)

const formattedUpdatedAt = computed(() =>
  new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(new Date(state.value?.updatedAt ?? Date.now()))
)

const exportJson = () => {
  const blob = new Blob([characterStore.serialize()], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = `rpg-player-helper-${new Date().toISOString().slice(0, 10)}.json`
  anchor.click()
  URL.revokeObjectURL(url)
}

const importJson = async (file: File) => {
  try {
    const text = await file.text()
    const payload = JSON.parse(text) as unknown
    characterStore.importFromObject(payload)
  } catch {
    window.alert('Le fichier JSON est invalide ou illisible.')
  }
}
</script>
