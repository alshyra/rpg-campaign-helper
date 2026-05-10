<template>
  <section class="grid gap-6 rounded-3xl border border-white/5 bg-stone-900/40 p-6">
    <h3 class="m-0 font-(family-name:--serif) text-lg text-amber-100">Données de {{ characterName }}</h3>
    <div class="grid gap-3">
      <!-- Export JSON -->
      <button
        class="group flex w-full items-center justify-between rounded-xl border border-white/5 bg-stone-800 p-4 font-bold text-amber-400 transition-all hover:bg-stone-700"
        type="button"
        @click="emit('export')"
      >
        <div class="flex items-center gap-3">
          <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
            <path d="M12 18v-6M9 15l3 3 3-3" />
          </svg>
          <span>Exporter JSON</span>
        </div>
        <svg viewBox="0 0 24 24" class="h-4 w-4 opacity-60" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true">
          <path d="M12 4v10M8.5 10.5L12 14l3.5-3.5M5 18h14" />
        </svg>
      </button>

      <!-- Import JSON -->
      <FileImportLabel variant="icon-button" class="!block !w-full !rounded-xl !border !border-white/5 !bg-stone-800 !p-4 !text-left !font-bold !text-amber-400 hover:!bg-stone-700" aria-label="Importer un JSON" @file-selected="onFileChange">
        <div class="flex items-center gap-3">
          <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
            <path d="M12 12v6M9 15l3-3 3 3" />
          </svg>
          <span>Importer JSON</span>
        </div>
      </FileImportLabel>

      <!-- Supprimer le personnage -->
      <button
        class="flex w-full items-center gap-3 rounded-xl border border-transparent bg-stone-800/30 p-4 font-bold text-red-500/50 transition-all hover:text-red-500"
        type="button"
        @click="emit('delete')"
      >
        <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M5 7h14M9 7V5h6v2M8 7v11h8V7M10.5 10.5v5M13.5 10.5v5" />
        </svg>
        <span>Supprimer ce personnage</span>
      </button>
    </div>
    <p class="m-0 text-xs text-stone-600">Dernière mise à jour : {{ updatedAtLabel }}</p>
  </section>
</template>

<script setup lang="ts">
import FileImportLabel from '../ui/FileImportLabel.vue'

defineProps<{
  characterName: string
  updatedAtLabel: string
}>()

const emit = defineEmits<{
  export: []
  import: [file: File]
  delete: []
}>()

const onFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const [file] = target.files ?? []
  if (!file) {
    return
  }
  emit('import', file)
  target.value = ''
}
</script>