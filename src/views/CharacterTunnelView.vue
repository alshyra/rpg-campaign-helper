<template>
  <div class="stack-xl grid gap-6">
    <SectionHeading
      eyebrow="Tunnel"
      :title="isCreating ? 'Création du personnage' : 'Édition du personnage'"
    />

    <CharacterEditor />

    <Button
      type="button"
      @click="goBack"
    >
      {{ isCreating ? "Annuler" : "Retour au profil" }}
    </Button>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";

import CharacterEditor from "../components/character/CharacterEditor.vue";
import Button from "../components/ui/Button.vue";
import SectionHeading from "../components/ui/SectionHeading.vue";
import { useCharacterStore } from "../stores/character";

const characterStore = useCharacterStore();
const { hasCharacter, state } = storeToRefs(characterStore);
const route = useRoute();
const router = useRouter();

const characterId = computed(() => route.params.id as string);
const isCreating = computed(() => route.name === "character-create");

const goBack = () => {
  if (isCreating.value) {
    router.push("/characters");
    return;
  }
  if (hasCharacter.value && characterId.value) {
    router.push(`/characters/${characterId.value}/profile`);
    return;
  }
  router.push("/characters");
};
</script>
