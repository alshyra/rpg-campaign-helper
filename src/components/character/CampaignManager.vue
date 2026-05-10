<template>
  <section class="campaign-manager grid gap-3">
    <h3 class="px-2 text-[10px] font-black uppercase tracking-[0.2em] text-stone-500">Actifs</h3>

    <div
      v-if="campaigns.length === 0"
      class="rounded-2xl border border-white/5 bg-stone-900/30 px-4 py-6 text-sm text-(--text-soft)"
    >
      Aucun personnage sauvegardé.
    </div>

    <div
      v-else
      class="campaign-manager__list grid gap-2.5"
    >
      <article
        v-for="campaign in campaigns"
        :key="campaign.id"
        class="campaign-item group flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-white/5 bg-stone-900/40 p-5 transition-all hover:border-amber-500/30 hover:bg-stone-800/60"
        :class="{ 'campaign-item--active border-amber-500/40 bg-[rgba(210,160,51,0.08)]': campaign.id === activeCampaignId }"
        role="button"
        tabindex="0"
        @click="selectCampaign(campaign.id)"
        @keydown.enter.prevent="selectCampaign(campaign.id)"
        @keydown.space.prevent="selectCampaign(campaign.id)"
      >
        <div class="flex items-center gap-4">
          <div
            class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-950/50 font-(family-name:--serif) text-xl text-amber-500"
          >
            {{ campaign.characterName[0] }}
          </div>
          <div>
            <h4 class="m-0 text-lg font-bold text-amber-100 transition-colors group-hover:text-amber-400">
              {{ campaign.characterName }}
            </h4>
            <p class="m-0 text-xs italic text-stone-500">{{ campaign.role }}</p>
          </div>
        </div>
        <ChevronRight
          class="h-5 w-5 shrink-0 text-stone-700 transition-all group-hover:text-amber-500"
          :stroke-width="1.8"
        />
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ChevronRight } from "@lucide/vue";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";

import { useCharacterStore } from "../../stores/character";

const characterStore = useCharacterStore();
const { activeCampaignId, campaigns } = storeToRefs(characterStore);
const router = useRouter();

const selectCampaign = (id: string) => {
  characterStore.selectCampaign(id);
  router.push(`/characters/${id}/profile`);
};

</script>
