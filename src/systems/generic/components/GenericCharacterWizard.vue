<template>
  <AppCard>
    <form
      class="character-editor flex min-h-[calc(100dvh-8rem)] flex-col gap-3"
      @submit.prevent="submitCharacter"
    >
      <div class="wizard-steps flex items-center gap-1.5">
        <template
          v-for="(step, index) in steps"
          :key="step.id"
        >
          <div
            class="flex items-center gap-2 rounded-lg px-2.5 py-1.5 transition-all duration-200"
            :class="stepItemClasses(index)"
          >
            <span
              class="grid h-5 w-5 shrink-0 place-items-center rounded-full text-[0.65rem] font-bold transition-all duration-200"
              :class="stepDotClasses(index)"
              >{{ index + 1 }}</span
            >
            <strong
              v-if="currentStep === index"
              class="truncate text-[0.7rem] uppercase tracking-[0.06em]"
              >{{ step.label }}</strong
            >
          </div>
          <div
            v-if="index < steps.length - 1"
            class="h-px flex-1 shrink-0 bg-white/10"
            :class="{ 'max-w-6': currentStep !== index && currentStep !== index + 1 }"
          />
        </template>
      </div>

      <div class="flex-1">
        <div
          v-if="currentStepId === 'identity'"
          class="grid grid-cols-2 gap-3.5 max-[420px]:grid-cols-1"
        >
          <div class="grid gap-2 col-span-full">
            <span class="text-(--text-soft) text-sm">Portrait</span>

            <div class="flex items-center gap-2.5 flex-wrap">
              <div
                v-if="draft.profile.avatarDataUrl"
                class="size-14 shrink-0 rounded-2xl overflow-hidden border border-[rgba(221,187,123,0.26)]"
              >
                <img
                  :src="draft.profile.avatarDataUrl"
                  alt="Aperçu du portrait"
                  class="w-full h-full object-cover block"
                />
              </div>
              <div
                v-else
                class="size-14 shrink-0 rounded-2xl overflow-hidden border border-[rgba(221,187,123,0.26)] grid place-items-center text-[#fcd98e] bg-[rgba(124,68,16,0.4)] font-(family-name:--serif) text-xl font-bold"
                aria-hidden="true"
              >
                {{ (draft.profile.characterName || "?").slice(0, 1).toUpperCase() }}
              </div>

              <label class="relative overflow-hidden inline-flex items-center justify-center min-h-10 rounded-xl border border-white/10 bg-[rgba(28,20,15,0.5)] text-(--text) font-bold text-[0.9rem] px-3.5 cursor-pointer hover:border-amber-500/50">
                <span>{{ draft.profile.avatarDataUrl ? "Changer le portrait" : "Ajouter un portrait" }}</span>
                <input
                  type="file"
                  accept="image/*"
                  class="absolute inset-0 opacity-0 cursor-pointer"
                  @change="onAvatarSelected"
                />
              </label>

              <Button
                v-if="draft.profile.avatarDataUrl"
                type="button"
                variant="secondary"
                @click="removeAvatar"
              >
                Retirer
              </Button>
            </div>
          </div>

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

        <div
          v-if="currentStepId === 'stats'"
          class="grid gap-3 border-t border-white/5 pt-1"
        >
          <div class="flex items-end justify-between gap-3 max-[420px]:grid max-[420px]:grid-cols-1">
            <p class="section-heading__eyebrow">Caractéristiques</p>
            <strong>Base du personnage</strong>
          </div>
          <div class="grid grid-cols-2 gap-2.5 max-[360px]:grid-cols-1">
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
      </div>

      <div class="wizard-actions mt-auto grid grid-cols-2 gap-2.5 pt-4 max-[420px]:grid-cols-1">
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
import { computed, reactive, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

import AppCard from "../../../components/ui/AppCard.vue";
import Button from "../../../components/ui/Button.vue";
import FormField from "../../../components/ui/FormField.vue";
import StatsStepper from "../../../components/ui/StatStepper.vue";
import { useCharacterDraftWizard } from "../../../composables/useCharacterDraftWizard";
import { useCharacterStore } from "../../../stores/character";
import type { CharacterState, Stat } from "../../../types/character";

const characterStore = useCharacterStore();
const { hasCharacter, state, activeCampaignId } = storeToRefs(characterStore);
const route = useRoute();
const router = useRouter();

const blankStats = [
  { key: "dex" as const, label: "DEX", value: 0 },
  { key: "for" as const, label: "FOR", value: 0 },
  { key: "con" as const, label: "CON", value: 0 },
  { key: "int" as const, label: "INT", value: 0 },
  { key: "sag" as const, label: "SAG", value: 0 },
  { key: "cha" as const, label: "CHA", value: 0 },
];

const emptyCharacter = (): CharacterState => ({
  systemId: "generic",
  profile: {
    characterName: "",
    role: "",
    mood: "",
    avatarDataUrl: "",
    injuries: { light: 0, minor: 0, major: 0, fatal: 0 },
  },
  systemData: {
    stats: blankStats,
    skills: [],
    inventory: [],
    notes: [],
    spells: [],
    injuries: { light: 0, minor: 0, major: 0, fatal: 0 },
  },
  stats: blankStats,
  skills: [],
  inventory: [],
  notes: [],
  spells: [],
  updatedAt: new Date().toISOString(),
});

const isNewMode = computed(() => route.query.new === "1");
const character = computed(() => (isNewMode.value || !state.value ? emptyCharacter() : state.value));
const submitLabel = computed(() => (hasCharacter.value ? "Enregistrer" : "Créer le personnage"));

const { steps, currentStep, currentStepId, draft, nextStep, previousStep, updateStat, snapshot } =
  useCharacterDraftWizard(character);

const submitCharacter = () => {
  const payload = snapshot();

  if (isNewMode.value || !hasCharacter.value) {
    characterStore.createNewCharacter(payload);
  } else {
    characterStore.saveActiveCharacter(payload);
  }

  const id = activeCampaignId.value;
  router.replace(id ? `/characters/${id}/profile` : "/characters");
};

const readAsDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Impossible de lire le fichier image."));
      }
    };
    reader.onerror = () => reject(new Error("Lecture de l'image échouée."));
    reader.readAsDataURL(file);
  });

