<template>
  <div>
    <CharacterEditor />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";

import CharacterEditor from "../components/character/CharacterEditor.vue";

const route = useRoute();

const isCreating = computed(() => route.name === "character-create");
</script>
