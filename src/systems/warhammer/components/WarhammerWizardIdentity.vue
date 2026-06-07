<template>
  <div class="grid gap-3">
    <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <FormField
        :model-value="name"
        label="Nom"
        required
        @update:model-value="emit('update:name', $event)"
      />
      <FormField label="Espèce">
        <Select
          :model-value="species"
          :options="speciesOptions"
          @update:model-value="emit('update:species', $event)"
        />
      </FormField>
      <FormField
        label="Carrière actuelle"
        :full="true"
      >
        <Select
          :model-value="career"
          :options="careerSelectOptions"
          placeholder="Ex: Sorcier de village"
          @update:model-value="emit('update:career', $event)"
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
</template>

<script setup lang="ts">
import FormField from "../../../components/ui/FormField.vue";
import Select from "../../../components/ui/Select.vue";
import type { WfrpCareerData } from "../careers";

interface Props {
  name: string;
  species: string;
  career: string;
  speciesOptions: { value: string; label: string }[];
  careerSelectOptions: { value: string; label: string }[];
  careerInfo: WfrpCareerData | null;
  careerCaracList: string;
  careerSecList: string;
}

defineProps<Props>();

const emit = defineEmits<{
  "update:name": [value: string];
  "update:species": [value: string];
  "update:career": [value: string];
}>();
</script>
