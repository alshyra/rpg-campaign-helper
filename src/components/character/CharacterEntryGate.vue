<template>
  <div class="entry-gate stack-xl grid gap-6">
    <SectionHeading
      eyebrow="Compagnon"
      title="Créer ou restaurer un personnage"
    />

    <AppCard>
      <div class="entry-gate__hero grid gap-3">
        <p class="m-0 leading-relaxed text-(--text-soft)">
          Aucun personnage détecté dans ce navigateur. Tu peux repartir d'un JSON existant ou ouvrir un tunnel de
          création.
        </p>
        <div class="entry-gate__actions grid gap-2.5">
          <FileImportLabel
            label="Importer un JSON"
            @file-selected="onFileChange"
          />
          <Button
            variant="primary"
            type="button"
            @click="goToTunnel"
            >Créer un personnage</Button
          >
        </div>
      </div>
    </AppCard>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

import { useCharacterStore } from "../../stores/character";
import AppCard from "../ui/AppCard.vue";
import Button from "../ui/Button.vue";
import FileImportLabel from "../ui/FileImportLabel.vue";
import SectionHeading from "../ui/SectionHeading.vue";

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
