<template>
  <AppCard>
    <form class="character-editor grid gap-4" @submit.prevent="submitCharacter">
      <div class="wizard-steps grid grid-cols-3 gap-2 max-[420px]:grid-cols-1">
        <div
          v-for="(step, index) in steps"
          :key="step.id"
          class="wizard-steps__item grid justify-items-center gap-1.5 rounded-xl border border-[rgba(221,187,123,0.12)] bg-[rgba(13,10,8,0.72)] px-2 py-2 text-(--text-soft)"
          :class="{ 'wizard-steps__item--active': currentStep === index, 'wizard-steps__item--done': currentStep > index }"
        >
          <span class="grid h-6 w-6 place-items-center rounded-full border border-[rgba(221,187,123,0.2)] text-xs">{{ index + 1 }}</span>
          <strong class="text-[0.76rem] uppercase tracking-[0.06em]">{{ step.label }}</strong>
        </div>
      </div>

      <div v-if="currentStepId === 'identity'" class="form-grid form-grid--profile grid grid-cols-2 gap-3.5 max-[420px]:grid-cols-1">
        <label class="field">
          <span>Nom</span>
          <input v-model="draft.profile.characterName" type="text" required />
        </label>
        <label class="field">
          <span>Rôle / classe</span>
          <input v-model="draft.profile.role" type="text" required />
        </label>
        <label class="field field--full">
          <span>Ambiance</span>
          <textarea v-model="draft.profile.mood" rows="3"></textarea>
        </label>
      </div>

      <div v-if="currentStepId === 'stats'" class="character-editor__section grid gap-3 border-t border-white/5 pt-1">
        <div class="character-editor__section-head flex items-end justify-between gap-3 max-[420px]:grid max-[420px]:grid-cols-1">
          <p class="section-heading__eyebrow">Caractéristiques</p>
          <strong>Base du personnage</strong>
        </div>
        <div class="editor-stat-grid grid grid-cols-2 gap-3 max-[420px]:grid-cols-1">
          <label v-for="stat in draft.stats" :key="stat.key" class="field field--small">
            <span>{{ stat.label }}</span>
            <input :value="stat.value" type="number" min="-5" max="5" @input="updateStat(stat.key, $event)" />
          </label>
        </div>
      </div>

      <div v-if="currentStepId === 'skills'" class="character-editor__section grid gap-3 border-t border-white/5 pt-1">
        <div class="character-editor__section-head flex items-end justify-between gap-3 max-[420px]:grid max-[420px]:grid-cols-1">
          <p class="section-heading__eyebrow">Compétences</p>
          <button class="icon-button" type="button" @click="addSkill">Ajouter une compétence</button>
        </div>
        <p v-if="draft.skills.length === 0" class="character-editor__hint">
          Aucune compétence pour le moment. Ajoute celles que ton joueur veut utiliser.
        </p>
        <div class="editor-skill-list grid gap-3">
          <div v-for="skill in draft.skills" :key="skill.id" class="editor-skill-row grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_84px_auto] items-end gap-3 rounded-xl border border-[rgba(221,187,123,0.1)] bg-[rgba(13,10,8,0.5)] p-3 max-[420px]:grid-cols-1">
            <label class="field field--small">
              <span>Nom</span>
              <input :value="skill.name" type="text" placeholder="Ex: Pistage" @input="updateSkillText(skill.id, 'name', $event)" />
            </label>
            <label class="field field--small">
              <span>Catégorie</span>
              <input
                :value="skill.category"
                type="text"
                placeholder="Ex: Exploration"
                @input="updateSkillText(skill.id, 'category', $event)"
              />
            </label>
            <label class="field field--mini">
              <span>Val.</span>
              <input :value="skill.value" type="number" min="0" max="10" @input="updateSkillValue(skill.id, $event)" />
            </label>
            <button class="icon-button" type="button" @click="removeSkill(skill.id)">Retirer</button>
          </div>
        </div>
      </div>

      <div class="wizard-actions grid grid-cols-2 gap-2.5 max-[420px]:grid-cols-1">
        <button v-if="currentStep > 0" class="secondary-button" type="button" @click="previousStep">
          Précédent
        </button>
        <button v-if="currentStep < steps.length - 1" class="primary-button" type="button" @click="nextStep">
          Suivant
        </button>
        <button v-else class="primary-button" type="submit">{{ submitLabel }}</button>
      </div>
    </form>
  </AppCard>
</template>

<script setup lang="ts">
import { toRef } from 'vue'
import type { CharacterState } from '../../types/character'
import { useCharacterDraftWizard } from '../../composables/useCharacterDraftWizard'
import AppCard from '../ui/AppCard.vue'

const props = defineProps<{
    character: CharacterState
    submitLabel: string
}>()


const emit = defineEmits<{
  submit: [character: CharacterState]
}>()

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
  snapshot
} = useCharacterDraftWizard(toRef(props, 'character'))

const submitCharacter = () => {
  emit('submit', snapshot())
}
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

.injury-pill {
	display: grid;
	gap: 6px;
	padding: 10px 12px;
	border-radius: 12px;
	border: 1px solid rgba(221, 187, 123, 0.16);
	background: rgba(13, 10, 8, 0.82);
}

.injury-pill span {
	color: var(--text-soft);
	font-size: 0.82rem;
}

.injury-stepper strong {
	text-align: center;
	font-family: var(--serif);
	color: var(--gold);
	font-size: 1.2rem;
}

.field {
	display: grid;
	grid-template-columns: 1fr;
	gap: 0.4rem;
}

.field span {
	opacity: 0.6;
	font-size: 0.9rem;
}

.field input,
.field textarea {
	min-height: 36px;
	padding: 8px 12px;
	border-radius: 8px;
	border: 1px solid rgba(221, 187, 123, 0.18);
	background: rgba(13, 10, 8, 0.88);
	color: var(--text);
	font: inherit;
}

.field input:focus,
.field textarea:focus {
	outline: none;
	border-color: rgba(221, 187, 123, 0.35);
	background: rgba(13, 10, 8, 0.95);
}

.field--full {
	grid-column: 1 / -1;
}

</style>
