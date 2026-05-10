<template>
  <div class="grid gap-8">
    <!-- Formulaire Journal -->
    <section class="grid gap-4 rounded-3xl border border-white/5 bg-stone-900/40 p-6">
      <h2 class="m-0 font-(family-name:--serif) text-2xl italic text-amber-100">Journal</h2>
      <form
        class="grid gap-3"
        @submit.prevent="submitNote"
      >
        <input
          v-model="draft.title"
          type="text"
          placeholder="Titre..."
          class="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm font-bold text-amber-100 outline-none placeholder:text-stone-600 focus:border-amber-500"
        />
        <textarea
          v-model="draft.content"
          rows="4"
          placeholder="Contenu..."
          class="w-full resize-none rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-amber-100 outline-none placeholder:text-stone-600 focus:border-amber-500"
        ></textarea>
        <button
          class="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-600 py-3 font-black text-black transition-all hover:bg-amber-500 active:scale-[0.98]"
          type="submit"
        >
          <svg
            viewBox="0 0 24 24"
            class="h-5 w-5"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
            <path d="M17 21v-8H7v8M7 3v5h8" />
          </svg>
          SCELER LA NOTE
        </button>
      </form>
    </section>

    <!-- Timeline des notes -->
    <div class="grid gap-6">
      <div
        v-for="note in notes"
        :key="note.id"
        class="group relative border-l border-amber-600/30 pl-6"
      >
        <button
          class="absolute -left-3.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-stone-900/80 text-stone-600 opacity-0 transition-all group-hover:opacity-100 hover:text-red-500!"
          type="button"
          aria-label="Supprimer cette note"
          @click="emit('remove', note.id)"
        >
          <svg
            viewBox="0 0 24 24"
            class="h-3.5 w-3.5"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            aria-hidden="true"
          >
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
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
import { reactive } from "vue";

import type { NoteEntry } from "../../types/character";

defineProps<{
  notes: NoteEntry[];
}>();

const emit = defineEmits<{
  add: [note: Omit<NoteEntry, "id" | "createdAt">];
  remove: [id: string];
}>();

const draft = reactive({
  title: "",
  content: "",
});

const submitNote = () => {
  if (!draft.title.trim() || !draft.content.trim()) {
    return;
  }

  emit("add", {
    title: draft.title.trim(),
    content: draft.content.trim(),
  });

  draft.title = "";
  draft.content = "";
};
</script>
