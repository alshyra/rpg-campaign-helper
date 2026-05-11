<template>
  <div class="grid gap-6">
    <DrivePanel />

    <NoCharacterEmpty v-if="!character" />
    <BackupPanel v-else />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { computed } from "vue";

import NoCharacterEmpty from "../components/character/NoCharacterEmpty.vue";
import BackupPanel from "../components/profile/BackupPanel.vue";
import DrivePanel from "../components/profile/DrivePanel.vue";
import { useCharacterStore } from "../stores/character";

const characterStore = useCharacterStore();
const { state } = storeToRefs(characterStore);

const character = computed(() => state.value);
</script>
