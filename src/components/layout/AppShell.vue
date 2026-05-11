<template>
  <div class="relative min-h-screen">
    <!-- Glows -->
    <div
      class="fixed -top-22.5 -right-10 w-55 h-55 rounded-full pointer-events-none blur-2xl opacity-45 bg-[rgba(180,110,30,0.18)]"
    />
    <div
      class="fixed bottom-7.5 -left-20 w-55 h-55 rounded-full pointer-events-none blur-2xl opacity-45 bg-[rgba(140,88,40,0.16)]"
    />

    <header
      v-if="showHeader"
      class="sticky top-0 z-50 grid grid-cols-[40px_1fr_40px] items-center gap-3 border-b border-white/5 bg-black/60 px-5 py-4 backdrop-blur-md"
    >
      <!-- Gauche -->
      <IconButton
        square
        ghost
        @click="goHome"
        v-if="route.name !== 'characters'"
        aria-label="Retour accueil"
        icon="House"
        :size="16"
      />
      <div
        v-else
        class="w-10"
      />

      <!-- Centre : titre + crayon collé -->
      <div class="flex items-center justify-center gap-1.5">
        <div
          class="text-center"
          :class="{ 'cursor-pointer': characterId }"
          @click="characterId ? router.push(`/characters/${characterId}/profile`) : undefined"
        >
          <p class="m-0 text-[10px] font-black uppercase leading-tight tracking-[0.3em] text-amber-600">
            {{ eyebrow }}
          </p>
          <p class="m-0 mt-0.5 font-(family-name:--serif) text-xl leading-none tracking-wide text-amber-100">
            {{ title }}
          </p>
        </div>

        <IconButton
          v-if="showEditButton"
          type="button"
          aria-label="Modifier le personnage"
          :size="16"
          @click="goToTunnel"
          icon="Pencil"
          ghost
        />
      </div>

      <!-- Droite -->
      <IconButton
        v-if="route.name !== 'settings'"
        class="icon-button icon-button--square justify-self-end"
        type="button"
        ghost
        aria-label="Ouvrir les paramètres"
        icon="Settings"
        :size="16"
        @click="goToSettings"
      >
      </IconButton>
      <div
        v-else
        class="w-10"
      />
    </header>

    <div class="mx-auto w-full max-w-140 px-5 pb-28 pt-3">
      <main class="grid gap-4.5">
        <slot />
      </main>
    </div>

    <BottomNav v-if="showBottomNav" />
  </div>
</template>

<script setup lang="ts">
import { House, Settings, Pencil } from "@lucide/vue";
import { storeToRefs } from "pinia";
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";

import { useCharacterStore } from "../../stores/character";
import Button from "../ui/Button.vue";
import IconButton from "../ui/IconButton.vue";
import BottomNav from "./BottomNav.vue";

const characterStore = useCharacterStore();
const { hasCharacter, state } = storeToRefs(characterStore);
const route = useRoute();
const router = useRouter();

const characterName = computed(() => state.value?.profile.characterName || "");
const characterId = computed(() => route.params.id as string);

const eyebrow = computed(() => {
  if (route.name === "characters") return "Compendium";
  if (route.name === "settings") return "Système";
  return "Aventurier";
});

const title = computed(() => {
  if (route.name === "characters") return "Mes Héros";
  if (route.name === "settings") return "Réglages";
  return characterName.value || "Héros";
});

const showHeader = computed(() => true);

const showBottomNav = computed(
  () => hasCharacter.value && !["character-edit", "character-create", "characters", "settings"].includes(route.name as string),
);

const showEditButton = computed(
  () =>
    route.name === "character-profile" ||
    route.name === "character-inventory" ||
    route.name === "character-notes" ||
    route.name === "character-spells" ||
    route.name === "character-skills",
);

const goHome = () => {
  router.push("/characters");
};

const goToSettings = () => {
  router.push("/settings");
};

const goToTunnel = () => {
  if (characterId.value) {
    router.push(`/characters/${characterId.value}/edit`);
  }
};
</script>

<style scoped>
.app-shell__glow {
  position: fixed;
  width: 220px;
  height: 220px;
  border-radius: 999px;
  pointer-events: none;
  filter: blur(40px);
  opacity: 0.45;
}

.app-shell__glow--top {
  top: -90px;
  right: -40px;
  background: rgba(180, 110, 30, 0.18);
}

.app-shell__glow--bottom {
  bottom: 30px;
  left: -80px;
  background: rgba(140, 88, 40, 0.16);
}

.app-topbar__title {
  border: 0;
  padding: 0;
  background: transparent;
  color: var(--text-soft);
  font-family: var(--serif);
  font-size: 1rem;
  cursor: pointer;
}

.app-topbar__title:hover {
  color: var(--gold);
}
</style>
