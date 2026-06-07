<template>
  <article class="rounded-2xl border border-white/5 bg-stone-900/40 p-4">
    <h3 class="mb-3 text-[10px] font-black uppercase tracking-widest text-amber-500">Argent</h3>
    <div class="flex flex-wrap gap-3">
      <FormField
        v-model="moneyGold"
        label="PO"
        type="number"
        min="0"
        class="money-field"
      />
      <FormField
        v-model="moneySilver"
        label="PA"
        type="number"
        min="0"
        class="money-field"
      />
      <FormField
        v-model="moneyBrass"
        label="PC"
        type="number"
        min="0"
        class="money-field"
      />
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from "vue";
import FormField from "../../../components/ui/FormField.vue";
import { useCharacterStore } from "../../../stores/character";
import type { WfrpSystemData } from "../types";

const characterStore = useCharacterStore();
const systemData = computed(() => characterStore.getSystemData<WfrpSystemData>());

const setMoney = (field: keyof WfrpSystemData["money"], val: string) => {
  const current = systemData.value?.money ?? { gold: 0, silver: 0, brass: 0 };
  characterStore.updateSystemData<WfrpSystemData>({
    money: { ...current, [field]: Math.max(0, parseInt(val) || 0) },
  });
};

const moneyGold = computed({
  get: () => systemData.value?.money.gold ?? 0,
  set: (v) => setMoney("gold", String(v)),
});
const moneySilver = computed({
  get: () => systemData.value?.money.silver ?? 0,
  set: (v) => setMoney("silver", String(v)),
});
const moneyBrass = computed({
  get: () => systemData.value?.money.brass ?? 0,
  set: (v) => setMoney("brass", String(v)),
});
</script>

<style scoped>
.money-field {
  width: 5.5rem;
}
.money-field :deep(input) {
  text-align: center;
}
</style>
