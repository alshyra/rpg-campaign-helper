<template>
  <div class="stack-xl grid gap-6">
    <SectionHeading
      eyebrow="Tunnel"
      :title="hasCharacter ? 'Édition du personnage' : 'Création du personnage'"
    />

    <CharacterEditor />

    <Button
      type="button"
      @click="goBack"
    >
      {{ hasCharacter ? "Retour au profil" : "Retour" }}
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

const isNewMode = computed(() => route.query.new === "1");

const goBack = () => {
  if (hasCharacter.value && !isNewMode.value) {
    router.push("/profil");
    return;
  }
  router.push("/persos");
};
</script>
