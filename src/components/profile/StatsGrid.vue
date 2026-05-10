<style scoped>
.stat-box__label {
  margin: 0;
  color: var(--gold);
  letter-spacing: 0.18em;
  text-transform: uppercase;
  font-family: var(--serif);
  font-size: 0.76rem;
}

.stat-box__value {
  margin: 0;
  font-family: var(--serif);
}

.stat-box__readonly {
  margin: 8px 0 0;
  color: var(--text-soft);
  font-size: 0.84rem;
}
</style>
<template>
  <div class="stats-grid grid grid-cols-2 gap-3.5 max-[420px]:grid-cols-1">
    <AppCard
      v-for="stat in stats"
      :key="stat.key"
    >
      <div class="stat-box grid grid-cols-[1fr_auto] items-center">
        <div>
          <p class="stat-box__label">{{ stat.label }}</p>
          <input
            v-if="!readonly"
            class="stat-box__input"
            :value="stat.value"
            type="range"
            min="-5"
            max="5"
            step="1"
            @input="onInput(stat.key, $event)"
          />
          <p
            v-else
            class="stat-box__readonly"
          >
            Valeur fixe dans la fiche
          </p>
        </div>
        <strong class="stat-box__value">{{ formatValue(stat.value) }}</strong>
      </div>
    </AppCard>
  </div>
</template>

<script setup lang="ts">
import type { Stat } from "../../types/character";
import AppCard from "../ui/AppCard.vue";

defineProps<{
  stats: Stat[];
  readonly?: boolean;
}>();

const emit = defineEmits<{
  update: [key: Stat["key"], value: number];
}>();

const onInput = (key: Stat["key"], event: Event) => {
  const target = event.target as HTMLInputElement;
  emit("update", key, Number(target.value));
};

const formatValue = (value: number) => (value >= 0 ? `+${value}` : `${value}`);
</script>
