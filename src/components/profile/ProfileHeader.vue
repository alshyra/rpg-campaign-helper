<template>
  <AppCard>
    <div class="form-grid form-grid--profile grid grid-cols-2 gap-3.5 max-[420px]:grid-cols-1">
      <FormField
        label="Nom"
        :model-value="profile.characterName"
        @update:model-value="updateText('characterName', $event)"
      />
      <FormField
        label="Rôle"
        :model-value="profile.role"
        @update:model-value="updateText('role', $event)"
      />
      <FormField
        label="Ambiance"
        type="textarea"
        :model-value="profile.mood"
        rows="3"
        full
        @update:model-value="updateText('mood', $event)"
      />
    </div>
  </AppCard>
</template>

<script setup lang="ts">
import type { Profile } from "../../types/character";
import AppCard from "../ui/AppCard.vue";
import FormField from "../ui/FormField.vue";

defineProps<{
  profile: Profile;
}>();

const emit = defineEmits<{
  update: [patch: Partial<Profile>];
}>();

const updateText = (
  key: keyof Pick<Profile, "characterName" | "role" | "mood">,
  value: string | number,
) => {
  emit("update", { [key]: String(value) });
};
</script>
