<template>
  <AppCard>
    <div class="no-character-empty grid gap-3">
      <h3 class="m-0 font-(family-name:--serif)">Aucun personnage actif</h3>
      <p class="m-0 leading-relaxed text-(--text-soft)">
        Sélectionne ou crée un personnage pour accéder à cette section.
      </p>
      <div class="no-character-empty__actions grid grid-cols-2 gap-2.5 max-[420px]:grid-cols-1">
        <Button
          variant="secondary"
          @click="goPersos"
        >
          Aller à Persos
        </Button>
        <Button
          variant="primary"
          @click="goTunnel"
        >
          Créer un perso
        </Button>
      </div>
    </div>
  </AppCard>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

import AppCard from "../ui/AppCard.vue";
import Button from "../ui/Button.vue";

const router = useRouter();

const goPersos = () => {
  router.push("/characters");
};

const goTunnel = () => {
  router.push("/characters/create");
};
</script>
