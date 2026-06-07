<template>
  <article class="rounded-2xl border border-white/5 bg-stone-900/40 p-4">
    <div class="mb-3 flex items-center justify-between">
      <h3 class="m-0 text-[10px] font-black uppercase tracking-widest text-amber-500">Armes</h3>
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
      class="mb-4 grid grid-cols-2 gap-2"
    >
      <FormField
        v-model="draft.name"
        placeholder="Nom de l'arme"
        class="col-span-2 !mb-0"
      />
      <FormField
        v-model="draft.damage"
        placeholder="Dégâts (ex: F+4)"
        class="!mb-0"
      />
      <FormField
        v-model="draft.qualities"
        placeholder="Qualités (ex: Tranchant)"
        class="!mb-0"
      />
      <Button
        variant="primary"
        class="col-span-2 py-2 text-sm"
        @click="addWeapon"
        >Ajouter</Button
      >
    </div>

    <div
      v-if="weapons.length === 0"
      class="py-4 text-center text-xs italic text-stone-600"
      data-testid="no-weapons"
    >
      Aucune arme
    </div>

    <div
      v-else
      class="grid gap-2"
      data-testid="weapons-list"
    >
      <div
        v-for="wp in weapons"
        :key="wp.id"
        class="group flex items-center justify-between rounded-xl border border-white/5 bg-black/30 p-3"
      >
        <div>
          <span
            class="text-sm font-bold text-amber-100"
            data-testid="weapon-name"
            >{{ wp.name }}</span
          >
          <span
            class="ml-2 text-xs text-stone-500"
            data-testid="weapon-damage"
            >{{ wp.damage }} · {{ wp.qualities }}</span
          >
        </div>
        <IconButton
          square
          ghost
          class="h-6 w-6 p-0 text-stone-600 opacity-0 transition-all group-hover:opacity-100 hover:text-red-500!"
          @click="removeWeapon(wp.id)"
        >
          <X class="h-3.5 w-3.5" />
        </IconButton>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import { Plus, X } from "@lucide/vue";
import Button from "../../../components/ui/Button.vue";
import FormField from "../../../components/ui/FormField.vue";
import IconButton from "../../../components/ui/IconButton.vue";
import { useCharacterStore } from "../../../stores/character";
import type { WfrpSystemData } from "../types";

const characterStore = useCharacterStore();
const systemData = computed(() => characterStore.getSystemData<WfrpSystemData>());

const weapons = computed(() => systemData.value?.weapons ?? []);

const showForm = ref(false);
const draft = reactive({ name: "", damage: "", qualities: "" });

const makeWpId = () => `wp-${Math.random().toString(36).slice(2, 10)}`;

const addWeapon = () => {
  if (!draft.name.trim()) return;
  const current = systemData.value?.weapons ?? [];
  characterStore.updateSystemData<WfrpSystemData>({
    weapons: [
      ...current,
      {
        id: makeWpId(),
        name: draft.name.trim(),
        damage: draft.damage.trim(),
        qualities: draft.qualities.trim(),
      },
    ],
  });
  draft.name = "";
  draft.damage = "";
  draft.qualities = "";
  showForm.value = false;
};

const removeWeapon = (id: string) => {
  const current = systemData.value?.weapons ?? [];
  characterStore.updateSystemData<WfrpSystemData>({
    weapons: current.filter((w) => w.id !== id),
  });
};
</script>
