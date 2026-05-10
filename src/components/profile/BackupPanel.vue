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
          <FileDown class="h-5 w-5" :stroke-width="1.8" />
          <span>Exporter JSON</span>
        </div>
        <Download class="h-4 w-4 opacity-60" :stroke-width="1.8" />
      </Button>

      <!-- Import JSON -->
      <FileImportLabel
        variant="button"
        class="w-full rounded-xl border-white/5 bg-stone-800 p-4 text-left font-bold text-amber-400 hover:bg-stone-700"
        aria-label="Importer un JSON"
        @file-selected="onFileChange"
      >
        <div class="flex items-center gap-3">
          <FileUp class="h-5 w-5" :stroke-width="1.8" />
          <span>Importer JSON</span>
        </div>
      </FileImportLabel>

      <!-- Supprimer le personnage -->
      <Button
        variant="secondary"
        class="w-full justify-start gap-3 rounded-xl border-transparent bg-stone-800/30 p-4 font-bold text-red-500/50 transition-all hover:text-red-500"
        @click="deleteCharacter"
      >
        <Trash2 class="h-5 w-5" :stroke-width="1.8" />
        <span>Supprimer ce personnage</span>
      </Button>
    </div>
    <p class="m-0 text-xs text-stone-600">Dernière mise à jour : {{ updatedAtLabel }}</p>
  </section>
</template>

<script setup lang="ts">
import { Download, FileDown, FileUp, Trash2 } from "@lucide/vue";
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
  router.push("/characters");
};
</script>
