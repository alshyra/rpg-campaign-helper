<template>
  <div class="stack-xl grid gap-6">
    <SectionHeading eyebrow="Campagnes" title="Personnages" />

    <AppCard>
      <div class="persos-quick-actions grid gap-2.5">
        <FileImportLabel label="Importer un JSON" @file-selected="onFileChange" />
        <Button variant="primary" type="button" @click="goToTunnel">Créer un personnage</Button>
      </div>
    </AppCard>

    <CampaignManager
      :campaigns="campaigns"
      :active-campaign-id="activeCampaignId"
      @select="selectCampaign"
      @delete="deleteCampaign"
    />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import CampaignManager from '../components/character/CampaignManager.vue'
import AppCard from '../components/ui/AppCard.vue'
import SectionHeading from '../components/ui/SectionHeading.vue'
import Button from '../components/ui/Button.vue'
import FileImportLabel from '../components/ui/FileImportLabel.vue'
import { useCharacterStore } from '../stores/character'

const characterStore = useCharacterStore()
const { activeCampaignId, campaigns } = storeToRefs(characterStore)
const router = useRouter()

const goToTunnel = () => {
  router.push('/personnage/tunnel?new=1')
}

const selectCampaign = (id: string) => {
  characterStore.selectCampaign(id)
}

const deleteCampaign = (id: string) => {
  const confirmed = window.confirm('Supprimer ce personnage de campagne ? Cette action est définitive.')
  if (!confirmed) {
    return
  }
  characterStore.deleteCampaign(id)
}

const onFileChange = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const [file] = target.files ?? []
  if (!file) {
    return
  }

  try {
    const text = await file.text()
    characterStore.importFromObject(JSON.parse(text) as unknown)
  } catch {
    window.alert('Le fichier JSON est invalide ou illisible.')
  } finally {
    target.value = ''
  }
}
</script>
