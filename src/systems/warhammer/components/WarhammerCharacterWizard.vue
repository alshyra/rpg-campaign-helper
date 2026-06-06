<template>
  <AppCard>
    <form
      class="grid gap-4"
      @submit.prevent="submit"
    >
      <h2 class="m-0 font-(family-name:--serif) text-xl text-amber-100">
        {{ isEditing ? "Modifier le personnage Warhammer" : "Nouveau personnage Warhammer" }}
      </h2>

      <div class="grid gap-3">
        <div class="grid grid-cols-3 gap-2">
          <div
            v-for="(step, index) in steps"
            :key="step.id"
            class="rounded-xl border px-3 py-2 text-center"
            :class="stepClass(index)"
          >
            <div class="text-[9px] font-black uppercase tracking-[0.16em]">{{ index + 1 }}</div>
            <div class="mt-1 text-[11px] font-bold">{{ step.label }}</div>
          </div>
        </div>

        <div
          v-if="currentStep === 0"
          class="grid gap-3"
        >
          <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <FormField
              v-model="name"
              label="Nom"
              required
            />
            <FormField label="Espèce">
              <Select
                v-model="species"
                :options="speciesOptions"
              />
            </FormField>
            <FormField
              label="Carrière actuelle"
              :full="true"
            >
              <Select
                v-model="career"
                :options="careerSelectOptions"
                placeholder="Ex: Sorcier de village"
              />
            </FormField>
          </div>

          <div
            v-if="careerInfo"
            class="rounded-xl border border-amber-500/10 bg-amber-950/20 px-3 py-2"
          >
            <p class="text-[9px] text-stone-500">
              Caracs de carrière :
              <span class="text-amber-400">{{ careerCaracList }}</span>
            </p>
            <p class="text-[9px] text-stone-500">
              Avancements secondaires :
              <span class="text-amber-400">{{ careerSecList }}</span>
            </p>
          </div>
        </div>

        <div
          v-else-if="currentStep === 1"
          class="grid gap-3"
        >
          <FormField label="Blessures max">
            <div class="grid gap-2 rounded-xl border border-white/5 bg-black/20 p-3">
              <div class="flex items-center justify-between gap-3">
                <p class="text-sm text-stone-300">Réserve de blessures de départ</p>
                <span class="rounded-full border border-amber-500/20 bg-amber-950/20 px-2 py-1 text-[10px] font-black uppercase tracking-wider text-amber-300">
                  {{ woundsMax }} PV
                </span>
              </div>
              <StatStepper
                label="Blessures max"
                :model-value="woundsMax"
                :min="6"
                :max="30"
                no-prefix
                @update:model-value="(value) => (woundsMax = value)"
              />
              <p class="text-[10px] text-stone-500">Ajustable rapidement au doigt. Sera ensuite calculé depuis l'endurance.</p>
            </div>
          </FormField>

          <div class="rounded-xl border border-white/5 bg-black/20 p-3">
            <div class="mb-3 flex items-center justify-between gap-3">
              <h4 class="m-0 text-[9px] font-black uppercase tracking-widest text-stone-500">Repères</h4>
              <span class="text-[10px] text-stone-500">Valeurs utiles avant répartition</span>
            </div>
            <div class="grid grid-cols-2 gap-2 text-left">
              <div class="rounded-lg border border-white/5 bg-black/20 px-3 py-2">
                <div class="text-[9px] font-black uppercase tracking-widest text-stone-500">Attaques</div>
                <div class="text-base font-bold text-amber-400">{{ attacks }}</div>
              </div>
              <div class="rounded-lg border border-white/5 bg-black/20 px-3 py-2">
                <div class="text-[9px] font-black uppercase tracking-widest text-stone-500">Mouvement</div>
                <div class="text-base font-bold text-amber-400">{{ movement }}</div>
              </div>
            </div>
          </div>
        </div>

        <div
          v-else
          class="grid gap-3"
        >
          <div class="flex items-center justify-between rounded-xl bg-amber-950/30 px-4 py-3">
            <h3 class="m-0 text-[10px] font-black uppercase tracking-widest text-amber-400">Caractéristiques</h3>
            <span
              class="font-mono text-sm"
              :class="budgetClass"
              >{{ budgetRemaining }} / {{ budgetTotal }} pts</span
            >
          </div>

          <div class="grid grid-cols-2 gap-2">
            <Button
              v-for="stat in CHARACTERISTICS"
              :key="stat.key"
              :variant="activeStatKey === stat.key ? 'secondary' : 'ghost'"
              type="button"
              class="w-full justify-between! rounded-xl! px-3! py-2.5! text-left"
              :class="statEntryClass(stat.key)"
              @click="activeStatKey = stat.key"
            >
              <div class="flex items-center justify-between gap-2">
                <div>
                  <div class="text-[9px] font-black uppercase tracking-wider text-stone-500">
                    {{ stat.label }}
                  </div>
                  <div class="mt-0.5 text-[9px] text-stone-500">+{{ spent[stat.key] }}</div>
                </div>

                <div class="text-right">
                  <div class="text-lg font-black text-amber-400">{{ currentValue(stat.key) }}</div>
                </div>
              </div>
            </Button>
          </div>

          <div class="grid gap-2.5 rounded-2xl border border-amber-500/12 bg-[linear-gradient(180deg,rgba(59,41,21,0.48),rgba(13,10,8,0.92))] p-3.5 shadow-[0_18px_40px_rgba(0,0,0,0.25)]">
            <div class="flex items-start justify-between gap-3">
              <div>
                <div class="text-[9px] font-black uppercase tracking-[0.16em] text-amber-400">Stat active</div>
                <div class="mt-0.5 font-(family-name:--serif) text-xl text-amber-100">{{ activeStat.label }}</div>
                <div class="mt-0.5 text-[10px] text-stone-400">Base {{ getBase(activeStat.key) }} · Cap {{ maxValueFor(activeStat.key) }}</div>
              </div>

              <div class="text-right">
                <div class="text-[9px] font-black uppercase tracking-[0.16em] text-stone-500">Total</div>
                <div class="text-2xl font-black text-amber-300">{{ currentValue(activeStat.key) }}</div>
              </div>
            </div>

            <div class="flex items-center justify-between gap-3 text-[10px] uppercase tracking-wider text-stone-500">
              <span>Investi</span>
              <span class="rounded-full border border-amber-500/20 bg-amber-950/20 px-2 py-1 font-mono text-amber-300">
                +{{ spent[activeStat.key] }} / {{ currentSpentMax }}
              </span>
            </div>

            <div class="grid gap-1">
              <div class="h-6 overflow-hidden rounded-full bg-black/40">
                <div
                  class="h-full rounded-full bg-linear-to-r from-amber-900 via-amber-700 to-amber-500 transition-all"
                  :style="{ width: barPercent(activeStat.key) + '%' }"
                />
              </div>
              <div class="flex items-center justify-between text-[9px] uppercase tracking-wider text-stone-600">
                <span>base {{ getBase(activeStat.key) }}</span>
                <span>{{ currentValue(activeStat.key) }} / {{ maxValueFor(activeStat.key) }}</span>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-2">
              <Button
                variant="ghost"
                type="button"
                :disabled="spent[activeStat.key] < STEP"
                @click="adjust(activeStat.key, -STEP)"
              >
                Retirer 5
              </Button>
              <Button
                variant="secondary"
                type="button"
                :disabled="spent[activeStat.key] >= currentSpentMax || budgetRemaining < STEP"
                @click="adjust(activeStat.key, STEP)"
              >
                Ajouter 5
              </Button>
            </div>

            <div class="flex items-center justify-between text-[10px] text-stone-500">
              <span>{{ isEditing ? `Race : ${species || "Humain"}` : "Base commune à 40" }}</span>
              <span>Force {{ computeBonus(currentValue("s")) }} · Endurance {{ computeBonus(currentValue("t")) }}</span>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-2 pt-2">
          <Button
            v-if="currentStep > 0"
            variant="ghost"
            type="button"
            @click="previousStep"
          >
            Précédent
          </Button>
          <div
            v-else
            class="hidden sm:block"
          />

          <Button
            v-if="!isLastStep"
            variant="primary"
            type="button"
            :class="{ 'col-span-2 sm:col-span-1 sm:col-start-2': currentStep === 0 }"
            @click="nextStep"
          >
            Suivant
          </Button>
          <Button
            v-else
            variant="primary"
            type="submit"
            class="col-span-2 sm:col-span-1 sm:col-start-2"
          >
            {{ isEditing ? "Enregistrer" : "Créer le personnage" }}
          </Button>
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
import FormField from "../../../components/ui/FormField.vue";
import StatStepper from "../../../components/ui/StatStepper.vue";
import Select from "../../../components/ui/Select.vue";
import { useCharacterStore } from "../../../stores/character";
import type { CharacterState } from "../../../types/character";
import { getBasicCareerNames, CAREER_DATA } from "../careers";
import type { CharacteristicKey, Characteristics, WfrpSystemData } from "../types";
import {
  CHARACTERISTICS,
  SPENT_MAX,
  BUDGET_TOTAL,
  STEP,
  computeBonus,
  makeBlankCharacteristics,
  cloneCharacteristics,
  computeCurrent,
} from "../types";

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

