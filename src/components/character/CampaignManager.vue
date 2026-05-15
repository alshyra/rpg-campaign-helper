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
            class="campaign-item__avatar flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-amber-500/20 bg-amber-950/50 font-(family-name:--serif) text-xl text-amber-500"
          >
            <img
              v-if="campaign.avatarDataUrl"
              :src="campaign.avatarDataUrl"
              :alt="`Portrait de ${campaign.characterName}`"
            />
            <span v-else>{{ campaign.characterName[0] }}</span>
          </div>
          <div>
            <h4 class="m-0 text-lg font-bold text-amber-100 transition-colors group-hover:text-amber-400">
              {{ campaign.characterName }}
            </h4>
            <div class="flex items-center gap-2">
              <p class="m-0 text-xs italic text-stone-500">{{ campaign.role }}</p>
              <span class="rounded-md border border-amber-500/20 bg-amber-950/30 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-amber-600/80">
                {{ systemName(campaign.systemId) }}
              </span>
            </div>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <IconButton
            icon="Trash2"
            :aria-label="'Supprimer ' + campaign.characterName"
            :square="true"
            :ghost="true"
            class="campaign-delete-button opacity-0 transition-opacity group-hover:opacity-100"
            @click.stop="deleteCampaign(campaign.id)"
          />
          <ChevronRight
            class="h-5 w-5 shrink-0 text-stone-700 transition-all group-hover:text-amber-500"
            :stroke-width="1.8"
          />
        </div>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ChevronRight } from "@lucide/vue"
import { storeToRefs } from "pinia"
import { useRouter } from "vue-router"

import { useCharacterStore } from "../../stores/character"
import { getRegisteredSystems } from "../../systems/registry"
import IconButton from "../ui/IconButton.vue"

const characterStore = useCharacterStore()
const { activeCampaignId, campaigns } = storeToRefs(characterStore)
const { deleteCampaign } = characterStore
const router = useRouter()

const systemName = (id: string) => {
  const systems = getRegisteredSystems()
  const found = systems.find((s) => s.id === id)
  return found?.name ?? id
}

const selectCampaign = (id: string) => {
  characterStore.selectCampaign(id)
  router.push(`/characters/${id}/profile`)
}
</script>

<style scoped>
.campaign-item__avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
</style>
