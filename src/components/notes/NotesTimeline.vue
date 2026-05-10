<template>
  <div class="grid gap-6">
    <!-- Header avec toggle -->
    <div class="flex items-center justify-between px-2">
      <h2 class="m-0 font-(family-name:--serif) text-2xl italic text-amber-100">Journal</h2>
      <IconButton
        square
        class="rounded-full p-2 transition-all"
        :class="showAddForm ? 'bg-red-500/20 text-red-500 rotate-45' : 'bg-amber-500/10 text-amber-500'"
        @click="showAddForm = !showAddForm"
      >
        <Plus class="h-6 w-6" :stroke-width="2.2" />
      </IconButton>
    </div>

    <!-- Formulaire ajout (collapsible) -->
    <section
      v-if="showAddForm"
      class="grid gap-4 rounded-3xl border border-amber-500/30 bg-stone-900/80 p-6"
    >
      <div class="flex items-center justify-between">
        <h3 class="m-0 text-[10px] font-black uppercase tracking-widest text-amber-400">Nouvelle entrée</h3>
        <IconButton
          ghost
          square
          class="h-8 w-8 p-0 text-stone-500 hover:text-white"
          @click="showAddForm = false"
        >
          <X class="h-4 w-4" :stroke-width="2" />
        </IconButton>
      </div>
      <form
        class="grid gap-3"
        @submit.prevent="submitNote"
      >
        <FormField
          v-model="draft.title"
          placeholder="Titre..."
        />
        <FormField
          v-model="draft.content"
          type="textarea"
          rows="4"
          placeholder="Contenu..."
        />
        <Button
          variant="primary"
          class="w-full gap-2 py-3 font-black text-black transition-all hover:bg-amber-500 active:scale-[0.98]"
          type="submit"
        >
          <Save class="h-5 w-5" :stroke-width="1.8" />
          SCELER LA NOTE
        </Button>
      </form>
    </section>

    <!-- État vide -->
    <div
      v-if="notes.length === 0"
      class="rounded-3xl border-2 border-dashed border-white/5 py-12 text-center text-stone-600"
    >
      <BookOpen class="mx-auto mb-2 h-12 w-12 opacity-20" :stroke-width="1.2" />
      <p class="text-sm italic">Le journal est vide... Commence à écrire l'histoire.</p>
    </div>

    <!-- Timeline des notes -->
    <div
      v-else
      class="grid gap-6"
    >
      <div
        v-for="note in notes"
        :key="note.id"
        class="group relative border-l border-amber-600/30 pl-6"
      >
        <IconButton
          square
          class="absolute -left-3.5 top-1.5 h-7 w-7 rounded-full border-white/10 bg-stone-900/80 p-0 text-stone-600 opacity-0 transition-all group-hover:opacity-100 hover:bg-white/5 hover:text-red-500!"
          aria-label="Supprimer cette note"
          @click="removeNote(note.id)"
        >
          <X class="h-3.5 w-3.5" :stroke-width="1.8" />
        </IconButton>
        <span class="font-mono text-[10px] uppercase text-stone-500">{{ note.createdAt }}</span>
        <h4 class="m-0 mt-0.5 font-(family-name:--serif) text-lg text-amber-200">
          {{ note.title }}
        </h4>
        <p class="m-0 mt-2 text-sm italic leading-relaxed text-stone-400">"{{ note.content }}"</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { BookOpen, Plus, Save, X } from "@lucide/vue";
import { storeToRefs } from "pinia";
import { computed, reactive, ref } from "vue";

import { useCharacterStore } from "../../stores/character";
import Button from "../ui/Button.vue";
import FormField from "../ui/FormField.vue";
import IconButton from "../ui/IconButton.vue";

const characterStore = useCharacterStore();
const { state } = storeToRefs(characterStore);

const notes = computed(() => state.value?.notes ?? []);
const showAddForm = ref(false);

const draft = reactive({
  title: "",
  content: "",
});

const submitNote = () => {
  if (!draft.title.trim() || !draft.content.trim()) {
    return;
  }

  characterStore.addNote({
    title: draft.title.trim(),
    content: draft.content.trim(),
  });

  draft.title = "";
  draft.content = "";
  showAddForm.value = false;
};

const removeNote = (id: string) => {
  characterStore.removeNote(id);
};
</script>

<style scoped>
.note-field :deep(input),
.note-field :deep(textarea) {
  border-color: rgb(255 255 255 / 0.1);
  background: rgb(0 0 0 / 0.4);
  color: rgb(254 243 199 / 1);
}

.note-field :deep(input)::placeholder,
.note-field :deep(textarea)::placeholder {
  color: rgb(87 83 78 / 1);
}

.note-field :deep(input:focus),
.note-field :deep(textarea:focus) {
  border-color: rgb(245 158 11 / 1);
  outline: none;
}

.note-field--content :deep(textarea) {
  resize: none;
}
</style>