const resizeAvatar = (dataUrl: string) =>
  new Promise<string>((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const outputSize = 256;
      const cropSize = Math.min(img.width, img.height);
      const sourceX = Math.floor((img.width - cropSize) / 2);
      const sourceY = Math.floor((img.height - cropSize) / 2);

      const canvas = document.createElement("canvas");
      canvas.width = outputSize;
      canvas.height = outputSize;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas indisponible."));
        return;
      }

      ctx.drawImage(img, sourceX, sourceY, cropSize, cropSize, 0, 0, outputSize, outputSize);
      resolve(canvas.toDataURL("image/jpeg", 0.82));
    };
    img.onerror = () => reject(new Error("Image invalide."));
    img.src = dataUrl;
  });

const onAvatarSelected = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file || !file.type.startsWith("image/")) {
    input.value = "";
    return;
  }

  try {
    const original = await readAsDataUrl(file);
    draft.profile.avatarDataUrl = await resizeAvatar(original);
  } catch (error) {
    console.error("Avatar upload failed:", error);
  } finally {
    input.value = "";
  }
};

const removeAvatar = () => {
  draft.profile.avatarDataUrl = "";
};

const stepItemClasses = (index: number) => {
  const activeOrDone = currentStep.value >= index;
  return {
    "text-(--gold) border-[rgba(221,187,123,0.35)]": activeOrDone,
    "text-(--text-soft)": !activeOrDone,
    "flex-1": currentStep.value === index,
    "shrink-0": currentStep.value !== index,
  };
};

const stepDotClasses = (index: number) => {
  return currentStep.value >= index
    ? "border border-[rgba(221,187,123,0.55)]"
    : "border border-[rgba(221,187,123,0.2)]";
};
</script>

<style scoped></style>
