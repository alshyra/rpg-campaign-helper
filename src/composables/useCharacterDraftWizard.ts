import { computed, reactive, ref, watch, type Ref } from 'vue'
import type { CharacterState, Skill, Stat } from '../types/character'

type WizardStep = {
  id: 'identity' | 'stats' | 'skills'
  label: string
}

const cloneCharacter = (source: CharacterState) => JSON.parse(JSON.stringify(source)) as CharacterState

const makeSkillId = () => `skill-${Math.random().toString(36).slice(2, 10)}`

export const useCharacterDraftWizard = (character: Ref<CharacterState>) => {
  const steps = computed<WizardStep[]>(() => [
    { id: 'identity', label: 'Identité' },
    { id: 'stats', label: 'Stats' },
    { id: 'skills', label: 'Compétences' },
  ])

  const currentStep = ref(0)
  const currentStepId = computed(() => steps.value[currentStep.value]?.id)

  const draft = reactive<CharacterState>(cloneCharacter(character.value))

  watch(
    character,
    (nextCharacter) => {
      Object.assign(draft, cloneCharacter(nextCharacter))
      currentStep.value = 0
    },
    { deep: true }
  )

  const nextStep = () => {
    currentStep.value = Math.min(steps.value.length - 1, currentStep.value + 1)
  }

  const previousStep = () => {
    currentStep.value = Math.max(0, currentStep.value - 1)
  }

  const updateStat = (key: Stat['key'], event: Event) => {
    const target = event.target as HTMLInputElement
    draft.stats = draft.stats.map((stat) =>
      stat.key === key ? { ...stat, value: Number(target.value) } : stat
    )
  }

  const addSkill = () => {
    draft.skills = [...draft.skills, { id: makeSkillId(), name: '', category: '', value: 0 }]
  }

  const removeSkill = (id: string) => {
    draft.skills = draft.skills.filter((skill) => skill.id !== id)
  }

  const updateSkillValue = (id: string, event: Event) => {
    const target = event.target as HTMLInputElement
    draft.skills = draft.skills.map((skill) =>
      skill.id === id ? { ...skill, value: Math.max(0, Math.min(10, Number(target.value))) } : skill
    )
  }

  const updateSkillText = (id: string, field: 'name' | 'category', event: Event) => {
    const target = event.target as HTMLInputElement
    draft.skills = draft.skills.map((skill) =>
      skill.id === id ? ({ ...skill, [field]: target.value } as Skill) : skill
    )
  }

  const snapshot = () => cloneCharacter(draft as CharacterState)

  return {
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
  }
}