const FLAT_CREATE_BASE = 40;
const CREATE_BUDGET_TOTAL = STEP;
const steps = [
  { id: "identity", label: "Identité" },
  { id: "survival", label: "Survie" },
  { id: "stats", label: "Caractéristiques" },
] as const;

const charKeys: CharacteristicKey[] = ["ws", "bs", "s", "t", "ag", "int", "wp", "fel"];
const baseCharacteristics = reactive<Characteristics>({
  ws: FLAT_CREATE_BASE,
  bs: FLAT_CREATE_BASE,
  s: FLAT_CREATE_BASE,
  t: FLAT_CREATE_BASE,
  ag: FLAT_CREATE_BASE,
  int: FLAT_CREATE_BASE,
  wp: FLAT_CREATE_BASE,
  fel: FLAT_CREATE_BASE,
});
const spent = reactive<Record<string, number>>(Object.fromEntries(charKeys.map((k) => [k, 0])));
const currentStep = ref(0);
const activeStatKey = ref<CharacteristicKey>("ws");
const activeStat = computed(() => CHARACTERISTICS.find((stat) => stat.key === activeStatKey.value) ?? CHARACTERISTICS[0]);
const isLastStep = computed(() => currentStep.value === steps.length - 1);
const totalSpent = computed(() => charKeys.reduce((sum, k) => sum + spent[k], 0));
const budgetTotal = computed(() => (isEditing.value ? BUDGET_TOTAL : CREATE_BUDGET_TOTAL));
const currentSpentMax = computed(() => (isEditing.value ? SPENT_MAX : STEP));
const budgetRemaining = computed(() => budgetTotal.value - totalSpent.value);

