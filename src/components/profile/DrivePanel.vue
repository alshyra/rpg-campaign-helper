<template>
  <section class="grid gap-6 rounded-3xl border border-white/5 bg-stone-900/40 p-6">
    <h3 class="m-0 font-(family-name:--serif) text-lg text-amber-100">Synchronisation Google Drive</h3>

    <div v-if="!isConnected" class="grid gap-3">
      <Button
        variant="secondary"
        class="group w-full justify-between rounded-xl border-white/5 bg-stone-800 p-4 font-bold text-amber-400 transition-all hover:bg-stone-700"
        :disabled="isConnecting"
        @click="handleConnect"
      >
        <div class="flex items-center gap-3">
          <CloudUpload class="h-5 w-5" :stroke-width="1.8" />
          <span>{{ isConnecting ? "Connexion…" : "Connecter Google Drive" }}</span>
        </div>
        <Loader2 v-if="isConnecting" class="h-4 w-4 animate-spin opacity-60" :stroke-width="1.8" />
        <ArrowRight v-else class="h-4 w-4 opacity-60" :stroke-width="1.8" />
      </Button>
    </div>

    <div v-else class="grid gap-3">
      <div class="flex items-center gap-3 rounded-xl bg-stone-800/50 p-4">
        <CloudUpload class="h-5 w-5 text-green-400" :stroke-width="1.8" />
        <div class="flex-1">
          <p class="m-0 font-bold text-green-400">Connecté</p>
          <p v-if="lastSyncedAt" class="m-0 text-xs text-stone-500">
            Dernière sync : {{ syncLabel }}
          </p>
          <p v-else class="m-0 text-xs text-stone-500">Pas encore synchronisé</p>
        </div>
        <Loader2 v-if="isSyncing" class="h-4 w-4 animate-spin text-amber-400" :stroke-width="1.8" />
      </div>

      <Button
        variant="secondary"
        class="w-full justify-start gap-3 rounded-xl border-transparent bg-stone-800/30 p-4 font-bold text-red-500/50 transition-all hover:text-red-500"
        @click="driveSync.disconnect()"
      >
        <CloudOff class="h-5 w-5" :stroke-width="1.8" />
        <span>Déconnecter</span>
      </Button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ArrowRight, CloudOff, CloudUpload, Loader2 } from "@lucide/vue";
import { computed, ref } from "vue";

import { useDriveSync } from "../../composables/useDriveSync";
import Button from "../ui/Button.vue";

const driveSync = useDriveSync();
const { isConnected, isSyncing, lastSyncedAt } = driveSync;

const isConnecting = ref(false);

const syncLabel = computed(() => {
  if (!lastSyncedAt.value) return null;
  return lastSyncedAt.value.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
});

async function handleConnect() {
  isConnecting.value = true;
  try {
    await driveSync.connect();
  } catch (e) {
    console.error("Drive connect error:", e);
  } finally {
    isConnecting.value = false;
  }
}
</script>
