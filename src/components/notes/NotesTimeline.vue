<template>
  <div class="stack-lg grid gap-4.5">
    <AppCard>
      <form class="notes-form grid gap-3.5" @submit.prevent="submitNote">
        <label class="field field--full">
          <span>Titre</span>
          <input v-model="draft.title" type="text" placeholder="Ex. Session 3" />
        </label>
        <label class="field field--full">
          <span>Note</span>
          <textarea v-model="draft.content" rows="5" placeholder="Résumé de session, PNJ, pistes, butin..."></textarea>
        </label>
        <button class="primary-button" type="submit">Ajouter au journal</button>
      </form>
    </AppCard>

    <AppCard v-for="note in notes" :key="note.id">
      <article class="note-entry grid gap-3.5">
        <div class="note-entry__top flex items-start justify-between gap-3">
          <div>
            <p class="note-entry__date">{{ note.createdAt }}</p>
            <h3 class="m-0 font-(family-name:--serif) text-lg">{{ note.title }}</h3>
          </div>
          <button class="icon-button" type="button" @click="emit('remove', note.id)">Supprimer</button>
        </div>
        <p class="m-0 leading-relaxed text-(--text-soft)">{{ note.content }}</p>
      </article>
    </AppCard>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import type { NoteEntry } from '../../types/character'
import AppCard from '../ui/AppCard.vue'

defineProps<{
  notes: NoteEntry[]
}>()

const emit = defineEmits<{
  add: [note: Omit<NoteEntry, 'id' | 'createdAt'>]
  remove: [id: string]
}>()

const draft = reactive({
  title: '',
  content: ''
})

const submitNote = () => {
  if (!draft.title.trim() || !draft.content.trim()) {
    return
  }

  emit('add', {
    title: draft.title.trim(),
    content: draft.content.trim()
  })

  draft.title = ''
  draft.content = ''
}
</script>