const budgetClass = computed(() => {
  if (budgetRemaining.value < 0) return "text-red-500 font-bold";
  if (budgetRemaining.value === 0) return "text-amber-400 font-bold";
  return "text-stone-400";
});

const speciesOptions = [
  { value: "Humain", label: "Humain" },
  { value: "Nain", label: "Nain" },
  { value: "Elfe", label: "Elfe" },
  { value: "Halfelin", label: "Halfelin" },
];

const careerSelectOptions = computed(() => {
  const names = getBasicCareerNames();
  const filtered =
    species.value === "Nain"
      ? names.filter((n) => {
          const c = CAREER_DATA[n];
          return c && c.secondary.mag === 0 && c.role !== "Slayers";
        })
      : species.value === "Elfe" || species.value === "Halfelin"
        ? names.filter((n) => n !== "Kithband Warrior" && n !== "Norse Berserker")
        : names;
  return filtered.map((name) => ({ value: name, label: name }));
});

const careerInfo = computed(() => {
  if (!career.value) return null;
  return CAREER_DATA[career.value] ?? null;
});

const charLabelMap: Record<string, string> = {
  ws: "CC",
  bs: "CT",
  s: "F",
  t: "E",
  ag: "AG",
  int: "INT",
  wp: "FM",
  fel: "SOC",
};

