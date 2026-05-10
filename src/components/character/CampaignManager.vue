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
  </section>
</template>

<script setup lang="ts">
import CampaignItem from "./CampaignItem.vue";

defineProps<{
  campaigns: Array<{
    id: string;
    characterName: string;
    role: string;
    updatedAt: string;
  }>;
  activeCampaignId: string | null;
}>();

const emit = defineEmits<{
  select: [id: string];
  delete: [id: string];
}>();
</script>
