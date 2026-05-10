<template>
  <AppCard>
    <div class="backup-panel backup-panel--compact flex items-center justify-between gap-3.5 max-[420px]:flex-col max-[420px]:items-stretch">
      <div class="backup-panel__summary grid gap-1">
        <p class="backup-panel__title m-0 font-(family-name:--serif) text-[1.1rem]">Sauvegarde locale active</p>
        <p class="backup-panel__meta">Dernière mise à jour : {{ updatedAtLabel }}</p>
      </div>
      <div class="backup-panel__quick-actions flex items-center gap-2">
        <IconButton square type="button" aria-label="Exporter en JSON" @click="emit('export')">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 4v10" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
            <path d="M8.5 10.5L12 14l3.5-3.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M5 18h14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
          </svg>
        </IconButton>
        <FileImportLabel variant="icon-button" aria-label="Importer un JSON" @file-selected="onFileChange">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 20V10" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
            <path d="M8.5 13.5L12 10l3.5 3.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M5 6h14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
          </svg>
        </FileImportLabel>
      </div>
    </div>
  </AppCard>
</template>

<script setup lang="ts">
import AppCard from '../ui/AppCard.vue'
import IconButton from '../ui/IconButton.vue'
import FileImportLabel from '../ui/FileImportLabel.vue'

defineProps<{
  updatedAtLabel: string
}>()

const emit = defineEmits<{
  export: []
  import: [file: File]
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