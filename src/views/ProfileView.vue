<template>
  <div class="stack-xl grid gap-6">
    <NoCharacterEmpty v-if="!character" />

    <template v-else>
      <div class="profile-overview-head flex items-end justify-between gap-3">
        <SectionHeading eyebrow="Profil" title="Fiche rapide" />
        <div class="profile-overview-actions flex gap-2">
          <IconButton square type="button" aria-label="Modifier le personnage" @click="goToTunnel">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 20h4l10-10-4-4L4 16v4z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
              <path d="M12.5 5.5l4 4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
            </svg>
          </IconButton>
        </div>
      </div>

      <StatsRadar :stats="stats" />

      <div class="profile-section-inline-head -mb-1.5">
        <p class="section-heading__eyebrow m-0">Compétences</p>
      </div>
      <SkillsTable :skills="skills" readonly />
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import NoCharacterEmpty from '../components/character/NoCharacterEmpty.vue'
import SkillsTable from '../components/profile/SkillsTable.vue'
import StatsRadar from '../components/profile/StatsRadar.vue'
import SectionHeading from '../components/ui/SectionHeading.vue'
import IconButton from '../components/ui/IconButton.vue'
import { useCharacterStore } from '../stores/character'

const characterStore = useCharacterStore()
const { state } = storeToRefs(characterStore)
const router = useRouter()

const character = computed(() => state.value)
const stats = computed(() => state.value?.stats ?? [])
const skills = computed(() => state.value?.skills ?? [])

const goToTunnel = () => {
  router.push('/personnage/tunnel')
}

</script>