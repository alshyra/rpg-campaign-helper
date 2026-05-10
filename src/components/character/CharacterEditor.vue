<template>
  <AppCard>
    <form
      class="character-editor grid gap-4"
      @submit.prevent="submitCharacter"
    >
      <!-- Indicateur d'étapes -->
      <div class="wizard-steps grid grid-cols-3 gap-2 max-[420px]:grid-cols-1">
        <div
          v-for="(step, index) in steps"
          :key="step.id"
          class="wizard-steps__item grid justify-items-center gap-1.5 rounded-xl border border-[rgba(221,187,123,0.12)] bg-[rgba(13,10,8,0.72)] px-2 py-2 text-(--text-soft)"
          :class="{
            'wizard-steps__item--active': currentStep === index,
            'wizard-steps__item--done': currentStep > index,
          }"
        >
          <span class="grid h-6 w-6 place-items-center rounded-full border border-[rgba(221,187,123,0.2)] text-xs">{{
            index + 1
          }}</span>
          <strong class="text-[0.76rem] uppercase tracking-[0.06em]">{{ step.label }}</strong>
        </div>
      </div>

      <!-- Étape : Identité -->
      <div
        v-if="currentStepId === 'identity'"
        class="grid grid-cols-2 gap-3.5 max-[420px]:grid-cols-1"
      >
        <FormField
          v-model="draft.profile.characterName"
          label="Nom"
          required
        />
        <FormField
          v-model="draft.profile.role"
          label="Rôle / classe"
          required
        />
        <FormField
          v-model="draft.profile.mood"
          label="Ambiance"
          type="textarea"
          :full="true"
          rows="3"
        />
      </div>

      <!-- Étape : Stats -->
      <div
        v-if="currentStepId === 'stats'"
        class="grid gap-3 border-t border-white/5 pt-1"
      >
        <div class="flex items-end justify-between gap-3 max-[420px]:grid max-[420px]:grid-cols-1">
          <p class="section-heading__eyebrow">Caractéristiques</p>
          <strong>Base du personnage</strong>
        </div>
        <div class="grid grid-cols-2 gap-3 max-[420px]:grid-cols-1">
          <StatsStepper
            v-for="stat in draft.stats"
            :key="stat.key"
            :model-value="stat.value"
            :label="stat.label"
            type="number"
            :min="-5"
            :max="5"
            @update:model-value="(v) => updateStat(stat.key, v)"
          />
        </div>
      </div>

      <!-- Étape : Compétences -->
      <div
        v-if="currentStepId === 'skills'"
        class="grid gap-3 border-t border-white/5 pt-1"
      >
        <div class="flex items-end justify-between gap-3 max-[420px]:grid max-[420px]:grid-cols-1">
          <p class="section-heading__eyebrow">Compétences</p>
          <IconButton
            type="button"
            @click="addSkill"
            >Ajouter une compétence</IconButton
          >
        </div>
        <p
          v-if="draft.skills.length === 0"
          class="text-sm opacity-50"
        >
          Aucune compétence pour le moment. Ajoute celles que ton joueur veut utiliser.
        </p>
        <div class="grid gap-3">
          <div
            v-for="skill in draft.skills"
            :key="skill.id"
            class="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_84px_auto] items-end gap-3 rounded-xl border border-[rgba(221,187,123,0.1)] bg-[rgba(13,10,8,0.5)] p-3 max-[420px]:grid-cols-1"
          >
            <FormField
              :model-value="skill.name"
              label="Nom"
              placeholder="Ex: Pistage"
              @update:model-value="(v) => updateSkillText(skill.id, 'name', String(v))"
            />
            <FormField
              :model-value="skill.category"
              label="Catégorie"
              placeholder="Ex: Exploration"
              @update:model-value="(v) => updateSkillText(skill.id, 'category', String(v))"
            />
            <StatsStepper
              :model-value="skill.value"
              label="Val."
              type="number"
              :min="0"
              :max="10"
              @update:model-value="(v) => updateSkillValue(skill.id, v)"
            />
            <IconButton
              type="button"
              @click="removeSkill(skill.id)"
              >Retirer</IconButton
            >
          </div>
        </div>
      </div>

      <!-- Navigation wizard -->
      <div class="wizard-actions grid grid-cols-2 gap-2.5 max-[420px]:grid-cols-1">
        <Button
          v-if="currentStep > 0"
          variant="secondary"
          type="button"
          @click="previousStep"
        >
          Précédent
        </Button>
        <Button
          v-if="currentStep < steps.length - 1"
          variant="primary"
          :class="{ 'col-start-2': currentStep === 0 }"
          type="button"
          @click="nextStep"
        >
          Suivant
        </Button>
        <Button
          v-else
          variant="primary"
          type="submit"
          >{{ submitLabel }}</Button
        >
      </div>
    </form>
  </AppCard>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";

import { useCharacterDraftWizard } from "../../composables/useCharacterDraftWizard";
import { useCharacterStore } from "../../stores/character";
import type { CharacterState } from "../../types/character";
import AppCard from "../ui/AppCard.vue";
import Button from "../ui/Button.vue";
import FormField from "../ui/FormField.vue";
import IconButton from "../ui/IconButton.vue";
import StatsStepper from "../ui/StatStepper.vue";

const characterStore = useCharacterStore();
const { hasCharacter, state } = storeToRefs(characterStore);
const route = useRoute();
const router = useRouter();

const emptyCharacter = (): CharacterState => ({
  profile: {
    characterName: "",
    role: "",
    mood: "",
    injuries: {
      light: 0,
      minor: 0,
      major: 0,
      fatal: 0,
    },
  },
  stats: [
    { key: "dex", label: "DEX", value: 0 },
    { key: "for", label: "FOR", value: 0 },
    { key: "con", label: "CON", value: 0 },
    { key: "int", label: "INT", value: 0 },
    { key: "sag", label: "SAG", value: 0 },
    { key: "cha", label: "CHA", value: 0 },
  ],
  skills: [],
  inventory: [],
  notes: [],
  updatedAt: new Date().toISOString(),
});

const isNewMode = computed(() => route.query.new === "1");
const character = computed(() => (isNewMode.value || !state.value ? emptyCharacter() : state.value));
const submitLabel = computed(() => (hasCharacter.value ? "Enregistrer" : "Créer le personnage"));

const {
  steps,
  currentStep,
  currentStepId,
  draft,
  nextStep,
  previousStep,
  updateStat,
  addSkill,
  removeSkill,
  updateSkillValue,
  updateSkillText,
  snapshot,
} = useCharacterDraftWizard(character);

const submitCharacter = () => {
  const payload = snapshot();

  if (isNewMode.value || !hasCharacter.value) {
    characterStore.createNewCharacter(payload);
  } else {
    characterStore.saveActiveCharacter(payload);
  }

  router.replace("/profil");
};
</script>
<style scoped>
.wizard-steps__item--active,
.wizard-steps__item--done {
  color: var(--gold);
  border-color: rgba(221, 187, 123, 0.35);
}

.wizard-steps__item--done span,
.wizard-steps__item--active span {
  border-color: rgba(221, 187, 123, 0.55);
}
</style>
