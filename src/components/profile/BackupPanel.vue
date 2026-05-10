<template>
  <section class="grid gap-6 rounded-3xl border border-white/5 bg-stone-900/40 p-6">
    <h3 class="m-0 font-(family-name:--serif) text-lg text-amber-100">Données de {{ characterName }}</h3>
    <div class="grid gap-3">
      <!-- Export JSON -->
      <Button
        variant="secondary"
        class="group w-full justify-between rounded-xl border-white/5 bg-stone-800 p-4 font-bold text-amber-400 transition-all hover:bg-stone-700"
        @click="exportJson"
      >
        <div class="flex items-center gap-3">
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
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
            <path d="M12 18v-6M9 15l3 3 3-3" />
          </svg>
          <span>Exporter JSON</span>
        </div>
        <svg
          viewBox="0 0 24 24"
          class="h-4 w-4 opacity-60"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
          stroke-linecap="round"
          aria-hidden="true"
        >
          <path d="M12 4v10M8.5 10.5L12 14l3.5-3.5M5 18h14" />
        </svg>
      </Button>

      <!-- Import JSON -->
      <FileImportLabel
        variant="icon-button"
        class="block! w-full! rounded-xl! border! border-white/5! bg-stone-800! p-4! text-left! font-bold! text-amber-400! hover:bg-stone-700!"
        aria-label="Importer un JSON"
        @file-selected="onFileChange"
      >
        <div class="flex items-center gap-3">
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
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
            <path d="M12 12v6M9 15l3-3 3 3" />
          </svg>
          <span>Importer JSON</span>
        </div>
      </FileImportLabel>

      <!-- Supprimer le personnage -->
      <Button
        variant="secondary"
        class="w-full justify-start gap-3 rounded-xl border-transparent bg-stone-800/30 p-4 font-bold text-red-500/50 transition-all hover:text-red-500"
        @click="deleteCharacter"
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
          <path d="M5 7h14M9 7V5h6v2M8 7v11h8V7M10.5 10.5v5M13.5 10.5v5" />
        </svg>
        <span>Supprimer ce personnage</span>
      </Button>
    </div>
    <p class="m-0 text-xs text-stone-600">Dernière mise à jour : {{ updatedAtLabel }}</p>
  </section>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { computed } from "vue";
import { useRouter } from "vue-router";

import { useCharacterStore } from "../../stores/character";
import Button from "../ui/Button.vue";
import FileImportLabel from "../ui/FileImportLabel.vue";

const characterStore = useCharacterStore();
const { state } = storeToRefs(characterStore);
const router = useRouter();

const characterName = computed(() => state.value?.profile.characterName ?? "");

const updatedAtLabel = computed(() =>
  new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(state.value?.updatedAt ?? Date.now())),
);

const exportJson = () => {
  const blob = new Blob([characterStore.serialize()], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `rpg-player-helper-${new Date().toISOString().slice(0, 10)}.json`;
  anchor.click();
  URL.revokeObjectURL(url);
};

const onFileChange = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const [file] = target.files ?? [];
  if (!file) {
    return;
  }

  try {
    const text = await file.text();
    const payload = JSON.parse(text) as unknown;
    characterStore.importFromObject(payload);
  } catch {
    window.alert("Le fichier JSON est invalide ou illisible.");
  } finally {
    target.value = "";
  }
};

const deleteCharacter = () => {
  const activeCampaignId = characterStore.activeCampaignId;
  if (!activeCampaignId) {
    return;
  }

  const confirmed = window.confirm("Supprimer ce personnage ? Cette action est définitive.");
  if (!confirmed) {
    return;
  }

  characterStore.deleteCampaign(activeCampaignId);
  router.push("/persos");
};
</script>
