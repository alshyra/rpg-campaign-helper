<template>
    <AppCard>
        <form class="grid gap-4" @submit.prevent="submit">
            <h2 class="m-0 font-(family-name:--serif) text-xl text-amber-100">
                {{ isEditing ? "Modifier le personnage Warhammer" : "Nouveau personnage Warhammer" }}
            </h2>

            <div class="grid grid-cols-2 gap-3 max-[420px]:grid-cols-1">
                <FormField v-model="name" label="Nom" required />
                <div>
                    <p class="mb-1 text-[0.85rem] text-(--text-soft)">Espèce</p>
                    <Select v-model="species" :options="speciesOptions" />
                </div>
                <div>
                    <p class="mb-1 text-[0.85rem] text-(--text-soft)">Carrière actuelle</p>
                    <Select v-model="career" :options="careerSelectOptions" placeholder="Ex: Sorcier de village" />
                </div>
                <FormField
                    v-model.number="woundsMax"
                    label="Blessures max"
                    type="number"
                    full
                />
                <!-- TODO: sera calculé depuis T (Endurance) -->
            </div>

            <div v-if="careerInfo" class="rounded-xl border border-amber-500/10 bg-amber-950/20 px-3 py-2">
                <p class="text-[9px] text-stone-500">
                    Caracs de carrière :
                    <span class="text-amber-400">{{ careerCaracList }}</span>
                </p>
                <p class="text-[9px] text-stone-500">
                    Avancements secondaires :
                    <span class="text-amber-400">{{ careerSecList }}</span>
                </p>
            </div>

            <div
                class="flex items-center justify-between rounded-xl bg-amber-950/30 px-4 py-3"
            >
                <h3
                    class="m-0 text-[10px] font-black uppercase tracking-widest text-amber-400"
                >
                    Caractéristiques
                </h3>
                <span class="font-mono text-sm" :class="budgetClass"
                    >{{ budgetRemaining }} / {{ BUDGET_TOTAL }} pts</span
                >
            </div>

            <p class="-mt-2 text-[10px] text-stone-500">
                Race : {{ species || "Humain" }} — base raciale + points d'achat
            </p>

            <div class="grid gap-2">
                <div
                    v-for="stat in CHARACTERISTICS"
                    :key="stat.key"
                    class="flex items-center gap-3 rounded-xl border border-white/5 bg-black/30 px-4 py-3"
                >
                    <div class="min-w-10 text-center">
                        <div
                            class="text-[9px] font-black uppercase tracking-wider text-stone-500"
                        >
                            {{ stat.label }}
                        </div>
                        <div class="text-lg font-black text-amber-400">
                            {{ currentValue(stat.key) }}
                        </div>
                    </div>

                    <div class="flex flex-1 items-center gap-2">
                        <div class="flex flex-col items-center">
                            <IconButton
                                ghost
                                class="h-7 w-7 rounded-lg border-white/10 text-xs text-stone-400 hover:border-amber-500/40 hover:text-amber-400 disabled:opacity-20"
                                :disabled="spent[stat.key] < STEP"
                                @click="adjust(stat.key, -STEP)"
                                >−5</IconButton
                            >
                            <div class="pt-0.5 text-[9px] text-stone-600">
                                dép.
                            </div>
                            <IconButton
                                ghost
                                class="h-7 w-7 rounded-lg border-white/10 text-xs text-stone-400 hover:border-amber-500/40 hover:text-amber-400 disabled:opacity-20"
                                :disabled="
                                    spent[stat.key] >= SPENT_MAX ||
                                    budgetRemaining < STEP
                                "
                                @click="adjust(stat.key, STEP)"
                                >+5</IconButton
                            >
                        </div>

                        <div
                            class="h-6 flex-1 overflow-hidden rounded-full bg-black/40"
                        >
                            <div
                                class="h-full rounded-full bg-linear-to-r from-amber-900 to-amber-600 transition-all"
                                :style="{ width: barPercent(stat.key) + '%' }"
                            />
                        </div>
                    </div>

                    <div
                        class="text-right text-[10px] leading-tight text-stone-600"
                    >
                        <div>base {{ getBase(stat.key) }}</div>
                        <div
                            v-if="spent[stat.key] > 0"
                            class="text-amber-500/70"
                        >
                            +{{ spent[stat.key] }}
                        </div>
                    </div>
                </div>
            </div>

            <div class="rounded-xl border border-white/5 bg-black/20 p-3">
              <h4 class="mb-2 text-[9px] font-black uppercase tracking-widest text-stone-500">Sous-stats</h4>
              <div class="grid grid-cols-4 gap-2 text-center text-xs">
                <div><span class="text-stone-500">A </span><span class="font-bold text-amber-400">{{ attacks }}</span></div>
                <div><span class="text-stone-500">B </span><span class="font-bold text-amber-400">{{ computeBonus(currentValue("s")) }}</span></div>
                <div><span class="text-stone-500">BE </span><span class="font-bold text-amber-400">{{ computeBonus(currentValue("t")) }}</span></div>
                <div><span class="text-stone-500">M </span><span class="font-bold text-amber-400">{{ movement }}</span></div>
              </div>
            </div>

            <Button variant="primary" type="submit" class="w-full"
                >{{ isEditing ? "Enregistrer" : "Créer le personnage" }}</Button
            >
        </form>
    </AppCard>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { storeToRefs } from "pinia";

