<template>
  <AppCard>
    <form class="grid gap-4" @submit.prevent="submit">
      <h2 class="m-0 font-(family-name:--serif) text-xl text-amber-100">{{ isEditing ? "Modifier le personnage Warhammer" : "Nouveau personnage Warhammer" }}</h2>
      <div class="grid gap-3">
        <div class="grid grid-cols-3 gap-2">
          <div v-for="(step, index) in steps" :key="step.id"
            class="rounded-xl border px-3 py-2 text-center" :class="stepClass(index)">
            <div class="text-[9px] font-black uppercase tracking-[0.16em]">{{ index + 1 }}</div>
            <div class="mt-1 text-[11px] font-bold">{{ step.label }}</div>
          </div>
        </div>

        <WarhammerWizardIdentity v-if="currentStep === 0"
          :name="name" :species="species" :career="career"
          :species-options="speciesOptions" :career-select-options="careerSelectOptions"
          :career-info="careerInfo" :career-carac-list="careerCaracList" :career-sec-list="careerSecList"
          @update:name="name = $event" @update:species="species = $event" @update:career="career = $event" />
        <WarhammerWizardSurvival v-else-if="currentStep === 1"
          :wounds-max="woundsMax" :attacks="attacks" :movement="movement"
          @update:wounds-max="woundsMax = $event" @update:attacks="attacks = $event" @update:movement="movement = $event" />
        <WarhammerWizardStats v-else
          :characteristics="CHARACTERISTICS" :spent="spent" :active-stat-key="activeStatKey"
          :budget-remaining="budgetRemaining" :budget-total="budgetTotal" :budget-class="budgetClass"
          :base-characteristics="baseCharacteristics" :current-spent-max="currentSpentMax"
          :species="species" :is-editing="isEditing" :STEP="STEP" :compute-bonus="computeBonus"
          :current-value="currentValue" :max-value-for="maxValueFor" :bar-percent="barPercent"
          :get-base="getBase" :stat-entry-class="statEntryClass"
          @update:active-stat-key="activeStatKey = $event" @adjust="adjust($event)" />

        <div class="grid grid-cols-2 gap-2 pt-2">
          <Button v-if="currentStep > 0" variant="ghost" type="button" @click="previousStep">Précédent</Button>
          <div v-else class="hidden sm:block" />
          <Button v-if="!isLastStep" variant="primary" type="button"
            :class="{ 'col-span-2 sm:col-span-1 sm:col-start-2': currentStep === 0 }" @click="nextStep">Suivant</Button>
          <Button v-else variant="primary" type="submit"
            class="col-span-2 sm:col-span-1 sm:col-start-2">{{ isEditing ? "Enregistrer" : "Créer le personnage" }}</Button>
        </div>
      </div>
    </form>
  </AppCard>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { computed, onMounted, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import AppCard from "../../../components/ui/AppCard.vue";
import Button from "../../../components/ui/Button.vue";
import { useCharacterStore } from "../../../stores/character";
import type { CharacterState } from "../../../types/character";
import { getBasicCareerNames, CAREER_DATA } from "../careers";
import type { CharacteristicKey, Characteristics, WfrpSystemData } from "../types";
import { CHARACTERISTICS, SPENT_MAX, BUDGET_TOTAL, STEP, computeBonus, makeBlankCharacteristics, cloneCharacteristics, computeCurrent, HUMAN_BASE } from "../types";
import WarhammerWizardIdentity from "./WarhammerWizardIdentity.vue";
import WarhammerWizardSurvival from "./WarhammerWizardSurvival.vue";
import WarhammerWizardStats from "./WarhammerWizardStats.vue";

const router = useRouter();
const route = useRoute();
const characterStore = useCharacterStore();
const { state, activeCampaignId } = storeToRefs(characterStore);
const isEditing = computed(() => route.name === "character-edit");

const name = ref("");
const species = ref("Humain");
const career = ref("");
const woundsMax = ref(12);
const attacks = ref(1);
const movement = ref(4);

const charKeys: CharacteristicKey[] = ["ws", "bs", "s", "t", "ag", "int", "wp", "fel"];
const baseCharacteristics = reactive<Characteristics>(cloneCharacteristics(HUMAN_BASE));
const spent = reactive<Record<string, number>>(Object.fromEntries(charKeys.map((k) => [k, 0])));
const currentStep = ref(0);
const activeStatKey = ref<CharacteristicKey>("ws");
const steps = [{ id: "identity", label: "Identité" }, { id: "survival", label: "Survie" }, { id: "stats", label: "Caractéristiques" }] as const;

const isLastStep = computed(() => currentStep.value === steps.length - 1);
const totalSpent = computed(() => charKeys.reduce((s, k) => s + spent[k], 0));
const budgetTotal = computed(() => isEditing.value ? BUDGET_TOTAL : STEP);
const currentSpentMax = computed(() => isEditing.value ? SPENT_MAX : STEP);
const budgetRemaining = computed(() => budgetTotal.value - totalSpent.value);
const budgetClass = computed(() => {
  if (budgetRemaining.value < 0) return "text-red-500 font-bold";
  if (budgetRemaining.value === 0) return "text-amber-400 font-bold";
  return "text-stone-400";
});

const speciesOptions = [
  { value: "Humain", label: "Humain" }, { value: "Nain", label: "Nain" },
  { value: "Elfe", label: "Elfe" }, { value: "Halfelin", label: "Halfelin" },
];

const careerSelectOptions = computed(() => {
  const names = getBasicCareerNames();
  const filtered = species.value === "Nain"
    ? names.filter((n) => { const c = CAREER_DATA[n]; return c && c.secondary.mag === 0 && c.role !== "Slayers"; })
    : species.value === "Elfe" || species.value === "Halfelin"
      ? names.filter((n) => n !== "Kithband Warrior" && n !== "Norse Berserker")
      : names;
  return filtered.map((n) => ({ value: n, label: n }));
});

const careerInfo = computed(() => career.value ? CAREER_DATA[career.value] ?? null : null);
const charLabelMap: Record<string, string> = { ws: "CC", bs: "CT", s: "F", t: "E", ag: "AG", int: "INT", wp: "FM", fel: "SOC" };
const careerCaracList = computed(() => {
  if (!careerInfo.value) return "";
  return Object.entries(careerInfo.value.advances).filter(([, v]) => v > 0).map(([k, v]) => `${charLabelMap[k] ?? k}+${v}%`).join(" ");
});
const careerSecList = computed(() => {
  if (!careerInfo.value) return "";
  const parts: string[] = [];
  const sec = careerInfo.value.secondary;
  if (sec.wounds > 0) parts.push(`Blessures +${sec.wounds}`);
  if (sec.attacks > 0) parts.push(`A +${sec.attacks}`);
  if (sec.mag > 0) parts.push(`PM +${sec.mag}`);
  return parts.join(" ") || "—";
});

const getBase = (key: CharacteristicKey) => baseCharacteristics[key];
const currentValue = (key: CharacteristicKey) => getBase(key) + spent[key];
const maxValueFor = (key: CharacteristicKey) => getBase(key) + currentSpentMax.value;
const barPercent = (key: CharacteristicKey) => Math.min(100, (currentValue(key) / maxValueFor(key)) * 100);
const statEntryClass = (key: CharacteristicKey) => key === activeStatKey.value
  ? "border-amber-500/25 bg-[rgba(68,44,18,0.78)] shadow-[0_16px_32px_rgba(0,0,0,0.2)]"
  : "border-white/5 bg-black/25 text-stone-300";
const stepClass = (index: number) => {
  if (index === currentStep.value) return "border-amber-500/30 bg-amber-950/30 text-amber-200";
  if (index < currentStep.value) return "border-white/10 bg-black/20 text-stone-300";
  return "border-white/5 bg-black/10 text-stone-500";
};

const nextStep = () => { currentStep.value = Math.min(steps.length - 1, currentStep.value + 1); };
const previousStep = () => { currentStep.value = Math.max(0, currentStep.value - 1); };

onMounted(() => {
  if (!isEditing.value) return;
  const data = characterStore.getSystemData<WfrpSystemData>();
  if (!data || !state.value) return;
  name.value = state.value.profile?.characterName ?? "";
  species.value = data.species;
  career.value = data.career.current;
  woundsMax.value = data.wounds.max;
  attacks.value = data.attacks ?? 1;
  movement.value = data.movement ?? 4;
  for (const k of charKeys) { baseCharacteristics[k] = data.characteristics.base[k]; spent[k] = data.characteristics.spent[k]; }
});

const adjust = (payload: { key: string; delta: number }) => {
  const next = (spent[payload.key] ?? 0) + payload.delta;
  if (next < 0 || next > currentSpentMax.value || budgetRemaining.value - payload.delta < 0) return;
  spent[payload.key] = next;
};

const submit = () => {
  const s = makeBlankCharacteristics();
  for (const k of charKeys) s[k] = spent[k];
  const systemData: WfrpSystemData = {
    species: species.value || "Humain",
    characteristics: { base: cloneCharacteristics(baseCharacteristics), spent: s, advancements: makeBlankCharacteristics(), current: computeCurrent(baseCharacteristics, s, makeBlankCharacteristics()) },
    wounds: { current: isEditing.value ? (characterStore.getSystemData<WfrpSystemData>()?.wounds.current ?? 12) : 12, max: woundsMax.value },
    woundsAdvancements: 0, attacks: attacks.value,
    strengthBonus: computeBonus(currentValue("s")), toughnessBonus: computeBonus(currentValue("t")),
    movement: movement.value, mag: 0, magAdvancements: 0, fate: 2, insanity: 0,
    xp: { total: 0, available: 0 },
    career: { current: career.value, plan: "", status: "Argent 1", promotions: 1, history: [] },
    skills: {}, talents: [], spells: [], weapons: [],
    armor: { head: 0, leftArm: 0, rightArm: 0, body: 0, leftLeg: 0, rightLeg: 0 },
    equipment: [], money: { gold: 0, silver: 0, brass: 0 },
  };
  const payload: Partial<CharacterState> = {
    systemId: "warhammer",
    profile: { characterName: name.value, role: career.value, mood: "", avatarDataUrl: "", injuries: { light: 0, minor: 0, major: 0, fatal: 0 } },
    systemData,
  };
  isEditing.value ? characterStore.saveActiveCharacter(payload) : characterStore.createNewCharacter(payload);
  router.replace(activeCampaignId.value ? `/characters/${activeCampaignId.value}/profile` : "/characters");
};
</script>
