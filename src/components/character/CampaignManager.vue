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
        <CampaignItem
          v-for="campaign in campaigns"
          :key="campaign.id"
          :character-name="campaign.characterName"
          :role="campaign.role"
          :is-active="campaign.id === activeCampaignId"
          @select="emit('select', campaign.id)"
          @delete="emit('delete', campaign.id)"
        />
      </div>
    </div>
  </AppCard>
</template>

<script setup lang="ts">
import AppCard from '../ui/AppCard.vue'
import CampaignItem from './CampaignItem.vue'

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