import { useCharacterStore } from "../../../stores/character";
import type { CharacterState } from "../../../types/character";
import type { CharacteristicKey, WfrpSystemData } from "../types";
import {
    CHARACTERISTICS,
    HUMAN_BASE,
    SPENT_MAX,
    BUDGET_TOTAL,
    STEP,
    computeBonus,
    makeBlankCharacteristics,
    cloneCharacteristics,
    computeCurrent,
} from "../types";
import { getBasicCareerNames, CAREER_DATA } from "../careers";
import AppCard from "../../../components/ui/AppCard.vue";
import Button from "../../../components/ui/Button.vue";
import FormField from "../../../components/ui/FormField.vue";
import IconButton from "../../../components/ui/IconButton.vue";
import Select from "../../../components/ui/Select.vue";

const router = useRouter();
const route = useRoute();
const characterStore = useCharacterStore();
const { state, activeCampaignId } = storeToRefs(characterStore);

const isEditing = computed(() => route.name === "character-edit")

const name = ref("");
const species = ref("Humain");
const career = ref("");
const woundsMax = ref(12);
const attacks = ref(1);
const movement = ref(4);

const charKeys: CharacteristicKey[] = [
    "ws",
    "bs",
    "s",
    "t",
    "ag",
    "int",
    "wp",
    "fel",
];
const spent = reactive<Record<string, number>>(
    Object.fromEntries(charKeys.map((k) => [k, 0])),
);
const totalSpent = computed(() =>
    charKeys.reduce((sum, k) => sum + spent[k], 0),
);
const budgetRemaining = computed(() => BUDGET_TOTAL - totalSpent.value);

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
]

const careerSelectOptions = computed(() => {
  const names = getBasicCareerNames()
  const filtered = species.value === "Nain"
    ? names.filter(n => {
        const c = CAREER_DATA[n]
        return c && c.secondary.mag === 0 && c.role !== "Slayers"
      })
    : (species.value === "Elfe" || species.value === "Halfelin")
      ? names.filter(n => n !== "Kithband Warrior" && n !== "Norse Berserker")
      : names
  return filtered.map(name => ({ value: name, label: name }))
})

const careerInfo = computed(() => {
    if (!career.value) return null
    return CAREER_DATA[career.value] ?? null
})

const charLabelMap: Record<string, string> = { ws: "CC", bs: "CT", s: "F", t: "E", ag: "AG", int: "INT", wp: "FM", fel: "SOC" }

const careerCaracList = computed(() => {
    if (!careerInfo.value) return ""
    return Object.entries(careerInfo.value.advances)
        .filter(([, v]) => v > 0)
        .map(([k, v]) => `${charLabelMap[k] ?? k}+${v}%`)
        .join(" ")
})

const careerSecList = computed(() => {
    if (!careerInfo.value) return ""
    const parts: string[] = []
    const sec = careerInfo.value.secondary
    if (sec.wounds > 0) parts.push(`Blessures +${sec.wounds}`)
    if (sec.attacks > 0) parts.push(`A +${sec.attacks}`)
    if (sec.mag > 0) parts.push(`PM +${sec.mag}`)
    return parts.join(" ") || "—"
})

const getBase = (key: CharacteristicKey) => HUMAN_BASE[key];

const currentValue = (key: CharacteristicKey) => getBase(key) + spent[key];

const BAR_MAX = HUMAN_BASE.ws + SPENT_MAX;

const barPercent = (key: CharacteristicKey) => {
    return Math.min(100, (currentValue(key) / BAR_MAX) * 100);
};

onMounted(() => {
    if (!isEditing.value) return
    const data = characterStore.getSystemData<WfrpSystemData>()
    if (!data || !state.value) return
    name.value = state.value.profile?.characterName ?? ""
    species.value = data.species
    career.value = data.career.current
    woundsMax.value = data.wounds.max
    attacks.value = data.attacks ?? 1
    movement.value = data.movement ?? 4
    for (const k of charKeys) {
        spent[k] = data.characteristics.spent[k]
    }
})

const adjust = (key: string, delta: number) => {
    const current = spent[key] ?? 0;
    const next = current + delta;
    if (next < 0) return;
    if (next > SPENT_MAX) return;
    if (budgetRemaining.value - delta < 0) return;
    spent[key] = next;
};

const submit = () => {
    const s = makeBlankCharacteristics();
    for (const k of charKeys) s[k] = spent[k];

    const systemData: WfrpSystemData = {
        species: species.value || "Humain",
        characteristics: {
            base: cloneCharacteristics(HUMAN_BASE),
            spent: s,
            advancements: makeBlankCharacteristics(),
            current: computeCurrent(HUMAN_BASE, s, makeBlankCharacteristics()),
        },
        wounds: { current: isEditing.value ? (characterStore.getSystemData<WfrpSystemData>()?.wounds.current ?? 12) : 12, max: woundsMax.value },
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
        characterStore.saveActiveCharacter(payload)
    } else {
        characterStore.createNewCharacter(payload)
    }
    const id = activeCampaignId.value;
    router.replace(id ? `/characters/${id}/profile` : "/characters");
};
</script>
