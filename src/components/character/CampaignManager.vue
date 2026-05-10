<template>
  <AppCard>
    <div class="campaign-manager grid gap-3">
      <div class="campaign-manager__head flex items-center justify-between gap-3">
        <p>Personnages de campagne</p>
      </div>

      <div v-if="campaigns.length === 0" class="campaign-manager__empty text-sm text-(--text-soft)">
        Aucun personnage sauvegardé.
      </div>

      <div v-else class="campaign-manager__list grid gap-2.5">
        <article
          v-for="campaign in campaigns"
          :key="campaign.id"
          class="campaign-item grid cursor-pointer grid-cols-[minmax(0,1fr)_auto] items-center gap-3"
          :class="{ 'campaign-item--active': campaign.id === activeCampaignId }"
          role="button"
          tabindex="0"
          @click="emit('select', campaign.id)"
          @keydown.enter.prevent="emit('select', campaign.id)"
          @keydown.space.prevent="emit('select', campaign.id)"
        >
          <div>
            <strong>{{ campaign.characterName }}</strong>
            <p>{{ campaign.role }}</p>
          </div>
          <button class="icon-button icon-button--square campaign-item__delete" type="button" aria-label="Supprimer ce personnage" @click.stop="emit('delete', campaign.id)">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 7h14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
              <path d="M9 7V5h6v2" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
              <path d="M8 7v11h8V7" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
              <path d="M10.5 10.5v5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
              <path d="M13.5 10.5v5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
            </svg>
          </button>
        </article>
      </div>
    </div>
  </AppCard>
</template>

<script setup lang="ts">
import AppCard from '../ui/AppCard.vue'

defineProps<{
  campaigns: Array<{
    id: string
    characterName: string
    role: string
    updatedAt: string
  }>
  activeCampaignId: string | null
}>()

const emit = defineEmits<{
  select: [id: string]
  delete: [id: string]
}>()
</script>
