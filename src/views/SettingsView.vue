<template>
  <div class="grid gap-6">
    <NoCharacterEmpty v-if="!character" />

    <template v-else>
      <BackupPanel
        :character-name="state?.profile.characterName ?? ''"
        :updated-at-label="formattedUpdatedAt"
        @export="exportJson"
        @import="importJson"
        @delete="deleteCharacter"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { computed } from "vue";
import { useRouter } from "vue-router";

import NoCharacterEmpty from "../components/character/NoCharacterEmpty.vue";
import BackupPanel from "../components/profile/BackupPanel.vue";
import { useCharacterStore } from "../stores/character";

const characterStore = useCharacterStore();
const { state } = storeToRefs(characterStore);
const router = useRouter();

const character = computed(() => state.value);

const formattedUpdatedAt = computed(() =>
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

const importJson = async (file: File) => {
  try {
    const text = await file.text();
    const payload = JSON.parse(text) as unknown;
    characterStore.importFromObject(payload);
  } catch {
    window.alert("Le fichier JSON est invalide ou illisible.");
  }
};

const deleteCharacter = () => {
  const activeCampaignId = characterStore.activeCampaignId;
  if (!activeCampaignId) return;
  const confirmed = window.confirm("Supprimer ce personnage ? Cette action est définitive.");
  if (!confirmed) return;
  characterStore.deleteCampaign(activeCampaignId);
  router.push("/persos");
};
</script>
