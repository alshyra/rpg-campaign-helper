import { computed, reactive, ref, watch, type Ref } from "vue";

import type { CharacterState, Stat } from "../types/character";

type WizardStep = {
  id: "identity" | "stats";
  label: string;
};

const cloneCharacter = (source: CharacterState) => JSON.parse(JSON.stringify(source)) as CharacterState;

export const useCharacterDraftWizard = (character: Ref<CharacterState>) => {
  const steps = computed<WizardStep[]>(() => [
    { id: "identity", label: "Identité" },
    { id: "stats", label: "Stats" },
  ]);

  const currentStep = ref(0);
  const currentStepId = computed(() => steps.value[currentStep.value]?.id);

  const draft = reactive<CharacterState>(cloneCharacter(character.value));

  watch(
    character,
    (nextCharacter) => {
      Object.assign(draft, cloneCharacter(nextCharacter));
      currentStep.value = 0;
    },
    { deep: true },
  );

  const nextStep = () => {
    currentStep.value = Math.min(steps.value.length - 1, currentStep.value + 1);
  };

  const previousStep = () => {
    currentStep.value = Math.max(0, currentStep.value - 1);
  };

  const updateStat = (key: Stat["key"], value: string | number) => {
    draft.stats = draft.stats.map((stat) => (stat.key === key ? { ...stat, value: Number(value) } : stat));
  };

  const snapshot = () => cloneCharacter(draft as CharacterState);

  return {
    steps,
    currentStep,
    currentStepId,
    draft,
    nextStep,
    previousStep,
    updateStat,
    snapshot,
  };
};
