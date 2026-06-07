<template>
  <article class="rounded-2xl border border-white/5 bg-stone-900/40 p-4">
    <div class="mb-3 flex items-center justify-between">
      <h3 class="m-0 text-[10px] font-black uppercase tracking-widest text-amber-500">Équipement</h3>
      <IconButton
        square
        class="rounded-full p-2"
        :class="showForm ? 'bg-red-500/20 text-red-500 rotate-45' : 'bg-amber-500/10 text-amber-500'"
        @click="showForm = !showForm"
      >
        <Plus
          class="h-5 w-5"
          :stroke-width="2.2"
        />
      </IconButton>
    </div>

    <div
      v-if="showForm"
      class="mb-4"
    >
      <FormField
        v-model="draft"
        placeholder="Ex: Dague, Rations..."
        @keydown.enter="addItem"
      />
    </div>

    <div
      v-if="equipment.length === 0"
      class="py-4 text-center text-xs italic text-stone-600"
      data-testid="no-equipment"
    >
      Aucun équipement
    </div>

    <div
      v-else
      class="grid gap-1"
      data-testid="equipment-list"
    >
      <div
        v-for="(item, idx) in equipment"
        :key="idx"
        class="group flex items-center justify-between rounded-xl px-3 py-2 transition-colors hover:bg-white/5"
      >
        <span
          class="text-sm text-amber-100"
          data-testid="equipment-item"
          >{{ item }}</span
        >
        <IconButton
          square
          ghost
          class="h-6 w-6 p-0 text-stone-600 opacity-0 transition-all group-hover:opacity-100 hover:text-red-500!"
          @click="removeItem(idx)"
        >
          <X class="h-3.5 w-3.5" />
        </IconButton>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { Plus, X } from "@lucide/vue";
import FormField from "../../../components/ui/FormField.vue";
import IconButton from "../../../components/ui/IconButton.vue";
import { useCharacterStore } from "../../../stores/character";
import type { WfrpSystemData } from "../types";

const characterStore = useCharacterStore();
const systemData = computed(() => characterStore.getSystemData<WfrpSystemData>());

const equipment = computed(() => systemData.value?.equipment ?? []);

const showForm = ref(false);
const draft = ref("");

const addItem = () => {
  if (!draft.value.trim()) return;
  const current = systemData.value?.equipment ?? [];
  characterStore.updateSystemData<WfrpSystemData>({
    equipment: [draft.value.trim(), ...current],
  });
  draft.value = "";
  showForm.value = false;
};

const removeItem = (idx: number) => {
  const current = [...(systemData.value?.equipment ?? [])];
  current.splice(idx, 1);
  characterStore.updateSystemData<WfrpSystemData>({ equipment: current });
};
</script>
