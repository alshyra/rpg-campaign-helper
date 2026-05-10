<template>
  <div class="stack-xl grid gap-6">
    <SectionHeading
      eyebrow="Tunnel"
      :title="isCreating ? 'Création du personnage' : 'Édition du personnage'"
    />

    <CharacterEditor />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";

import CharacterEditor from "../components/character/CharacterEditor.vue";
import SectionHeading from "../components/ui/SectionHeading.vue";

const route = useRoute();

const isCreating = computed(() => route.name === "character-create");
</script>
