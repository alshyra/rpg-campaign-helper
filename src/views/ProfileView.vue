<template>
  <div class="grid gap-8">
    <NoCharacterEmpty v-if="!character" />

    <template v-else>
      <!-- Section Aptitudes -->
      <section class="grid gap-4">
        <div class="flex items-center justify-between px-2">
          <h2 class="m-0 font-(family-name:--serif) text-2xl text-amber-100">Aptitudes</h2>
          <IconButton square type="button" aria-label="Modifier le personnage" @click="goToTunnel">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 20h4l10-10-4-4L4 16v4z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
              <path d="M12.5 5.5l4 4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
            </svg>
          </IconButton>
        </div>
        <StatsRadar :stats="stats" />
      </section>

      <!-- Section Compétences -->
        <!-- Section État Vital -->
        <HealthPanel :profile="profile" @update="characterStore.updateProfile" />

        <!-- Section Compétences -->
      <section class="grid gap-4">
        <h3 class="px-2 text-[10px] font-black uppercase tracking-[0.2em] text-amber-600">Compétences spéciales</h3>
        <SkillsTable :skills="skills" readonly />
      </section>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import HealthPanel from '../components/profile/HealthPanel.vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import NoCharacterEmpty from '../components/character/NoCharacterEmpty.vue'
import SkillsTable from '../components/profile/SkillsTable.vue'
import StatsRadar from '../components/profile/StatsRadar.vue'
import IconButton from '../components/ui/IconButton.vue'
import { useCharacterStore } from '../stores/character'

const characterStore = useCharacterStore()
const { state } = storeToRefs(characterStore)
const router = useRouter()

const character = computed(() => state.value)
const profile = computed(() => state.value!.profile)
const stats = computed(() => state.value?.stats ?? [])
const skills = computed(() => state.value?.skills ?? [])

const goToTunnel = () => {
  router.push('/personnage/tunnel')
}

</script>