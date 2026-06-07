<template>
  <div class="grid gap-3">
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
          @update:model-value="emit('update:woundsMax', $event)"
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
</template>

<script setup lang="ts">
import FormField from "../../../components/ui/FormField.vue";
import StatStepper from "../../../components/ui/StatStepper.vue";

interface Props {
  woundsMax: number;
  attacks: number;
  movement: number;
}

defineProps<Props>();

const emit = defineEmits<{
  "update:woundsMax": [value: number];
  "update:attacks": [value: number];
  "update:movement": [value: number];
}>();
</script>
