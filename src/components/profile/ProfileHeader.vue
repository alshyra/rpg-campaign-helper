<template>
  <AppCard>
    <div class="form-grid form-grid--profile grid grid-cols-2 gap-3.5 max-[420px]:grid-cols-1">
      <label class="field">
        <span>Nom</span>
        <input :value="profile.characterName" type="text" @input="onText('characterName', $event)" />
      </label>
      <label class="field">
        <span>Rôle</span>
        <input :value="profile.role" type="text" @input="onText('role', $event)" />
      </label>
      <label class="field field--full">
        <span>Ambiance</span>
        <textarea :value="profile.mood" rows="3" @input="onText('mood', $event)"></textarea>
      </label>
    </div>
  </AppCard>
</template>

<script setup lang="ts">
import type { Profile } from '../../types/character'
import AppCard from '../ui/AppCard.vue'

const props = defineProps<{
  profile: Profile
}>()

const emit = defineEmits<{
  update: [patch: Partial<Profile>]
}>()

const onText = (key: keyof Pick<Profile, 'characterName' | 'role' | 'mood'>, event: Event) => {
  const target = event.target as HTMLInputElement | HTMLTextAreaElement
  emit('update', { [key]: target.value })
}

void props
</script>