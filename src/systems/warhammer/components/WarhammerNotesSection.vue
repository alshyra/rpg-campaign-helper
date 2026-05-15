<template>
  <article class="rounded-2xl border border-white/5 bg-stone-900/40 p-4">
    <div class="mb-3 flex items-center justify-between">
      <h3 class="m-0 text-[10px] font-black uppercase tracking-widest text-amber-500">Notes</h3>
      <IconButton
        square
        class="rounded-full p-2"
        :class="showForm ? 'bg-red-500/20 text-red-500 rotate-45' : 'bg-amber-500/10 text-amber-500'"
        @click="showForm = !showForm"
      >
        <Plus class="h-5 w-5" :stroke-width="2.2" />
      </IconButton>
    </div>

    <div v-if="showForm" class="mb-4 grid gap-2">
      <FormField v-model="draftTitle" placeholder="Titre" />
      <FormField v-model="draftContent" type="textarea" placeholder="Contenu..." rows="3" />
      <Button variant="primary" class="w-full py-2 text-sm" @click="addNote">Ajouter</Button>
    </div>

    <div v-if="notes.length === 0" class="py-4 text-center text-xs italic text-stone-600">
      Aucune note
    </div>

    <div v-else class="grid gap-2">
      <div v-for="note in notes" :key="note.id" class="group rounded-xl border border-white/5 bg-black/30 p-3">
        <div class="flex items-start justify-between gap-2">
          <div>
            <h4 v-if="note.title" class="m-0 font-bold text-amber-100">{{ note.title }}</h4>
            <p class="m-0 whitespace-pre-wrap text-xs leading-relaxed text-stone-400">{{ note.content }}</p>
          </div>
          <IconButton square ghost class="h-6 w-6 shrink-0 p-0 text-stone-600 opacity-0 transition-all group-hover:opacity-100 hover:text-red-500!" @click="removeNote(note.id)">
            <X class="h-3.5 w-3.5" />
          </IconButton>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { Plus, X } from "@lucide/vue"
import { computed, ref } from "vue"
import { storeToRefs } from "pinia"

import { useCharacterStore } from "../../../stores/character"
import Button from "../../../components/ui/Button.vue"
import FormField from "../../../components/ui/FormField.vue"
import IconButton from "../../../components/ui/IconButton.vue"

const characterStore = useCharacterStore()
const { state } = storeToRefs(characterStore)
const notes = computed(() => state.value?.notes ?? [])

const showForm = ref(false)
const draftTitle = ref("")
const draftContent = ref("")

const addNote = () => {
  if (!draftTitle.value.trim() && !draftContent.value.trim()) return
  characterStore.addNote({
    title: draftTitle.value.trim(),
    content: draftContent.value.trim(),
  })
  draftTitle.value = ""
  draftContent.value = ""
  showForm.value = false
}

const removeNote = (id: string) => {
  characterStore.removeNote(id)
}
</script>
