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

        <div class="grid gap-2.5">
          <div class="flex items-center gap-2">
            <div class="h-px flex-1 bg-white/10"></div>
            <span class="text-xs text-(--text-soft)">ou récupérer</span>
            <div class="h-px flex-1 bg-white/10"></div>
          </div>
          <Button
            v-if="!isConnected"
            variant="secondary"
            type="button"
            :disabled="isConnecting"
            class="justify-center gap-2"
            @click="handleDriveConnect"
          >
            <CloudUpload class="h-4 w-4" :stroke-width="1.8" />
            {{ isConnecting ? "Connexion…" : "Récupérer depuis Google Drive" }}
          </Button>
          <div
            v-else
            class="flex items-center justify-center gap-2 rounded-xl bg-stone-800/40 p-3 text-sm text-green-400"
          >
            <Loader2 class="h-4 w-4 animate-spin" :stroke-width="1.8" />
            Chargement depuis Google Drive…
          </div>
        </div>
      </div>
    </AppCard>
  </div>
</template>

<script setup lang="ts">
import { CloudUpload, Loader2 } from "@lucide/vue";
import { ref } from "vue";
import { useRouter } from "vue-router";

import AppCard from "../components/ui/AppCard.vue";
import Button from "../components/ui/Button.vue";
import FileImportLabel from "../components/ui/FileImportLabel.vue";
import { useDriveSync } from "../composables/useDriveSync";
import { useCharacterStore } from "../stores/character";

const router = useRouter();
const characterStore = useCharacterStore();
const driveSync = useDriveSync();
const { isConnected } = driveSync;
const isConnecting = ref(false);

const handleDriveConnect = async () => {
  isConnecting.value = true;
  try {
    await driveSync.connect();
    // character.ts watcher will load Drive data → hasCharacter becomes true → RouterView renders
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error("Drive connect error:", message);
    window.alert(`Impossible de se connecter a Google Drive: ${message}`);
  } finally {
    isConnecting.value = false;
  }
};

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
