<template>
  <!-- center the div below in the middle of the page -->
  <div class="flex flex-col gap-8 items-stretch justify-center min-h-screen -mt-16">
    <CampaignManager />
    <section class="grid gap-3">
      <Button
        variant="primary"
        class="w-full gap-3 p-5 text-lg font-black shadow-lg shadow-amber-900/20 transition-all hover:bg-amber-500 active:scale-95"
        @click="goToTunnel"
      >
        <svg
          viewBox="0 0 24 24"
          class="h-6 w-6"
          fill="none"
          stroke="currentColor"
          stroke-width="2.2"
          stroke-linecap="round"
          aria-hidden="true"
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
        NOUVEAU HÉROS
      </Button>
      <div class="relative">
        <FileImportLabel @file-selected="onFileChange">
          <svg
            viewBox="0 0 24 24"
            class="h-5 w-5 text-amber-500"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M12 4v10M8.5 10.5L12 14l3.5-3.5M5 18h14" />
          </svg>
          IMPORTER JSON
        </FileImportLabel>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

import CampaignManager from "../components/character/CampaignManager.vue";
import Button from "../components/ui/Button.vue";
import FileImportLabel from "../components/ui/FileImportLabel.vue";
import { useCharacterStore } from "../stores/character";

const characterStore = useCharacterStore();
const router = useRouter();

const goToTunnel = () => {
  router.push("/personnage/tunnel?new=1");
};

const onFileChange = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const [file] = target.files ?? [];
  if (!file) {
    return;
  }

  try {
    const text = await file.text();
    characterStore.importFromObject(JSON.parse(text) as unknown);
  } catch {
    window.alert("Le fichier JSON est invalide ou illisible.");
  } finally {
    target.value = "";
  }
};
</script>