const careerCaracList = computed(() => {
  if (!careerInfo.value) return "";
  return Object.entries(careerInfo.value.advances)
    .filter(([, v]) => v > 0)
    .map(([k, v]) => `${charLabelMap[k] ?? k}+${v}%`)
    .join(" ");
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

const barPercent = (key: CharacteristicKey) => {
  return Math.min(100, (currentValue(key) / maxValueFor(key)) * 100);
};

const statEntryClass = (key: CharacteristicKey) =>
  key === activeStatKey.value
    ? "border-amber-500/25 bg-[rgba(68,44,18,0.78)] shadow-[0_16px_32px_rgba(0,0,0,0.2)]"
    : "border-white/5 bg-black/25 text-stone-300";

const stepClass = (index: number) => {
  if (index === currentStep.value) return "border-amber-500/30 bg-amber-950/30 text-amber-200";
  if (index < currentStep.value) return "border-white/10 bg-black/20 text-stone-300";
  return "border-white/5 bg-black/10 text-stone-500";
};

const nextStep = () => {
  currentStep.value = Math.min(steps.length - 1, currentStep.value + 1);
};

const previousStep = () => {
  currentStep.value = Math.max(0, currentStep.value - 1);
};

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
  for (const k of charKeys) {
    baseCharacteristics[k] = data.characteristics.base[k];
    spent[k] = data.characteristics.spent[k];
  }
});

const adjust = (key: string, delta: number) => {
  const current = spent[key] ?? 0;
  const next = current + delta;
  if (next < 0) return;
  if (next > currentSpentMax.value) return;
  if (budgetRemaining.value - delta < 0) return;
  spent[key] = next;
};

const submit = () => {
  const s = makeBlankCharacteristics();
  for (const k of charKeys) s[k] = spent[k];

  const systemData: WfrpSystemData = {
    species: species.value || "Humain",
    characteristics: {
      base: cloneCharacteristics(baseCharacteristics),
      spent: s,
      advancements: makeBlankCharacteristics(),
      current: computeCurrent(baseCharacteristics, s, makeBlankCharacteristics()),
    },
    wounds: {
      current: isEditing.value ? (characterStore.getSystemData<WfrpSystemData>()?.wounds.current ?? 12) : 12,
      max: woundsMax.value,
    },
    woundsAdvancements: 0,
    attacks: attacks.value,
    strengthBonus: computeBonus(currentValue("s")),
    toughnessBonus: computeBonus(currentValue("t")),
    movement: movement.value,
    mag: 0,
    magAdvancements: 0,
    fate: 2,
    insanity: 0,
    xp: { total: 0, available: 0 },
    career: {
      current: career.value,
      plan: "",
      status: "Argent 1",
      promotions: 1,
      history: [],
    },
    skills: {},
    talents: [],
    spells: [],
    weapons: [],
    armor: {
      head: 0,
      leftArm: 0,
      rightArm: 0,
      body: 0,
      leftLeg: 0,
      rightLeg: 0,
    },
    equipment: [],
    money: { gold: 0, silver: 0, brass: 0 },
  };

  const payload: Partial<CharacterState> = {
    systemId: "warhammer",
    profile: {
      characterName: name.value,
      role: career.value,
      mood: "",
      avatarDataUrl: "",
      injuries: { light: 0, minor: 0, major: 0, fatal: 0 },
    },
    systemData,
  };

  if (isEditing.value) {
    characterStore.saveActiveCharacter(payload);
  } else {
    characterStore.createNewCharacter(payload);
  }
  const id = activeCampaignId.value;
  router.replace(id ? `/characters/${id}/profile` : "/characters");
};
</script>
