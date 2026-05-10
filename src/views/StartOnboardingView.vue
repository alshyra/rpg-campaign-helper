<template>
  <div class="start-onboarding relative grid min-h-[calc(100vh-140px)] place-items-center py-2.5">
    <div class="start-onboarding__halo"></div>
    <AppCard>
      <div class="start-onboarding__content relative grid gap-3.5">
        <p class="section-heading__eyebrow">Bienvenue</p>
        <h2 class="m-0 font-(family-name:--serif) text-3xl">Prêt à lancer ta prochaine campagne</h2>
        <p class="m-0 leading-relaxed text-(--text-soft)">
          Commence avec une création guidée de personnage, ou restaure une sauvegarde JSON existante. Toutes les données
          restent locales dans ton navigateur.
        </p>

        <div class="start-onboarding__actions grid gap-2.5">
          <Button
            variant="primary"
            type="button"
            @click="goToTunnel"
            >Créer mon personnage</Button
          >
          <FileImportLabel
            label="Importer un personnage JSON"
            @file-selected="onFileChange"
          />
        </div>
      </div>
    </AppCard>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

import AppCard from "../components/ui/AppCard.vue";
import Button from "../components/ui/Button.vue";
import FileImportLabel from "../components/ui/FileImportLabel.vue";
import { useCharacterStore } from "../stores/character";

const router = useRouter();
const characterStore = useCharacterStore();

const goToTunnel = () => {
  router.push("/characters/create");
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
