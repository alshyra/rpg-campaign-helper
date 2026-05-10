<template>
  <div class="grid gap-6">
    <NoCharacterEmpty v-if="!character" />

    <template v-else>
      <BackupPanel />
    </template>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { computed } from "vue";

import NoCharacterEmpty from "../components/character/NoCharacterEmpty.vue";
import BackupPanel from "../components/profile/BackupPanel.vue";
import { useCharacterStore } from "../stores/character";

const characterStore = useCharacterStore();
const { state } = storeToRefs(characterStore);

const character = computed(() => state.value);
</script>
