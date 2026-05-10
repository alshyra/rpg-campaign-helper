import { computed, reactive, ref, watch, type Ref } from 'vue'
import type { CharacterState, Profile, Skill, Stat } from '../types/character'

type WizardStep = {
  id: 'identity' | 'injuries' | 'stats' | 'skills'
  label: string
}

const cloneCharacter = (source: CharacterState) => JSON.parse(JSON.stringify(source)) as CharacterState

const makeSkillId = () => `skill-${Math.random().toString(36).slice(2, 10)}`

const injuries: Array<{ key: keyof Profile['injuries']; label: string }> = [
  { key: 'light', label: 'Légères' },
  { key: 'minor', label: 'Mineures' },
  { key: 'major', label: 'Majeures' },
  { key: 'fatal', label: 'Fatales' }
]

const mapTotalToInjuries = (total: number): Profile['injuries'] => {
  const normalized = Math.max(0, Math.min(8, total))
  const light = Math.min(2, normalized)
  const minor = Math.min(2, Math.max(0, normalized - 2))
  const major = Math.min(2, Math.max(0, normalized - 4))
  const fatal = Math.min(2, Math.max(0, normalized - 6))

  return { light, minor, major, fatal }
}

export const useCharacterDraftWizard = (character: Ref<CharacterState>, includeInjuries: Ref<boolean>) => {
  const steps = computed<WizardStep[]>(() => {
    const base: WizardStep[] = [{ id: 'identity', label: 'Identité' }]

    if (includeInjuries.value) {
      base.push({ id: 'injuries', label: 'Blessures' })
    }

    base.push({ id: 'stats', label: 'Stats' })
    base.push({ id: 'skills', label: 'Compétences' })

    return base
  })

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

  const usedInjurySlots = computed(() =>
    Object.values(draft.profile.injuries).reduce((total, value) => total + value, 0)
  )

  const adjustInjuries = (delta: number) => {
    draft.profile.injuries = mapTotalToInjuries(usedInjurySlots.value + delta)
  }

  const nextStep = () => {
    if (currentStepId.value === 'identity' && (!draft.profile.characterName.trim() || !draft.profile.role.trim())) {
      return
    }
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
    injuries,
    usedInjurySlots,
    adjustInjuries,
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
