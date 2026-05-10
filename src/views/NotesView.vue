<template>
  <div class="stack-xl grid gap-6">
    <NoCharacterEmpty v-if="!character" />
    <template v-else>
      <SectionHeading eyebrow="Journal" title="Prise de notes" />
      <NotesTimeline :notes="notes" @add="characterStore.addNote" @remove="characterStore.removeNote" />
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import NoCharacterEmpty from '../components/character/NoCharacterEmpty.vue'
import NotesTimeline from '../components/notes/NotesTimeline.vue'
import SectionHeading from '../components/ui/SectionHeading.vue'
import { useCharacterStore } from '../stores/character'

const characterStore = useCharacterStore()
const { state } = storeToRefs(characterStore)

const character = computed(() => state.value)
const notes = computed(() => state.value?.notes ?? [])
</script>